import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Comprehensive coffee data from major growing regions
const coffees = [
  // ==================== ETHIOPIA ====================
  {
    name: 'Yirgacheffe Kochere',
    description: 'From the birthplace of coffee, Yirgacheffe Kochere produces some of the most complex and aromatic coffees in the world. Grown at extreme elevations in the Gedeo Zone, these beans exhibit the classic Ethiopian heirloom characteristics with exceptional clarity and floral complexity.',
    origin: 'Ethiopia',
    region: 'Yirgacheffe, Gedeo Zone',
    farm: 'Kochere Washing Station',
    altitude: '1,850-2,200 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'Ethiopian Heirloom',
    brewParams: {
      espresso: { dose: 18, yield: 40, ratio: '1:2.2', temperature: 94, pullTime: { min: 28, max: 32 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 96, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Jasmine', 'Bergamot', 'Lemon Zest', 'Peach', 'Tea-like'],
    acidity: 9,
    body: 5,
    sweetness: 8,
  },
  {
    name: 'Sidamo Bensa',
    description: 'The Sidamo region is known for producing exceptionally balanced coffees with wine-like qualities. Bensa district coffees are grown on small family plots, hand-picked at peak ripeness, and processed using traditional methods passed down through generations.',
    origin: 'Ethiopia',
    region: 'Sidamo, Bensa District',
    farm: 'Various Smallholders',
    altitude: '1,900-2,100 MASL',
    process: 'NATURAL',
    roastLevel: 'LIGHT',
    variety: 'Ethiopian Heirloom',
    brewParams: {
      espresso: { dose: 18, yield: 38, ratio: '1:2.1', temperature: 93, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 260, ratio: '1:16.25', temperature: 95, totalTime: { min: 195, max: 225 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 48 }
    },
    tastingNotes: ['Blueberry', 'Strawberry', 'Dark Chocolate', 'Wine', 'Honey'],
    acidity: 8,
    body: 6,
    sweetness: 9,
  },
  {
    name: 'Guji Hambela',
    description: 'Guji has emerged as one of Ethiopia\'s most exciting coffee regions. The Hambela area produces coffees with extraordinary fruit-forward profiles and syrupy body. The unique microclimate and volcanic soil create ideal growing conditions for specialty coffee.',
    origin: 'Ethiopia',
    region: 'Guji, Hambela Wamena',
    farm: 'Hambela Washing Station',
    altitude: '2,000-2,300 MASL',
    process: 'NATURAL',
    roastLevel: 'MEDIUM_LIGHT',
    variety: 'Ethiopian Heirloom (74110, 74112)',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 25, max: 29 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 240, ratio: '1:16', temperature: 94, totalTime: { min: 180, max: 210 }, grindSize: 'Medium-Fine', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Tropical Fruit', 'Mango', 'Papaya', 'Floral', 'Brown Sugar'],
    acidity: 8,
    body: 7,
    sweetness: 9,
  },
  {
    name: 'Harrar Longberry',
    description: 'One of the oldest and most storied coffee origins in the world. Harrar coffees are dry-processed in the eastern highlands of Ethiopia, producing bold, wine-like flavors with distinctive wild berry notes. The elongated beans are hand-sorted for quality.',
    origin: 'Ethiopia',
    region: 'Harrar, Eastern Highlands',
    farm: 'Traditional Smallholders',
    altitude: '1,500-2,100 MASL',
    process: 'NATURAL',
    roastLevel: 'MEDIUM',
    variety: 'Harrar Longberry',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 92, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 256, ratio: '1:16', temperature: 93, totalTime: { min: 200, max: 230 }, grindSize: 'Medium', bloomTime: 35, bloomWater: 48 }
    },
    tastingNotes: ['Wild Blueberry', 'Dried Fruit', 'Mocha', 'Spice', 'Wine'],
    acidity: 7,
    body: 8,
    sweetness: 7,
  },

  // ==================== COLOMBIA ====================
  {
    name: 'Huila Supremo',
    description: 'Huila is Colombia\'s premier coffee-growing department, producing nearly a quarter of the country\'s specialty coffee. The dramatic elevation changes, volcanic soil, and ideal climate create perfect conditions for growing exceptionally sweet and balanced coffees.',
    origin: 'Colombia',
    region: 'Huila, Pitalito',
    farm: 'Finca El Paraiso',
    altitude: '1,700-1,900 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Castillo, Caturra',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 27, max: 31 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Caramel', 'Red Apple', 'Citrus', 'Milk Chocolate', 'Nutty'],
    acidity: 7,
    body: 7,
    sweetness: 8,
  },
  {
    name: 'Nariño Aponte',
    description: 'Nariño produces some of Colombia\'s highest-grown coffees, with farms reaching up to 2,300 meters. The extreme altitude and equatorial location create a unique terroir that produces coffees with vibrant acidity and complex fruit notes.',
    origin: 'Colombia',
    region: 'Nariño, Aponte',
    farm: 'Asociación Aponte',
    altitude: '1,900-2,300 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'Typica, Caturra',
    brewParams: {
      espresso: { dose: 18, yield: 40, ratio: '1:2.2', temperature: 94, pullTime: { min: 28, max: 32 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 255, ratio: '1:17', temperature: 96, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Orange', 'Panela', 'Floral', 'Stone Fruit', 'Clean'],
    acidity: 9,
    body: 6,
    sweetness: 8,
  },
  {
    name: 'Tolima Planadas',
    description: 'The Tolima region has rapidly gained recognition for producing exceptional specialty coffee. Planadas municipality, nestled in the Andean mountains, benefits from ideal growing conditions and a strong community of dedicated coffee farmers.',
    origin: 'Colombia',
    region: 'Tolima, Planadas',
    farm: 'Various Smallholders',
    altitude: '1,600-1,900 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Colombia, Castillo',
    brewParams: {
      espresso: { dose: 18, yield: 38, ratio: '1:2.1', temperature: 93, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 260, ratio: '1:16.25', temperature: 94, totalTime: { min: 190, max: 220 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 48 }
    },
    tastingNotes: ['Chocolate', 'Plum', 'Toffee', 'Citrus', 'Balanced'],
    acidity: 7,
    body: 7,
    sweetness: 8,
  },
  {
    name: 'Cauca Inzá Pink Bourbon',
    description: 'Pink Bourbon is a rare and prized variety known for its exceptional cup quality. This lot from Inzá showcases the variety\'s signature sweetness and complexity, grown by indigenous Nasa communities who have cultivated coffee for generations.',
    origin: 'Colombia',
    region: 'Cauca, Inzá',
    farm: 'Indigenous Nasa Producers',
    altitude: '1,750-2,000 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'Pink Bourbon',
    brewParams: {
      espresso: { dose: 18, yield: 42, ratio: '1:2.3', temperature: 94, pullTime: { min: 28, max: 33 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 95, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Raspberry', 'Rose', 'Honey', 'Peach', 'Delicate'],
    acidity: 8,
    body: 6,
    sweetness: 9,
  },

  // ==================== KENYA ====================
  {
    name: 'Kenya AA Nyeri',
    description: 'Kenya AA represents the largest bean size grade from Kenya, and Nyeri produces some of the country\'s most sought-after lots. The rich volcanic soil of Mount Kenya\'s slopes and meticulous processing create coffees with Kenya\'s signature bright, complex acidity.',
    origin: 'Kenya',
    region: 'Nyeri, Central Province',
    farm: 'Othaya Farmers Cooperative',
    altitude: '1,700-1,900 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'SL28, SL34',
    brewParams: {
      espresso: { dose: 18, yield: 40, ratio: '1:2.2', temperature: 94, pullTime: { min: 28, max: 32 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 96, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Blackcurrant', 'Tomato', 'Grapefruit', 'Brown Sugar', 'Sparkling'],
    acidity: 10,
    body: 7,
    sweetness: 8,
  },
  {
    name: 'Kenya Kirinyaga Peaberry',
    description: 'Peaberry beans occur when only one seed develops inside the coffee cherry instead of the usual two. This Kirinyaga lot showcases the concentrated flavors typical of peaberries, with intensified brightness and complexity characteristic of Kenyan coffees.',
    origin: 'Kenya',
    region: 'Kirinyaga, Central Province',
    farm: 'Kamwangi Factory',
    altitude: '1,600-1,800 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'SL28, SL34, Ruiru 11',
    brewParams: {
      espresso: { dose: 17, yield: 38, ratio: '1:2.2', temperature: 94, pullTime: { min: 27, max: 31 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 14, waterAmount: 238, ratio: '1:17', temperature: 96, totalTime: { min: 175, max: 200 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 42 }
    },
    tastingNotes: ['Red Currant', 'Lime', 'Black Tea', 'Molasses', 'Intense'],
    acidity: 9,
    body: 6,
    sweetness: 7,
  },
  {
    name: 'Kenya Embu AB',
    description: 'Embu County on the eastern slopes of Mount Kenya produces distinctively balanced Kenyan coffees. The AB grade indicates medium-sized beans, which often deliver exceptional cup quality with the region\'s characteristic juicy acidity.',
    origin: 'Kenya',
    region: 'Embu, Eastern Province',
    farm: 'Gikundi Factory',
    altitude: '1,500-1,700 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM_LIGHT',
    variety: 'SL28, SL34',
    brewParams: {
      espresso: { dose: 18, yield: 38, ratio: '1:2.1', temperature: 93, pullTime: { min: 27, max: 31 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 255, ratio: '1:17', temperature: 95, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Plum', 'Orange Zest', 'Caramel', 'Winey', 'Balanced'],
    acidity: 8,
    body: 7,
    sweetness: 8,
  },

  // ==================== GUATEMALA ====================
  {
    name: 'Antigua Los Volcanes',
    description: 'Guatemala Antigua is one of the world\'s most prestigious coffee origins. Grown in the shadow of three volcanoes, these coffees benefit from rich volcanic soil, ideal altitude, and a unique microclimate that produces exceptionally complex and full-bodied cups.',
    origin: 'Guatemala',
    region: 'Antigua, Sacatepéquez',
    farm: 'Finca Los Volcanes',
    altitude: '1,500-1,700 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Bourbon, Caturra',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 256, ratio: '1:16', temperature: 94, totalTime: { min: 190, max: 220 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 48 }
    },
    tastingNotes: ['Chocolate', 'Spice', 'Orange', 'Smoky', 'Full Body'],
    acidity: 7,
    body: 8,
    sweetness: 7,
  },
  {
    name: 'Huehuetenango El Injerto',
    description: 'Huehuetenango is Guatemala\'s highest and most remote coffee-growing region. Finca El Injerto, a legendary estate that has won numerous Cup of Excellence awards, produces meticulously cultivated coffees known for their complexity and exceptional sweetness.',
    origin: 'Guatemala',
    region: 'Huehuetenango',
    farm: 'Finca El Injerto',
    altitude: '1,500-1,910 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'Bourbon, Pacamara',
    brewParams: {
      espresso: { dose: 18, yield: 40, ratio: '1:2.2', temperature: 94, pullTime: { min: 28, max: 32 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 95, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Toffee', 'Red Apple', 'Citrus', 'Floral', 'Complex'],
    acidity: 8,
    body: 7,
    sweetness: 9,
  },
  {
    name: 'Cobán Rainforest',
    description: 'The Cobán region is characterized by its unique cloudy, rainy climate known locally as "chipi chipi." This constant mist and high humidity create a distinctive terroir that produces coffees with refined acidity and unique flavor characteristics.',
    origin: 'Guatemala',
    region: 'Cobán, Alta Verapaz',
    farm: 'Finca Chirrepec',
    altitude: '1,350-1,500 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Bourbon, Maragogype',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 92, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 260, ratio: '1:16.25', temperature: 93, totalTime: { min: 195, max: 225 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 48 }
    },
    tastingNotes: ['Hazelnut', 'Plum', 'Wine', 'Spice', 'Delicate'],
    acidity: 6,
    body: 7,
    sweetness: 7,
  },

  // ==================== COSTA RICA ====================
  {
    name: 'Tarrazú La Minita',
    description: 'Tarrazú is Costa Rica\'s most famous coffee region, and La Minita is among its most prestigious estates. Known for rigorous quality control where beans are hand-sorted twice, these coffees exemplify the clean, bright profile that made Costa Rican coffee famous.',
    origin: 'Costa Rica',
    region: 'Tarrazú, San José',
    farm: 'Finca La Minita',
    altitude: '1,200-1,700 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Catuaí, Caturra',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 27, max: 31 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Honey', 'Citrus', 'Almond', 'Clean', 'Bright'],
    acidity: 8,
    body: 7,
    sweetness: 8,
  },
  {
    name: 'West Valley Black Honey',
    description: 'Costa Rica\'s West Valley (Valle Occidental) has become known for innovative processing. This Black Honey processed coffee retains most of the mucilage during drying, creating a cup with enhanced body and fruit sweetness while maintaining clarity.',
    origin: 'Costa Rica',
    region: 'West Valley, Naranjo',
    farm: 'Finca Don Oscar',
    altitude: '1,400-1,600 MASL',
    process: 'HONEY',
    roastLevel: 'MEDIUM_LIGHT',
    variety: 'Villa Sarchi',
    brewParams: {
      espresso: { dose: 18, yield: 38, ratio: '1:2.1', temperature: 93, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Brown Sugar', 'Peach', 'Vanilla', 'Mandarin', 'Syrupy'],
    acidity: 7,
    body: 8,
    sweetness: 9,
  },

  // ==================== PANAMA ====================
  {
    name: 'Boquete Geisha',
    description: 'Panama Geisha is widely considered one of the world\'s most exceptional coffees. Originally from Ethiopia, the Geisha variety found its ideal terroir in Panama\'s Boquete highlands. These coffees command premium prices for their extraordinary jasmine and bergamot aromatics.',
    origin: 'Panama',
    region: 'Boquete, Chiriquí',
    farm: 'Hacienda La Esmeralda',
    altitude: '1,600-1,800 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'Geisha',
    brewParams: {
      espresso: { dose: 17, yield: 42, ratio: '1:2.5', temperature: 94, pullTime: { min: 30, max: 35 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 14, waterAmount: 238, ratio: '1:17', temperature: 96, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 50, bloomWater: 42 }
    },
    tastingNotes: ['Jasmine', 'Bergamot', 'Tropical Fruit', 'Honey', 'Tea-like'],
    acidity: 9,
    body: 5,
    sweetness: 9,
  },
  {
    name: 'Volcán Natural Pacamara',
    description: 'The volcanic highlands around Volcán produce distinctive Panamanian coffees. This natural-processed Pacamara (a cross between Pacas and Maragogype) showcases intense fruit flavors with the variety\'s characteristic large bean size and complex cup profile.',
    origin: 'Panama',
    region: 'Volcán, Chiriquí',
    farm: 'Finca Hartmann',
    altitude: '1,400-1,700 MASL',
    process: 'NATURAL',
    roastLevel: 'MEDIUM_LIGHT',
    variety: 'Pacamara',
    brewParams: {
      espresso: { dose: 18, yield: 38, ratio: '1:2.1', temperature: 93, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 185, max: 215 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Fig', 'Red Wine', 'Chocolate', 'Stone Fruit', 'Complex'],
    acidity: 7,
    body: 8,
    sweetness: 8,
  },

  // ==================== BRAZIL ====================
  {
    name: 'Cerrado Mineiro',
    description: 'Brazil\'s Cerrado region produces consistent, high-quality coffees with classic Brazilian characteristics. The savanna climate with distinct wet and dry seasons creates ideal conditions for producing sweet, low-acid coffees perfect for espresso blends and single origins.',
    origin: 'Brazil',
    region: 'Cerrado Mineiro, Minas Gerais',
    farm: 'Fazenda Passeio',
    altitude: '1,000-1,200 MASL',
    process: 'NATURAL',
    roastLevel: 'MEDIUM',
    variety: 'Yellow Bourbon, Mundo Novo',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 92, pullTime: { min: 25, max: 29 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 256, ratio: '1:16', temperature: 92, totalTime: { min: 200, max: 230 }, grindSize: 'Medium-Coarse', bloomTime: 35, bloomWater: 48 }
    },
    tastingNotes: ['Chocolate', 'Peanut', 'Caramel', 'Low Acid', 'Smooth'],
    acidity: 4,
    body: 8,
    sweetness: 7,
  },
  {
    name: 'Sul de Minas Yellow Bourbon',
    description: 'The Sul de Minas region in southern Minas Gerais produces some of Brazil\'s finest specialty coffees. This Yellow Bourbon lot showcases the variety\'s signature sweetness and smooth body, carefully processed to highlight its delicate fruit notes.',
    origin: 'Brazil',
    region: 'Sul de Minas, Minas Gerais',
    farm: 'Fazenda Santa Inês',
    altitude: '1,100-1,400 MASL',
    process: 'NATURAL',
    roastLevel: 'MEDIUM',
    variety: 'Yellow Bourbon',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 92, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 260, ratio: '1:16.25', temperature: 93, totalTime: { min: 195, max: 225 }, grindSize: 'Medium', bloomTime: 35, bloomWater: 48 }
    },
    tastingNotes: ['Milk Chocolate', 'Hazelnut', 'Yellow Fruit', 'Creamy', 'Sweet'],
    acidity: 5,
    body: 8,
    sweetness: 8,
  },
  {
    name: 'Mogiana Pulped Natural',
    description: 'The Mogiana region spans São Paulo and Minas Gerais, known for rich volcanic soils. This pulped natural (honey) processed lot offers a bridge between washed clarity and natural sweetness, creating a balanced cup with enhanced body.',
    origin: 'Brazil',
    region: 'Mogiana, São Paulo',
    farm: 'Sítio São Benedito',
    altitude: '950-1,100 MASL',
    process: 'HONEY',
    roastLevel: 'MEDIUM_DARK',
    variety: 'Catuaí, Mundo Novo',
    brewParams: {
      espresso: { dose: 18, yield: 34, ratio: '1:1.9', temperature: 91, pullTime: { min: 24, max: 28 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 17, waterAmount: 272, ratio: '1:16', temperature: 92, totalTime: { min: 210, max: 240 }, grindSize: 'Medium-Coarse', bloomTime: 35, bloomWater: 51 }
    },
    tastingNotes: ['Dark Chocolate', 'Walnut', 'Dried Fruit', 'Spice', 'Full Body'],
    acidity: 4,
    body: 9,
    sweetness: 7,
  },

  // ==================== INDONESIA ====================
  {
    name: 'Sumatra Mandheling',
    description: 'Sumatra Mandheling is one of the world\'s most distinctive coffee origins. The unique wet-hulling (Giling Basah) process creates the earthy, full-bodied profile that has made Sumatran coffee legendary. Grown by Batak farmers in the Lake Toba highlands.',
    origin: 'Indonesia',
    region: 'North Sumatra, Lintong',
    farm: 'Batak Smallholders',
    altitude: '1,200-1,600 MASL',
    process: 'WET_HULLED',
    roastLevel: 'DARK',
    variety: 'Typica, Catimor',
    brewParams: {
      espresso: { dose: 18, yield: 32, ratio: '1:1.8', temperature: 90, pullTime: { min: 23, max: 27 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 17, waterAmount: 255, ratio: '1:15', temperature: 91, totalTime: { min: 220, max: 250 }, grindSize: 'Medium-Coarse', bloomTime: 30, bloomWater: 51 }
    },
    tastingNotes: ['Earthy', 'Cedar', 'Dark Chocolate', 'Tobacco', 'Herbal'],
    acidity: 3,
    body: 10,
    sweetness: 5,
  },
  {
    name: 'Java Estate',
    description: 'Java was one of the first places outside Africa and Arabia to cultivate coffee. Today, five government-run estates continue the tradition, producing clean, well-balanced coffees using modern wet-processing methods that differ from typical Indonesian profiles.',
    origin: 'Indonesia',
    region: 'East Java, Ijen Plateau',
    farm: 'Blawan Estate',
    altitude: '1,400-1,600 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Typica, S795',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 92, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 256, ratio: '1:16', temperature: 93, totalTime: { min: 195, max: 225 }, grindSize: 'Medium', bloomTime: 35, bloomWater: 48 }
    },
    tastingNotes: ['Malt', 'Chocolate', 'Nuts', 'Clean', 'Balanced'],
    acidity: 5,
    body: 7,
    sweetness: 6,
  },
  {
    name: 'Sulawesi Toraja',
    description: 'The Toraja highlands of Sulawesi produce some of Indonesia\'s most prized coffees. Grown on the mountainsides above 1,400 meters by the indigenous Toraja people, these coffees combine Sumatran earthiness with unique spice notes and cleaner acidity.',
    origin: 'Indonesia',
    region: 'South Sulawesi, Tana Toraja',
    farm: 'Toraja Smallholders',
    altitude: '1,400-1,800 MASL',
    process: 'WET_HULLED',
    roastLevel: 'MEDIUM_DARK',
    variety: 'S795, Typica',
    brewParams: {
      espresso: { dose: 18, yield: 34, ratio: '1:1.9', temperature: 91, pullTime: { min: 25, max: 29 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 256, ratio: '1:16', temperature: 92, totalTime: { min: 205, max: 235 }, grindSize: 'Medium-Coarse', bloomTime: 35, bloomWater: 48 }
    },
    tastingNotes: ['Spice', 'Dark Chocolate', 'Brown Sugar', 'Earthy', 'Herbal'],
    acidity: 4,
    body: 9,
    sweetness: 6,
  },
  {
    name: 'Bali Kintamani',
    description: 'Grown on the volcanic slopes of Mount Batur in the Kintamani highlands, this Balinese coffee is part of a UNESCO-recognized agricultural system. The unique Subak Abian cooperative farming system and wet processing produce a clean, bright cup unusual for Indonesia.',
    origin: 'Indonesia',
    region: 'Bali, Kintamani Highlands',
    farm: 'Subak Abian Cooperative',
    altitude: '1,200-1,600 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Typica, Bourbon',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 185, max: 215 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Citrus', 'Chocolate', 'Stone Fruit', 'Clean', 'Bright'],
    acidity: 7,
    body: 6,
    sweetness: 7,
  },

  // ==================== YEMEN ====================
  {
    name: 'Yemen Mocha Mattari',
    description: 'Yemen is where coffee cultivation began outside of Ethiopia. Mocha Mattari from the Bani Mattar region represents the original coffee terroir. Ancient varieties grown on terraced mountainsides using traditional methods produce wild, wine-like coffees unlike any other.',
    origin: 'Yemen',
    region: 'Bani Mattar, Sana\'a',
    farm: 'Traditional Terraces',
    altitude: '1,800-2,400 MASL',
    process: 'NATURAL',
    roastLevel: 'MEDIUM',
    variety: 'Yemeni Heirloom (Udaini, Dawairi)',
    brewParams: {
      espresso: { dose: 17, yield: 36, ratio: '1:2.1', temperature: 93, pullTime: { min: 27, max: 31 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 255, ratio: '1:17', temperature: 94, totalTime: { min: 190, max: 220 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Wine', 'Dried Fruit', 'Chocolate', 'Spice', 'Wild'],
    acidity: 7,
    body: 8,
    sweetness: 7,
  },

  // ==================== RWANDA ====================
  {
    name: 'Rwanda Nyamasheke',
    description: 'Rwanda has rapidly emerged as a specialty coffee powerhouse. The Nyamasheke region in the southwest, near Lake Kivu, produces exceptionally clean and complex coffees. The country\'s commitment to quality processing has earned its coffees worldwide recognition.',
    origin: 'Rwanda',
    region: 'Nyamasheke, Western Province',
    farm: 'Buf Café Washing Station',
    altitude: '1,700-2,000 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'Red Bourbon',
    brewParams: {
      espresso: { dose: 18, yield: 40, ratio: '1:2.2', temperature: 94, pullTime: { min: 28, max: 32 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 95, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Orange', 'Floral', 'Caramel', 'Black Tea', 'Clean'],
    acidity: 8,
    body: 6,
    sweetness: 8,
  },
  {
    name: 'Rwanda Huye Mountain',
    description: 'The southern highlands around Huye (formerly Butare) produce some of Rwanda\'s finest coffees. This lot from Huye Mountain benefits from high altitude and Red Bourbon varieties, creating complex cups with bright acidity and excellent sweetness.',
    origin: 'Rwanda',
    region: 'Huye, Southern Province',
    farm: 'Huye Mountain Coffee',
    altitude: '1,800-2,100 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'Red Bourbon',
    brewParams: {
      espresso: { dose: 18, yield: 40, ratio: '1:2.2', temperature: 94, pullTime: { min: 28, max: 32 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 255, ratio: '1:17', temperature: 96, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Red Berry', 'Lemon', 'Honey', 'Jasmine', 'Silky'],
    acidity: 9,
    body: 6,
    sweetness: 9,
  },

  // ==================== BURUNDI ====================
  {
    name: 'Burundi Kayanza',
    description: 'Burundi shares similar terroir with neighboring Rwanda and produces equally stunning coffees. The Kayanza province in the north, with its high altitudes and ideal climate, creates coffees with remarkable complexity and the juicy, vibrant acidity typical of the region.',
    origin: 'Burundi',
    region: 'Kayanza Province',
    farm: 'Mpanga Washing Station',
    altitude: '1,700-2,000 MASL',
    process: 'WASHED',
    roastLevel: 'LIGHT',
    variety: 'Red Bourbon',
    brewParams: {
      espresso: { dose: 18, yield: 40, ratio: '1:2.2', temperature: 94, pullTime: { min: 28, max: 32 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 95, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Blackberry', 'Lime', 'Raw Honey', 'Floral', 'Complex'],
    acidity: 9,
    body: 6,
    sweetness: 8,
  },

  // ==================== EL SALVADOR ====================
  {
    name: 'El Salvador Pacamara',
    description: 'El Salvador created the Pacamara variety by crossing Pacas and Maragogype. This large-beaned variety has become the country\'s signature, producing complex cups with remarkable depth. The volcanic soils of El Salvador provide ideal growing conditions.',
    origin: 'El Salvador',
    region: 'Apaneca-Ilamatepec',
    farm: 'Finca Los Pirineos',
    altitude: '1,350-1,650 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM_LIGHT',
    variety: 'Pacamara',
    brewParams: {
      espresso: { dose: 18, yield: 40, ratio: '1:2.2', temperature: 93, pullTime: { min: 27, max: 31 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 185, max: 215 }, grindSize: 'Medium', bloomTime: 45, bloomWater: 45 }
    },
    tastingNotes: ['Stone Fruit', 'Chocolate', 'Floral', 'Citrus', 'Creamy'],
    acidity: 7,
    body: 7,
    sweetness: 8,
  },
  {
    name: 'El Salvador Bourbon Tekisic',
    description: 'Tekisic is El Salvador\'s selection of the best Bourbon lines, developed by the national coffee institute. This variety represents the highest quality Bourbon genetics, producing cups with exceptional sweetness and the classic profile El Salvador is known for.',
    origin: 'El Salvador',
    region: 'Santa Ana, Chalatenango',
    farm: 'Finca Kilimanjaro',
    altitude: '1,400-1,700 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Bourbon Tekisic',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 27, max: 31 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Caramel', 'Orange', 'Almond', 'Balanced', 'Sweet'],
    acidity: 6,
    body: 7,
    sweetness: 8,
  },

  // ==================== HONDURAS ====================
  {
    name: 'Honduras Marcala',
    description: 'Marcala was Honduras\'s first Denomination of Origin, recognized for its distinctive coffee profile. The region\'s high altitude, pine forests, and excellent soil create coffees with balanced acidity and notable sweetness that have earned international acclaim.',
    origin: 'Honduras',
    region: 'Marcala, La Paz',
    farm: 'COMSA Cooperative',
    altitude: '1,300-1,700 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Catuaí, Lempira',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 185, max: 215 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Milk Chocolate', 'Apple', 'Brown Sugar', 'Nutty', 'Clean'],
    acidity: 6,
    body: 7,
    sweetness: 8,
  },

  // ==================== PERU ====================
  {
    name: 'Peru Cajamarca',
    description: 'Peru\'s Cajamarca region in the northern highlands produces some of the country\'s finest specialty coffees. The remote, mountainous terrain and organic farming practices of many smallholders create clean, sweet coffees with excellent complexity.',
    origin: 'Peru',
    region: 'Cajamarca, Jaén',
    farm: 'Sol y Café Cooperative',
    altitude: '1,400-1,900 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Bourbon, Caturra, Typica',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 185, max: 215 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Cocoa', 'Citrus', 'Floral', 'Nuts', 'Mild'],
    acidity: 6,
    body: 6,
    sweetness: 7,
  },

  // ==================== MEXICO ====================
  {
    name: 'Mexico Chiapas',
    description: 'The Chiapas highlands near the Guatemalan border produce Mexico\'s finest coffees. Indigenous Maya farmers grow coffee under shade in the Sierra Madre mountains, creating organic, shade-grown coffees with delicate flavors and bright, clean acidity.',
    origin: 'Mexico',
    region: 'Chiapas, Sierra Madre',
    farm: 'Indigenous Smallholders',
    altitude: '1,200-1,700 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Typica, Bourbon, Caturra',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 92, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 93, totalTime: { min: 185, max: 215 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Chocolate', 'Light Citrus', 'Nut', 'Mild', 'Clean'],
    acidity: 5,
    body: 6,
    sweetness: 7,
  },

  // ==================== JAMAICA ====================
  {
    name: 'Jamaica Blue Mountain',
    description: 'Jamaica Blue Mountain is one of the world\'s most famous and sought-after coffees. Grown exclusively in the Blue Mountains at specific altitudes, these coffees are regulated by the Jamaica Coffee Industry Board. The unique climate produces exceptionally mild, balanced cups.',
    origin: 'Jamaica',
    region: 'Blue Mountains, Portland Parish',
    farm: 'Mavis Bank Estate',
    altitude: '910-1,700 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Blue Mountain Typica',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 27, max: 31 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Mild', 'Floral', 'Sweet', 'Nut', 'Clean', 'Balanced'],
    acidity: 5,
    body: 6,
    sweetness: 8,
  },

  // ==================== HAWAII ====================
  {
    name: 'Hawaii Kona Extra Fancy',
    description: 'Kona coffee from Hawaii\'s Big Island is grown on the slopes of Hualalai and Mauna Loa volcanoes. The unique microclimate with morning sun, afternoon clouds, and rich volcanic soil creates the smooth, aromatic profile Kona is famous for. Extra Fancy is the highest grade.',
    origin: 'USA (Hawaii)',
    region: 'Kona, Big Island',
    farm: 'Greenwell Farms',
    altitude: '150-900 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'Kona Typica',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 93, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 15, waterAmount: 250, ratio: '1:16.7', temperature: 94, totalTime: { min: 180, max: 210 }, grindSize: 'Medium', bloomTime: 40, bloomWater: 45 }
    },
    tastingNotes: ['Brown Sugar', 'Macadamia', 'Light Fruit', 'Buttery', 'Smooth'],
    acidity: 5,
    body: 7,
    sweetness: 8,
  },

  // ==================== INDIA ====================
  {
    name: 'India Monsoon Malabar',
    description: 'India\'s Monsoon Malabar is one of the world\'s most unique processed coffees. Beans are exposed to monsoon winds and humidity for months, swelling the beans and drastically reducing acidity while creating a distinctive musty, earthy profile unlike any other coffee.',
    origin: 'India',
    region: 'Malabar Coast, Karnataka',
    farm: 'Various Estates',
    altitude: '1,000-1,500 MASL',
    process: 'OTHER',
    roastLevel: 'DARK',
    variety: 'Robusta, Arabica Blend',
    brewParams: {
      espresso: { dose: 18, yield: 32, ratio: '1:1.8', temperature: 90, pullTime: { min: 23, max: 27 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 17, waterAmount: 255, ratio: '1:15', temperature: 91, totalTime: { min: 210, max: 240 }, grindSize: 'Medium-Coarse', bloomTime: 30, bloomWater: 51 }
    },
    tastingNotes: ['Earthy', 'Spice', 'Tobacco', 'Musty', 'Low Acid', 'Full Body'],
    acidity: 2,
    body: 10,
    sweetness: 4,
  },
  {
    name: 'India Karnataka Arabica',
    description: 'Karnataka state produces most of India\'s Arabica coffee, grown in the lush Western Ghats mountains. This shade-grown coffee from traditional estates offers a more conventional profile than Monsoon Malabar, with medium body and pleasant mild acidity.',
    origin: 'India',
    region: 'Karnataka, Chikmagalur',
    farm: 'Badra Estates',
    altitude: '1,000-1,500 MASL',
    process: 'WASHED',
    roastLevel: 'MEDIUM',
    variety: 'S795, Selection 9',
    brewParams: {
      espresso: { dose: 18, yield: 36, ratio: '1:2', temperature: 92, pullTime: { min: 26, max: 30 }, pressure: 9, grindSize: 'Fine' },
      pourOver: { dose: 16, waterAmount: 256, ratio: '1:16', temperature: 93, totalTime: { min: 195, max: 225 }, grindSize: 'Medium', bloomTime: 35, bloomWater: 48 }
    },
    tastingNotes: ['Chocolate', 'Spice', 'Mild Fruit', 'Balanced', 'Smooth'],
    acidity: 5,
    body: 7,
    sweetness: 6,
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
