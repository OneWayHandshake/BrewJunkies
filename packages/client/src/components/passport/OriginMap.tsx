import { MapPin, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { COFFEE_ORIGINS } from '@coffee/shared';

interface OriginMapProps {
  origins: string[];
}

export function OriginMap({ origins }: OriginMapProps) {
  const visitedSet = new Set(origins);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {origins.length} of {COFFEE_ORIGINS.length} Origins Explored
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-sage" />
            Visited
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-muted" />
            Not yet
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {COFFEE_ORIGINS.map((origin) => {
          const isVisited = visitedSet.has(origin);
          return (
            <Card
              key={origin}
              className={`transition-all ${
                isVisited
                  ? 'ring-2 ring-sage bg-sage/5'
                  : 'opacity-60 hover:opacity-80'
              }`}
            >
              <CardContent className="p-3 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isVisited ? 'bg-sage text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isVisited ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isVisited ? '' : 'text-muted-foreground'}`}>
                    {origin}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {origins.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No origins explored yet</p>
          <p className="text-sm">Start adding coffees to see your journey unfold</p>
        </div>
      )}
    </div>
  );
}
