import { NextRequest, NextResponse } from 'next/server';
import { getNearbyPlaces, PlaceCategory } from '@/lib/places';

const VALID_CATEGORIES: PlaceCategory[] = ['dining', 'shopping', 'attractions', 'parks', 'schools', 'safety'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const category = searchParams.get('category');

  if (!lat || !lon || !category) {
    return NextResponse.json(
      { error: 'Missing required parameters: lat, lon, category' },
      { status: 400 }
    );
  }

  if (!VALID_CATEGORIES.includes(category as PlaceCategory)) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    return NextResponse.json({ error: 'Invalid lat/lon values' }, { status: 400 });
  }

  try {
    const places = await getNearbyPlaces(latNum, lonNum, category as PlaceCategory);
    return NextResponse.json({ places });
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby places' }, { status: 500 });
  }
}
