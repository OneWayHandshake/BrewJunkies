/**
 * Script to generate accurate SVG paths from GeoJSON country data
 * Run with: node scripts/generate-country-paths.js
 */

const fs = require('fs');
const path = require('path');

// Map of our coffee country slugs to ISO 3166-1 alpha-3 codes
const countryMap = {
  'brazil-coffee': 'BRA',
  'vietnam-coffee': 'VNM',
  'colombia-coffee': 'COL',
  'indonesia-coffee': 'IDN',
  'ethiopia-coffee-country': 'ETH',
  'honduras-coffee': 'HND',
  'india-coffee': 'IND',
  'uganda-coffee': 'UGA',
  'mexico-coffee': 'MEX',
  'guatemala-coffee': 'GTM',
  'peru-coffee': 'PER',
  'nicaragua-coffee': 'NIC',
  'ivory-coast-coffee': 'CIV',
  'costa-rica-coffee': 'CRI',
  'tanzania-coffee': 'TZA',
  'kenya-coffee-country': 'KEN',
  'papua-new-guinea-coffee': 'PNG',
  'el-salvador-coffee': 'SLV',
  'ecuador-coffee': 'ECU',
  'cameroon-coffee': 'CMR',
  'thailand-coffee': 'THA',
  'philippines-coffee': 'PHL',
  'democratic-republic-congo-coffee': 'COD',
  'rwanda-coffee': 'RWA',
  'burundi-coffee': 'BDI',
  'madagascar-coffee': 'MDG',
  'dominican-republic-coffee': 'DOM',
  'haiti-coffee': 'HTI',
  'bolivia-coffee': 'BOL',
  'venezuela-coffee': 'VEN',
  'cuba-coffee': 'CUB',
  'jamaica-coffee': 'JAM',
  'yemen-coffee': 'YEM',
  'panama-coffee': 'PAN',
  'myanmar-coffee': 'MMR',
  'laos-coffee': 'LAO',
  'nepal-coffee': 'NPL',
  'china-coffee': 'CHN',
  'zimbabwe-coffee': 'ZWE',
  'malawi-coffee': 'MWI',
  'zambia-coffee': 'ZMB',
  'angola-coffee': 'AGO',
  'central-african-republic-coffee': 'CAF',
  'togo-coffee': 'TGO',
  'guinea-coffee': 'GIN',
  'sierra-leone-coffee': 'SLE',
  'nigeria-coffee': 'NGA',
  'sri-lanka-coffee': 'LKA',
  'usa-hawaii-coffee': 'USA', // Will use USA outline
  'australia-coffee': 'AUS',
};

// Load GeoJSON data
const geoJsonPath = path.join(__dirname, '../node_modules/@geo-maps/countries-land-10km/map.geo.json');
const geoJson = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'));

// Create a map of A3 codes to features
const countryFeatures = {};
for (const feature of geoJson.features) {
  const code = feature.properties.A3;
  if (code) {
    countryFeatures[code] = feature;
  }
}

/**
 * Convert GeoJSON coordinates to SVG path, normalizing to viewBox 0 0 100 100
 */
function geoToSvgPath(geometry, simplificationFactor = 10) {
  let allCoords = [];

  // Extract all coordinates based on geometry type
  if (geometry.type === 'Polygon') {
    // Use only the outer ring (first array)
    allCoords = [geometry.coordinates[0]];
  } else if (geometry.type === 'MultiPolygon') {
    // Get outer ring of each polygon, sort by size and take largest ones
    const rings = geometry.coordinates.map(poly => poly[0]);
    // Sort by number of points (proxy for size) and take top rings
    rings.sort((a, b) => b.length - a.length);
    // Take up to 5 largest land masses
    allCoords = rings.slice(0, 5);
  }

  if (allCoords.length === 0) return null;

  // Find bounding box across all rings
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const ring of allCoords) {
    for (const [x, y] of ring) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const scale = 90 / Math.max(width, height); // Leave 5px margin on each side
  const offsetX = 5 + (90 - width * scale) / 2;
  const offsetY = 5 + (90 - height * scale) / 2;

  // Convert coordinates to SVG points
  function toSvg(x, y) {
    // Flip Y axis (SVG Y increases downward, geo Y increases upward)
    const svgX = Math.round((x - minX) * scale + offsetX);
    const svgY = Math.round(90 - (y - minY) * scale + 5);
    return `${svgX},${svgY}`;
  }

  // Simplify a ring by keeping every Nth point
  function simplifyRing(ring, factor) {
    if (ring.length <= 10) return ring;
    const result = [];
    for (let i = 0; i < ring.length; i += factor) {
      result.push(ring[i]);
    }
    // Always include the last point to close the shape
    if (result[result.length - 1] !== ring[ring.length - 1]) {
      result.push(ring[ring.length - 1]);
    }
    return result;
  }

  // Build SVG path
  const paths = [];
  for (const ring of allCoords) {
    const simplified = simplifyRing(ring, simplificationFactor);
    if (simplified.length < 3) continue;

    let pathStr = `M${toSvg(simplified[0][0], simplified[0][1])}`;
    for (let i = 1; i < simplified.length; i++) {
      pathStr += ` L${toSvg(simplified[i][0], simplified[i][1])}`;
    }
    pathStr += ' Z';
    paths.push(pathStr);
  }

  return paths.join(' ');
}

// Generate paths for each country
const countryPaths = {};
const missing = [];

for (const [slug, isoCode] of Object.entries(countryMap)) {
  const feature = countryFeatures[isoCode];
  if (feature) {
    const svgPath = geoToSvgPath(feature.geometry);
    if (svgPath) {
      countryPaths[slug] = svgPath;
    } else {
      missing.push({ slug, isoCode, reason: 'Could not generate path' });
    }
  } else {
    missing.push({ slug, isoCode, reason: 'Country not found in GeoJSON' });
  }
}

// Output TypeScript code
console.log('// Auto-generated country outline paths from GeoJSON data');
console.log('// Do not edit manually - regenerate using: node scripts/generate-country-paths.js\n');
console.log('const countryPaths: Record<string, string> = {');
for (const [slug, path] of Object.entries(countryPaths)) {
  console.log(`  '${slug}': '${path}',`);
}
console.log('};');

if (missing.length > 0) {
  console.log('\n// Missing countries:');
  for (const { slug, isoCode, reason } of missing) {
    console.log(`// - ${slug} (${isoCode}): ${reason}`);
  }
}
