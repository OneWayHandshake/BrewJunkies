import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const maslArticle = {
  slug: 'understanding-masl-altitude',
  title: 'Understanding MASL: How Altitude Shapes Coffee',
  subtitle: 'The Science Behind Elevation and Coffee Quality',
  excerpt: 'Discover how meters above sea level (MASL) dramatically influences coffee flavor, acidity, and complexity.',
  content: `# Understanding MASL: How Altitude Shapes Coffee

MASL stands for **Meters Above Sea Level**, and it's one of the most critical factors determining coffee quality and flavor profile. When coffee professionals discuss altitude, they're referring to how high above sea level coffee is grown—and this single variable can transform an ordinary bean into an extraordinary one.

## Why Altitude Matters

At higher elevations, coffee plants face a unique set of growing conditions that stress the plant in beneficial ways:

**Cooler Temperatures**
- Higher altitudes mean cooler average temperatures
- Coffee cherries mature more slowly (up to 2-3 months longer)
- Slower maturation allows more time for complex sugars and acids to develop
- Result: More nuanced, complex flavors

**Greater Temperature Variation**
- Day-to-night temperature swings are more dramatic at altitude
- Plants "rest" during cool nights, conserving energy
- Daytime warmth drives photosynthesis and sugar production
- Result: Higher sugar content and more developed flavors

**Increased UV Exposure**
- Thinner atmosphere means more intense sunlight
- Plants produce more chlorogenic acids as protection
- These acids contribute to perceived acidity and brightness
- Result: Vibrant, bright cup profiles

**Lower Oxygen Levels**
- Reduced oxygen slows plant metabolism
- Beans develop denser cellular structure
- Denser beans roast more evenly
- Result: Better roasting characteristics

## Altitude Classifications

The coffee industry generally classifies growing altitudes into distinct categories:

### Low Altitude: Below 900 MASL
- **Characteristics**: Mild, soft flavors; lower acidity; fuller body
- **Flavor Profile**: Earthy, nutty, subtle sweetness
- **Bean Density**: Soft bean (lower density)
- **Common Origins**: Parts of Brazil, Hawaii, some Indonesian islands
- **Best For**: Espresso blends, those preferring smooth, mild coffee

### Medium Altitude: 900-1,200 MASL
- **Characteristics**: Balanced sweetness and acidity; smooth body
- **Flavor Profile**: Nutty, chocolate, caramel notes
- **Bean Density**: Medium density
- **Common Origins**: Santos (Brazil), some Central American regions
- **Best For**: All-purpose brewing, balanced espresso

### High Altitude: 1,200-1,500 MASL
- **Characteristics**: Pronounced acidity; complex flavors; medium body
- **Flavor Profile**: Citrus, stone fruit, floral notes emerging
- **Bean Density**: Hard bean (HB)
- **Common Origins**: Guatemala, Costa Rica, parts of Colombia
- **Best For**: Pour-over, filter brewing methods

### Very High Altitude: 1,500-1,800 MASL
- **Characteristics**: Bright acidity; complex, layered flavors; lighter body
- **Flavor Profile**: Berries, wine-like qualities, jasmine, citrus
- **Bean Density**: Strictly Hard Bean (SHB)
- **Common Origins**: Ethiopian highlands, Kenyan highlands, Colombian micro-lots
- **Best For**: Specialty single-origin brewing, light roasts

### Extreme Altitude: Above 1,800 MASL
- **Characteristics**: Intense, vibrant acidity; exceptional complexity; delicate body
- **Flavor Profile**: Exotic fruits, floral explosions, tea-like qualities
- **Bean Density**: Very hard, dense beans
- **Common Origins**: Ethiopian Yirgacheffe, Bolivian Yungas, parts of Peru
- **Best For**: Showcase single-origins, competition coffees

## How Altitude Affects Specific Flavor Components

### Acidity
Higher altitude = Brighter, more complex acidity
- Low altitude: Soft, muted acidity
- Medium altitude: Balanced, pleasant acidity
- High altitude: Bright, citric acidity
- Very high altitude: Sparkling, wine-like acidity

### Sweetness
Altitude influences sugar development:
- Low altitude: Simple sweetness, brown sugar
- Medium altitude: Caramel, toffee sweetness
- High altitude: Fruit sweetness, honey
- Very high altitude: Complex fruit sugars, floral honey

### Body
Generally inversely related to altitude:
- Low altitude: Full, heavy body
- Medium altitude: Medium, balanced body
- High altitude: Medium-light body
- Very high altitude: Light, tea-like body

### Flavor Complexity
Directly correlated with altitude:
- Low altitude: 1-2 distinct flavor notes
- Medium altitude: 2-3 flavor notes
- High altitude: 4-6 flavor notes
- Very high altitude: 6+ layered flavor notes

## Regional Altitude Examples

### Ethiopia
- Yirgacheffe: 1,700-2,200 MASL
- Sidamo: 1,500-2,200 MASL
- Harrar: 1,500-2,100 MASL
- Known for: Floral, fruity, wine-like characteristics

### Colombia
- Huila: 1,250-2,000 MASL
- Nariño: 1,500-2,300 MASL
- Cauca: 1,700-2,100 MASL
- Known for: Balanced acidity, caramel sweetness, fruit notes

### Guatemala
- Antigua: 1,500-1,700 MASL
- Huehuetenango: 1,500-2,000 MASL
- Acatenango: 1,300-2,000 MASL
- Known for: Chocolate, spice, citrus complexity

### Kenya
- Central Province: 1,400-2,000 MASL
- Nyeri: 1,700-1,900 MASL
- Kirinyaga: 1,300-1,900 MASL
- Known for: Bright acidity, blackcurrant, tomato notes

## Grading Systems Based on Altitude

Several countries use altitude-based grading:

### Central American Grading
- **SHB (Strictly Hard Bean)**: Above 1,350 MASL
- **HB (Hard Bean)**: 1,200-1,350 MASL
- **Semi-Hard Bean**: 1,000-1,200 MASL
- **Extra Prime**: 900-1,000 MASL
- **Prime**: 750-900 MASL

### Mexican Grading
- **Altura**: Above 1,200 MASL (highest grade)
- **Prima Lavado**: 900-1,200 MASL
- **Buen Lavado**: Below 900 MASL

## Practical Applications

### For Roasters
- Higher altitude beans require careful roast profiling
- Dense beans need longer development time
- Risk of underdevelopment if rushed
- Often better suited to lighter roast profiles

### For Brewers
- High altitude coffees often shine with pour-over methods
- Lower altitude coffees work well for espresso
- Consider grind size adjustments for bean density
- Water temperature may need adjustment

### For Buyers
- MASL is one indicator of quality, not the only one
- Consider altitude alongside processing method and variety
- Higher altitude often (but not always) means higher price
- Look for specific elevation data on specialty coffee bags

## Beyond Altitude: The Complete Picture

While MASL is crucial, remember it's part of a larger equation:

**Other Important Factors**
- Latitude (equatorial regions can grow at lower elevations)
- Soil composition and nutrients
- Rainfall patterns and irrigation
- Shade coverage
- Variety of coffee plant
- Processing method
- Post-harvest handling

The best coffees combine optimal altitude with excellent practices in all these areas.

## Key Takeaways

1. **MASL directly impacts flavor complexity** - higher generally means more complex
2. **Bean density increases with altitude** - affecting roasting and extraction
3. **Acidity correlates with elevation** - higher altitude = brighter acidity
4. **Body often decreases with altitude** - lower altitude = fuller body
5. **Quality grading often uses altitude** - SHB/HB designations indicate elevation
6. **Context matters** - other factors work alongside altitude

Understanding MASL helps you make informed choices about which coffees to try and how to best prepare them. Whether you prefer the smooth, full-bodied character of lower-altitude Brazilian beans or the sparkling, complex notes of high-altitude Ethiopian coffees, knowing the role of altitude enriches your coffee journey.`,
  category: 'ORIGINS',
  tags: ['MASL', 'Altitude', 'Coffee Science', 'Growing Conditions', 'Bean Density', 'Flavor Development'],
  order: 0, // Place it first in the ORIGINS category
};

async function main() {
  console.log('Seeding MASL educational article...');

  await prisma.educationalContent.upsert({
    where: { slug: maslArticle.slug },
    update: {
      title: maslArticle.title,
      subtitle: maslArticle.subtitle,
      excerpt: maslArticle.excerpt,
      content: maslArticle.content,
      category: maslArticle.category,
      tags: maslArticle.tags,
      order: maslArticle.order,
      published: true,
      publishedAt: new Date(),
    },
    create: {
      slug: maslArticle.slug,
      title: maslArticle.title,
      subtitle: maslArticle.subtitle,
      excerpt: maslArticle.excerpt,
      content: maslArticle.content,
      category: maslArticle.category,
      tags: maslArticle.tags,
      order: maslArticle.order,
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log('MASL article seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding MASL article:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
