import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const coffeeCountries = [
  {
    slug: 'brazil-coffee',
    title: 'Brazil',
    subtitle: 'The World\'s Largest Coffee Producer',
    excerpt: 'Brazil produces approximately 40% of the world\'s coffee, known for its nutty, chocolatey profiles.',
    content: `# Brazil: Coffee Giant

Brazil has dominated global coffee production for over 150 years, producing both Arabica and Robusta varieties across vast fazendas (coffee farms).

## Key Growing Regions

**Minas Gerais**
- Altitude: 900-1,350 MASL
- Profile: Nutty, chocolate, caramel
- Brazil's largest producing state

**São Paulo (Mogiana)**
- Altitude: 900-1,100 MASL
- Profile: Sweet, mild acidity, caramel
- Historic coffee region

**Bahia**
- Altitude: 700-1,200 MASL
- Profile: Fruity, wine-like, full body
- Modern, technologically advanced farms

**Espírito Santo**
- Altitude: 600-1,200 MASL
- Known for Robusta/Conilon production

## Common Bean Types
- **Bourbon**: Sweet, complex
- **Mundo Novo**: High yield, good cup quality
- **Catuai**: Disease resistant, balanced
- **Yellow Bourbon**: Honey sweetness

## Flavor Profile
Brazilian coffees are generally known for:
- Low to medium acidity
- Full body
- Nutty, chocolatey notes
- Caramel sweetness
- Smooth, easy-drinking character

## Processing Methods
- Primarily natural (dry) processed
- Pulped natural (honey) gaining popularity
- Some washed lots from specialty farms`,
    tags: ['Brazil', 'South America', 'Arabica', 'Robusta'],
    order: 1,
  },
  {
    slug: 'vietnam-coffee',
    title: 'Vietnam',
    subtitle: 'The Robusta Powerhouse',
    excerpt: 'Second largest producer globally, Vietnam specializes in Robusta beans with bold, earthy flavors.',
    content: `# Vietnam: Robusta Leader

Vietnam emerged as a coffee powerhouse in the late 20th century, becoming the world's second-largest producer and the leading Robusta producer.

## Key Growing Regions

**Central Highlands (Tây Nguyên)**
- Includes Đắk Lắk, Lâm Đồng, Gia Lai
- Altitude: 500-1,500 MASL
- 90% of Vietnam's coffee production

**Đắk Lắk Province**
- Vietnam's coffee capital
- Known as "Land of Coffee"
- Largest production volume

**Lâm Đồng Province (Dalat)**
- Higher altitude Arabica production
- Cooler climate, quality focus

## Common Bean Types
- **Robusta**: 95% of production
- **Arabica**: Growing specialty segment
- **Catimor**: Disease-resistant Arabica hybrid
- **Excelsa**: Small production, unique profile

## Flavor Profile
Vietnamese coffees typically offer:
- Bold, strong flavor
- Low acidity
- Earthy, woody notes
- Chocolate undertones
- High caffeine content (Robusta)

## Cultural Significance
Vietnam developed unique coffee culture:
- **Cà phê sữa đá**: Iced coffee with condensed milk
- **Egg coffee**: Whipped egg yolk coffee
- Drip filter brewing (phin)`,
    tags: ['Vietnam', 'Asia', 'Robusta', 'Arabica'],
    order: 2,
  },
  {
    slug: 'colombia-coffee',
    title: 'Colombia',
    subtitle: 'Premium Arabica Excellence',
    excerpt: 'World-renowned for high-quality Arabica with balanced acidity and rich, fruity notes.',
    content: `# Colombia: Coffee Excellence

Colombia is synonymous with premium Arabica coffee, benefiting from ideal growing conditions along the Andes mountains and a sophisticated quality grading system.

## Key Growing Regions

**Huila**
- Altitude: 1,250-2,000 MASL
- Profile: Fruity, wine-like, complex
- Colombia's top specialty region

**Nariño**
- Altitude: 1,800-2,300 MASL
- Profile: Bright acidity, citrus, floral
- High altitude excellence

**Tolima**
- Altitude: 1,200-1,900 MASL
- Profile: Caramel, red fruit, balanced

**Antioquia**
- Altitude: 1,300-2,000 MASL
- Profile: Chocolate, nuts, mild

**Cauca**
- Altitude: 1,700-2,100 MASL
- Profile: Sweet, fruity, clean

## Common Bean Types
- **Castillo**: Disease-resistant, good quality
- **Colombia**: Rust-resistant variety
- **Caturra**: Traditional, excellent cup
- **Typica**: Heritage variety
- **Tabi**: New hybrid, complex flavors
- **Pink Bourbon**: Rare, exceptional quality

## Flavor Profile
Colombian coffees are celebrated for:
- Bright, balanced acidity
- Medium to full body
- Caramel sweetness
- Fruity notes (citrus, berries)
- Clean, well-defined flavors

## Quality Grading
- **Supremo**: Largest screen size (17+)
- **Excelso**: Medium screen size (14-16)
- Regional designations gaining importance`,
    tags: ['Colombia', 'South America', 'Arabica', 'Specialty'],
    order: 3,
  },
  {
    slug: 'indonesia-coffee',
    title: 'Indonesia',
    subtitle: 'Island Diversity and Unique Processing',
    excerpt: 'Famous for Sumatra, Java, and Sulawesi coffees with earthy, herbal, and full-bodied profiles.',
    content: `# Indonesia: Archipelago of Coffee

Indonesia's 17,000+ islands produce remarkably diverse coffees, each with distinct characteristics shaped by unique terroir and traditional processing methods.

## Key Growing Regions

**Sumatra**
- Altitude: 1,000-1,600 MASL
- Profile: Earthy, herbal, full body, low acidity
- Famous: Mandheling, Lintong, Gayo
- Wet-hulled (Giling Basah) processing

**Java**
- Altitude: 900-1,800 MASL
- Profile: Clean, bright, sweet
- Historic Dutch colonial plantations
- Often washed processed

**Sulawesi (Celebes)**
- Altitude: 1,100-1,700 MASL
- Profile: Spicy, herbal, complex
- Famous: Toraja region
- Traditional processing methods

**Bali**
- Altitude: 1,200-1,700 MASL
- Profile: Sweet, citrus, clean
- Organic farming traditions
- Subak irrigation system

**Flores**
- Altitude: 1,200-1,800 MASL
- Profile: Floral, chocolate, spice
- Growing specialty reputation

## Common Bean Types
- **Typica variants**: Traditional, clean cup
- **S795**: Indian-Indonesian hybrid
- **Catimor**: Disease-resistant
- **Tim Tim**: Local Timor hybrid
- **Lini S**: New Indonesian variety

## Flavor Profile
Indonesian coffees are known for:
- Low acidity
- Full, heavy body
- Earthy, herbal notes
- Spicy undertones
- Tobacco, cedar characteristics
- Syrupy mouthfeel

## Unique Processing
**Giling Basah (Wet-Hulled)**:
Creates the distinctive earthy, herbal profile unique to Indonesian coffees.`,
    tags: ['Indonesia', 'Asia', 'Arabica', 'Sumatra', 'Java'],
    order: 4,
  },
  {
    slug: 'ethiopia-coffee-country',
    title: 'Ethiopia',
    subtitle: 'The Birthplace of Coffee',
    excerpt: 'Where coffee originated, offering incredible diversity from wild heirloom varieties.',
    content: `# Ethiopia: Coffee's Ancestral Home

Ethiopia is where Coffea arabica originated, and its wild coffee forests contain more genetic diversity than anywhere else on Earth.

## Key Growing Regions

**Yirgacheffe**
- Altitude: 1,700-2,200 MASL
- Profile: Floral, tea-like, citrus, bergamot
- Washed process produces clean, bright cups

**Sidamo**
- Altitude: 1,500-2,200 MASL
- Profile: Berry, wine, chocolate
- Both washed and natural processing

**Guji**
- Altitude: 1,800-2,300 MASL
- Profile: Tropical fruit, floral, syrupy
- Rising star in specialty coffee

**Harrar**
- Altitude: 1,500-2,100 MASL
- Profile: Wild blueberry, wine, mocha
- Dry-processed, intense fruit

**Limu**
- Altitude: 1,400-2,100 MASL
- Profile: Wine, spice, balanced
- Washed processing

**Djimmah**
- Altitude: 1,400-2,000 MASL
- Profile: Earthy, spicy
- Larger commercial production

## Common Bean Types
Ethiopian coffees contain thousands of heirloom varieties, often simply called "Ethiopian Heirloom" as individual varieties are rarely isolated.

## Flavor Profile
Ethiopian coffees can offer:
- Bright, wine-like acidity
- Light to medium body
- Floral aromatics
- Fruit-forward (blueberry, citrus, tropical)
- Tea-like characteristics
- Complex, layered flavors

## Cultural Significance
Coffee ceremony (Buna) is central to Ethiopian social life.`,
    tags: ['Ethiopia', 'Africa', 'Arabica', 'Heirloom', 'Origin'],
    order: 5,
  },
  {
    slug: 'honduras-coffee',
    title: 'Honduras',
    subtitle: 'Central America\'s Rising Star',
    excerpt: 'Now Central America\'s largest producer, Honduras offers excellent value and growing specialty quality.',
    content: `# Honduras: Quality on the Rise

Honduras has rapidly grown to become Central America's largest coffee producer and is increasingly recognized for specialty-grade coffees.

## Key Growing Regions

**Copán**
- Altitude: 1,000-1,500 MASL
- Profile: Chocolate, caramel, balanced
- Western Honduras, Mayan heritage

**Montecillos**
- Altitude: 1,200-1,700 MASL
- Profile: Citrus, peach, lively acidity
- One of six designated origins

**Agalta**
- Altitude: 1,100-1,400 MASL
- Profile: Tropical fruit, chocolate

**Opalaca**
- Altitude: 1,100-1,500 MASL
- Profile: Stone fruit, grape, sweet

**Comayagua**
- Altitude: 1,100-1,500 MASL
- Profile: Citrus, apricot, honey

**El Paraíso**
- Altitude: 1,100-1,400 MASL
- Profile: Sweet, fruity, clean

## Common Bean Types
- **Catuai**: Most common, reliable
- **Caturra**: Good quality, compact
- **Bourbon**: Premium lots
- **Pacas**: Salvadoran variety
- **Lempira**: Local hybrid
- **IHCAFE 90**: Rust-resistant

## Flavor Profile
Honduran coffees typically offer:
- Mild, balanced acidity
- Medium body
- Chocolate notes
- Stone fruit sweetness
- Clean finish
- Excellent value for quality`,
    tags: ['Honduras', 'Central America', 'Arabica'],
    order: 6,
  },
  {
    slug: 'india-coffee',
    title: 'India',
    subtitle: 'Monsoon Magic and Southern Tradition',
    excerpt: 'Known for unique Monsoon Malabar processing and shade-grown coffees from Karnataka.',
    content: `# India: Monsooned Distinction

India produces both Arabica and Robusta, with unique processing methods and traditional shade-growing under forest canopy.

## Key Growing Regions

**Karnataka**
- Includes Chikmagalur, Coorg, Hassan
- Altitude: 1,000-1,500 MASL
- 70% of Indian production
- Birthplace of Indian coffee (Baba Budan)

**Kerala**
- Altitude: 600-1,500 MASL
- Profile: Full body, spicy
- Robusta and Arabica

**Tamil Nadu**
- Altitude: 900-1,400 MASL
- Includes Nilgiris, Pulneys, Shevaroys
- High-grown Arabica

## Common Bean Types
- **S795**: Arabica hybrid, most planted
- **Selection 9**: Kent derivative
- **Cauvery (Catimor)**: Disease-resistant
- **Robusta CxR**: High-yielding Robusta

## Unique Processing

**Monsoon Malabar**
Coffee exposed to monsoon winds for 12-16 weeks:
- Beans swell and turn golden
- Low acidity, full body
- Earthy, musty, spicy notes
- Created accidentally during colonial shipping

## Flavor Profile
Indian coffees typically offer:
- Low acidity
- Full body
- Spicy, earthy notes
- Chocolate undertones
- Tobacco, cedar (Monsoon Malabar)

## Growing Practices
- Shade-grown under forest canopy
- Intercropped with pepper, cardamom
- Sustainable, biodiversity-friendly`,
    tags: ['India', 'Asia', 'Arabica', 'Robusta', 'Monsoon Malabar'],
    order: 7,
  },
  {
    slug: 'uganda-coffee',
    title: 'Uganda',
    subtitle: 'Africa\'s Robusta Giant',
    excerpt: 'Major African producer with native Robusta forests and growing Arabica specialty sector.',
    content: `# Uganda: Robusta Roots

Uganda is Africa's top coffee exporter by volume, with indigenous Robusta forests and a developing Arabica specialty sector on Mount Elgon.

## Key Growing Regions

**Mount Elgon**
- Altitude: 1,500-2,300 MASL
- Arabica production
- Profile: Bright, fruity, wine-like
- Bugisu region famous for quality

**Central Region**
- Lake Victoria basin
- Native Robusta forests
- Lower altitude production

**Rwenzori Mountains**
- Altitude: 1,200-2,200 MASL
- Growing Arabica sector
- "Mountains of the Moon"

**West Nile**
- Developing coffee region
- Robusta and Arabica

## Common Bean Types
- **Bugisu AA**: Premium Arabica
- **Drugar**: Washed Robusta
- **Native Robusta**: Wild varieties
- **SL14, SL28**: Arabica selections

## Flavor Profile
**Ugandan Arabica:**
- Bright acidity
- Fruity, wine-like
- Medium body
- Berry, citrus notes

**Ugandan Robusta:**
- Earthy, woody
- Full body
- Low acidity
- Chocolate notes

## Industry Structure
- Smallholder farmers dominate
- Growing specialty sector
- Direct trade relationships developing`,
    tags: ['Uganda', 'Africa', 'Robusta', 'Arabica'],
    order: 8,
  },
  {
    slug: 'mexico-coffee',
    title: 'Mexico',
    subtitle: 'Organic Pioneer of the Americas',
    excerpt: 'Leading organic coffee producer with diverse regional profiles from Chiapas to Oaxaca.',
    content: `# Mexico: Organic Leadership

Mexico is one of the world's largest producers of organic coffee, with indigenous farming communities maintaining traditional sustainable practices.

## Key Growing Regions

**Chiapas**
- Altitude: 1,000-1,800 MASL
- Largest producing state
- Profile: Light body, bright, citrus
- Strong organic presence

**Oaxaca (Pluma)**
- Altitude: 900-1,650 MASL
- Profile: Chocolate, nutty, balanced
- Famous Pluma Hidalgo region

**Veracruz**
- Altitude: 800-1,700 MASL
- Historic coffee region
- Profile: Sweet, caramel, light

**Puebla**
- Altitude: 1,000-1,600 MASL
- Indigenous communities
- Organic focus

**Guerrero**
- Altitude: 900-1,400 MASL
- Growing specialty reputation

## Common Bean Types
- **Typica**: Traditional, clean cup
- **Bourbon**: Sweet, complex
- **Caturra**: Compact, good quality
- **Mundo Novo**: Productive
- **Catimor**: Disease-resistant

## Flavor Profile
Mexican coffees typically offer:
- Light to medium body
- Mild, pleasant acidity
- Nutty, chocolate notes
- Delicate sweetness
- Clean finish

## Social Impact
- Indigenous community cooperatives
- Fair trade movement strong
- Organic certification leader`,
    tags: ['Mexico', 'North America', 'Arabica', 'Organic'],
    order: 9,
  },
  {
    slug: 'guatemala-coffee',
    title: 'Guatemala',
    subtitle: 'Volcanic Excellence',
    excerpt: 'Eight distinct growing regions produce complex, full-bodied coffees shaped by volcanic soil.',
    content: `# Guatemala: Volcanic Terroir

Guatemala's volcanic landscape creates eight distinct coffee-growing regions, each producing coffees with unique characteristics.

## Key Growing Regions

**Antigua**
- Altitude: 1,500-1,700 MASL
- Volcanic soil, three volcanos
- Profile: Full body, spicy, chocolate, smoky
- Premium prices, protected designation

**Huehuetenango**
- Altitude: 1,500-2,000 MASL
- Non-volcanic, dry microclimate
- Profile: Complex, fruity, wine-like
- Highest growing region

**Cobán**
- Altitude: 1,300-1,500 MASL
- Rainforest climate, misty
- Profile: Light body, fruity, wild

**Atitlán**
- Altitude: 1,500-1,700 MASL
- Lake Atitlán volcanic basin
- Profile: Full body, citrus, floral

**San Marcos**
- Altitude: 1,300-1,800 MASL
- Highest rainfall
- Profile: Floral, balanced, delicate

**Fraijanes**
- Altitude: 1,400-1,800 MASL
- Profile: Bright acidity, fruit forward

**Nuevo Oriente**
- Altitude: 1,300-1,700 MASL
- Profile: Balanced, chocolate

**Acatenango**
- Altitude: 1,300-2,000 MASL
- Profile: Rich, sweet, full body

## Common Bean Types
- **Bourbon**: Traditional, complex
- **Caturra**: Popular, balanced
- **Catuai**: Disease-resistant
- **Pache**: Guatemala native
- **Typica**: Heritage variety
- **Pacamara**: Large bean, fruity

## Flavor Profile
Guatemalan coffees are known for:
- Full body
- Bright acidity
- Chocolate complexity
- Spicy undertones
- Smoky notes (volcanic regions)`,
    tags: ['Guatemala', 'Central America', 'Arabica', 'Volcanic'],
    order: 10,
  },
  {
    slug: 'peru-coffee',
    title: 'Peru',
    subtitle: 'Andes Heights and Organic Growth',
    excerpt: 'High-altitude Arabica from small farmers, with strong organic and fair trade presence.',
    content: `# Peru: High-Altitude Promise

Peru's coffee grows high in the Andes, produced primarily by small-scale farmers with a strong focus on organic and fair trade certification.

## Key Growing Regions

**Cajamarca**
- Altitude: 1,200-2,050 MASL
- Northern Peru
- Profile: Balanced, sweet, mild

**San Martín**
- Altitude: 1,100-1,800 MASL
- Largest production volume
- Profile: Chocolate, nutty

**Amazonas**
- Altitude: 1,400-2,000 MASL
- Remote, pristine environment
- Profile: Fruity, floral

**Junín**
- Altitude: 1,200-1,900 MASL
- Central highlands
- Profile: Bright, citrus

**Cusco**
- Altitude: 1,200-1,800 MASL
- Near Machu Picchu
- Profile: Sweet, balanced

**Puno**
- Altitude: 1,300-1,800 MASL
- Lake Titicaca region
- Profile: Mild, clean

## Common Bean Types
- **Typica**: Most planted
- **Caturra**: Popular variety
- **Bourbon**: Quality focus
- **Catimor**: Disease-resistant
- **Pache**: Some presence

## Flavor Profile
Peruvian coffees typically offer:
- Mild to medium acidity
- Light to medium body
- Nutty, chocolate notes
- Floral undertones
- Clean, sweet finish

## Industry Characteristics
- Smallholder dominated
- Strong cooperative structure
- Organic certification widespread
- Fair trade focus`,
    tags: ['Peru', 'South America', 'Arabica', 'Organic'],
    order: 11,
  },
  {
    slug: 'nicaragua-coffee',
    title: 'Nicaragua',
    subtitle: 'Central American Quality',
    excerpt: 'Shade-grown coffees from volcanic highlands with balanced, fruity profiles.',
    content: `# Nicaragua: Volcanic Soil, Quality Focus

Nicaragua produces shade-grown Arabica on volcanic slopes, with a growing reputation for specialty-grade coffees.

## Key Growing Regions

**Jinotega**
- Altitude: 1,100-1,700 MASL
- Largest producing region
- Profile: Citrus, chocolate, balanced

**Matagalpa**
- Altitude: 1,000-1,500 MASL
- Historic coffee region
- Profile: Fruity, sweet

**Nueva Segovia**
- Altitude: 1,100-1,650 MASL
- Border with Honduras
- Profile: Bright, complex, fruity

**Madriz**
- Altitude: 1,200-1,450 MASL
- Smaller production
- Profile: Sweet, balanced

## Common Bean Types
- **Caturra**: Most common
- **Catuai**: Productive
- **Bourbon**: Premium quality
- **Maragogype**: "Elephant bean"
- **Pacamara**: Large, complex
- **Java**: Some presence

## Flavor Profile
Nicaraguan coffees are known for:
- Bright, fruity acidity
- Medium body
- Citrus notes
- Chocolate sweetness
- Clean finish

## Growing Practices
- Shade-grown under diverse canopy
- Volcanic soil benefits
- Family farms predominate
- Direct trade relationships`,
    tags: ['Nicaragua', 'Central America', 'Arabica'],
    order: 12,
  },
  {
    slug: 'ivory-coast-coffee',
    title: 'Côte d\'Ivoire',
    subtitle: 'West African Robusta Hub',
    excerpt: 'Major Robusta producer providing beans for commercial blends worldwide.',
    content: `# Côte d'Ivoire: West African Producer

Côte d'Ivoire (Ivory Coast) is a significant Robusta producer, supplying beans for commercial blends, instant coffee, and espresso blends.

## Key Growing Regions

**Western Region**
- Main production area
- Altitude: 200-800 MASL
- Dense forest coverage

**Central-West**
- Expanding production
- Mixed farming systems

## Common Bean Types
- **Robusta**: Primary production
- Limited Arabica experiments

## Flavor Profile
Ivorian Robusta offers:
- Strong, bold flavor
- Low acidity
- Earthy, woody notes
- High caffeine content
- Full body

## Industry Characteristics
- Smallholder farmers
- Commercial grade focus
- Instant coffee market
- Espresso blend component`,
    tags: ['Côte d\'Ivoire', 'Africa', 'Robusta'],
    order: 13,
  },
  {
    slug: 'costa-rica-coffee',
    title: 'Costa Rica',
    subtitle: 'Strictly Hard Bean Excellence',
    excerpt: 'Pioneering quality focus with only Arabica production and innovative processing.',
    content: `# Costa Rica: Quality Commitment

Costa Rica was the first Central American country to establish a coffee industry and maintains strict quality standards—Robusta production is actually illegal.

## Key Growing Regions

**Tarrazú**
- Altitude: 1,200-1,900 MASL
- Most famous region
- Profile: Bright acidity, full body, citrus
- "Strictly Hard Bean" designation

**Central Valley**
- Altitude: 1,000-1,400 MASL
- Historic production area
- Profile: Balanced, clean, sweet

**West Valley**
- Altitude: 1,200-1,700 MASL
- Profile: Fruity, complex
- Innovative processing

**Brunca**
- Altitude: 800-1,700 MASL
- Southern region
- Profile: Balanced, mild

**Guanacaste**
- Altitude: 600-1,300 MASL
- Drier climate
- Profile: Mild, sweet

**Tres Ríos**
- Altitude: 1,200-1,650 MASL
- Small, premium region
- Profile: Bright, fruity

**Orosi**
- Altitude: 1,000-1,400 MASL
- Valley microclimate

**Turrialba**
- Altitude: 600-1,600 MASL
- Volcanic soil

## Common Bean Types
- **Caturra**: Most common
- **Catuai**: Popular
- **Villa Sarchi**: Costa Rican native
- **Geisha**: Premium lots
- **SL28**: Limited production

## Flavor Profile
Costa Rican coffees offer:
- Bright, lively acidity
- Clean, sweet cup
- Citrus, stone fruit
- Honey sweetness
- Medium body

## Processing Innovation
Costa Rica leads in experimental processing:
- Honey processed (white, yellow, red, black)
- Anaerobic fermentation
- Natural processing`,
    tags: ['Costa Rica', 'Central America', 'Arabica', 'Specialty'],
    order: 14,
  },
  {
    slug: 'tanzania-coffee',
    title: 'Tanzania',
    subtitle: 'East African Brightness',
    excerpt: 'Known for Mount Kilimanjaro peaberry coffees with bright, winey acidity.',
    content: `# Tanzania: Kilimanjaro Heights

Tanzania produces high-quality Arabica on the slopes of Mount Kilimanjaro and Mount Meru, known for distinctive peaberry offerings.

## Key Growing Regions

**Northern Highlands (Kilimanjaro/Arusha)**
- Altitude: 1,400-1,800 MASL
- Volcanic soil
- Profile: Bright, wine-like, complex
- Famous for peaberry

**Southern Highlands (Mbeya/Ruvuma)**
- Altitude: 1,200-1,800 MASL
- Growing production
- Profile: Fruity, medium body

**Kigoma Region**
- Altitude: 1,100-1,700 MASL
- Lake Tanganyika influence
- Profile: Complex, balanced

## Common Bean Types
- **Bourbon**: Traditional, quality
- **Kent**: Disease-resistant
- **N39**: Local selection
- **Blue Mountain**: Some presence
- **Peaberry**: Single-seed beans, premium

## Flavor Profile
Tanzanian coffees typically offer:
- Bright, wine-like acidity
- Medium body
- Stone fruit, berry notes
- Floral aromatics
- Clean, complex finish

## Peaberry Special
Tanzania is famous for Peaberry:
- Single oval seed (vs. two flat seeds)
- More concentrated flavor
- Premium pricing
- Roughly 5% of harvest`,
    tags: ['Tanzania', 'Africa', 'Arabica', 'Peaberry'],
    order: 15,
  },
  {
    slug: 'kenya-coffee-country',
    title: 'Kenya',
    subtitle: 'Auction Excellence',
    excerpt: 'Famous for complex, fruity coffees sold through a unique auction system.',
    content: `# Kenya: Auction Quality

Kenya produces some of the world's most sought-after coffees, known for intense fruit-forward profiles and sold through a renowned auction system.

## Key Growing Regions

**Central Province (Nyeri, Kirinyaga, Murang'a)**
- Altitude: 1,400-2,000 MASL
- Volcanic red soil
- Profile: Intense, blackcurrant, tomato, complex
- Premium AA lots

**Eastern Province (Embu, Meru)**
- Altitude: 1,300-1,900 MASL
- Mount Kenya slopes
- Profile: Fruity, bright, balanced

**Kiambu**
- Altitude: 1,500-1,800 MASL
- Historic region near Nairobi

**Bungoma (Western)**
- Altitude: 1,400-1,800 MASL
- Developing region

## Common Bean Types
- **SL28**: Drought-resistant, exceptional cup
- **SL34**: High yield, quality cup
- **Ruiru 11**: Disease-resistant hybrid
- **Batian**: New, resistant variety
- **K7**: Some production

## Grading System
- **AA**: Largest screen size (17-18)
- **AB**: Medium (15-16)
- **PB**: Peaberry
- **C, E, TT**: Lower grades

## Flavor Profile
Kenyan coffees are known for:
- Intense, bright acidity
- Full body
- Blackcurrant, tomato notes
- Citrus, grapefruit
- Complex, winey characteristics

## Auction System
Kenya's coffee is sold through the Nairobi Coffee Exchange, allowing buyers to cup and bid on specific lots.`,
    tags: ['Kenya', 'Africa', 'Arabica', 'SL28', 'SL34'],
    order: 16,
  },
  {
    slug: 'papua-new-guinea-coffee',
    title: 'Papua New Guinea',
    subtitle: 'Pacific Island Mystery',
    excerpt: 'Remote highlands produce unique, earthy coffees with rustic character.',
    content: `# Papua New Guinea: Highland Mystery

Papua New Guinea's remote highlands produce distinctive coffees, often with rustic, earthy characteristics shaped by traditional processing.

## Key Growing Regions

**Western Highlands**
- Altitude: 1,400-1,800 MASL
- Largest production
- Wahgi Valley famous
- Profile: Fruity, herbal, complex

**Eastern Highlands**
- Altitude: 1,400-1,900 MASL
- Goroka region
- Profile: Sweet, balanced

**Simbu Province**
- Altitude: 1,500-1,900 MASL
- High altitude quality

**Jiwaka Province**
- Altitude: 1,400-1,800 MASL
- Newer producing area

## Common Bean Types
- **Typica**: Blue Mountain heritage
- **Bourbon**: Some plantings
- **Arusha**: Typica selection
- **Mundo Novo**: Limited

## Flavor Profile
PNG coffees typically offer:
- Medium acidity
- Full, syrupy body
- Earthy, herbal notes
- Tropical fruit
- Rustic, wild character

## Industry Characteristics
- Smallholder farmers (95%)
- Traditional processing methods
- Limited infrastructure
- Organic by default
- Complex logistics`,
    tags: ['Papua New Guinea', 'Pacific', 'Arabica'],
    order: 17,
  },
  {
    slug: 'el-salvador-coffee',
    title: 'El Salvador',
    subtitle: 'Bourbon Heritage',
    excerpt: 'Historic Bourbon variety plantings produce sweet, balanced coffees.',
    content: `# El Salvador: Bourbon Tradition

El Salvador maintains significant plantings of heritage Bourbon variety, producing sweet, balanced coffees from volcanic slopes.

## Key Growing Regions

**Apaneca-Ilamatepec**
- Altitude: 1,000-2,300 MASL
- Volcanic range
- Profile: Complex, bright, fruity
- Famous Santa Ana volcano

**Alotepec-Metapán**
- Altitude: 1,000-2,000 MASL
- Cooler microclimate
- Profile: Sweet, balanced

**El Bálsamo-Quezaltepec**
- Altitude: 500-1,900 MASL
- Western region
- Profile: Chocolate, nuts

**Chichontepec**
- Altitude: 500-1,000 MASL
- Lower altitude

**Tecapa-Chinameca**
- Altitude: 500-1,700 MASL
- Eastern region

**Cacahuatique**
- Altitude: 500-1,650 MASL
- Growing specialty

## Common Bean Types
- **Bourbon**: Heritage, 70%+ of production
- **Pacas**: El Salvador native mutation
- **Pacamara**: Pacas x Maragogype hybrid
- **Caturra**: Some presence
- **Catisic**: Local hybrid

## Flavor Profile
Salvadoran coffees offer:
- Sweet, balanced cup
- Medium acidity
- Chocolate, caramel
- Soft fruit notes
- Creamy body

## Specialty Focus
- Bourbon heritage preserved
- Cup of Excellence participation
- Direct trade relationships`,
    tags: ['El Salvador', 'Central America', 'Arabica', 'Bourbon'],
    order: 18,
  },
  {
    slug: 'ecuador-coffee',
    title: 'Ecuador',
    subtitle: 'Galápagos and Mainland Diversity',
    excerpt: 'From coastal lowlands to Galápagos islands, Ecuador offers unique terroir.',
    content: `# Ecuador: Geographic Diversity

Ecuador's varied geography—coast, highlands, and Galápagos—produces diverse coffee profiles, though production volumes remain small.

## Key Growing Regions

**Galápagos Islands**
- Altitude: 200-450 MASL
- Volcanic soil
- Profile: Unique, mild, low acidity
- Organic, isolated ecosystem

**Loja Province**
- Altitude: 1,100-2,000 MASL
- Southern highlands
- Profile: Balanced, fruity
- Best mainland quality

**Zamora-Chinchipe**
- Altitude: 900-1,500 MASL
- Amazon transition
- Profile: Complex, fruity

**Manabí**
- Altitude: 300-700 MASL
- Coastal region
- Profile: Mild, chocolatey

**El Oro**
- Altitude: 500-1,200 MASL
- Southern coast

## Common Bean Types
- **Typica**: Traditional
- **Bourbon**: Quality plantings
- **Caturra**: Popular
- **Catimor**: Resistant variety

## Flavor Profile
Ecuadorian coffees vary by region:
- Galápagos: Mild, unique, low acidity
- Highlands: Fruity, balanced, bright
- Coast: Mild, chocolate, nutty

## Specialty Potential
- Small production volumes
- Growing specialty focus
- Galápagos premium niche`,
    tags: ['Ecuador', 'South America', 'Arabica', 'Galápagos'],
    order: 19,
  },
  {
    slug: 'cameroon-coffee',
    title: 'Cameroon',
    subtitle: 'West-Central African Producer',
    excerpt: 'Both Robusta and Arabica production with focus on commercial grades.',
    content: `# Cameroon: Dual Production

Cameroon produces both Arabica (highlands) and Robusta (lowlands), serving commercial and regional markets.

## Key Growing Regions

**Western Highlands**
- Altitude: 1,000-2,000 MASL
- Arabica production
- Volcanic soil

**Northwest Region**
- Altitude: 1,200-1,800 MASL
- Specialty potential

**Littoral/South**
- Lower altitudes
- Robusta production

## Common Bean Types
- **Java**: Arabica selection
- **Robusta**: Lowland production
- **Catimor**: Disease-resistant

## Flavor Profile
**Cameroonian Arabica:**
- Medium body
- Earthy, herbal
- Low acidity

**Robusta:**
- Strong, bold
- Commercial use`,
    tags: ['Cameroon', 'Africa', 'Arabica', 'Robusta'],
    order: 20,
  },
  {
    slug: 'thailand-coffee',
    title: 'Thailand',
    subtitle: 'Royal Project Success',
    excerpt: 'Northern highlands produce quality Arabica through Royal development projects.',
    content: `# Thailand: Hill Tribe Heritage

Thailand's coffee industry developed through Royal Projects to replace opium poppy cultivation in northern hill tribe areas.

## Key Growing Regions

**Chiang Mai**
- Altitude: 800-1,400 MASL
- Doi Inthanon area
- Profile: Light, fruity, clean

**Chiang Rai**
- Altitude: 1,000-1,500 MASL
- Doi Mae Salong, Doi Tung
- Profile: Sweet, balanced

**Nan Province**
- Altitude: 800-1,200 MASL
- Growing production

## Common Bean Types
- **Catimor**: Most common
- **Caturra**: Quality focus
- **Geisha**: Premium experiments
- **Robusta**: Southern lowlands

## Flavor Profile
Thai Arabica offers:
- Light to medium body
- Mild acidity
- Fruity, floral notes
- Tea-like characteristics
- Clean finish

## Social Impact
Royal Projects transformed opium-growing regions into sustainable coffee communities.`,
    tags: ['Thailand', 'Asia', 'Arabica'],
    order: 21,
  },
  {
    slug: 'philippines-coffee',
    title: 'Philippines',
    subtitle: 'Historic Liberica Haven',
    excerpt: 'Unique Liberica (Barako) production alongside Arabica and Robusta.',
    content: `# Philippines: Liberica Legacy

The Philippines is one of few countries producing all four coffee species commercially, including the rare Liberica variety locally called Barako.

## Key Growing Regions

**Batangas**
- Lowland Liberica (Barako)
- Historic production area
- Profile: Bold, woody, smoky

**Benguet (Cordillera)**
- Altitude: 1,200-1,600 MASL
- Arabica highlands
- Profile: Fruity, balanced

**Bukidnon (Mindanao)**
- Altitude: 700-1,200 MASL
- Growing Arabica sector
- Profile: Sweet, mild

**Cavite**
- Traditional Liberica region
- Lowland production

**Sultan Kudarat**
- Arabica development
- Quality focus

## Common Bean Types
- **Liberica (Barako)**: Unique to Philippines
- **Robusta**: Commercial production
- **Arabica**: Growing specialty
- **Excelsa**: Limited production

## Flavor Profile
**Philippine Barako (Liberica):**
- Bold, strong flavor
- Woody, smoky notes
- Full body
- Distinctive aroma

**Philippine Arabica:**
- Fruity, mild
- Medium body
- Growing quality`,
    tags: ['Philippines', 'Asia', 'Liberica', 'Arabica', 'Robusta'],
    order: 22,
  },
  {
    slug: 'democratic-republic-congo-coffee',
    title: 'Democratic Republic of Congo',
    subtitle: 'Untapped Potential',
    excerpt: 'Historic producer working to rebuild quality coffee sector.',
    content: `# DRC: Rebuilding Heritage

The Democratic Republic of Congo has significant coffee potential, with historic Arabica regions working to rebuild after decades of conflict.

## Key Growing Regions

**North Kivu**
- Altitude: 1,400-2,000 MASL
- Lake Kivu shores
- Profile: Bright, fruity
- Quality potential

**South Kivu**
- Altitude: 1,200-2,000 MASL
- Historic production
- Profile: Complex, winey

**Ituri Province**
- Altitude: 1,000-1,800 MASL
- Developing sector

## Common Bean Types
- **Bourbon**: Heritage plantings
- **Blue Mountain**: Some presence
- **Robusta**: Lowland areas

## Flavor Profile
Congolese Arabica offers:
- Bright acidity
- Fruity, berry notes
- Medium body
- Complex potential

## Challenges & Hope
- Infrastructure rebuilding
- Direct trade initiatives
- Women's cooperatives
- Quality improvement programs`,
    tags: ['DRC', 'Congo', 'Africa', 'Arabica'],
    order: 23,
  },
  {
    slug: 'rwanda-coffee',
    title: 'Rwanda',
    subtitle: 'Thousand Hills Excellence',
    excerpt: 'Post-conflict success story producing exceptional, fruity Bourbon coffees.',
    content: `# Rwanda: Rising Star

Rwanda has emerged as a specialty coffee leader, with exceptional Bourbon-based coffees grown across its thousand hills.

## Key Growing Regions

**Western Province**
- Lake Kivu shores
- Altitude: 1,700-2,000 MASL
- Profile: Fruity, floral, complex
- Top specialty region

**Southern Province**
- Altitude: 1,600-1,900 MASL
- Profile: Sweet, balanced
- Huye Mountain famous

**Northern Province**
- Altitude: 1,700-2,200 MASL
- Volcanic soil
- Profile: Bright, citrus

**Eastern Province**
- Altitude: 1,300-1,700 MASL
- Growing production

## Common Bean Types
- **Red Bourbon**: Predominant, exceptional
- **Jackson**: Bourbon selection
- **BM139**: Resistant variety

## Flavor Profile
Rwandan coffees are known for:
- Bright, sparkling acidity
- Silky body
- Red fruit, berry notes
- Floral aromatics
- Orange, citrus
- Clean, sweet finish

## Success Story
Rwanda rebuilt its coffee sector post-1994, focusing on quality and direct trade, becoming a specialty coffee success.`,
    tags: ['Rwanda', 'Africa', 'Arabica', 'Bourbon'],
    order: 24,
  },
  {
    slug: 'burundi-coffee',
    title: 'Burundi',
    subtitle: 'Hidden African Gem',
    excerpt: 'Landlocked nation producing exceptional coffees rivaling Rwandan quality.',
    content: `# Burundi: Undiscovered Excellence

Burundi produces exceptional Bourbon-based coffees similar to neighboring Rwanda, though less widely known in specialty markets.

## Key Growing Regions

**Kayanza Province**
- Altitude: 1,700-2,000 MASL
- Top quality region
- Profile: Complex, fruity, bright

**Ngozi Province**
- Altitude: 1,600-1,900 MASL
- Profile: Sweet, balanced

**Muyinga Province**
- Altitude: 1,400-1,800 MASL
- Eastern production

**Kirundo Province**
- Altitude: 1,400-1,700 MASL
- Northern region

## Common Bean Types
- **Red Bourbon**: Primary variety
- **Jackson**: Bourbon selection
- **Mibirizi**: Local selection

## Flavor Profile
Burundian coffees offer:
- Bright, juicy acidity
- Silky body
- Red berry, citrus
- Floral notes
- Sweet finish
- Complex layers

## Growing Recognition
- Cup of Excellence participation
- Direct trade development
- Quality washing stations`,
    tags: ['Burundi', 'Africa', 'Arabica', 'Bourbon'],
    order: 25,
  },
  {
    slug: 'madagascar-coffee',
    title: 'Madagascar',
    subtitle: 'Island Robusta',
    excerpt: 'Indian Ocean island producing Robusta for regional and vanilla-paired markets.',
    content: `# Madagascar: Island Production

Madagascar produces primarily Robusta, often associated with its famous vanilla production and regional markets.

## Key Growing Regions

**SAVA Region**
- Northeastern coast
- Combined with vanilla farming
- Robusta focus

**Analanjirofo**
- Eastern coast
- Robusta production

**Highlands**
- Limited Arabica attempts
- Higher altitude areas

## Common Bean Types
- **Robusta**: Primary production
- **Kouilou**: Wild Robusta variety
- Limited Arabica

## Flavor Profile
Malagasy coffee:
- Bold, strong
- Earthy notes
- Often paired with vanilla
- Full body`,
    tags: ['Madagascar', 'Africa', 'Robusta'],
    order: 26,
  },
  {
    slug: 'dominican-republic-coffee',
    title: 'Dominican Republic',
    subtitle: 'Caribbean Tradition',
    excerpt: 'Mountain-grown Arabica with chocolatey sweetness and mild profiles.',
    content: `# Dominican Republic: Caribbean Quality

The Dominican Republic produces shade-grown Arabica in its mountain ranges, known for sweet, mild profiles.

## Key Growing Regions

**Barahona**
- Altitude: 600-1,300 MASL
- Southern mountains
- Profile: Full body, chocolate
- Most famous region

**Cibao (Cibao Altura)**
- Altitude: 400-1,200 MASL
- Central-north
- Profile: Mild, balanced

**Valdesia**
- Altitude: 600-1,200 MASL
- Profile: Sweet, mild

**Neyba**
- Altitude: 600-1,400 MASL
- Sierra de Neyba
- Profile: Balanced

## Common Bean Types
- **Typica**: Traditional
- **Caturra**: Popular
- **Catuai**: Some presence

## Flavor Profile
Dominican coffees offer:
- Low to medium acidity
- Full body
- Chocolate notes
- Sweet, mild
- Smooth finish

## Growing Practices
- Shade-grown tradition
- Small family farms
- Organic potential`,
    tags: ['Dominican Republic', 'Caribbean', 'Arabica'],
    order: 27,
  },
  {
    slug: 'haiti-coffee',
    title: 'Haiti',
    subtitle: 'Blue Mountain Heritage',
    excerpt: 'Historic producer with Typica heritage working to rebuild specialty sector.',
    content: `# Haiti: Historic Potential

Haiti was once a major coffee producer with heritage Typica (Blue Mountain) varieties, now working to rebuild its specialty sector.

## Key Growing Regions

**Northern Mountains**
- Altitude: 800-1,400 MASL
- Traditional production

**Baptiste (North)**
- Altitude: 1,000-1,500 MASL
- Quality focus
- Profile: Sweet, fruity

**Thiotte (Southeast)**
- Altitude: 800-1,300 MASL
- Growing specialty

## Common Bean Types
- **Typica**: Heritage variety
- **Blue Mountain**: Related genetics

## Flavor Profile
Haitian coffees can offer:
- Mild acidity
- Sweet, smooth
- Chocolate notes
- Fruit undertones

## Challenges & Hope
- Infrastructure limitations
- Climate vulnerability
- Direct trade initiatives
- Quality improvement programs`,
    tags: ['Haiti', 'Caribbean', 'Arabica', 'Typica'],
    order: 28,
  },
  {
    slug: 'bolivia-coffee',
    title: 'Bolivia',
    subtitle: 'High-Altitude Hidden Gem',
    excerpt: 'Extremely high-altitude coffees from remote Yungas valleys.',
    content: `# Bolivia: Yungas Heights

Bolivia produces coffee at extreme altitudes in the remote Yungas valleys, creating unique, complex profiles.

## Key Growing Regions

**Yungas (La Paz)**
- Altitude: 1,000-2,300 MASL
- Cloud forest valleys
- Profile: Complex, fruity, bright
- Caranavi, Coroico famous

**Santa Cruz**
- Altitude: 1,000-1,600 MASL
- Smaller production

## Common Bean Types
- **Typica**: Most common
- **Caturra**: Some presence
- **Catuai**: Limited
- **Java**: Heirloom plantings

## Flavor Profile
Bolivian coffees offer:
- Bright, complex acidity
- Light to medium body
- Fruity, floral notes
- Sweet, clean
- Unique terroir expression

## Challenges
- Remote access
- Limited infrastructure
- Small production volumes
- High quality potential`,
    tags: ['Bolivia', 'South America', 'Arabica'],
    order: 29,
  },
  {
    slug: 'venezuela-coffee',
    title: 'Venezuela',
    subtitle: 'Historic Producer in Recovery',
    excerpt: 'Once major producer working to revive quality coffee sector.',
    content: `# Venezuela: Rebuilding Heritage

Venezuela has historic coffee heritage but production has declined significantly; efforts continue to revive the sector.

## Key Growing Regions

**Táchira**
- Altitude: 800-1,600 MASL
- Western Andes
- Traditional production

**Mérida**
- Altitude: 1,000-1,800 MASL
- Andean highlands
- Profile: Balanced, mild

**Lara**
- Altitude: 600-1,200 MASL
- Central-western

**Portuguesa**
- Lower altitude production

## Common Bean Types
- **Typica**: Heritage
- **Bourbon**: Some presence
- **Caturra**: Popular

## Flavor Profile
Venezuelan coffees traditionally offer:
- Mild acidity
- Medium body
- Sweet, balanced
- Nutty, chocolate notes

## Current Status
- Reduced production
- Economic challenges
- Quality revival efforts`,
    tags: ['Venezuela', 'South America', 'Arabica'],
    order: 30,
  },
  {
    slug: 'cuba-coffee',
    title: 'Cuba',
    subtitle: 'Caribbean Classic',
    excerpt: 'Mountain-grown Arabica famous for traditional Cuban espresso culture.',
    content: `# Cuba: Espresso Tradition

Cuba produces Arabica in its Sierra Maestra mountains, famous for its strong espresso culture and traditional brewing.

## Key Growing Regions

**Sierra Maestra**
- Altitude: 800-1,500 MASL
- Eastern mountains
- Primary production
- Profile: Full body, low acidity

**Escambray Mountains**
- Altitude: 600-1,000 MASL
- Central Cuba

**Sierra del Rosario**
- Altitude: 400-800 MASL
- Western region

## Common Bean Types
- **Typica**: Traditional
- **Caturra**: Some presence
- **Catuai**: Limited

## Flavor Profile
Cuban coffee offers:
- Low acidity
- Full body
- Strong, bold flavor
- Sweet, smoky notes
- Traditional dark roast

## Cuban Coffee Culture
- Café Cubano: Strong espresso with sugar
- Cortadito: With steamed milk
- Colada: Shared espresso`,
    tags: ['Cuba', 'Caribbean', 'Arabica'],
    order: 31,
  },
  {
    slug: 'jamaica-coffee',
    title: 'Jamaica',
    subtitle: 'Blue Mountain Legend',
    excerpt: 'Producer of the legendary, expensive Jamaica Blue Mountain coffee.',
    content: `# Jamaica: Blue Mountain Fame

Jamaica produces the world-famous Blue Mountain coffee, one of the most expensive and sought-after coffees globally.

## Key Growing Region

**Blue Mountains**
- Altitude: 910-1,700 MASL
- Protected designation
- Strict quality control
- Profile: Mild, balanced, sweet

**High Mountain**
- Altitude: 460-910 MASL
- Second tier designation

**Jamaica Low Mountain/Supreme**
- Below 460 MASL
- Lower grade

## Common Bean Types
- **Jamaica Blue Mountain Typica**: Heritage variety
- Strict genetic control

## Flavor Profile
Jamaica Blue Mountain offers:
- Mild, balanced acidity
- Smooth, clean body
- Sweet, no bitterness
- Floral, nutty notes
- Exceptionally balanced

## Quality Control
- Coffee Industry Board certification
- Strict altitude requirements
- Barrel packaging tradition
- Premium pricing`,
    tags: ['Jamaica', 'Caribbean', 'Arabica', 'Blue Mountain'],
    order: 32,
  },
  {
    slug: 'yemen-coffee',
    title: 'Yemen',
    subtitle: 'Ancient Coffee Birthplace',
    excerpt: 'Where coffee trade began, producing rare, wine-like Mocha coffees.',
    content: `# Yemen: Coffee History

Yemen is where the global coffee trade began, still producing rare, distinctive coffees using ancient methods.

## Key Growing Regions

**Haraz Mountains**
- Altitude: 1,500-2,500 MASL
- Traditional terracing
- Profile: Complex, fruity, wine-like

**Bani Mattar**
- Altitude: 1,800-2,400 MASL
- Western highlands
- Profile: Wild, intense

**Bani Ismail**
- Altitude: 1,600-2,200 MASL
- Profile: Fruity, chocolate

**Yafe'i**
- Altitude: 1,500-2,000 MASL
- Southern region
- Profile: Wine-like, berry

## Common Bean Types
- **Yemeni Heirloom**: Ancient varieties
- Various named landraces
- Genetic diversity preserved

## Flavor Profile
Yemeni coffees are legendary for:
- Wild, wine-like acidity
- Complex fruit (dried fruit, wine)
- Earthy, spicy notes
- Chocolate undertones
- Unique, distinctive character

## Traditional Methods
- Ancient terrace farming
- Natural (dry) processing
- Sun-dried on rooftops
- Hand-sorted`,
    tags: ['Yemen', 'Middle East', 'Arabica', 'Mocha'],
    order: 33,
  },
  {
    slug: 'panama-coffee',
    title: 'Panama',
    subtitle: 'Geisha Revolution',
    excerpt: 'Home of the famous Geisha variety commanding record-breaking auction prices.',
    content: `# Panama: Geisha Glory

Panama transformed specialty coffee with Hacienda La Esmeralda's Geisha, which has set auction price records and redefined premium coffee.

## Key Growing Regions

**Boquete**
- Altitude: 1,200-1,900 MASL
- Volcán Barú slopes
- Profile: Exceptional, complex
- Geisha heartland

**Volcán**
- Altitude: 1,300-1,800 MASL
- Western Chiriquí
- Profile: Bright, clean

**Renacimiento**
- Altitude: 1,200-1,700 MASL
- Growing specialty

**Santa Clara**
- Altitude: 1,100-1,500 MASL
- Quality production

## Common Bean Types
- **Geisha/Gesha**: Record-breaking variety
- **Caturra**: Traditional
- **Catuai**: Common
- **Typica**: Heritage
- **Pacamara**: Some presence

## Flavor Profile
**Panama Geisha:**
- Explosive florals (jasmine)
- Tea-like body
- Bergamot, tropical fruit
- Exceptional complexity
- Record auction prices

**Other Panama coffees:**
- Bright acidity
- Clean, sweet
- Balanced, approachable`,
    tags: ['Panama', 'Central America', 'Arabica', 'Geisha'],
    order: 34,
  },
  {
    slug: 'myanmar-coffee',
    title: 'Myanmar',
    subtitle: 'Emerging Asian Origin',
    excerpt: 'Developing specialty sector with unique terroir potential.',
    content: `# Myanmar: New Frontier

Myanmar is an emerging specialty coffee origin, with development programs helping establish quality-focused production.

## Key Growing Regions

**Shan State**
- Altitude: 1,000-1,600 MASL
- Primary production
- Profile: Fruity, floral
- Pyin Oo Lwin area

**Mandalay Region**
- Altitude: 800-1,400 MASL
- Developing sector

**Chin State**
- Altitude: 1,200-1,800 MASL
- Remote, high potential

## Common Bean Types
- **Catimor**: Common
- **SL34**: Some presence
- **Catuai**: Introduced

## Flavor Profile
Myanmar coffees can offer:
- Bright acidity
- Floral, fruity notes
- Tea-like characteristics
- Medium body
- Clean finish

## Development
- International aid projects
- Quality improvement programs
- Direct trade initiatives`,
    tags: ['Myanmar', 'Asia', 'Arabica'],
    order: 35,
  },
  {
    slug: 'laos-coffee',
    title: 'Laos',
    subtitle: 'Bolaven Plateau Treasure',
    excerpt: 'Rich volcanic soils of the Bolaven Plateau produce distinctive coffees.',
    content: `# Laos: Bolaven Excellence

Laos produces coffee primarily on the volcanic Bolaven Plateau, with both Arabica and Robusta cultivation.

## Key Growing Regions

**Bolaven Plateau**
- Altitude: 1,000-1,350 MASL
- Volcanic soil
- Primary production
- Profile: Full body, low acidity

**Champasak Province**
- Part of Bolaven
- Largest producer

**Sekong Province**
- Eastern Bolaven
- Growing production

## Common Bean Types
- **Typica**: Traditional
- **Catimor**: Disease-resistant
- **Robusta**: Significant production
- **Arabica**: Growing focus

## Flavor Profile
Laotian Arabica offers:
- Low acidity
- Full body
- Chocolate, earthy notes
- Sweet finish
- Smooth character`,
    tags: ['Laos', 'Asia', 'Arabica', 'Robusta'],
    order: 36,
  },
  {
    slug: 'nepal-coffee',
    title: 'Nepal',
    subtitle: 'Himalayan Heights',
    excerpt: 'Organic coffee from the foothills of the Himalayas.',
    content: `# Nepal: Himalayan Coffee

Nepal produces small quantities of high-altitude, often organic coffee in the foothills of the Himalayas.

## Key Growing Regions

**Gulmi District**
- Altitude: 800-1,500 MASL
- Western hills
- Primary production

**Palpa District**
- Altitude: 900-1,400 MASL
- Quality focus

**Kaski (Pokhara)**
- Altitude: 700-1,400 MASL
- Growing production

**Syangja District**
- Altitude: 800-1,300 MASL
- Developing sector

## Common Bean Types
- **Typica**: Most common
- **Bourbon**: Some presence
- **Caturra**: Limited

## Flavor Profile
Nepali coffee offers:
- Mild acidity
- Medium body
- Sweet, clean
- Fruity notes
- Organic character

## Industry Characteristics
- Smallholder farmers
- Often organic by default
- Growing specialty interest`,
    tags: ['Nepal', 'Asia', 'Arabica', 'Organic'],
    order: 37,
  },
  {
    slug: 'china-coffee',
    title: 'China',
    subtitle: 'Yunnan\'s Growing Industry',
    excerpt: 'Rapidly developing production in Yunnan province with improving quality.',
    content: `# China: Yunnan Rising

China's Yunnan province has developed into a significant coffee producer, supplying domestic demand and improving quality.

## Key Growing Regions

**Yunnan Province**
- Altitude: 900-1,500 MASL
- 98% of Chinese production
- Pu'er, Baoshan main areas
- Profile: Improving quality

**Pu'er Prefecture**
- Altitude: 1,000-1,400 MASL
- Largest production
- Profile: Mild, balanced

**Baoshan**
- Altitude: 1,000-1,500 MASL
- Growing specialty

**Dehong**
- Altitude: 800-1,300 MASL
- Western Yunnan

## Common Bean Types
- **Catimor**: Most common
- **Caturra**: Quality focus
- **Typica**: Limited
- **Geisha**: Experiments

## Flavor Profile
Yunnan coffees offer:
- Mild to medium acidity
- Light to medium body
- Nutty, chocolate notes
- Improving complexity

## Industry Growth
- Domestic demand driving production
- Quality improvement programs
- Specialty sector developing`,
    tags: ['China', 'Asia', 'Arabica', 'Yunnan'],
    order: 38,
  },
  {
    slug: 'zimbabwe-coffee',
    title: 'Zimbabwe',
    subtitle: 'Southern African Surprise',
    excerpt: 'Small but quality-focused production from Eastern Highlands.',
    content: `# Zimbabwe: Eastern Highlands

Zimbabwe produces small quantities of quality Arabica in its Eastern Highlands, with potential for specialty focus.

## Key Growing Regions

**Eastern Highlands (Chipinge)**
- Altitude: 900-1,700 MASL
- Chimanimani area
- Profile: Bright, fruity
- Small estate production

**Honde Valley**
- Altitude: 700-1,400 MASL
- Growing area

## Common Bean Types
- **SL28**: Kenyan origin
- **Catimor**: Some presence
- **Bourbon**: Limited

## Flavor Profile
Zimbabwean coffees can offer:
- Bright acidity
- Medium body
- Fruity, citrus notes
- Clean finish

## Current Status
- Small production volumes
- Estate-focused
- Quality potential`,
    tags: ['Zimbabwe', 'Africa', 'Arabica'],
    order: 39,
  },
  {
    slug: 'malawi-coffee',
    title: 'Malawi',
    subtitle: 'African Quality Potential',
    excerpt: 'Small production with Geisha plantings and quality focus.',
    content: `# Malawi: Growing Quality

Malawi produces small volumes of Arabica, with recent plantings of Geisha variety and growing specialty interest.

## Key Growing Regions

**Northern Region**
- Altitude: 1,000-1,500 MASL
- Misuku Hills, Chitipa
- Profile: Fruity, bright

**Thyolo/Mulanje (Southern)**
- Altitude: 800-1,200 MASL
- Estate production
- Historic production

## Common Bean Types
- **Geisha**: New plantings
- **Catimor**: Common
- **Agaro**: Ethiopian selection

## Flavor Profile
Malawian coffees offer:
- Bright acidity
- Fruity notes
- Medium body
- Growing complexity

## Development
- Specialty focus increasing
- Geisha experiments
- Direct trade interest`,
    tags: ['Malawi', 'Africa', 'Arabica', 'Geisha'],
    order: 40,
  },
  {
    slug: 'zambia-coffee',
    title: 'Zambia',
    subtitle: 'Emerging East African Quality',
    excerpt: 'Small but growing specialty sector with excellent potential.',
    content: `# Zambia: Specialty Potential

Zambia produces small quantities of Arabica with growing specialty recognition and excellent terroir potential.

## Key Growing Regions

**Northern Province**
- Altitude: 1,200-1,800 MASL
- Kasama, Isoka areas
- Profile: Fruity, complex

**Muchinga Province**
- Altitude: 1,000-1,500 MASL
- Growing production

## Common Bean Types
- **Catimor**: Common
- **SL28/34**: Quality focus
- **Bourbon**: Some presence

## Flavor Profile
Zambian coffees offer:
- Bright, complex acidity
- Medium body
- Berry, citrus notes
- Floral aromatics

## Growth
- Small but growing
- Specialty focus
- Direct trade relationships`,
    tags: ['Zambia', 'Africa', 'Arabica'],
    order: 41,
  },
  {
    slug: 'angola-coffee',
    title: 'Angola',
    subtitle: 'Rebuilding Historic Industry',
    excerpt: 'Former major producer working to revive Robusta and Arabica sectors.',
    content: `# Angola: Revival Efforts

Angola was once Africa's fourth-largest producer before civil war; efforts continue to rebuild the coffee sector.

## Key Growing Regions

**Kwanza Sul Province**
- Altitude: 1,000-1,400 MASL
- Traditional Arabica
- Amboim plateau

**Uíge Province**
- Robusta focus
- Northern region

**Benguela**
- Arabica attempts
- Coastal highlands

## Common Bean Types
- **Robusta**: Historic focus
- **Ambriz**: Local Robusta variety
- **Arabica**: Rebuilding

## Current Status
- Production rebuilding
- Infrastructure development
- Quality potential
- Historic heritage`,
    tags: ['Angola', 'Africa', 'Robusta', 'Arabica'],
    order: 42,
  },
  {
    slug: 'central-african-republic-coffee',
    title: 'Central African Republic',
    subtitle: 'Challenging Conditions',
    excerpt: 'Robusta production despite ongoing infrastructure challenges.',
    content: `# Central African Republic: Persistence

CAR produces Robusta despite significant infrastructure and security challenges.

## Key Growing Regions

**Western Regions**
- Robusta focus
- Challenging logistics

## Common Bean Types
- **Robusta**: Primary production

## Current Status
- Limited production
- Infrastructure challenges
- Development needs`,
    tags: ['Central African Republic', 'Africa', 'Robusta'],
    order: 43,
  },
  {
    slug: 'togo-coffee',
    title: 'Togo',
    subtitle: 'West African Robusta',
    excerpt: 'Small Robusta producer in West Africa.',
    content: `# Togo: West African Production

Togo produces Robusta for regional and commercial markets.

## Key Growing Regions

**Plateaux Region**
- Altitude: 200-600 MASL
- Primary production

**Kara Region**
- Northern production
- Smaller volumes

## Common Bean Types
- **Robusta**: Primary

## Flavor Profile
Togolese Robusta:
- Bold, strong
- Commercial grade focus`,
    tags: ['Togo', 'Africa', 'Robusta'],
    order: 44,
  },
  {
    slug: 'guinea-coffee',
    title: 'Guinea',
    subtitle: 'Fouta Djallon Highlands',
    excerpt: 'Highland Arabica potential in the Fouta Djallon region.',
    content: `# Guinea: Highland Potential

Guinea has Arabica potential in the Fouta Djallon highlands, with mostly Robusta commercial production.

## Key Growing Regions

**Fouta Djallon**
- Altitude: 900-1,500 MASL
- Arabica potential
- Highland plateau

**Forest Region**
- Lower altitude
- Robusta focus

## Common Bean Types
- **Robusta**: Primary commercial
- **Arabica**: Highland potential

## Status
- Developing sector
- Infrastructure needs
- Quality potential in highlands`,
    tags: ['Guinea', 'Africa', 'Arabica', 'Robusta'],
    order: 45,
  },
  {
    slug: 'sierra-leone-coffee',
    title: 'Sierra Leone',
    subtitle: 'West African Rebuilding',
    excerpt: 'Rebuilding coffee sector after civil conflict.',
    content: `# Sierra Leone: Reconstruction

Sierra Leone is working to rebuild its coffee sector, primarily Robusta for commercial markets.

## Key Growing Regions

**Eastern Province**
- Robusta production
- Rebuilding efforts

**Northern Province**
- Developing sector

## Common Bean Types
- **Robusta**: Primary

## Current Status
- Post-conflict rebuilding
- Development programs
- Commercial focus`,
    tags: ['Sierra Leone', 'Africa', 'Robusta'],
    order: 46,
  },
  {
    slug: 'nigeria-coffee',
    title: 'Nigeria',
    subtitle: 'Domestic Focus',
    excerpt: 'Robusta production primarily for domestic consumption.',
    content: `# Nigeria: Domestic Market

Nigeria produces Robusta primarily for its large domestic market.

## Key Growing Regions

**Taraba State**
- Highland production
- Mambilla Plateau

**Cross River State**
- Robusta focus

**Plateau State**
- Jos Plateau production

## Common Bean Types
- **Robusta**: Primary
- Limited Arabica on Mambilla

## Characteristics
- Domestic consumption focus
- Large internal market
- Quality improvement potential`,
    tags: ['Nigeria', 'Africa', 'Robusta'],
    order: 47,
  },
  {
    slug: 'sri-lanka-coffee',
    title: 'Sri Lanka',
    subtitle: 'Former Coffee Island',
    excerpt: 'Historic producer before tea dominance, small specialty revival.',
    content: `# Sri Lanka: Coffee Revival

Sri Lanka was a major coffee producer before leaf rust led to tea's dominance; small specialty revival underway.

## Key Growing Regions

**Central Highlands**
- Altitude: 1,000-1,500 MASL
- Limited production
- Quality focus

## Common Bean Types
- **Arabica**: Specialty focus
- **Robusta**: Small production

## History
- Major producer pre-1870s
- Coffee rust devastation
- Converted to tea
- Small revival emerging

## Current Status
- Very small production
- Specialty niche
- Historic revival interest`,
    tags: ['Sri Lanka', 'Asia', 'Arabica', 'Historic'],
    order: 48,
  },
  {
    slug: 'usa-hawaii-coffee',
    title: 'Hawaii (USA)',
    subtitle: 'American Premium',
    excerpt: 'Only US state producing coffee commercially, famous for Kona.',
    content: `# Hawaii: American Coffee

Hawaii is the only US state producing commercial coffee, famous for Kona but with production across multiple islands.

## Key Growing Regions

**Kona (Big Island)**
- Altitude: 150-750 MASL
- Volcanic slopes of Hualalai/Mauna Loa
- Profile: Mild, smooth, sweet
- Protected designation

**Ka'u (Big Island)**
- Altitude: 350-650 MASL
- Southern Big Island
- Profile: Sweet, fruity
- Growing reputation

**Maui**
- Altitude: 300-600 MASL
- Multiple farms
- Profile: Various

**Kauai**
- Altitude: 300-500 MASL
- Large estate (Kauai Coffee)

**Molokai**
- Altitude: 300-500 MASL
- Smaller production

**Oahu**
- Altitude: 200-400 MASL
- Waialua region

## Common Bean Types
- **Guatemalan Typica (Kona Typica)**: Traditional
- **Yellow Catuai**: Common
- **Red Catuai**: Some farms
- **Geisha**: Premium experiments

## Flavor Profile
Hawaiian coffees offer:
- Low acidity
- Smooth, clean body
- Sweet, mild
- Nutty, buttery notes (Kona)
- Premium pricing`,
    tags: ['USA', 'Hawaii', 'Arabica', 'Kona'],
    order: 49,
  },
  {
    slug: 'australia-coffee',
    title: 'Australia',
    subtitle: 'Southern Hemisphere Specialty',
    excerpt: 'Small but innovative production in Queensland and New South Wales.',
    content: `# Australia: Innovation Down Under

Australia produces small quantities of specialty Arabica, known for innovation and mechanization.

## Key Growing Regions

**Northern New South Wales**
- Altitude: 100-600 MASL
- Byron Bay region
- Profile: Mild, sweet

**North Queensland**
- Atherton Tablelands
- Altitude: 500-1,100 MASL
- Profile: Clean, mild

**Southeast Queensland**
- Sunshine Coast Hinterland
- Small estate production

## Common Bean Types
- **K7**: Common variety
- **Catuai**: Popular
- **SL34**: Some farms
- **Geisha**: Premium

## Flavor Profile
Australian coffees offer:
- Mild acidity
- Clean, sweet profile
- Chocolate notes
- Light body
- Unique terroir

## Innovation
- Mechanical harvesting leaders
- Sustainable practices
- Specialty focus
- High labor costs drive innovation`,
    tags: ['Australia', 'Pacific', 'Arabica'],
    order: 50,
  },
];

async function main() {
  console.log('Seeding coffee locations...');

  for (const country of coffeeCountries) {
    await prisma.educationalContent.upsert({
      where: { slug: country.slug },
      update: {
        title: country.title,
        subtitle: country.subtitle,
        content: country.content,
        excerpt: country.excerpt,
        category: 'LOCATIONS',
        tags: country.tags,
        published: true,
        publishedAt: new Date(),
        order: country.order,
      },
      create: {
        slug: country.slug,
        title: country.title,
        subtitle: country.subtitle,
        content: country.content,
        excerpt: country.excerpt,
        category: 'LOCATIONS',
        tags: country.tags,
        published: true,
        publishedAt: new Date(),
        order: country.order,
      },
    });
    console.log(`  Added: ${country.title}`);
  }

  console.log(`\nSuccessfully seeded ${coffeeCountries.length} coffee producing countries!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
