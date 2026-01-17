import { Star, CheckCircle2, Trash2, Edit2, Coffee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BREW_METHOD_LABELS, ROAST_LEVEL_LABELS, type GrindSettingListItem } from '@coffee/shared';

interface GrindSettingCardProps {
  setting: GrindSettingListItem;
  onEdit: (setting: GrindSettingListItem) => void;
  onDelete: (setting: GrindSettingListItem) => void;
  onToggleDialedIn: (setting: GrindSettingListItem) => void;
}

export function GrindSettingCard({
  setting,
  onEdit,
  onDelete,
  onToggleDialedIn,
}: GrindSettingCardProps) {
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className={setting.isDialedIn ? 'border-green-500/50 bg-green-500/5' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-primary">{setting.setting}</span>
              <span className="text-sm px-2 py-0.5 bg-secondary rounded-full">
                {BREW_METHOD_LABELS[setting.brewMethod]}
              </span>
              {setting.isDialedIn && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  Dialed In
                </span>
              )}
            </div>

            {setting.coffee && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Coffee className="h-3 w-3" />
                <span>{setting.coffee.name}</span>
                <span className="text-xs">
                  ({ROAST_LEVEL_LABELS[setting.coffee.roastLevel]})
                </span>
              </div>
            )}

            <div className="flex items-center gap-4">
              {renderStars(setting.rating)}
              {setting.notes && (
                <p className="text-xs text-muted-foreground truncate">{setting.notes}</p>
              )}
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                setting.isDialedIn ? 'text-green-600' : 'text-muted-foreground'
              }`}
              onClick={() => onToggleDialedIn(setting)}
              title={setting.isDialedIn ? 'Unmark as dialed in' : 'Mark as dialed in'}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(setting)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(setting)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
