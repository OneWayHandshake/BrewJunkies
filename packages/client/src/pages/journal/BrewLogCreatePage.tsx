import { useSearchParams } from 'react-router-dom';
import { BrewLogForm } from '@/components/journal/BrewLogForm';

export function BrewLogCreatePage() {
  const [searchParams] = useSearchParams();
  const coffeeId = searchParams.get('coffeeId') || undefined;
  const recipeId = searchParams.get('recipeId') || undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-display font-semibold mb-2">Log a Brew</h1>
        <p className="text-muted-foreground mb-8">
          Record your brewing session to track what works best.
        </p>

        <BrewLogForm initialCoffeeId={coffeeId} initialRecipeId={recipeId} />
      </div>
    </div>
  );
}
