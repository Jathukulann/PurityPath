import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import type { User, Streak, JournalEntry, Milestone } from '@shared/schema';
import StreakCounter from '@/components/StreakCounter';
import PanicButton from '@/components/PanicButton';
import JournalEntryComponent from '@/components/JournalEntry';
import DailyAffirmation from '@/components/DailyAffirmation';
import ProgressChart from '@/components/ProgressChart';
import ThemeToggle from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Settings, Menu, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch streak data
  const { data: streak, isLoading: streakLoading, error: streakError } = useQuery<Streak>({
    queryKey: ['/api/streak'],
  });

  // Handle streak fetch errors
  if (streakError && isUnauthorizedError(streakError as Error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
  }

  // Fetch journal entries
  const { data: journalEntries = [], isLoading: journalLoading, error: journalError } = useQuery<JournalEntry[]>({
    queryKey: ['/api/journal'],
  });

  // Handle journal fetch errors
  if (journalError && isUnauthorizedError(journalError as Error)) {
    toast({
      title: "Unauthorized", 
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
  }

  // Fetch milestones
  const { data: milestones = [], isLoading: milestonesLoading, error: milestonesError } = useQuery<Milestone[]>({
    queryKey: ['/api/milestones'],
  });

  // Handle milestones fetch errors
  if (milestonesError && isUnauthorizedError(milestonesError as Error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
  }

  // Reset streak mutation
  const resetStreakMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/streak/reset');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/streak'] });
      toast({
        title: "Streak Reset",
        description: "Your streak has been reset. Remember, recovery is a journey.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to reset streak. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  // Add journal entry mutation
  const addJournalEntryMutation = useMutation({
    mutationFn: async (entry: { content: string; mood: 'good' | 'neutral' | 'difficult' }) => {
      await apiRequest('POST', '/api/journal', {
        ...entry,
        entryDate: new Date().toISOString().split('T')[0]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal'] });
      toast({
        title: "Entry Saved",
        description: "Your journal entry has been saved privately.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to save journal entry. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  // Generate progress data from milestones
  const progressData = milestones
    .filter(m => m.isAchieved)
    .map(m => ({
      days: m.targetDays,
      title: m.title,
      achieved: m.isAchieved,
      date: m.achievedDate ? new Date(m.achievedDate).toLocaleDateString() : undefined
    }));

  // Mock weekly data for now - this could be calculated from journal entries
  const mockWeeklyData = [
    { week: 'Week 1', cleanDays: 5, totalDays: 7 },
    { week: 'Week 2', cleanDays: 7, totalDays: 7 },
    { week: 'Week 3', cleanDays: 6, totalDays: 7 },
    { week: 'Week 4', cleanDays: 7, totalDays: 7 }
  ];

  const handleStreakReset = () => {
    resetStreakMutation.mutate();
  };

  const handleAddJournalEntry = (entry: { content: string; mood: 'good' | 'neutral' | 'difficult' }) => {
    addJournalEntryMutation.mutate(entry);
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const formatJournalEntries = journalEntries.map(entry => ({
    id: entry.id,
    date: entry.entryDate || (entry.createdAt ? new Date(entry.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    content: entry.content,
    mood: entry.mood,
    isPrivate: entry.isPrivate
  }));

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Friend';
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'F';
  };

  if (streakLoading || journalLoading || milestonesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-primary">Recovery Path</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                {user?.profileImageUrl && (
                  <AvatarImage src={user.profileImageUrl} alt={getUserDisplayName()} />
                )}
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Welcome back, {getUserDisplayName()}</h2>
            <p className="text-muted-foreground">
              You're doing amazing. Here's your progress today.
            </p>
          </div>

          {/* Top Section - Streak and Panic Button */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StreakCounter 
                currentStreak={streak?.currentStreak || 0}
                longestStreak={streak?.longestStreak || 0}
                onReset={handleStreakReset}
              />
            </div>
            <div className="flex items-center justify-center">
              <PanicButton />
            </div>
          </div>

          {/* Daily Affirmation */}
          <DailyAffirmation />

          {/* Progress and Journal */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <ProgressChart 
                weeklyData={mockWeeklyData}
                milestones={progressData}
              />
            </div>
            <div>
              <JournalEntryComponent 
                entries={formatJournalEntries}
                onAddEntry={handleAddJournalEntry}
              />
            </div>
          </div>

          {/* Footer */}
          <Card className="p-6 text-center bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Remember: Recovery is a journey, not a destination. You're stronger than you know. 💜
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}