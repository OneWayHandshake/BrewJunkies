import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Coffees array - empty by default, add your own coffees via the app
const coffees: any[] = [
  // Add your own coffees here or use the app to create them
];

// Default brew recipes
const defaultRecipes = [
  {
    name: 'Hoffmann V60 Method',
    description: 'James Hoffmann\'s famous V60 technique for a clean, balanced cup.',
    brewMethod: 'POUR_OVER',
    isDefault: true,
    coffeeAmount: 15,
    waterAmount: 250,
    ratio: '1:16.7',
    waterTemp: 95,
    grindSize: 'Medium-fine',
    totalTime: 210, // 3:30
    author: 'James Hoffmann',
    source: 'YouTube',
    steps: [
      { id: '1', order: 1, type: 'bloom', instruction: 'Add 30g water, swirl gently to saturate all grounds', duration: 45, pourAmount: 30, targetWeight: 30 },
      { id: '2', order: 2, type: 'pour', instruction: 'Pour in circles to 150g total', duration: 30, pourAmount: 120, targetWeight: 150 },
      { id: '3', order: 3, type: 'wait', instruction: 'Let water drain through', duration: 30 },
      { id: '4', order: 4, type: 'pour', instruction: 'Final pour to 250g, gentle circles', duration: 30, pourAmount: 100, targetWeight: 250 },
      { id: '5', order: 5, type: 'wait', instruction: 'Give a gentle swirl and let drain completely', duration: 75 },
    ],
  },
  {
    name: '4:6 Method (Tetsu Kasuya)',
    description: 'World Brewers Cup winning technique allowing precise flavor control.',
    brewMethod: 'POUR_OVER',
    isDefault: true,
    coffeeAmount: 20,
    waterAmount: 300,
    ratio: '1:15',
    waterTemp: 92,
    grindSize: 'Medium-coarse',
    totalTime: 210, // 3:30
    author: 'Tetsu Kasuya',
    source: '2016 World Brewers Cup',
    steps: [
      { id: '1', order: 1, type: 'pour', instruction: 'First pour: 60g for sweetness/acidity balance', duration: 15, pourAmount: 60, targetWeight: 60 },
      { id: '2', order: 2, type: 'wait', instruction: 'Wait for water to drain', duration: 30 },
      { id: '3', order: 3, type: 'pour', instruction: 'Second pour: 60g for strength', duration: 15, pourAmount: 60, targetWeight: 120 },
      { id: '4', order: 4, type: 'wait', instruction: 'Wait for water to drain', duration: 30 },
      { id: '5', order: 5, type: 'pour', instruction: 'Third pour: 60g', duration: 15, pourAmount: 60, targetWeight: 180 },
      { id: '6', order: 6, type: 'wait', instruction: 'Wait for water to drain', duration: 30 },
      { id: '7', order: 7, type: 'pour', instruction: 'Fourth pour: 60g', duration: 15, pourAmount: 60, targetWeight: 240 },
      { id: '8', order: 8, type: 'wait', instruction: 'Wait for water to drain', duration: 20 },
      { id: '9', order: 9, type: 'pour', instruction: 'Fifth pour: 60g', duration: 10, pourAmount: 60, targetWeight: 300 },
      { id: '10', order: 10, type: 'wait', instruction: 'Let drain completely', duration: 30 },
    ],
  },
  {
    name: 'Classic AeroPress',
    description: 'The standard AeroPress technique for a clean, full-bodied cup.',
    brewMethod: 'AEROPRESS',
    isDefault: true,
    coffeeAmount: 17,
    waterAmount: 220,
    ratio: '1:13',
    waterTemp: 85,
    grindSize: 'Fine-medium',
    totalTime: 120, // 2:00
    author: 'AeroPress Inc.',
    source: 'Official Instructions',
    steps: [
      { id: '1', order: 1, type: 'pour', instruction: 'Add coffee, then pour water to the 4 mark', duration: 10, pourAmount: 220 },
      { id: '2', order: 2, type: 'stir', instruction: 'Stir vigorously for 10 seconds', duration: 10 },
      { id: '3', order: 3, type: 'wait', instruction: 'Steep for 1 minute', duration: 60 },
      { id: '4', order: 4, type: 'press', instruction: 'Press slowly and steadily for 30-40 seconds', duration: 40 },
    ],
  },
  {
    name: 'Inverted AeroPress',
    description: 'Popular inverted method for full immersion and more control.',
    brewMethod: 'AEROPRESS',
    isDefault: true,
    coffeeAmount: 15,
    waterAmount: 200,
    ratio: '1:13.3',
    waterTemp: 90,
    grindSize: 'Medium',
    totalTime: 150, // 2:30
    author: 'Community Favorite',
    steps: [
      { id: '1', order: 1, type: 'bloom', instruction: 'Add coffee, pour 50g water, stir gently', duration: 15, pourAmount: 50, targetWeight: 50 },
      { id: '2', order: 2, type: 'wait', instruction: 'Bloom for 30 seconds', duration: 30 },
      { id: '3', order: 3, type: 'pour', instruction: 'Fill remaining water to 200g', duration: 15, pourAmount: 150, targetWeight: 200 },
      { id: '4', order: 4, type: 'wait', instruction: 'Steep for 1 minute', duration: 60 },
      { id: '5', order: 5, type: 'stir', instruction: 'Stir 3 times', duration: 5 },
      { id: '6', order: 6, type: 'press', instruction: 'Flip carefully and press slowly', duration: 25 },
    ],
  },
  {
    name: 'Hoffmann French Press',
    description: 'James Hoffmann\'s technique for a cleaner, sweeter French press.',
    brewMethod: 'FRENCH_PRESS',
    isDefault: true,
    coffeeAmount: 30,
    waterAmount: 500,
    ratio: '1:16.7',
    waterTemp: 95,
    grindSize: 'Medium-coarse',
    totalTime: 540, // 9:00
    author: 'James Hoffmann',
    source: 'YouTube',
    steps: [
      { id: '1', order: 1, type: 'pour', instruction: 'Add coffee, pour all water', duration: 20, pourAmount: 500 },
      { id: '2', order: 2, type: 'wait', instruction: 'Let steep untouched for 4 minutes', duration: 240 },
      { id: '3', order: 3, type: 'stir', instruction: 'Break crust, stir gently, scoop off foam', duration: 30 },
      { id: '4', order: 4, type: 'wait', instruction: 'Wait 5 more minutes for fines to settle', duration: 250 },
      { id: '5', order: 5, type: 'finish', instruction: 'Press plunger just below surface, pour gently', duration: 0 },
    ],
  },
  {
    name: 'Classic French Press',
    description: 'Traditional 4-minute French press method for full-bodied coffee.',
    brewMethod: 'FRENCH_PRESS',
    isDefault: true,
    coffeeAmount: 30,
    waterAmount: 500,
    ratio: '1:16.7',
    waterTemp: 93,
    grindSize: 'Coarse',
    totalTime: 270, // 4:30
    author: 'Traditional',
    steps: [
      { id: '1', order: 1, type: 'pour', instruction: 'Add coffee, pour water in circular motion', duration: 20, pourAmount: 500 },
      { id: '2', order: 2, type: 'stir', instruction: 'Stir gently to saturate all grounds', duration: 10 },
      { id: '3', order: 3, type: 'wait', instruction: 'Place lid on, steep for 4 minutes', duration: 240 },
      { id: '4', order: 4, type: 'press', instruction: 'Press plunger slowly and steadily', duration: 0 },
    ],
  },
  {
    name: 'Chemex Classic',
    description: 'Standard Chemex recipe for a clean, bright, and delicate cup.',
    brewMethod: 'POUR_OVER',
    isDefault: true,
    coffeeAmount: 42,
    waterAmount: 700,
    ratio: '1:16.7',
    waterTemp: 94,
    grindSize: 'Medium-coarse',
    totalTime: 270, // 4:30
    author: 'Chemex',
    steps: [
      { id: '1', order: 1, type: 'bloom', instruction: 'Add 80g water, ensure all grounds are wet', duration: 45, pourAmount: 80, targetWeight: 80 },
      { id: '2', order: 2, type: 'pour', instruction: 'Pour in slow spirals to 350g', duration: 45, pourAmount: 270, targetWeight: 350 },
      { id: '3', order: 3, type: 'wait', instruction: 'Let drain until bed is visible', duration: 30 },
      { id: '4', order: 4, type: 'pour', instruction: 'Second pour to 550g in spirals', duration: 45, pourAmount: 200, targetWeight: 550 },
      { id: '5', order: 5, type: 'wait', instruction: 'Let drain', duration: 30 },
      { id: '6', order: 6, type: 'pour', instruction: 'Final pour to 700g', duration: 30, pourAmount: 150, targetWeight: 700 },
      { id: '7', order: 7, type: 'wait', instruction: 'Let drain completely', duration: 45 },
    ],
  },
  {
    name: 'Kalita Wave Recipe',
    description: 'Consistent, forgiving recipe for the flat-bottom Kalita Wave.',
    brewMethod: 'POUR_OVER',
    isDefault: true,
    coffeeAmount: 20,
    waterAmount: 300,
    ratio: '1:15',
    waterTemp: 93,
    grindSize: 'Medium',
    totalTime: 180, // 3:00
    author: 'Community Standard',
    steps: [
      { id: '1', order: 1, type: 'bloom', instruction: 'Pour 40g water, swirl gently', duration: 35, pourAmount: 40, targetWeight: 40 },
      { id: '2', order: 2, type: 'pour', instruction: 'Pour to 150g in small circles', duration: 25, pourAmount: 110, targetWeight: 150 },
      { id: '3', order: 3, type: 'wait', instruction: 'Wait for drawdown', duration: 20 },
      { id: '4', order: 4, type: 'pour', instruction: 'Pour to 230g', duration: 25, pourAmount: 80, targetWeight: 230 },
      { id: '5', order: 5, type: 'wait', instruction: 'Wait for drawdown', duration: 20 },
      { id: '6', order: 6, type: 'pour', instruction: 'Final pour to 300g', duration: 20, pourAmount: 70, targetWeight: 300 },
      { id: '7', order: 7, type: 'wait', instruction: 'Let drain completely', duration: 35 },
    ],
  },
  {
    name: 'Basic Cold Brew',
    description: 'Classic overnight cold brew concentrate for smooth, low-acid coffee.',
    brewMethod: 'COLD_BREW',
    isDefault: true,
    coffeeAmount: 100,
    waterAmount: 1000,
    ratio: '1:10',
    waterTemp: 4,
    grindSize: 'Coarse',
    totalTime: 50400, // 14 hours
    author: 'Traditional',
    steps: [
      { id: '1', order: 1, type: 'pour', instruction: 'Add coarse ground coffee to container', duration: 60 },
      { id: '2', order: 2, type: 'pour', instruction: 'Add cold filtered water, stir to wet all grounds', duration: 60, pourAmount: 1000 },
      { id: '3', order: 3, type: 'wait', instruction: 'Cover and refrigerate for 12-14 hours', duration: 50280 },
      { id: '4', order: 4, type: 'finish', instruction: 'Filter through paper filter, dilute 1:1 to serve', duration: 0 },
    ],
  },
  {
    name: 'Moka Pot Classic',
    description: 'Traditional stovetop method for rich, espresso-style coffee.',
    brewMethod: 'MOKA_POT',
    isDefault: true,
    coffeeAmount: 20,
    waterAmount: 200,
    ratio: '1:10',
    waterTemp: 70,
    grindSize: 'Fine-medium',
    totalTime: 300, // 5:00
    author: 'Traditional Italian',
    steps: [
      { id: '1', order: 1, type: 'pour', instruction: 'Fill bottom chamber with hot water to valve', duration: 30, pourAmount: 200 },
      { id: '2', order: 2, type: 'bloom', instruction: 'Fill basket with coffee, level off (don\'t tamp)', duration: 30 },
      { id: '3', order: 3, type: 'wait', instruction: 'Assemble and place on medium-low heat', duration: 30 },
      { id: '4', order: 4, type: 'wait', instruction: 'Watch for coffee to start flowing (should be honey-like)', duration: 150 },
      { id: '5', order: 5, type: 'finish', instruction: 'Remove from heat when sputtering begins, cool base under water', duration: 60 },
    ],
  },
];

