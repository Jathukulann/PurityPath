import {
  users,
  streaks,
  journalEntries,
  milestones,
  type User,
  type UpsertUser,
  type Streak,
  type JournalEntry,
  type Milestone,
  type InsertJournalEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { encryptJournalContent, decryptJournalContent } from "./crypto";

// Interface for storage operations
export interface IStorage {
  // User operations - (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Streak operations
  getStreakByUserId(userId: string): Promise<Streak | undefined>;
  updateStreak(userId: string, currentStreak: number, longestStreak: number): Promise<Streak>;
  resetStreak(userId: string): Promise<Streak>;
  
  // Journal operations
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
  createJournalEntry(userId: string, entry: InsertJournalEntry): Promise<JournalEntry>;
  
  // Milestone operations
  getMilestones(userId: string): Promise<Milestone[]>;
  createDefaultMilestones(userId: string): Promise<void>;
  updateMilestone(milestoneId: string, isAchieved: boolean, achievedDate?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations - (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Create default streak and milestones for new users
    await this.ensureUserDefaults(user.id);
    
    return user;
  }

  // Streak operations
  async getStreakByUserId(userId: string): Promise<Streak | undefined> {
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
    return streak;
  }

  async updateStreak(userId: string, currentStreak: number, longestStreak: number): Promise<Streak> {
    const existingStreak = await this.getStreakByUserId(userId);
    
    if (existingStreak) {
      const [updatedStreak] = await db
        .update(streaks)
        .set({
          currentStreak,
          longestStreak: Math.max(longestStreak, currentStreak),
          updatedAt: new Date(),
        })
        .where(eq(streaks.userId, userId))
        .returning();
      return updatedStreak;
    } else {
      const [newStreak] = await db
        .insert(streaks)
        .values({
          userId,
          currentStreak,
          longestStreak: Math.max(longestStreak, currentStreak),
        })
        .returning();
      return newStreak;
    }
  }

  async resetStreak(userId: string): Promise<Streak> {
    const [resetStreak] = await db
      .update(streaks)
      .set({
        currentStreak: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date(),
      })
      .where(eq(streaks.userId, userId))
      .returning();
    return resetStreak;
  }

  // Journal operations
  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    const encryptedEntries = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
    
    // Decrypt journal content before returning with proper error handling
    return encryptedEntries.map(entry => {
      try {
        return {
          ...entry,
          content: decryptJournalContent(entry.content)
        };
      } catch (error) {
        console.error(`Failed to decrypt journal entry ${entry.id}:`, error);
        // Return entry with error message instead of throwing
        return {
          ...entry,
          content: '[ENCRYPTED DATA - DECRYPTION FAILED]'
        };
      }
    });
  }

  async createJournalEntry(userId: string, entry: InsertJournalEntry): Promise<JournalEntry> {
    try {
      // Encrypt the journal content before storing
      const encryptedContent = encryptJournalContent(entry.content);
      
      const [newEntry] = await db
        .insert(journalEntries)
        .values({
          userId,
          ...entry,
          content: encryptedContent,
        })
        .returning();
      
      // Return with decrypted content for immediate use
      return {
        ...newEntry,
        content: entry.content // Return original content, not encrypted
      };
    } catch (error) {
      console.error('Failed to create journal entry:', error);
      if (error instanceof Error && error.message.includes('encrypt')) {
        throw new Error('Failed to securely store journal entry - encryption error');
      }
      throw error; // Re-throw other database errors
    }
  }

  // Milestone operations
  async getMilestones(userId: string): Promise<Milestone[]> {
    return await db
      .select()
      .from(milestones)
      .where(eq(milestones.userId, userId))
      .orderBy(milestones.targetDays);
  }

  async createDefaultMilestones(userId: string): Promise<void> {
    const defaultMilestones = [
      { title: "First Day Clean", targetDays: 1 },
      { title: "One Week Strong", targetDays: 7 },
      { title: "Two Weeks Free", targetDays: 14 },
      { title: "One Month Milestone", targetDays: 30 },
      { title: "Two Months Clean", targetDays: 60 },
      { title: "Three Months Strong", targetDays: 90 },
      { title: "Half Year Achievement", targetDays: 180 },
      { title: "One Year Victory", targetDays: 365 },
    ];

    await db.insert(milestones).values(
      defaultMilestones.map(milestone => ({
        userId,
        ...milestone,
      }))
    );
  }

  async updateMilestone(milestoneId: string, isAchieved: boolean, achievedDate?: string): Promise<void> {
    await db
      .update(milestones)
      .set({
        isAchieved,
        achievedDate: achievedDate || null,
      })
      .where(eq(milestones.id, milestoneId));
  }

  // Helper method to ensure user has default data
  private async ensureUserDefaults(userId: string): Promise<void> {
    // Check if user already has streak
    const existingStreak = await this.getStreakByUserId(userId);
    if (!existingStreak) {
      await db.insert(streaks).values({ userId });
    }

    // Check if user already has milestones
    const existingMilestones = await this.getMilestones(userId);
    if (existingMilestones.length === 0) {
      await this.createDefaultMilestones(userId);
    }
  }
}

export const storage = new DatabaseStorage();
