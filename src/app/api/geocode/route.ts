import { NextRequest, NextResponse } from 'next/server';
import { geocodeLocation } from '@/lib/geocode';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter "q"' }, { status: 400 });
  }

  try {
    const result = await geocodeLocation(query);
    if (!result) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Geocode API error:', error);
    return NextResponse.json({ error: 'Failed to geocode location' }, { status: 500 });
  }
}
