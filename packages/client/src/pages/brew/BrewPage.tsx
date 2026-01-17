import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Coffee, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RecipeCard } from '@/components/brew/RecipeCard';
import { RecipeScaler } from '@/components/brew/RecipeScaler';
import { useBrewStore } from '@/store/brewStore';
import { api } from '@/services/api';
import {
  BrewMethod,
  BREW_METHOD_LABELS,
  type BrewRecipe,
  type BrewRecipeListItem,
} from '@coffee/shared';

export function BrewPage() {
  const navigate = useNavigate();
  const { startBrew } = useBrewStore();

  const [recipes, setRecipes] = useState<BrewRecipeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<BrewMethod | ''>('');
  const [selectedRecipe, setSelectedRecipe] = useState<BrewRecipe | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (selectedMethod) params.append('brewMethod', selectedMethod);

        const response = await api.get(`/recipes?${params.toString()}`);
        setRecipes(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load recipes. Please try again.');
        console.error('Error fetching recipes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedMethod]);

  const handleSelectRecipe = async (recipe: BrewRecipeListItem) => {
    try {
      // Fetch full recipe with steps
      const response = await api.get(`/recipes/${recipe.id}`);
      setSelectedRecipe(response.data.data);
    } catch (err) {
      console.error('Error fetching recipe details:', err);
    }
  };

  const handleStartBrew = (scale: number) => {
    if (!selectedRecipe) return;
    startBrew(selectedRecipe, scale);
    navigate('/brew/timer');
  };

  const handleCancelSelection = () => {
    setSelectedRecipe(null);
  };

  // Group recipes by method
  const recipesByMethod = recipes.reduce((acc, recipe) => {
    if (!acc[recipe.brewMethod]) {
      acc[recipe.brewMethod] = [];
    }
    acc[recipe.brewMethod].push(recipe);
    return acc;
  }, {} as Record<BrewMethod, BrewRecipeListItem[]>);

  // If a recipe is selected, show the scaler
  if (selectedRecipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <RecipeScaler
          recipe={selectedRecipe}
          onStart={handleStartBrew}
          onCancel={handleCancelSelection}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold mb-2">Brew Timer</h1>
        <p className="text-muted-foreground">
          Choose a recipe and start your guided brewing session.
        </p>
      </div>

      {/* Method Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          <Button
            variant={selectedMethod === '' ? 'default' : 'outline'}
            onClick={() => setSelectedMethod('')}
          >
            All Methods
          </Button>
          {Object.entries(BREW_METHOD_LABELS).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedMethod === key ? 'default' : 'outline'}
              onClick={() => setSelectedMethod(key as BrewMethod)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20">
          <Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No recipes found for this method.
          </p>
        </div>
      ) : selectedMethod ? (
        // Show flat list when method is selected
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={handleSelectRecipe}
            />
          ))}
        </div>
      ) : (
        // Show grouped by method when "All" is selected
        <div className="space-y-8">
          {Object.entries(recipesByMethod).map(([method, methodRecipes]) => (
            <div key={method}>
              <h2 className="text-xl font-semibold mb-4">
                {BREW_METHOD_LABELS[method as BrewMethod]}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {methodRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSelect={handleSelectRecipe}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
