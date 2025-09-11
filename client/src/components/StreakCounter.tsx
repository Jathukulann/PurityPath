import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Target } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  onReset?: () => void;
}

export default function StreakCounter({ currentStreak, longestStreak, onReset }: StreakCounterProps) {
  const [showReset, setShowReset] = useState(false);

  const handleReset = () => {
    console.log('Streak reset triggered');
    onReset?.();
    setShowReset(false);
  };

  const getMilestoneMessage = (streak: number) => {
    if (streak >= 365) return "One year strong! 🌟";
    if (streak >= 180) return "Half a year milestone! 💪";
    if (streak >= 90) return "Three months clean! 🎉";
    if (streak >= 30) return "One month achieved! 🔥";
    if (streak >= 7) return "One week done! ✨";
    if (streak >= 1) return "You're doing great! 💜";
    return "Your journey starts today! 🌱";
  };

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Clean Days</span>
          </div>
          
          <div className="text-6xl font-bold text-primary tabular-nums" data-testid="text-current-streak">
            {currentStreak}
          </div>
          
          <p className="text-lg text-muted-foreground font-medium">
            {getMilestoneMessage(currentStreak)}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Best:</span>
            <Badge variant="secondary" data-testid="text-longest-streak">
              {longestStreak} days
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Goal:</span>
            <Badge variant="outline">30 days</Badge>
          </div>
        </div>

        {currentStreak > 0 && (
          <div className="pt-4 border-t border-border/50">
            {!showReset ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowReset(true)}
                className="text-muted-foreground hover:text-destructive"
                data-testid="button-show-reset"
              >
                Reset streak
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleReset}
                    data-testid="button-confirm-reset"
                  >
                    Yes, reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowReset(false)}
                    data-testid="button-cancel-reset"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}