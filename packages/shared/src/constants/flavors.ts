// SCA-based Coffee Flavor Wheel data
// Organized in 3 tiers: Category -> Subcategory -> Specific Flavor

export interface FlavorCategory {
  name: string;
  color: string;
  subcategories: FlavorSubcategory[];
}

export interface FlavorSubcategory {
  name: string;
  flavors: string[];
}

export const FLAVOR_WHEEL: FlavorCategory[] = [
  {
    name: 'Fruity',
    color: '#E91E63',
    subcategories: [
      {
        name: 'Berry',
        flavors: ['Blackberry', 'Raspberry', 'Blueberry', 'Strawberry'],
      },
      {
        name: 'Dried Fruit',
        flavors: ['Raisin', 'Prune', 'Date', 'Fig'],
      },
      {
        name: 'Citrus',
        flavors: ['Lemon', 'Lime', 'Orange', 'Grapefruit'],
      },
      {
        name: 'Stone Fruit',
        flavors: ['Peach', 'Apricot', 'Nectarine', 'Cherry'],
      },
      {
        name: 'Tropical',
        flavors: ['Pineapple', 'Mango', 'Passion Fruit', 'Coconut'],
      },
    ],
  },
  {
    name: 'Floral',
    color: '#9C27B0',
    subcategories: [
      {
        name: 'Floral',
        flavors: ['Jasmine', 'Rose', 'Lavender', 'Chamomile', 'Hibiscus'],
      },
    ],
  },
  {
    name: 'Sweet',
    color: '#FF9800',
    subcategories: [
      {
        name: 'Brown Sugar',
        flavors: ['Molasses', 'Maple Syrup', 'Caramel', 'Honey'],
      },
      {
        name: 'Vanilla',
        flavors: ['Vanilla', 'Vanillin'],
      },
      {
        name: 'Sweet Aromatics',
        flavors: ['Brown Sugar', 'Toffee', 'Butterscotch'],
      },
    ],
  },
  {
    name: 'Nutty/Cocoa',
    color: '#795548',
    subcategories: [
      {
        name: 'Nutty',
        flavors: ['Almond', 'Hazelnut', 'Peanut', 'Walnut', 'Pecan'],
      },
      {
        name: 'Cocoa',
        flavors: ['Dark Chocolate', 'Milk Chocolate', 'Cocoa', 'Bakers Chocolate'],
      },
    ],
  },
  {
    name: 'Spices',
    color: '#F44336',
    subcategories: [
      {
        name: 'Brown Spices',
        flavors: ['Cinnamon', 'Clove', 'Nutmeg', 'Anise'],
      },
      {
        name: 'Pepper',
        flavors: ['Black Pepper', 'White Pepper', 'Pink Pepper'],
      },
    ],
  },
  {
    name: 'Roasted',
    color: '#3F51B5',
    subcategories: [
      {
        name: 'Cereal',
        flavors: ['Grain', 'Malt', 'Toast', 'Bread'],
      },
      {
        name: 'Burnt',
        flavors: ['Smoky', 'Ashy', 'Acrid', 'Charred'],
      },
      {
        name: 'Tobacco',
        flavors: ['Pipe Tobacco', 'Tobacco'],
      },
    ],
  },
  {
    name: 'Green/Vegetative',
    color: '#4CAF50',
    subcategories: [
      {
        name: 'Olive Oil',
        flavors: ['Olive', 'Raw'],
      },
      {
        name: 'Green',
        flavors: ['Green', 'Vegetative', 'Grassy', 'Herbal'],
      },
      {
        name: 'Beany',
        flavors: ['Beany'],
      },
    ],
  },
  {
    name: 'Sour/Fermented',
    color: '#CDDC39',
    subcategories: [
      {
        name: 'Sour',
        flavors: ['Sour', 'Tart', 'Tangy'],
      },
      {
        name: 'Wine',
        flavors: ['Winey', 'Whiskey', 'Fermented'],
      },
      {
        name: 'Overripe',
        flavors: ['Overripe', 'Boozy'],
      },
    ],
  },
];

// Flatten all flavors for autocomplete/search
export const ALL_FLAVORS: string[] = FLAVOR_WHEEL.flatMap((category) =>
  category.subcategories.flatMap((sub) => sub.flavors)
);

// Get category for a specific flavor
export function getFlavorCategory(flavor: string): FlavorCategory | undefined {
  return FLAVOR_WHEEL.find((cat) =>
    cat.subcategories.some((sub) => sub.flavors.includes(flavor))
  );
}

// Get subcategory for a specific flavor
export function getFlavorSubcategory(flavor: string): FlavorSubcategory | undefined {
  for (const category of FLAVOR_WHEEL) {
    const subcategory = category.subcategories.find((sub) =>
      sub.flavors.includes(flavor)
    );
    if (subcategory) return subcategory;
  }
  return undefined;
}
