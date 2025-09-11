import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertJournalEntrySchema, insertStreakSchema } from "@shared/schema";
import { csrfTokenProvider, csrfProtection } from "./csrf";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // CSRF middleware
  app.use(csrfTokenProvider);
  app.use(csrfProtection);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // CSRF token endpoint - ensures CSRF token is available for authenticated users
  app.get('/api/auth/csrf', isAuthenticated, async (req: any, res) => {
    try {
      // The csrfTokenProvider middleware will automatically set the token if not present
      // This endpoint just confirms the token is set and returns success
      res.json({ message: "CSRF token set" });
    } catch (error) {
      console.error("Error setting CSRF token:", error);
      res.status(500).json({ message: "Failed to set CSRF token" });
    }
  });

  // Streak routes
  app.get('/api/streak', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const streak = await storage.getStreakByUserId(userId);
      res.json(streak || { currentStreak: 0, longestStreak: 0 });
    } catch (error) {
      console.error("Error fetching streak:", error);
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  app.put('/api/streak', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const streakData = insertStreakSchema.parse(req.body);
      const updatedStreak = await storage.updateStreak(userId, streakData.currentStreak!, streakData.longestStreak!);
      res.json(updatedStreak);
    } catch (error) {
      console.error("Error updating streak:", error);
      res.status(500).json({ message: "Failed to update streak" });
    }
  });

  app.post('/api/streak/reset', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resetStreak = await storage.resetStreak(userId);
      res.json(resetStreak);
    } catch (error) {
      console.error("Error resetting streak:", error);
      res.status(500).json({ message: "Failed to reset streak" });
    }
  });

  // Journal routes
  app.get('/api/journal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post('/api/journal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = insertJournalEntrySchema.parse(req.body);
      const newEntry = await storage.createJournalEntry(userId, entryData);
      res.json(newEntry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  // Milestone routes
  app.get('/api/milestones', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const milestones = await storage.getMilestones(userId);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
