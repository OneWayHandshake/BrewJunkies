import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Star, Clock, ChevronRight, Loader2, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';
import { BREW_METHOD_LABELS, type BrewMethod } from '@coffee/shared';

interface RecentBrew {
  id: string;
  brewMethod: BrewMethod;
  rating: number | null;
  brewedAt: string;
  coffee?: {
    id: string;
    name: string;
    origin: string;
  } | null;
}

export function RecentActivityWidget() {
  const { isAuthenticated } = useAuthStore();
  const [recentBrews, setRecentBrews] = useState<RecentBrew[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchActivity = async () => {
      try {
        const response = await api.get('/users/me/stats');
        setRecentBrews(response.data.data.recentBrews || []);
      } catch (err) {
        console.error('Error fetching activity:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <Link to="/journal">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : recentBrews.length === 0 ? (
          <div className="text-center py-6">
            <Coffee className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No recent activity</p>
            <Link to="/journal/new">
              <Button size="sm" variant="outline">
                Log Your First Brew
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBrews.map((brew) => (
              <Link
                key={brew.id}
                to={`/journal/${brew.id}/edit`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Coffee className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {brew.coffee?.name || BREW_METHOD_LABELS[brew.brewMethod]}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{BREW_METHOD_LABELS[brew.brewMethod]}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(brew.brewedAt)}
                    </span>
                  </div>
                </div>
                {brew.rating && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{brew.rating}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
