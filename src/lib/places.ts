export interface Place {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  address: string;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

export type PlaceCategory = 'dining' | 'shopping' | 'attractions' | 'parks' | 'schools' | 'safety';

function buildOverpassQuery(lat: number, lon: number, category: PlaceCategory): string {
  const radius = 2000;
  const center = `${lat},${lon}`;

  const filters: Record<PlaceCategory, string> = {
    dining: `
      node["amenity"~"restaurant|cafe|fast_food|bar|pub|food_court"](around:${radius},${center});
      way["amenity"~"restaurant|cafe|fast_food|bar|pub|food_court"](around:${radius},${center});
    `,
    shopping: `
      node["shop"~"supermarket|mall|clothes|electronics|department_store|convenience"](around:${radius},${center});
      way["shop"~"supermarket|mall|clothes|electronics|department_store|convenience"](around:${radius},${center});
    `,
    attractions: `
      node["tourism"~"attraction|museum|theme_park|zoo|aquarium|gallery|viewpoint"](around:${radius},${center});
      way["tourism"~"attraction|museum|theme_park|zoo|aquarium|gallery|viewpoint"](around:${radius},${center});
    `,
    parks: `
      node["leisure"~"park|nature_reserve|garden|playground"](around:${radius},${center});
      way["leisure"~"park|nature_reserve|garden|playground"](around:${radius},${center});
      node["amenity"="park"](around:${radius},${center});
      way["amenity"="park"](around:${radius},${center});
    `,
    schools: `
      node["amenity"~"school|college|university|kindergarten|library"](around:${radius},${center});
      way["amenity"~"school|college|university|kindergarten|library"](around:${radius},${center});
    `,
    safety: `
      node["amenity"~"police|fire_station|hospital|clinic|pharmacy"](around:${radius},${center});
      way["amenity"~"police|fire_station|hospital|clinic|pharmacy"](around:${radius},${center});
    `,
  };

  return `
    [out:json][timeout:25];
    (
      ${filters[category]}
    );
    out center 20;
  `;
}

function extractAddress(tags: Record<string, string>): string {
  const parts: string[] = [];
  if (tags['addr:housenumber'] && tags['addr:street']) {
    parts.push(`${tags['addr:housenumber']} ${tags['addr:street']}`);
  } else if (tags['addr:street']) {
    parts.push(tags['addr:street']);
  }
  if (tags['addr:city']) parts.push(tags['addr:city']);
  return parts.join(', ') || 'Address not available';
}

function getSubcategory(tags: Record<string, string>, category: PlaceCategory): string {
  if (category === 'dining') return tags.amenity || 'restaurant';
  if (category === 'shopping') return tags.shop || 'shop';
  if (category === 'attractions') return tags.tourism || 'attraction';
  if (category === 'parks') return tags.leisure || tags.amenity || 'park';
  if (category === 'schools') return tags.amenity || 'school';
  if (category === 'safety') return tags.amenity || 'safety';
  return category;
}

export async function getNearbyPlaces(
  lat: number,
  lon: number,
  category: PlaceCategory
): Promise<Place[]> {
  try {
    const query = buildOverpassQuery(lat, lon, category);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Overpass API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.elements) return [];

    const seen = new Set<string>();
    const places: Place[] = [];

    for (const el of data.elements) {
      const name = el.tags?.name;
      if (!name) continue;
      if (seen.has(name)) continue;
      seen.add(name);

      const elLat = el.lat ?? el.center?.lat ?? 0;
      const elLon = el.lon ?? el.center?.lon ?? 0;

      places.push({
        id: String(el.id),
        name,
        category,
        subcategory: getSubcategory(el.tags || {}, category),
        address: extractAddress(el.tags || {}),
        lat: elLat,
        lon: elLon,
        tags: el.tags || {},
      });

      if (places.length >= 20) break;
    }

    return places;
  } catch (error) {
    console.error(`Error fetching ${category} places:`, error);
    return [];
  }
}
