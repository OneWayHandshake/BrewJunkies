import { useState, useEffect } from 'react';
import {
  Globe,
  Coffee,
  Award,
  MapPin,
  Store,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { api } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AchievementBadge } from '@/components/passport/AchievementBadge';
import { PassportStats } from '@/components/passport/PassportStats';
import { OriginMap } from '@/components/passport/OriginMap';

interface PassportStatsData {
  totalCoffees: number;
  totalOrigins: number;
  totalRoasters: number;
  totalRoastLevels: number;
  totalTastingNotes: number;
  totalReviews: number;
  totalAnalyses: number;
  origins: string[];
  roasters: string[];
  roastLevels: string[];
  tastingNotes: string[];
  processes: string[];
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
  progress: {
    current: number;
    target: number;
  };
}

type TabType = 'overview' | 'achievements' | 'origins';

const CATEGORY_LABELS: Record<string, string> = {
  QUANTITY: 'Quantity',
  ORIGINS: 'Origins',
  ROAST_LEVELS: 'Roast Levels',
  ROASTERS: 'Roasters',
  TASTING: 'Tasting',
  SPECIAL: 'Special',
};

export function PassportPage() {
  const [stats, setStats] = useState<PassportStatsData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    async function fetchPassport() {
      try {
        const [passportRes, achievementsRes] = await Promise.all([
          api.get('/passport'),
          api.get('/passport/achievements'),
        ]);
        setStats(passportRes.data.data.stats);
        setAchievements(achievementsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch passport:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPassport();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Coffee className="h-8 w-8 animate-pulse text-sage" />
        </div>
      </div>
    );
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const recentAchievements = achievements
    .filter((a) => a.unlocked)
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
    })
    .slice(0, 6);

  const categories = ['QUANTITY', 'ORIGINS', 'ROAST_LEVELS', 'ROASTERS', 'TASTING', 'SPECIAL'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold mb-2 flex items-center gap-3">
            <Globe className="h-8 w-8 text-sage" />
            Coffee Passport
          </h1>
          <p className="text-muted-foreground">
            Track your coffee journey around the world and unlock achievements
          </p>
        </div>

        {/* Quick Stats */}
        <PassportStats stats={stats} />

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {(['overview', 'achievements', 'origins'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-sage border-b-2 border-sage'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>
                  {unlockedCount} of {achievements.length} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentAchievements.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {recentAchievements.map((achievement) => (
                      <AchievementBadge key={achievement.key} achievement={achievement} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No achievements yet. Start exploring coffees!
                  </p>
                )}
                <button
                  onClick={() => setActiveTab('achievements')}
                  className="w-full mt-4 py-2 text-sm text-sage hover:text-sage-dark transition-colors"
                >
                  View All Achievements
                </button>
              </CardContent>
            </Card>

            {/* Origins Visited */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Origins Explored
                </CardTitle>
                <CardDescription>
                  {stats?.totalOrigins || 0} countries visited
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats?.origins.slice(0, 8).map((origin) => (
                    <span
                      key={origin}
                      className="bg-sage/10 text-sage-dark px-3 py-1 rounded-full text-sm"
                    >
                      {origin}
                    </span>
                  ))}
                  {(stats?.origins.length || 0) > 8 && (
                    <span className="text-muted-foreground text-sm px-3 py-1">
                      +{(stats?.origins.length || 0) - 8} more
                    </span>
                  )}
                  {stats?.origins.length === 0 && (
                    <p className="text-muted-foreground text-sm">No origins yet</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('origins')}
                  className="w-full mt-4 py-2 text-sm text-sage hover:text-sage-dark transition-colors"
                >
                  View All Origins
                </button>
              </CardContent>
            </Card>

            {/* Roasters Discovered */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Roasters Discovered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats?.roasters.slice(0, 6).map((roaster) => (
                    <span
                      key={roaster}
                      className="bg-terracotta/10 text-terracotta-dark px-3 py-1 rounded-full text-sm"
                    >
                      {roaster}
                    </span>
                  ))}
                  {(stats?.roasters.length || 0) > 6 && (
                    <span className="text-muted-foreground text-sm px-3 py-1">
                      +{(stats?.roasters.length || 0) - 6} more
                    </span>
                  )}
                  {stats?.roasters.length === 0 && (
                    <p className="text-muted-foreground text-sm">No roasters yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Roast Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Roast Levels Tried
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {['LIGHT', 'MEDIUM_LIGHT', 'MEDIUM', 'MEDIUM_DARK', 'DARK'].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                        stats?.roastLevels.includes(level)
                          ? 'bg-sage text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      title={level.replace('_', ' ')}
                    >
                      {stats?.roastLevels.includes(level) && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Light</span>
                  <span>Dark</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryAchievements = achievements.filter((a) => a.category === category);
              if (categoryAchievements.length === 0) return null;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{CATEGORY_LABELS[category] || category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryAchievements.map((achievement) => (
                        <AchievementBadge
                          key={achievement.key}
                          achievement={achievement}
                          showProgress
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'origins' && <OriginMap origins={stats?.origins || []} />}
      </div>
    </div>
  );
}
