import { Settings, Trash2, Edit2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { GrinderListItem } from '@coffee/shared';

interface GrinderCardProps {
  grinder: GrinderListItem;
  onSelect: (grinder: GrinderListItem) => void;
  onEdit: (grinder: GrinderListItem) => void;
  onDelete: (grinder: GrinderListItem) => void;
  isSelected?: boolean;
}

export function GrinderCard({
  grinder,
  onSelect,
  onEdit,
  onDelete,
  isSelected,
}: GrinderCardProps) {
  return (
    <Card
      className={`cursor-pointer hover:border-primary/50 transition-colors ${
        isSelected ? 'border-primary ring-2 ring-primary/20' : ''
      }`}
      onClick={() => onSelect(grinder)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{grinder.name}</CardTitle>
            {isSelected && (
              <CheckCircle className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(grinder)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(grinder)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm text-muted-foreground">
          {grinder.brand && (
            <p>
              <span className="font-medium">Brand:</span> {grinder.brand}
              {grinder.model && ` ${grinder.model}`}
            </p>
          )}
          {grinder.burrType && (
            <p>
              <span className="font-medium">Burrs:</span> {grinder.burrType}
            </p>
          )}
          <p>
            <span className="font-medium">Settings saved:</span>{' '}
            {grinder.settingsCount}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
