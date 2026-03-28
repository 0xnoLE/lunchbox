import { NextRequest, NextResponse } from 'next/server';
import { getEmployerData } from '@/lib/employers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get('zip');

  if (!zip) {
    return NextResponse.json({ error: 'Missing required parameter: zip' }, { status: 400 });
  }

  const cleanZip = zip.replace(/\D/g, '').substring(0, 5);
  if (cleanZip.length !== 5) {
    return NextResponse.json(
      { error: 'Invalid ZIP code. Must be 5 digits.' },
      { status: 400 }
    );
  }

  try {
    const data = await getEmployerData(cleanZip);
    if (!data) {
      return NextResponse.json(
        { error: 'Employment data not available for this ZIP code' },
        { status: 404 }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Employers API error:', error);
    return NextResponse.json({ error: 'Failed to fetch employer data' }, { status: 500 });
  }
}