// Educational content about coffee
const educationalContent = [
  // ORIGINS
  {
    slug: 'ethiopia-birthplace-of-coffee',
    title: 'Ethiopia: The Birthplace of Coffee',
    subtitle: 'Exploring the ancestral home of Arabica coffee',
    category: 'ORIGINS',
    tags: ['Ethiopia', 'History', 'Arabica', 'Origins'],
    excerpt: 'Discover the legendary origins of coffee in the Ethiopian highlands and the incredible diversity of flavors found in its birthplace.',
    content: `# Ethiopia: The Birthplace of Coffee

## The Legend of Kaldi

The story of coffee begins in the ancient coffee forests of Ethiopia. According to legend, a goat herder named Kaldi discovered coffee around 850 AD when he noticed his goats becoming energetic after eating berries from a certain tree.

## Coffee Growing Regions

Ethiopia remains the spiritual and genetic home of Arabica coffee. The country's main growing regions each produce distinctive flavor profiles:

### Yirgacheffe
- **Altitude**: 1,700-2,200 MASL
- **Profile**: Floral, tea-like, citrus
- **Processing**: Primarily washed, some natural

Yirgacheffe coffees are prized for their distinctive jasmine and bergamot aromatics, with bright, sparkling acidity and delicate body.

### Sidamo
- **Altitude**: 1,500-2,200 MASL
- **Profile**: Berry, wine, chocolate
- **Processing**: Both washed and natural

The Sidamo region produces complex coffees with remarkable fruit notes, particularly when natural processed.

### Guji
- **Altitude**: 1,800-2,300 MASL
- **Profile**: Tropical fruit, floral, syrupy
- **Processing**: Natural and washed

Guji has emerged as one of Ethiopia's most exciting regions, producing coffees with incredible sweetness and exotic fruit notes.

### Harrar
- **Altitude**: 1,500-2,100 MASL
- **Profile**: Wild, wine, blueberry
- **Processing**: Natural

Harrar is one of the world's oldest coffee regions, producing bold, wine-like coffees with distinctive wild berry characteristics.

## Ethiopian Heirloom Varieties

Ethiopia is home to thousands of indigenous coffee varieties, collectively called "Ethiopian Heirloom." These wild and semi-wild varieties contribute to the incredible diversity of flavors found in Ethiopian coffees.

## Processing Methods

Ethiopian coffees are processed using both washed and natural methods:

- **Washed (Wet-Processed)**: Produces clean, bright, floral cups
- **Natural (Dry-Processed)**: Creates fruity, wine-like, complex cups

The processing method dramatically influences the final cup profile, with natural processed Ethiopian coffees often displaying intense berry and wine characteristics.`,
    published: true,
    order: 1,
  },
  {
    slug: 'colombian-coffee-regions',
    title: 'Colombian Coffee Regions',
    subtitle: 'A journey through the diverse terroirs of Colombia',
    category: 'ORIGINS',
    tags: ['Colombia', 'Terroir', 'Regions', 'South America'],
    excerpt: 'Explore Colombia\'s renowned coffee-growing regions and understand what makes Colombian coffee world-famous.',
    content: `# Colombian Coffee Regions

## Colombia's Coffee Heritage

Colombia is the world's third-largest coffee producer and is renowned for producing consistently high-quality Arabica coffee. The country's unique geography—with three ranges of the Andes mountains—creates diverse microclimates ideal for coffee cultivation.

## Major Growing Regions

### Huila
- **Altitude**: 1,200-2,000 MASL
- **Harvest**: Main crop April-June, Mitaca Oct-Dec
- **Profile**: Sweet, fruity, balanced acidity

Huila is Colombia's largest specialty coffee producer, accounting for nearly 18% of national production. The region's volcanic soils and ideal climate produce coffees with remarkable sweetness.

### Nariño
- **Altitude**: 1,500-2,300 MASL
- **Profile**: Complex, bright, citrus, floral

Nariño's extreme altitudes and equatorial location create unique growing conditions. Coffee here matures slowly, developing complex sugars and vibrant acidity.

### Tolima
- **Altitude**: 1,200-2,000 MASL
- **Profile**: Chocolate, nuts, mild fruit

Tolima has emerged as a major specialty coffee region, with a strong cooperative movement improving quality and farmer livelihoods.

### Cauca
- **Altitude**: 1,700-2,100 MASL
- **Profile**: Sweet, clean, balanced

The Cauca river valley's consistent climate produces exceptionally clean, sweet coffees year-round.

### Antioquia
- **Altitude**: 1,300-2,100 MASL
- **Profile**: Classic, balanced, chocolate

The birthplace of Colombian coffee culture, Antioquia produces the classic Colombian profile that made the country famous.

## Coffee Varieties in Colombia

Colombia has developed several disease-resistant varieties while maintaining cup quality:

- **Castillo**: Rust-resistant, good cup quality
- **Colombia**: Early hybrid variety
- **Caturra**: Traditional variety, excellent quality
- **Bourbon**: Heirloom variety, exceptional sweetness
- **Pink Bourbon**: Rare variety with remarkable complexity

## The Colombian Coffee Season

Unlike many origins, Colombia has two main harvest seasons due to its geography:

- **Main Harvest**: March-June (most regions)
- **Mitaca (Fly Crop)**: September-December

This dual harvest means fresh Colombian coffee is available nearly year-round.`,
    published: true,
    order: 2,
  },
  {
    slug: 'kenya-coffee-excellence',
    title: 'Kenya: Coffee Excellence',
    subtitle: 'Understanding Kenya\'s world-renowned coffee quality',
    category: 'ORIGINS',
    tags: ['Kenya', 'Africa', 'SL28', 'Terroir'],
    excerpt: 'Learn why Kenyan coffees are among the most sought-after in the specialty coffee world.',
    content: `# Kenya: Coffee Excellence

## A Unique Coffee Origin

Kenya produces some of the world's most distinctive and highly-valued coffees. The country's commitment to quality, unique varieties, and meticulous processing create coffees with unparalleled brightness and complexity.

## The Kenyan Grading System

Kenya grades coffee by bean size:

- **AA**: Screen 17-18 (7.22mm+) - Largest beans
- **AB**: Screen 15-16 (6.80mm) - Mix of A and B
- **PB**: Peaberry - Single rounded bean
- **C, TT, T**: Smaller grades

While size doesn't guarantee quality, larger beans often (but not always) produce more complex cups.

## Growing Regions

### Central Province (Nyeri, Kirinyaga, Murang'a)
- **Altitude**: 1,400-2,000 MASL
- **Profile**: Intense, blackcurrant, tomato, citrus

The slopes of Mount Kenya produce intensely flavored coffees with Kenya's signature bright acidity.

### Eastern Province (Embu, Meru)
- **Altitude**: 1,200-1,800 MASL
- **Profile**: Balanced, fruity, wine-like

Eastern slopes tend to produce slightly softer but equally complex coffees.

### Western Kenya
- **Altitude**: 1,500-1,900 MASL
- **Profile**: Full body, less acidity

The western highlands produce unique profiles distinct from central Kenya.

## Kenyan Varieties

Kenya's signature varieties were developed for the country's terroir:

### SL28
Developed in the 1930s by Scott Laboratories, SL28 is drought-tolerant and produces exceptional cup quality with intense fruit and wine-like acidity.

### SL34
A high-yielding variety that maintains good cup quality, often paired with SL28 in blends.

### Ruiru 11 & Batian
Newer disease-resistant varieties developed to combat coffee leaf rust while maintaining quality.

## The Kenyan Processing Difference

Kenya uses a distinctive double-fermentation washing process:

1. Pulping removes cherry skin
2. First fermentation (12-24 hours)
3. Washing
4. Second fermentation (12-24 hours)
5. Final washing in channels
6. Drying on raised beds

This meticulous process contributes to the clean, vibrant acidity Kenyan coffees are famous for.`,
    published: true,
    order: 3,
  },

  // ROASTING
  {
    slug: 'understanding-roast-levels',
    title: 'Understanding Roast Levels',
    subtitle: 'How roasting transforms green coffee into the flavors we love',
    category: 'ROASTING',
    tags: ['Roasting', 'Basics', 'Flavor', 'Guide'],
    excerpt: 'Learn how different roast levels affect flavor, body, and acidity in your coffee.',
    content: `# Understanding Roast Levels

## The Roasting Process

Roasting transforms green coffee beans into the aromatic brown beans we recognize. During this process, complex chemical reactions develop the flavors, aromas, and colors we associate with coffee.

## Key Roasting Stages

### Drying Phase (0-4 minutes)
The beans lose moisture and turn from green to yellow. The coffee smells grassy or hay-like.

### Browning Phase (4-7 minutes)
Maillard reactions begin, creating hundreds of flavor compounds. The beans turn light brown.

### Development Phase (7+ minutes)
After first crack, the roaster controls flavor development. This is where roast level is determined.

## Roast Levels Explained

### Light Roast
- **Color**: Light brown, no oil on surface
- **Internal Temp**: 356-401°F (180-205°C)
- **Characteristics**:
  - Highest acidity
  - Most origin character
  - Fruity, floral notes
  - Light body
  - Highest caffeine content

Best for: Single-origin specialty coffees, pour-over, cold brew

### Medium-Light Roast
- **Color**: Medium brown, no oil
- **Internal Temp**: 401-410°F (205-210°C)
- **Characteristics**:
  - Balanced acidity
  - Origin character preserved
  - Caramel sweetness emerging
  - Medium-light body

Best for: Versatile brewing, balanced espresso

### Medium Roast
- **Color**: Medium brown, minimal oil
- **Internal Temp**: 410-428°F (210-220°C)
- **Characteristics**:
  - Balanced flavor
  - Moderate acidity
  - Chocolate, nutty notes
  - Medium body
  - Classic coffee flavor

Best for: All brewing methods, crowd-pleasing coffees

### Medium-Dark Roast
- **Color**: Rich brown, some oil
- **Internal Temp**: 428-446°F (220-230°C)
- **Characteristics**:
  - Lower acidity
  - Roast character prominent
  - Bittersweet chocolate
  - Full body
  - Less origin character

Best for: Espresso, milk-based drinks

### Dark Roast
- **Color**: Dark brown to black, oily surface
- **Internal Temp**: 446-482°F (230-250°C)
- **Characteristics**:
  - Very low acidity
  - Smoky, bitter notes
  - Heavy body
  - Roast character dominant
  - Lowest caffeine content

Best for: Traditional espresso, French press

## Roast Level and Brewing

Different roast levels suit different brewing methods:

| Roast Level | Best Methods |
|-------------|--------------|
| Light | Pour-over, Chemex, Cold Brew |
| Medium-Light | V60, AeroPress, Espresso |
| Medium | All methods |
| Medium-Dark | Espresso, Moka Pot, French Press |
| Dark | Espresso, French Press |

## The Myth of "Stronger" Dark Roast

Contrary to popular belief, dark roasts contain slightly *less* caffeine than light roasts. The perception of "strength" comes from the bold, bitter flavors—not caffeine content.`,
    published: true,
    order: 1,
  },

  // BREWING
  {
    slug: 'espresso-fundamentals',
    title: 'Espresso Fundamentals',
    subtitle: 'Master the art and science of espresso extraction',
    category: 'BREWING',
    tags: ['Espresso', 'Brewing', 'Extraction', 'Guide'],
    excerpt: 'Everything you need to know to pull the perfect shot of espresso.',
    content: `# Espresso Fundamentals

## What is Espresso?

Espresso is a concentrated coffee brewed by forcing hot water through finely-ground coffee under high pressure. The result is a complex, intense beverage that forms the base for many coffee drinks.

## The Espresso Recipe

A standard espresso recipe includes:

- **Dose**: 18-20g of ground coffee
- **Yield**: 36-40g of liquid espresso
- **Ratio**: 1:2 (dose to yield)
- **Time**: 25-32 seconds
- **Temperature**: 90-96°C (194-205°F)
- **Pressure**: 9 bars

## Key Variables

### Dose
The amount of ground coffee in the portafilter.
- Increase dose → stronger, more intense
- Decrease dose → lighter, more delicate

### Yield
The weight of liquid espresso extracted.
- Higher yield → more extraction, potentially bitter
- Lower yield → less extraction, potentially sour

### Grind Size
- Finer grind → slower extraction, more intense
- Coarser grind → faster extraction, less intense

### Time
- Under 20 seconds → likely under-extracted (sour)
- Over 35 seconds → likely over-extracted (bitter)

## Dialing In Espresso

Follow this process to dial in a new coffee:

1. **Start with baseline**: 18g in, 36g out, ~30 seconds
2. **Taste the shot**: Identify if sour, bitter, or balanced
3. **Adjust grind**: Finer if sour/fast, coarser if bitter/slow
4. **Repeat**: Until balanced and delicious

## Roast-Specific Recommendations

### Light Roasts
- Higher temperature (94-96°C)
- Higher ratio (1:2.2 to 1:2.5)
- Longer time (28-35 seconds)
- Finer grind

### Medium Roasts
- Standard temperature (92-94°C)
- Standard ratio (1:2)
- Standard time (25-30 seconds)

### Dark Roasts
- Lower temperature (88-92°C)
- Lower ratio (1:1.8 to 1:2)
- Shorter time (22-28 seconds)
- Coarser grind

## Common Problems and Solutions

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| Sour shot | Under-extraction | Grind finer, increase temp |
| Bitter shot | Over-extraction | Grind coarser, decrease temp |
| Watery shot | Channeling | Improve distribution, tamp evenly |
| Uneven extraction | Poor prep | Level grounds, even tamp |
| No crema | Stale beans | Use fresher coffee |

## The Perfect Shot

A well-extracted espresso should have:
- **Crema**: Golden-brown, 2-3mm thick
- **Body**: Syrupy, full mouthfeel
- **Flavor**: Sweet, complex, balanced
- **Aftertaste**: Pleasant, lingering`,
    published: true,
    order: 1,
  },
  {
    slug: 'pour-over-techniques',
    title: 'Pour Over Techniques',
    subtitle: 'The art of manual coffee brewing',
    category: 'BREWING',
    tags: ['Pour Over', 'V60', 'Chemex', 'Manual Brewing'],
    excerpt: 'Master pour-over brewing for clean, complex cups that highlight coffee\'s best qualities.',
    content: `# Pour Over Techniques

## Why Pour Over?

Pour-over brewing offers unparalleled control over extraction, producing clean, complex cups that highlight a coffee's unique characteristics. It's the preferred method for showcasing high-quality single-origin coffees.

## Essential Equipment

- **Pour-over dripper**: V60, Chemex, Kalita Wave, etc.
- **Gooseneck kettle**: For precise pouring control
- **Scale**: Accuracy to 0.1g recommended
- **Timer**: Built into most coffee scales
- **Grinder**: Burr grinder for consistent particle size
- **Filters**: Appropriate for your dripper

## The Standard Recipe

### Baseline Parameters
- **Ratio**: 1:16 (coffee to water)
- **Dose**: 15-20g coffee
- **Water**: 240-320g at 92-96°C
- **Grind**: Medium (like sea salt)
- **Total time**: 2:30-3:30

## The V60 Technique

### Step-by-Step Process

1. **Rinse filter** (30 seconds)
   - Preheat brewer, remove paper taste
   - Discard rinse water

2. **Add coffee, create well**
   - Level grounds
   - Make small indent in center

3. **Bloom** (0:00-0:45)
   - Add 2x coffee weight in water
   - Wait 30-45 seconds
   - CO2 escapes, grounds "bloom"

4. **First pour** (0:45-1:15)
   - Slow, circular pour
   - Center to edge, avoid walls
   - Target: 60% of total water

5. **Second pour** (1:15-1:45)
   - Continue circular motion
   - Maintain even bed
   - Reach total water weight

6. **Drawdown** (1:45-3:00)
   - Allow complete draining
   - Final bed should be flat

## Adjusting Your Brew

### If coffee tastes sour (under-extracted):
- Grind finer
- Increase water temperature
- Pour slower
- Extend bloom time

### If coffee tastes bitter (over-extracted):
- Grind coarser
- Decrease water temperature
- Pour faster
- Reduce total brew time

## Roast Level Adjustments

| Roast | Temperature | Ratio | Notes |
|-------|-------------|-------|-------|
| Light | 96-100°C | 1:17 | Longer bloom, slower pour |
| Medium | 92-96°C | 1:16 | Standard recipe |
| Dark | 88-92°C | 1:15 | Quick pour, less agitation |

## Popular Pour-Over Methods

### V60 (Hario)
- Conical, spiral ridges
- Fast flow, high control needed
- Best for: Experienced brewers

### Chemex
- Thick filters, clean cup
- Longer brew times
- Best for: Multiple servings

### Kalita Wave
- Flat bottom, consistent extraction
- More forgiving technique
- Best for: Beginners

### Origami
- Versatile, use different filters
- Variable flow rates
- Best for: Experimentation`,
    published: true,
    order: 2,
  },

  // EQUIPMENT
  {
    slug: 'choosing-a-grinder',
    title: 'Choosing a Coffee Grinder',
    subtitle: 'The most important investment for better coffee',
    category: 'EQUIPMENT',
    tags: ['Grinder', 'Equipment', 'Buying Guide'],
    excerpt: 'Why your grinder matters more than your brewer, and how to choose the right one.',
    content: `# Choosing a Coffee Grinder

## Why Grinders Matter

The grinder is the single most important piece of coffee equipment you can invest in. Fresh, consistently ground coffee is essential for great extraction, and no brewing technique can compensate for poor grinding.

## Blade vs. Burr Grinders

### Blade Grinders
- Chop beans with spinning blade
- Inconsistent particle size
- Generate heat, damaging flavor
- **Verdict**: Avoid for serious coffee

### Burr Grinders
- Crush beans between two surfaces
- Consistent particle size
- Minimal heat generation
- **Verdict**: Essential for quality coffee

## Types of Burr Grinders

### Flat Burrs
- Two parallel discs
- Uniform particle size
- More clarity in cup
- Better for espresso
- Higher retention

### Conical Burrs
- Cone-shaped burr inside ring
- Slightly less uniform
- More body in cup
- Good for all methods
- Lower retention

## Hand vs. Electric Grinders

### Hand Grinders
**Pros**:
- Affordable quality
- Portable
- Quiet
- No electricity needed

**Cons**:
- Physical effort required
- Slow for multiple cups
- Limited capacity

**Best for**: Single servings, travel, budget-conscious

### Electric Grinders
**Pros**:
- Fast and convenient
- High capacity
- Consistent workflow
- Less physical effort

**Cons**:
- More expensive
- Noisy
- Requires counter space

**Best for**: Daily brewing, multiple cups, espresso

## Grinder Recommendations by Budget

### Entry Level ($50-150)
- **Hand**: 1Zpresso Q2, Timemore C2
- **Electric**: Baratza Encore, Fellow Ode

### Mid-Range ($150-400)
- **Hand**: 1Zpresso JX-Pro, Comandante
- **Electric**: Baratza Virtuoso+, Fellow Ode Gen 2

### High-End ($400+)
- **Hand**: 1Zpresso J-Max, Weber Key
- **Electric**: Niche Zero, Eureka Mignon, DF64

## Key Features to Consider

1. **Grind consistency**: Most important factor
2. **Grind range**: Must cover your brew methods
3. **Retention**: Low retention = fresher coffee
4. **Build quality**: Durability and reliability
5. **Ease of cleaning**: Regular maintenance matters
6. **Noise level**: Consider your environment
7. **Speed**: Time per dose

## Maintenance Tips

- Clean regularly (weekly for heavy use)
- Replace burrs when worn (every 1-3 years)
- Use grinder-safe cleaning products
- Store in dry location
- Recalibrate periodically`,
    published: true,
    order: 1,
  },
];

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.brewLog.deleteMany();
  await prisma.brewRecipe.deleteMany();
  await prisma.beanAnalysis.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.coffee.deleteMany();
  await prisma.educationalContent.deleteMany();

  // Seed coffees
  console.log('Seeding coffees...');
  for (const coffee of coffees) {
    await prisma.coffee.create({
      data: coffee as any,
    });
    console.log(`  Created: ${coffee.name}`);
  }
  console.log(`Seeded ${coffees.length} coffees`);

  // Seed default brew recipes
  console.log('Seeding default brew recipes...');
  for (const recipe of defaultRecipes) {
    await prisma.brewRecipe.create({
      data: recipe as any,
    });
    console.log(`  Created: ${recipe.name}`);
  }
  console.log(`Seeded ${defaultRecipes.length} recipes`);

  // Seed educational content
  console.log('Seeding educational content...');
  for (const content of educationalContent) {
    await prisma.educationalContent.create({
      data: {
        ...content,
        publishedAt: content.published ? new Date() : null,
      } as any,
    });
    console.log(`  Created: ${content.title}`);
  }
  console.log(`Seeded ${educationalContent.length} articles`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
