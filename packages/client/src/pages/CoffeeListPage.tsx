import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Loader2, Coffee, Star, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/services/api';
import { ROAST_LEVEL_LABELS, COFFEE_ORIGINS, type CoffeeListItem, type RoastLevel } from '@coffee/shared';

export function CoffeeListPage() {
  const [coffees, setCoffees] = useState<CoffeeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedRoasts, setSelectedRoasts] = useState<RoastLevel[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedOrigins.length) params.append('origin', selectedOrigins.join(','));
        if (selectedRoasts.length) params.append('roastLevel', selectedRoasts.join(','));

        const response = await api.get(`/coffees?${params.toString()}`);
        setCoffees(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load coffees. Please try again.');
        console.error('Error fetching coffees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchCoffees, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, selectedOrigins, selectedRoasts]);

  const uniqueOrigins = useMemo(() => {
    const origins = new Set(coffees.map(c => c.origin));
    return Array.from(origins).sort();
  }, [coffees]);

  const toggleOrigin = (origin: string) => {
    setSelectedOrigins(prev =>
      prev.includes(origin)
        ? prev.filter(o => o !== origin)
        : [...prev, origin]
    );
  };

  const toggleRoast = (roast: RoastLevel) => {
    setSelectedRoasts(prev =>
      prev.includes(roast)
        ? prev.filter(r => r !== roast)
        : [...prev, roast]
    );
  };

  const clearFilters = () => {
    setSelectedOrigins([]);
    setSelectedRoasts([]);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedOrigins.length > 0 || selectedRoasts.length > 0 || searchTerm;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">Coffee Catalog</h1>
          <p className="text-muted-foreground">
            Browse our collection of {coffees.length} coffees with detailed brew parameters and tasting notes.
          </p>
        </div>
        <Link to="/coffees/new">
          <Button className="gap-2 rounded-xl shadow-soft hover:shadow-soft-lg transition-all">
            <Plus className="h-4 w-4" />
            Spill the Beans
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coffees by name, origin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs">
              {selectedOrigins.length + selectedRoasts.length + (searchTerm ? 1 : 0)}
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
            <h3 className="font-medium mb-2">Roast Level</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ROAST_LEVEL_LABELS).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedRoasts.includes(key as RoastLevel) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRoast(key as RoastLevel)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Origin</h3>
            <div className="flex flex-wrap gap-2">
              {COFFEE_ORIGINS.map((origin) => (
                <Button
                  key={origin}
                  variant={selectedOrigins.includes(origin) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOrigin(origin)}
                >
                  {origin}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : coffees.length === 0 ? (
        <div className="text-center py-20">
          <Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No coffees found matching your criteria.</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearFilters}>Clear filters</Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coffees.map((coffee) => (
            <Link key={coffee.id} to={`/coffees/${coffee.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {coffee.imageUrl ? (
                    <img
                      src={coffee.imageUrl}
                      alt={coffee.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Coffee className="h-16 w-16 text-muted-foreground/50" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{coffee.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{coffee.origin}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {coffee.tastingNotes.slice(0, 3).map((note) => (
                      <span
                        key={note}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {ROAST_LEVEL_LABELS[coffee.roastLevel]}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      {coffee.averageRating ? (
                        <>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {coffee.averageRating.toFixed(1)}
                        </>
                      ) : (
                        <span className="text-xs">No reviews</span>
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
