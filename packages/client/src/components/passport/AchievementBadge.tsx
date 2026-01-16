import { Lock, CheckCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface AchievementProgress {
  current: number;
  target: number;
}

interface Achievement {
  key: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  unlockedAt?: Date;
  progress: AchievementProgress;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  showProgress?: boolean;
}

const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-slate-300 to-slate-500',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
};

const tierBgColors = {
  bronze: 'bg-amber-50 border-amber-200',
  silver: 'bg-slate-50 border-slate-200',
  gold: 'bg-yellow-50 border-yellow-200',
  platinum: 'bg-purple-50 border-purple-200',
};

export function AchievementBadge({ achievement, showProgress = false }: AchievementBadgeProps) {
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[achievement.icon] || LucideIcons.Award;
  const progress = Math.min(100, (achievement.progress.current / achievement.progress.target) * 100);

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all ${
        achievement.unlocked
          ? `${tierBgColors[achievement.tier]} shadow-sm`
          : 'bg-muted/30 border-muted opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            achievement.unlocked
              ? `bg-gradient-to-br ${tierColors[achievement.tier]} text-white shadow-md`
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {achievement.unlocked ? (
            <IconComponent className="h-6 w-6" />
          ) : (
            <Lock className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{achievement.name}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {achievement.description}
          </p>
        </div>
      </div>

      {showProgress && !achievement.unlocked && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{achievement.progress.current}/{achievement.progress.target}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-sage transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {achievement.unlocked && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-4 w-4 text-sage" />
        </div>
      )}
    </div>
  );
}
