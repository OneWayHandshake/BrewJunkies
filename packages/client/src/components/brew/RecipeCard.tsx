import { Clock, Droplets, Scale, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BREW_METHOD_LABELS, type BrewRecipeListItem } from '@coffee/shared';

interface RecipeCardProps {
  recipe: BrewRecipeListItem;
  onSelect: (recipe: BrewRecipeListItem) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold line-clamp-1">{recipe.name}</h3>
            <p className="text-sm text-muted-foreground">
              {BREW_METHOD_LABELS[recipe.brewMethod]}
            </p>
          </div>
          {recipe.isDefault && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
              Default
            </span>
          )}
        </div>

        {recipe.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Scale className="h-4 w-4" />
            {recipe.coffeeAmount}g
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="h-4 w-4" />
            {recipe.waterAmount}ml
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(recipe.totalTime)}
          </span>
        </div>

        {recipe.author && (
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <User className="h-3 w-3" />
            {recipe.author}
          </p>
        )}

        <Button
          className="w-full"
          onClick={() => onSelect(recipe)}
        >
          Start Brew
        </Button>
      </CardContent>
    </Card>
  );
}
