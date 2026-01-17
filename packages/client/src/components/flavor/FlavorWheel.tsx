import { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FLAVOR_WHEEL, type FlavorCategory, type FlavorSubcategory } from '@coffee/shared';

interface FlavorWheelProps {
  selectedFlavors: string[];
  onSelect: (flavor: string) => void;
  onRemove: (flavor: string) => void;
}

export function FlavorWheel({ selectedFlavors, onSelect, onRemove }: FlavorWheelProps) {
  const [activeCategory, setActiveCategory] = useState<FlavorCategory | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<FlavorSubcategory | null>(null);

  const handleCategoryClick = (category: FlavorCategory) => {
    setActiveCategory(category);
    setActiveSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory: FlavorSubcategory) => {
    setActiveSubcategory(subcategory);
  };

  const handleFlavorClick = (flavor: string) => {
    if (selectedFlavors.includes(flavor)) {
      onRemove(flavor);
    } else {
      onSelect(flavor);
    }
  };

  const handleBack = () => {
    if (activeSubcategory) {
      setActiveSubcategory(null);
    } else if (activeCategory) {
      setActiveCategory(null);
    }
  };

  // Render categories (tier 1)
  if (!activeCategory) {
    return (
      <div className="space-y-4">
        {/* Selected Flavors */}
        {selectedFlavors.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
            {selectedFlavors.map((flavor) => (
              <span
                key={flavor}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
              >
                {flavor}
                <button
                  onClick={() => onRemove(flavor)}
                  className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FLAVOR_WHEEL.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category)}
              className="p-4 rounded-lg text-white font-medium text-center hover:opacity-90 transition-opacity"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
              <ChevronRight className="h-4 w-4 inline-block ml-1" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Render subcategories (tier 2)
  if (!activeSubcategory) {
    return (
      <div className="space-y-4">
        {/* Selected Flavors */}
        {selectedFlavors.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
            {selectedFlavors.map((flavor) => (
              <span
                key={flavor}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
              >
                {flavor}
                <button
                  onClick={() => onRemove(flavor)}
                  className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Back Button & Category Header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span
            className="px-3 py-1 rounded text-white text-sm font-medium"
            style={{ backgroundColor: activeCategory.color }}
          >
            {activeCategory.name}
          </span>
        </div>

        {/* Subcategory Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {activeCategory.subcategories.map((subcategory) => (
            <button
              key={subcategory.name}
              onClick={() => handleSubcategoryClick(subcategory)}
              className="p-3 rounded-lg border-2 font-medium text-center hover:border-primary transition-colors"
              style={{ borderColor: activeCategory.color + '40' }}
            >
              {subcategory.name}
              <ChevronRight className="h-4 w-4 inline-block ml-1 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Render specific flavors (tier 3)
  return (
    <div className="space-y-4">
      {/* Selected Flavors */}
      {selectedFlavors.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
          {selectedFlavors.map((flavor) => (
            <span
              key={flavor}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
            >
              {flavor}
              <button
                onClick={() => onRemove(flavor)}
                className="hover:bg-primary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Back Button & Breadcrumb */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <span
          className="px-2 py-0.5 rounded text-white text-xs"
          style={{ backgroundColor: activeCategory.color }}
        >
          {activeCategory.name}
        </span>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{activeSubcategory.name}</span>
      </div>

      {/* Flavor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {activeSubcategory.flavors.map((flavor) => {
          const isSelected = selectedFlavors.includes(flavor);
          return (
            <button
              key={flavor}
              onClick={() => handleFlavorClick(flavor)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {flavor}
              {isSelected && (
                <span className="ml-2 text-primary">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
