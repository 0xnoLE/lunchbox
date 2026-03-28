export interface GeoLocation {
  lat: number;
  lon: number;
  displayName: string;
  city: string;
  state: string;
  zip: string;
}

export async function geocodeLocation(query: string): Promise<GeoLocation | null> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&addressdetails=1&limit=1&countrycodes=us`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NeighborhoodDiscovery/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Geocoding request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];
    const address = result.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      '';

    const state = address.state || '';
    const zip = address.postcode || '';

    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      displayName: result.display_name || query,
      city,
      state,
      zip,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
