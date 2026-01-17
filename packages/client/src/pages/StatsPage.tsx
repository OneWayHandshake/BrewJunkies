import { useState, useEffect } from 'react';
import { Loader2, Coffee, Flame, Globe, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/stats/StatCard';
import { BrewsOverTimeChart } from '@/components/stats/BrewsOverTimeChart';
import { MethodDistributionChart } from '@/components/stats/MethodDistributionChart';
import { OriginPieChart } from '@/components/stats/OriginPieChart';
import { TopTastingNotes } from '@/components/stats/TopTastingNotes';
import { api } from '@/services/api';
import type { BrewStats } from '@coffee/shared';

type DateRange = 'week' | 'month' | 'year' | 'all';

export function StatsPage() {
  const [stats, setStats] = useState<BrewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/brews/stats?range=${dateRange}`);
        setStats(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics. Please try again.');
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  const formatTime = (seconds: number): string => {
    if (seconds === 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalBrews === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold mb-2">Statistics</h1>
          <p className="text-muted-foreground">
            Track your coffee journey with detailed insights.
          </p>
        </div>
        <div className="text-center py-20">
          <Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Start logging brews to see your statistics!
          </p>
          <Button onClick={() => (window.location.href = '/journal/new')}>
            Log Your First Brew
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">Statistics</h1>
          <p className="text-muted-foreground">
            Track your coffee journey with detailed insights.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-2">
          {(['week', 'month', 'year', 'all'] as DateRange[]).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range === 'all' ? 'All Time' : range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Brews"
          value={stats.totalBrews}
          icon={Flame}
        />
        <StatCard
          title="Coffees Tried"
          value={stats.totalCoffeesTried}
          icon={Coffee}
        />
        <StatCard
          title="Unique Origins"
          value={stats.uniqueOrigins}
          icon={Globe}
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating ? stats.averageRating.toFixed(1) : '-'}
          subtitle={stats.averageRating ? 'out of 5 stars' : 'No ratings yet'}
          icon={Star}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <BrewsOverTimeChart data={stats.brewsByMonth} />
        <MethodDistributionChart data={stats.brewsByMethod} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <OriginPieChart data={stats.originDistribution} />
        <TopTastingNotes data={stats.topTastingNotes} />
      </div>

      {/* Total Brew Time */}
      {stats.totalBrewTime > 0 && (
        <div className="text-center text-muted-foreground">
          <Clock className="h-5 w-5 inline-block mr-2" />
          Total brew time: {formatTime(stats.totalBrewTime)}
        </div>
      )}
    </div>
  );
}
