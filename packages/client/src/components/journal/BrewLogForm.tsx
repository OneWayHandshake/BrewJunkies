import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Star, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FlavorSelector } from '@/components/flavor/FlavorSelector';
import { api } from '@/services/api';
import {
  BrewMethod,
  BREW_METHOD_LABELS,
  type CoffeeListItem,
  type BrewRecipeListItem,
  type BrewLogDetail,
} from '@coffee/shared';

interface BrewLogFormProps {
  initialCoffeeId?: string;
  initialRecipeId?: string;
  editBrew?: BrewLogDetail;
}

export function BrewLogForm({ initialCoffeeId, initialRecipeId, editBrew }: BrewLogFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!editBrew;

  // Form state - initialize from editBrew if in edit mode
  const [brewMethod, setBrewMethod] = useState<BrewMethod>(editBrew?.brewMethod || 'POUR_OVER');
  const [coffeeAmount, setCoffeeAmount] = useState(editBrew?.coffeeAmount?.toString() || '15');
  const [waterAmount, setWaterAmount] = useState(editBrew?.waterAmount?.toString() || '250');
  const [grindSize, setGrindSize] = useState(editBrew?.grindSize || '');
  const [waterTemp, setWaterTemp] = useState(editBrew?.waterTemp?.toString() || '');
  const [brewTime, setBrewTime] = useState(editBrew?.brewTime?.toString() || '');
  const [rating, setRating] = useState<number | null>(editBrew?.rating || null);
  const [tastingNotes, setTastingNotes] = useState<string[]>(editBrew?.tastingNotes || []);
  const [customNote, setCustomNote] = useState('');
  const [notes, setNotes] = useState(editBrew?.notes || '');
  const [coffeeId, setCoffeeId] = useState(editBrew?.coffee?.id || initialCoffeeId || '');
  const [recipeId, setRecipeId] = useState(editBrew?.recipe?.id || initialRecipeId || '');

  // Data for dropdowns
  const [coffees, setCoffees] = useState<CoffeeListItem[]>([]);
  const [recipes, setRecipes] = useState<BrewRecipeListItem[]>([]);
  const [coffeeSearch, setCoffeeSearch] = useState('');
  const [showCoffeeDropdown, setShowCoffeeDropdown] = useState(false);

  // Fetch coffees and recipes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coffeesRes, recipesRes] = await Promise.all([
          api.get('/coffees?limit=100'),
          api.get('/recipes'),
        ]);
        setCoffees(coffeesRes.data.data);
        setRecipes(recipesRes.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Filter coffees by search
  const filteredCoffees = coffees.filter((c) =>
    c.name.toLowerCase().includes(coffeeSearch.toLowerCase()) ||
    c.origin.toLowerCase().includes(coffeeSearch.toLowerCase())
  );

  // Filter recipes by method
  const filteredRecipes = recipes.filter((r) => r.brewMethod === brewMethod);

  // Apply recipe parameters when selected
  useEffect(() => {
    if (recipeId) {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (recipe) {
        setCoffeeAmount(recipe.coffeeAmount.toString());
        setWaterAmount(recipe.waterAmount.toString());
      }
    }
  }, [recipeId, recipes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const brewData = {
      brewMethod,
      coffeeAmount: parseFloat(coffeeAmount),
      waterAmount: parseFloat(waterAmount),
      grindSize: grindSize || undefined,
      waterTemp: waterTemp ? parseFloat(waterTemp) : undefined,
      brewTime: brewTime ? parseInt(brewTime) : undefined,
      rating: rating || undefined,
      tastingNotes,
      notes: notes || undefined,
      coffeeId: coffeeId || undefined,
      recipeId: recipeId || undefined,
    };

    try {
      if (isEditMode) {
        await api.patch(`/brews/${editBrew.id}`, brewData);
      } else {
        await api.post('/brews', brewData);
      }

      navigate('/journal');
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'log'} brew`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTastingNote = (note: string) => {
    setTastingNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const addCustomNote = () => {
    if (customNote.trim() && !tastingNotes.includes(customNote.trim())) {
      setTastingNotes((prev) => [...prev, customNote.trim()]);
      setCustomNote('');
    }
  };

  // In edit mode, use editBrew.coffee as fallback while coffees load
  const selectedCoffee = coffees.find((c) => c.id === coffeeId) ||
    (editBrew?.coffee?.id === coffeeId ? editBrew.coffee : undefined);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brew Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brew Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(BREW_METHOD_LABELS).map(([key, label]) => (
              <Button
                key={key}
                type="button"
                variant={brewMethod === key ? 'default' : 'outline'}
                className="w-full"
                onClick={() => {
                  setBrewMethod(key as BrewMethod);
                  setRecipeId('');
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coffee Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coffee (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="Search coffees..."
              value={coffeeSearch}
              onChange={(e) => {
                setCoffeeSearch(e.target.value);
                setShowCoffeeDropdown(true);
              }}
              onFocus={() => setShowCoffeeDropdown(true)}
            />
            {showCoffeeDropdown && coffeeSearch && filteredCoffees.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCoffees.slice(0, 10).map((coffee) => (
                  <button
                    key={coffee.id}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                    onClick={() => {
                      setCoffeeId(coffee.id);
                      setCoffeeSearch('');
                      setShowCoffeeDropdown(false);
                    }}
                  >
                    <span className="font-medium">{coffee.name}</span>
                    <span className="text-sm text-muted-foreground">{coffee.origin}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedCoffee && (
            <div className="mt-2 flex items-center gap-2 p-2 bg-muted rounded">
              <span className="font-medium">{selectedCoffee.name}</span>
              <span className="text-sm text-muted-foreground">{selectedCoffee.origin}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0"
                onClick={() => setCoffeeId('')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recipe Selection */}
      {filteredRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recipe (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="">No recipe</option>
              {filteredRecipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name} ({recipe.coffeeAmount}g / {recipe.waterAmount}ml)
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      {/* Brew Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brew Parameters</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="coffeeAmount">Coffee (g) *</Label>
            <Input
              id="coffeeAmount"
              type="number"
              step="0.1"
              min="0"
              value={coffeeAmount}
              onChange={(e) => setCoffeeAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="waterAmount">Water (ml) *</Label>
            <Input
              id="waterAmount"
              type="number"
              step="1"
              min="0"
              value={waterAmount}
              onChange={(e) => setWaterAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="grindSize">Grind Size</Label>
            <Input
              id="grindSize"
              placeholder="e.g., Medium-fine, 18 clicks"
              value={grindSize}
              onChange={(e) => setGrindSize(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="waterTemp">Water Temp (°C)</Label>
            <Input
              id="waterTemp"
              type="number"
              step="1"
              min="0"
              max="100"
              placeholder="e.g., 94"
              value={waterTemp}
              onChange={(e) => setWaterTemp(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="brewTime">Brew Time (seconds)</Label>
            <Input
              id="brewTime"
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 180"
              value={brewTime}
              onChange={(e) => setBrewTime(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(rating === value ? null : value)}
                className="p-2 hover:bg-muted rounded transition-colors"
              >
                <Star
                  className={`h-8 w-8 ${
                    rating && value <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasting Notes with Flavor Wheel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasting Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <FlavorSelector
            selectedFlavors={tastingNotes}
            onChange={setTastingNotes}
            label=""
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            placeholder="How was this brew? Any observations?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px] resize-y"
          />
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/journal')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditMode ? 'Updating...' : 'Logging...'}
            </>
          ) : (
            isEditMode ? 'Update Brew' : 'Log Brew'
          )}
        </Button>
      </div>
    </form>
  );
}
