import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Star, Clock, Droplets, Scale, Trash2, Loader2, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BREW_METHOD_LABELS, type BrewLogListItem } from '@coffee/shared';

interface BrewLogCardProps {
  brew: BrewLogListItem;
  onDelete?: (id: string) => Promise<void>;
}

export function BrewLogCard({ brew, onDelete }: BrewLogCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const brewDate = new Date(brew.brewedAt);
  const formattedDate = brewDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = brewDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(brew.id);
    } catch (error) {
      console.error('Failed to delete brew:', error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Coffee Image or Placeholder */}
          <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
            {brew.coffee?.imageUrl ? (
              <img
                src={brew.coffee.imageUrl}
                alt={brew.coffee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Coffee className="h-8 w-8 text-muted-foreground/50" />
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold line-clamp-1">
                  {brew.coffee?.name || 'Unknown Coffee'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {BREW_METHOD_LABELS[brew.brewMethod]}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {brew.rating && (
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
                    <Star className="h-3 w-3 fill-yellow-400" />
                    <span className="text-sm font-medium">{brew.rating}</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={() => navigate(`/journal/${brew.id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setShowConfirm(true)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Brew Parameters */}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Scale className="h-3 w-3" />
                {brew.coffeeAmount}g
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                {brew.waterAmount}ml
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formattedDate} at {formattedTime}
              </span>
            </div>

            {/* Tasting Notes */}
            {brew.tastingNotes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {brew.tastingNotes.slice(0, 4).map((note) => (
                  <span
                    key={note}
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
                  >
                    {note}
                  </span>
                ))}
                {brew.tastingNotes.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{brew.tastingNotes.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Recipe Used */}
            {brew.recipe && (
              <p className="text-xs text-muted-foreground mt-2">
                Recipe: {brew.recipe.name}
              </p>
            )}
          </div>
        </div>

        {/* Delete Confirmation */}
        {showConfirm && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Delete this brew log? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
