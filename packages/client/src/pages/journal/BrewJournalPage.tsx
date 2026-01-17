import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BrewLogCard } from '@/components/journal/BrewLogCard';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { IllustratedEmptyState, EmptySearchResults } from '@/components/ui/EmptyState';
import { api } from '@/services/api';
import {
  BrewMethod,
  BREW_METHOD_LABELS,
  type BrewLogListItem,
} from '@coffee/shared';

export function BrewJournalPage() {
  const [brews, setBrews] = useState<BrewLogListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedMethod, setSelectedMethod] = useState<BrewMethod | ''>('');
  const [minRating, setMinRating] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBrews = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', '20');

        if (selectedMethod) params.append('brewMethod', selectedMethod);
        if (minRating) params.append('minRating', minRating);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await api.get(`/brews?${params.toString()}`);
        setBrews(response.data.data);
        setTotalPages(response.data.meta.totalPages);
        setError(null);
      } catch (err) {
        setError('Failed to load brew journal. Please try again.');
        console.error('Error fetching brews:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrews();
  }, [page, selectedMethod, minRating, startDate, endDate]);

  const clearFilters = () => {
    setSelectedMethod('');
    setMinRating('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/brews/${id}`);
    setBrews((prev) => prev.filter((brew) => brew.id !== id));
  };

  const hasActiveFilters = selectedMethod || minRating || startDate || endDate;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">Brew Journal</h1>
          <p className="text-muted-foreground">
            Track your brewing journey and find your perfect cup.
          </p>
        </div>
        <Link to="/journal/new">
          <Button className="gap-2 rounded-xl shadow-soft hover:shadow-soft-lg transition-all">
            <Plus className="h-4 w-4" />
            Log Brew
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button
          variant={showFilters ? 'default' : 'outline'}
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs">
              Active
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-4">
          <div>
            <h3 className="font-medium mb-2">Brew Method</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedMethod === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMethod('')}
              >
                All
              </Button>
              {Object.entries(BREW_METHOD_LABELS).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedMethod === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMethod(key as BrewMethod)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Any rating</option>
                <option value="1">1+ stars</option>
                <option value="2">2+ stars</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
                <option value="5">5 stars</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">From Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">To Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <ListSkeleton count={5} />
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : brews.length === 0 ? (
        hasActiveFilters ? (
          <div className="text-center py-12">
            <EmptySearchResults query="your filters" />
            <Button variant="link" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          </div>
        ) : (
          <IllustratedEmptyState type="brews" />
        )
      ) : (
        <>
          <div className="space-y-4">
            {brews.map((brew) => (
              <BrewLogCard key={brew.id} brew={brew} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
