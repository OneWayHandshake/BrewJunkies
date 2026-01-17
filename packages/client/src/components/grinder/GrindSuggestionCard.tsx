import { Lightbulb, Coffee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { BREW_METHOD_LABELS, ROAST_LEVEL_LABELS, type GrindSuggestion } from '@coffee/shared';

interface GrindSuggestionCardProps {
  suggestion: GrindSuggestion;
}

const confidenceColors = {
  high: 'border-green-500/50 bg-green-500/10',
  medium: 'border-yellow-500/50 bg-yellow-500/10',
  low: 'border-orange-500/50 bg-orange-500/10',
};

const confidenceLabels = {
  high: 'High Confidence',
  medium: 'Medium Confidence',
  low: 'Starting Point',
};

export function GrindSuggestionCard({ suggestion }: GrindSuggestionCardProps) {
  return (
    <Card className={confidenceColors[suggestion.confidence]}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-primary">{suggestion.setting}</span>
              <span className="text-sm px-2 py-0.5 bg-secondary rounded-full">
                {BREW_METHOD_LABELS[suggestion.brewMethod]}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  suggestion.confidence === 'high'
                    ? 'bg-green-100 text-green-700'
                    : suggestion.confidence === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {confidenceLabels[suggestion.confidence]}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-2">{suggestion.basedOn}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Grinder: {suggestion.grinder.name}</span>
              {suggestion.sourceCoffee && (
                <span className="flex items-center gap-1">
                  <Coffee className="h-3 w-3" />
                  {suggestion.sourceCoffee.name} (
                  {ROAST_LEVEL_LABELS[suggestion.sourceCoffee.roastLevel]})
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
