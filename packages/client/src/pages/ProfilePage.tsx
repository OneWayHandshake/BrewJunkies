import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Heart,
  Star,
  Scan,
  Coffee,
  BookOpen,
  Globe,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AISettingsPanel } from '@/components/ai/AISettingsPanel';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { api } from '@/services/api';
import { BREW_METHOD_LABELS, type BrewMethod } from '@coffee/shared';

interface ProfileStats {
  counts: {
    reviews: number;
    favorites: number;
    analyses: number;
    brews: number;
    recipes: number;
    uniqueCoffees: number;
  };
  topOrigins: Array<{ origin: string; count: number }>;
  recentBrews: Array<{
    id: string;
    brewMethod: BrewMethod;
    rating: number | null;
    brewedAt: string;
    coffee?: { id: string; name: string; origin: string } | null;
  }>;
}

export function ProfilePage() {
  const { user } = useAuthStore();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/users/me/stats');
        setStats(response.data.data);
      } catch (err) {
        console.error('Error fetching profile stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => setEditModalOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Coffee className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats?.counts.brews || 0}</p>
                  <p className="text-xs text-muted-foreground">Brews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Globe className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats?.counts.uniqueCoffees || 0}</p>
                  <p className="text-xs text-muted-foreground">Coffees Tried</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats?.counts.favorites || 0}</p>
                  <p className="text-xs text-muted-foreground">Favorites</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats?.counts.reviews || 0}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats?.counts.recipes || 0}</p>
                  <p className="text-xs text-muted-foreground">Recipes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Scan className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats?.counts.analyses || 0}</p>
                  <p className="text-xs text-muted-foreground">Analyses</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Origins & Recent Brews */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Top Origins */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Favorite Origins
                  </CardTitle>
                  <CardDescription>Your most brewed coffee origins</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.topOrigins && stats.topOrigins.length > 0 ? (
                    <div className="space-y-3">
                      {stats.topOrigins.map((item, idx) => (
                        <div key={item.origin} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                            {idx + 1}
                          </span>
                          <span className="flex-1 font-medium">{item.origin}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} brew{item.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-6 text-muted-foreground text-sm">
                      Log some brews to see your favorite origins!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Brews */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Coffee className="h-5 w-5 text-primary" />
                        Recent Brews
                      </CardTitle>
                      <CardDescription>Your latest brewing activity</CardDescription>
                    </div>
                    <Link to="/journal">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {stats?.recentBrews && stats.recentBrews.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentBrews.map((brew) => (
                        <div
                          key={brew.id}
                          className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {brew.coffee?.name || BREW_METHOD_LABELS[brew.brewMethod]}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {BREW_METHOD_LABELS[brew.brewMethod]} • {formatDate(brew.brewedAt)}
                            </p>
                          </div>
                          {brew.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{brew.rating}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-6 text-muted-foreground text-sm">
                      No brews yet. Start your coffee journey!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* AI Settings */}
        <div className="mt-6">
          <AISettingsPanel />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </div>
  );
}
