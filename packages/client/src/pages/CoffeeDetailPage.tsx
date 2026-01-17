import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  ThermometerSun,
  Clock,
  Scale,
  Coffee,
  Loader2,
  ArrowLeft,
  Trash2,
  Star,
  MapPin,
  Factory,
  Mountain,
  Droplets,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ShareButton } from '@/components/ui/ShareButton';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  ROAST_LEVEL_LABELS,
  PROCESS_METHOD_LABELS,
  type Coffee as CoffeeType,
  type RoastLevel,
  type ProcessMethod,
} from '@coffee/shared';

interface CoffeeDetail extends CoffeeType {
  isFavorite?: boolean;
}

interface Review {
  id: string;
  rating: number;
  content: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export function CoffeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [coffee, setCoffee] = useState<CoffeeDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  useEffect(() => {
    const fetchCoffee = async () => {
      try {
        setIsLoading(true);
        const [coffeeRes, reviewsRes] = await Promise.all([
          api.get(`/coffees/${id}`),
          api.get(`/coffees/${id}/reviews`),
        ]);
        setCoffee(coffeeRes.data.data);
        setReviews(reviewsRes.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load coffee details.');
        console.error('Error fetching coffee:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCoffee();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this coffee? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/coffees/${id}`);
      navigate('/coffees');
    } catch (err) {
      console.error('Error deleting coffee:', err);
      alert('Failed to delete coffee. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !coffee) return;

    try {
      setIsFavoriting(true);
      if (coffee.isFavorite) {
        await api.delete(`/coffees/${id}/favorite`);
        setCoffee({ ...coffee, isFavorite: false });
      } else {
        await api.post(`/coffees/${id}/favorite`);
        setCoffee({ ...coffee, isFavorite: true });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsFavoriting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !coffee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-destructive mb-4">{error || 'Coffee not found'}</p>
          <Button onClick={() => navigate('/coffees')}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  const espresso = coffee.brewParams?.espresso;
  const pourOver = coffee.brewParams?.pourOver;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate('/coffees')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Catalog
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center overflow-hidden">
          {coffee.imageUrl ? (
            <img
              src={coffee.imageUrl}
              alt={coffee.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Coffee className="h-24 w-24 text-muted-foreground/30" />
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-display font-semibold mb-2">{coffee.name}</h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {coffee.origin}
                {coffee.region && ` - ${coffee.region}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton
                title={coffee.name}
                text={`Check out ${coffee.name} from ${coffee.origin} on BrewJunkies!`}
              />
              {isAuthenticated && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleToggleFavorite}
                    disabled={isFavoriting}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        coffee.isFavorite ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive hover:text-destructive"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Rating */}
          {coffee.averageRating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(coffee.averageRating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{coffee.averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({coffee.reviewCount} review{coffee.reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {ROAST_LEVEL_LABELS[coffee.roastLevel as RoastLevel]}
            </span>
            <span className="bg-secondary px-3 py-1 rounded-full text-sm">
              {PROCESS_METHOD_LABELS[coffee.process as ProcessMethod]}
            </span>
            {coffee.variety && (
              <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                {coffee.variety}
              </span>
            )}
          </div>

          {/* Tasting Notes */}
          {coffee.tastingNotes.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Tasting Notes</h2>
              <div className="flex flex-wrap gap-2">
                {coffee.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="border border-border px-3 py-1 rounded-full text-sm"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {coffee.description && (
            <p className="text-muted-foreground mb-6">{coffee.description}</p>
          )}

          {/* Origin Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {coffee.farm && (
              <div className="flex items-center gap-2 text-sm">
                <Factory className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Farm:</span>
                <span>{coffee.farm}</span>
              </div>
            )}
            {coffee.altitude && (
              <div className="flex items-center gap-2 text-sm">
                <Mountain className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Altitude:</span>
                <span>{coffee.altitude}</span>
              </div>
            )}
            {coffee.roaster && (
              <div className="flex items-center gap-2 text-sm">
                <Coffee className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Roaster:</span>
                <span>{coffee.roaster}</span>
              </div>
            )}
          </div>

          {/* Flavor Profile */}
          {(coffee.acidity || coffee.body || coffee.sweetness) && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Flavor Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coffee.acidity && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Acidity</span>
                      <span>{coffee.acidity}/10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${coffee.acidity * 10}%` }}
                      />
                    </div>
                  </div>
                )}
                {coffee.body && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Body</span>
                      <span>{coffee.body}/10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-700 rounded-full"
                        style={{ width: `${coffee.body * 10}%` }}
                      />
                    </div>
                  </div>
                )}
                {coffee.sweetness && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sweetness</span>
                      <span>{coffee.sweetness}/10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-500 rounded-full"
                        style={{ width: `${coffee.sweetness * 10}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Brew Parameters */}
          {espresso && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Espresso Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dose</p>
                      <p className="font-medium">
                        {espresso.dose}g in / {espresso.yield}g out
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ThermometerSun className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="font-medium">{espresso.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pull Time</p>
                      <p className="font-medium">
                        {espresso.pullTime.min}-{espresso.pullTime.max}s
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono text-lg">⚙️</span>
                    <div>
                      <p className="text-sm text-muted-foreground">Grind</p>
                      <p className="font-medium">{espresso.grindSize}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {pourOver && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coffee className="h-5 w-5" />
                  Pour Over Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ratio</p>
                      <p className="font-medium">
                        {pourOver.dose}g : {pourOver.waterAmount}ml ({pourOver.ratio})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ThermometerSun className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="font-medium">{pourOver.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Time</p>
                      <p className="font-medium">
                        {pourOver.totalTime.min}-{pourOver.totalTime.max}s
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono text-lg">⚙️</span>
                    <div>
                      <p className="text-sm text-muted-foreground">Grind</p>
                      <p className="font-medium">{pourOver.grindSize}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-display font-semibold mb-6">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="mb-4">No reviews yet. Be the first to review this coffee!</p>
            {isAuthenticated && <Button>Write a Review</Button>}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {review.user.avatarUrl ? (
                        <img
                          src={review.user.avatarUrl}
                          alt={review.user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {review.user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{review.user.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      {review.content && (
                        <p className="text-muted-foreground">{review.content}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
