import { useState } from 'react';
import { Minus, Plus, Scale, Droplets, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { BrewRecipe } from '@coffee/shared';

interface RecipeScalerProps {
  recipe: BrewRecipe;
  onStart: (scale: number) => void;
  onCancel: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export function RecipeScaler({ recipe, onStart, onCancel }: RecipeScalerProps) {
  const [scale, setScale] = useState(1);

  const scaledCoffee = Math.round(recipe.coffeeAmount * scale * 10) / 10;
  const scaledWater = Math.round(recipe.waterAmount * scale);

  const adjustScale = (delta: number) => {
    setScale((prev) => {
      const newScale = Math.round((prev + delta) * 10) / 10;
      return Math.max(0.5, Math.min(3, newScale));
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        {recipe.description && (
          <p className="text-sm text-muted-foreground">{recipe.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scale Selector */}
        <div>
          <label className="text-sm font-medium mb-2 block">Scale Recipe</label>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustScale(-0.5)}
              disabled={scale <= 0.5}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-2xl font-bold w-16 text-center">{scale}x</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustScale(0.5)}
              disabled={scale >= 3}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scaled Values */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <Scale className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{scaledCoffee}g</p>
            <p className="text-xs text-muted-foreground">Coffee</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Droplets className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{scaledWater}ml</p>
            <p className="text-xs text-muted-foreground">Water</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{formatTime(recipe.totalTime)}</p>
            <p className="text-xs text-muted-foreground">Time</p>
          </div>
        </div>

        {/* Recipe Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ratio</span>
            <span>{recipe.ratio}</span>
          </div>
          {recipe.waterTemp && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Water Temperature</span>
              <span>{recipe.waterTemp}°C</span>
            </div>
          )}
          {recipe.grindSize && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Grind Size</span>
              <span>{recipe.grindSize}</span>
            </div>
          )}
          {recipe.author && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Author</span>
              <span>{recipe.author}</span>
            </div>
          )}
        </div>

        {/* Steps Preview */}
        <div>
          <h4 className="text-sm font-medium mb-2">Steps ({recipe.steps.length})</h4>
          <ol className="space-y-1 text-sm text-muted-foreground">
            {recipe.steps.slice(0, 3).map((step, index) => (
              <li key={step.id} className="flex gap-2">
                <span className="text-muted-foreground/50">{index + 1}.</span>
                <span className="line-clamp-1">{step.instruction}</span>
              </li>
            ))}
            {recipe.steps.length > 3 && (
              <li className="text-muted-foreground/50">
                + {recipe.steps.length - 3} more steps...
              </li>
            )}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={() => onStart(scale)} className="flex-1">
            Start Brewing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
