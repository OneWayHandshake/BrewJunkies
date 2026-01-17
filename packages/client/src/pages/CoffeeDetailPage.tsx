import { useParams } from 'react-router-dom';
import { Heart, ThermometerSun, Clock, Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ShareButton } from '@/components/ui/ShareButton';

export function CoffeeDetailPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Coffee Image (ID: {id})</span>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Ethiopian Yirgacheffe</h1>
              <p className="text-lg text-muted-foreground">Single Origin - Ethiopia</p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton
                title="Ethiopian Yirgacheffe"
                text="Check out this amazing coffee from Ethiopia on BrewJunkies!"
              />
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              Light Roast
            </span>
            <span className="bg-secondary px-3 py-1 rounded-full text-sm">Washed</span>
            <span className="bg-secondary px-3 py-1 rounded-full text-sm">Arabica</span>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Tasting Notes</h2>
            <div className="flex flex-wrap gap-2">
              {['Blueberry', 'Citrus', 'Floral', 'Tea-like'].map((note) => (
                <span key={note} className="border px-3 py-1 rounded-full text-sm">
                  {note}
                </span>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            A bright and complex coffee from the Yirgacheffe region of Ethiopia. Known for its
            distinctive blueberry and citrus notes with a tea-like body.
          </p>

          {/* Brew Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Espresso Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Scale className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dose</p>
                    <p className="font-medium">18g in / 36g out</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ThermometerSun className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="font-medium">93-94°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pull Time</p>
                    <p className="font-medium">28-32 seconds</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-mono text-lg">☕</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Grind</p>
                    <p className="font-medium">Fine</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        <div className="text-center py-12 text-muted-foreground">
          <p>No reviews yet. Be the first to review this coffee!</p>
          <Button className="mt-4">Write a Review</Button>
        </div>
      </section>
    </div>
  );
}
