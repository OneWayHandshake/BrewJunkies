import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Users,
  Clock,
  Copy,
  User,
  CheckCircle,
  Coffee,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  BrewMethod,
  BREW_METHOD_LABELS,
  type BrewRecipeListItem,
} from '@coffee/shared';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface CommunityRecipeCardProps {
  recipe: BrewRecipeListItem;
  onClone: (recipe: BrewRecipeListItem) => void;
  isCloning: boolean;
}

function CommunityRecipeCard({ recipe, onClone, isCloning }: CommunityRecipeCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg truncate">{recipe.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {BREW_METHOD_LABELS[recipe.brewMethod]}
              </span>
              {recipe.user && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {recipe.user.name}
                </span>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onClone(recipe)}
            disabled={isCloning}
            className="shrink-0"
          >
            {isCloning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Clone
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recipe.description && (
          <CardDescription className="mb-3 line-clamp-2">
            {recipe.description}
          </CardDescription>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Coffee className="h-4 w-4" />
            <span>{recipe.coffeeAmount}g</span>
          </div>
          <div>
            <span className="font-medium">{recipe.waterAmount}ml</span>
          </div>
          <div>
            <span>{recipe.ratio}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(recipe.totalTime)}</span>
          </div>
        </div>
        {recipe.author && (
          <p className="mt-2 text-xs text-muted-foreground">
            Recipe by {recipe.author}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function CommunityRecipesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [recipes, setRecipes] = useState<BrewRecipeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<BrewMethod | ''>('');
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [clonedRecipes, setClonedRecipes] = useState<Set<string>>(new Set());

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (selectedMethod) params.append('brewMethod', selectedMethod);

        const response = await api.get(`/recipes/community?${params.toString()}`);
        setRecipes(response.data.data);
        setTotalPages(response.data.meta.totalPages);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load recipes');
        console.error('Error fetching community recipes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedMethod, page]);

  const handleClone = async (recipe: BrewRecipeListItem) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setCloningId(recipe.id);
      await api.post(`/recipes/${recipe.id}/clone`);
      setClonedRecipes((prev) => new Set(prev).add(recipe.id));
    } catch (err: any) {
      console.error('Error cloning recipe:', err);
    } finally {
      setCloningId(null);
    }
  };

  const handleMethodChange = (method: BrewMethod | '') => {
    setSelectedMethod(method);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Community Recipes
        </h1>
        <p className="text-muted-foreground">
          Discover and clone brew recipes shared by the community.
        </p>
      </div>

      {/* Method Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          <Button
            variant={selectedMethod === '' ? 'default' : 'outline'}
            onClick={() => handleMethodChange('')}
          >
            All Methods
          </Button>
          {Object.entries(BREW_METHOD_LABELS).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedMethod === key ? 'default' : 'outline'}
              onClick={() => handleMethodChange(key as BrewMethod)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : recipes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-2">No community recipes yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Be the first to share a recipe with the community!
            </p>
            {isAuthenticated && (
              <Button onClick={() => navigate('/brew')}>
                Create a Recipe
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="relative">
                <CommunityRecipeCard
                  recipe={recipe}
                  onClone={handleClone}
                  isCloning={cloningId === recipe.id}
                />
                {clonedRecipes.has(recipe.id) && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    Cloned!
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Info about sharing */}
      {isAuthenticated && (
        <Card className="mt-8">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <Users className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Share Your Recipes</h3>
                <p className="text-sm text-muted-foreground">
                  Want to share your favorite brew recipe with the community? When creating or editing
                  a recipe, mark it as "Public" to have it appear here for others to discover and clone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
