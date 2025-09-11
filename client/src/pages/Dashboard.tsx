import { useState } from 'react';
import StreakCounter from '@/components/StreakCounter';
import PanicButton from '@/components/PanicButton';
import JournalEntry from '@/components/JournalEntry';
import DailyAffirmation from '@/components/DailyAffirmation';
import ProgressChart from '@/components/ProgressChart';
import ThemeToggle from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Settings, Menu } from 'lucide-react';

export default function Dashboard() {
  //todo: remove mock functionality
  const [currentStreak, setCurrentStreak] = useState(23);
  const [longestStreak] = useState(47);
  const [journalEntries, setJournalEntries] = useState<Array<{
    id: string;
    date: string;
    content: string;
    mood: 'good' | 'neutral' | 'difficult';
    isPrivate: boolean;
  }>>([
    {
      id: '1',
      date: '2024-01-15',
      content: 'Had a challenging day today but managed to resist urges by going for a walk instead. Feeling proud of this small victory.',
      mood: 'good' as const,
      isPrivate: true
    },
    {
      id: '2', 
      date: '2024-01-14',
      content: 'Feeling a bit overwhelmed with work stress. Used the breathing exercises and they really helped center me.',
      mood: 'neutral' as const,
      isPrivate: true
    }
  ]);

  const mockWeeklyData = [
    { week: 'Week 1', cleanDays: 5, totalDays: 7 },
    { week: 'Week 2', cleanDays: 7, totalDays: 7 },
    { week: 'Week 3', cleanDays: 6, totalDays: 7 },
    { week: 'Week 4', cleanDays: 7, totalDays: 7 }
  ];

  const mockMilestones = [
    { days: 1, title: 'First Day Clean', achieved: true, date: 'Jan 1' },
    { days: 7, title: 'One Week Strong', achieved: true, date: 'Jan 7' },
    { days: 30, title: 'One Month Milestone', achieved: false },
    { days: 90, title: 'Three Months Clean', achieved: false }
  ];

  const handleStreakReset = () => {
    setCurrentStreak(0);
  };

  const handleAddJournalEntry = (entry: { content: string; mood: 'good' | 'neutral' | 'difficult' }) => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: entry.content,
      mood: entry.mood,
      isPrivate: true
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

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
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarFallback>JD</AvatarFallback>
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
            <h2 className="text-2xl font-bold">Welcome back, John</h2>
            <p className="text-muted-foreground">
              You're doing amazing. Here's your progress today.
            </p>
          </div>

          {/* Top Section - Streak and Panic Button */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StreakCounter 
                currentStreak={currentStreak}
                longestStreak={longestStreak}
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
                milestones={mockMilestones}
              />
            </div>
            <div>
              <JournalEntry 
                entries={journalEntries}
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