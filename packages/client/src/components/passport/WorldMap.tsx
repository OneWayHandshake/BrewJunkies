import { useState, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

interface WorldMapProps {
  visitedOrigins: string[];
}

// GeoJSON URL for world countries
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map country names from GeoJSON to our origin names
const COUNTRY_NAME_MAP: Record<string, string> = {
  'United States of America': 'Hawaii', // Special case for Hawaii
  'Mexico': 'Mexico',
  'Guatemala': 'Guatemala',
  'Honduras': 'Honduras',
  'El Salvador': 'El Salvador',
  'Nicaragua': 'Nicaragua',
  'Costa Rica': 'Costa Rica',
  'Panama': 'Panama',
  'Jamaica': 'Jamaica',
  'Colombia': 'Colombia',
  'Venezuela': 'Venezuela',
  'Ecuador': 'Ecuador',
  'Peru': 'Peru',
  'Bolivia': 'Bolivia',
  'Brazil': 'Brazil',
  'Ivory Coast': 'Ivory Coast',
  "Côte d'Ivoire": 'Ivory Coast',
  'Cameroon': 'Cameroon',
  'Democratic Republic of the Congo': 'Democratic Republic of Congo',
  'Dem. Rep. Congo': 'Democratic Republic of Congo',
  'Uganda': 'Uganda',
  'Rwanda': 'Rwanda',
  'Burundi': 'Burundi',
  'Ethiopia': 'Ethiopia',
  'Kenya': 'Kenya',
  'Tanzania': 'Tanzania',
  'United Republic of Tanzania': 'Tanzania',
  'Malawi': 'Malawi',
  'Zambia': 'Zambia',
  'Zimbabwe': 'Zimbabwe',
  'Madagascar': 'Madagascar',
  'Yemen': 'Yemen',
  'India': 'India',
  'Nepal': 'Nepal',
  'Myanmar': 'Myanmar',
  'Thailand': 'Thailand',
  'Laos': 'Laos',
  'Vietnam': 'Vietnam',
  'Viet Nam': 'Vietnam',
  'China': 'China',
  'Philippines': 'Philippines',
  'Indonesia': 'Indonesia',
  'Papua New Guinea': 'Papua New Guinea',
  'Australia': 'Australia',
};

// All coffee origins we track
const ALL_ORIGINS = [
  'Ethiopia', 'Colombia', 'Brazil', 'Kenya', 'Guatemala',
  'Costa Rica', 'Panama', 'Indonesia', 'Vietnam', 'Honduras',
  'Peru', 'Mexico', 'Rwanda', 'Burundi', 'Yemen',
  'Jamaica', 'Hawaii', 'India', 'Nicaragua', 'El Salvador'
];

// Countries that are coffee-producing (for highlighting)
const COFFEE_PRODUCING_COUNTRIES = new Set([
  'Mexico', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua',
  'Costa Rica', 'Panama', 'Jamaica', 'United States of America',
  'Colombia', 'Venezuela', 'Ecuador', 'Peru', 'Bolivia', 'Brazil',
  'Ivory Coast', "Côte d'Ivoire", 'Cameroon',
  'Democratic Republic of the Congo', 'Dem. Rep. Congo',
  'Uganda', 'Rwanda', 'Burundi', 'Ethiopia', 'Kenya',
  'Tanzania', 'United Republic of Tanzania', 'Malawi', 'Zambia', 'Zimbabwe', 'Madagascar',
  'Yemen', 'India', 'Nepal', 'Myanmar', 'Thailand', 'Laos',
  'Vietnam', 'Viet Nam', 'China', 'Philippines', 'Indonesia',
  'Papua New Guinea', 'Australia',
]);

const WorldMap = memo(function WorldMap({ visitedOrigins }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const visitedSet = new Set(visitedOrigins);

  // Check if a country's origin name is visited
  const isOriginVisited = (geoName: string): boolean => {
    const originName = COUNTRY_NAME_MAP[geoName];
    return originName ? visitedSet.has(originName) : false;
  };

  // Check if country is a coffee producer
  const isCoffeeProducer = (geoName: string): boolean => {
    return COFFEE_PRODUCING_COUNTRIES.has(geoName);
  };

  // Get display name for tooltip
  const getDisplayName = (geoName: string): string => {
    return COUNTRY_NAME_MAP[geoName] || geoName;
  };

  return (
    <div className="w-full">
      {/* Map Legend */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {visitedOrigins.length} of {ALL_ORIGINS.length} Coffee Origins Explored
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sage" />
            Visited
          </span>
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-muted-foreground/30 bg-transparent" />
            Not yet
          </span>
        </div>
      </div>

      {/* World Map */}
      <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [20, 10],
          }}
          style={{ width: '100%', height: 'auto' }}
        >
          <ZoomableGroup center={[20, 10]} zoom={1} minZoom={1} maxZoom={4}>
            {/* Coffee belt background band */}
            <rect
              x={-500}
              y={-23.5 * 4}
              width={2000}
              height={47 * 4}
              fill="hsl(var(--sage))"
              opacity={0.03}
            />

            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoName = geo.properties.name;
                  const isVisited = isOriginVisited(geoName);
                  const isCoffee = isCoffeeProducer(geoName);
                  const isHovered = hoveredCountry === geoName;
                  const displayName = getDisplayName(geoName);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (isCoffee) setHoveredCountry(geoName);
                      }}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        default: {
                          fill: isVisited
                            ? 'hsl(var(--sage))'
                            : isCoffee
                              ? 'transparent'
                              : 'hsl(var(--muted-foreground))',
                          fillOpacity: isVisited ? 1 : isCoffee ? 0 : 0.08,
                          stroke: isVisited
                            ? 'hsl(var(--sage-dark))'
                            : isCoffee
                              ? 'hsl(var(--muted-foreground))'
                              : 'hsl(var(--muted-foreground))',
                          strokeWidth: isVisited ? 0.75 : isCoffee ? 0.5 : 0.25,
                          strokeOpacity: isVisited ? 1 : isCoffee ? 0.5 : 0.2,
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        },
                        hover: {
                          fill: isVisited
                            ? 'hsl(var(--sage))'
                            : isCoffee
                              ? 'hsl(var(--muted-foreground))'
                              : 'hsl(var(--muted-foreground))',
                          fillOpacity: isVisited ? 1 : isCoffee ? 0.15 : 0.08,
                          stroke: isVisited
                            ? 'hsl(var(--sage-dark))'
                            : 'hsl(var(--muted-foreground))',
                          strokeWidth: isCoffee ? 1 : 0.25,
                          strokeOpacity: isVisited ? 1 : isCoffee ? 0.8 : 0.2,
                          outline: 'none',
                          cursor: isCoffee ? 'pointer' : 'default',
                          transition: 'all 0.2s ease',
                        },
                        pressed: {
                          fill: isVisited
                            ? 'hsl(var(--sage-dark))'
                            : 'hsl(var(--muted-foreground))',
                          fillOpacity: isVisited ? 1 : 0.2,
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Hover tooltip */}
        {hoveredCountry && (
          <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border rounded-xl px-4 py-3 shadow-lg pointer-events-none z-10">
            <p className="font-semibold text-foreground">{getDisplayName(hoveredCountry)}</p>
            <p className="text-sm text-muted-foreground">
              {isOriginVisited(hoveredCountry) ? (
                <span className="text-sage font-medium">Explored</span>
              ) : (
                'Not yet explored'
              )}
            </p>
          </div>
        )}

        {/* Subtle label */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/40 italic pointer-events-none">
          Coffee Belt Region
        </div>
      </div>

      {/* Country grid below map */}
      <div className="mt-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
        {ALL_ORIGINS.map((origin) => {
          const isVisited = visitedSet.has(origin);
          const matchingGeoName = Object.entries(COUNTRY_NAME_MAP).find(
            ([, val]) => val === origin
          )?.[0];
          const isHovered = matchingGeoName === hoveredCountry ||
            Object.entries(COUNTRY_NAME_MAP)
              .filter(([, val]) => val === origin)
              .some(([key]) => key === hoveredCountry);

          return (
            <div
              key={origin}
              className={`text-center p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isVisited
                  ? 'bg-sage/20 text-sage-dark border border-sage/30'
                  : isHovered
                    ? 'bg-muted/50 text-foreground border border-muted-foreground/30'
                    : 'bg-muted/30 text-muted-foreground border border-transparent hover:border-muted-foreground/20'
              }`}
              onMouseEnter={() => {
                const geoKey = Object.entries(COUNTRY_NAME_MAP).find(
                  ([, val]) => val === origin
                )?.[0];
                if (geoKey) setHoveredCountry(geoKey);
              }}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              {origin}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export { WorldMap };
