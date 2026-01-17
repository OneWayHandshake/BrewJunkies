import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FlavorWheel } from './FlavorWheel';

interface FlavorSelectorProps {
  selectedFlavors: string[];
  onChange: (flavors: string[]) => void;
  label?: string;
}

export function FlavorSelector({
  selectedFlavors,
  onChange,
  label = 'Tasting Notes',
}: FlavorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (flavor: string) => {
    if (!selectedFlavors.includes(flavor)) {
      onChange([...selectedFlavors, flavor]);
    }
  };

  const handleRemove = (flavor: string) => {
    onChange(selectedFlavors.filter((f) => f !== flavor));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-1"
        >
          {isOpen ? (
            <>
              Close Wheel
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Open Flavor Wheel
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Selected Chips (always visible) */}
      {selectedFlavors.length > 0 && !isOpen && (
        <div className="flex flex-wrap gap-2">
          {selectedFlavors.map((flavor) => (
            <span
              key={flavor}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm"
            >
              {flavor}
              <button
                type="button"
                onClick={() => handleRemove(flavor)}
                className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Flavor Wheel */}
      {isOpen && (
        <div className="border rounded-lg p-4 bg-card">
          <FlavorWheel
            selectedFlavors={selectedFlavors}
            onSelect={handleSelect}
            onRemove={handleRemove}
          />
        </div>
      )}
    </div>
  );
}
