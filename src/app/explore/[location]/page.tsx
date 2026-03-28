import { Suspense } from 'react';
import Link from 'next/link';
import { geocodeLocation } from '@/lib/geocode';
import { getNearbyPlaces, Place } from '@/lib/places';
import { getEmployerData, EmployerData } from '@/lib/employers';
import SearchBar from '@/components/SearchBar';
import PlaceCard from '@/components/PlaceCard';
import EmployerSection from '@/components/EmployerSection';
import AreaStats from '@/components/AreaStats';
import TabView from '@/components/TabView';

interface PageProps {
  params: Promise<{ location: string }>;
}

const TABS = [
  { id: 'dining', label: 'Dining & Shopping', emoji: '🍽️' },
  { id: 'attractions', label: 'Attractions & Parks', emoji: '🎭' },
  { id: 'employers', label: 'Major Employers', emoji: '💼' },
  { id: 'stats', label: 'Area Stats', emoji: '📊' },
];

function PlacesGrid({ places, category }: { places: Place[]; category: string }) {
  if (places.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-3">🔍</div>
        <p className="font-medium">No {category} found nearby</p>
        <p className="text-sm mt-1 text-gray-400">OpenStreetMap data may be limited for this area</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}

export default async function ExplorePage({ params }: PageProps) {
  const { location } = await params;
  const decodedLocation = decodeURIComponent(location);

  // Geocode the location
  const geoResult = await geocodeLocation(decodedLocation);

  if (!geoResult) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Location Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find{' '}
            <strong>&ldquo;{decodedLocation}&rdquo;</strong>. Try a different ZIP code or city name.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  // Fetch all place categories and employer data in parallel
  const [dining, shopping, attractions, parks, employerData] = await Promise.allSettled([
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'dining'),
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'shopping'),
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'attractions'),
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'parks'),
    geoResult.zip ? getEmployerData(geoResult.zip) : Promise.resolve(null),
  ]);

  const diningPlaces: Place[] = dining.status === 'fulfilled' ? dining.value : [];
  const shoppingPlaces: Place[] = shopping.status === 'fulfilled' ? shopping.value : [];
  const attractionPlaces: Place[] = attractions.status === 'fulfilled' ? attractions.value : [];
  const parkPlaces: Place[] = parks.status === 'fulfilled' ? parks.value : [];
  const employers: EmployerData | null = employerData.status === 'fulfilled' ? employerData.value : null;

  const locationTitle = [geoResult.city, geoResult.state].filter(Boolean).join(', ') || decodedLocation;
  const totalPlaces = diningPlaces.length + shoppingPlaces.length + attractionPlaces.length + parkPlaces.length;

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-amber-200 hover:text-white text-sm mb-4 transition-colors"
          >
            ← Back to Search
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{locationTitle}</h1>
              {geoResult.zip && (
                <p className="mt-1 text-amber-200 text-sm">ZIP: {geoResult.zip}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                  📍 {totalPlaces} places found
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                  📡 {geoResult.lat.toFixed(4)}, {geoResult.lon.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <SearchBar initialValue={decodedLocation} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1">
        <TabView tabs={TABS}>
          {/* Dining & Shopping */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🍽️</span> Dining ({diningPlaces.length})
              </h2>
              <PlacesGrid places={diningPlaces} category="dining spots" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🛍️</span> Shopping ({shoppingPlaces.length})
              </h2>
              <PlacesGrid places={shoppingPlaces} category="shops" />
            </div>
          </div>

          {/* Attractions & Parks */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎭</span> Attractions ({attractionPlaces.length})
              </h2>
              <PlacesGrid places={attractionPlaces} category="attractions" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🌳</span> Parks & Green Spaces ({parkPlaces.length})
              </h2>
              <PlacesGrid places={parkPlaces} category="parks" />
            </div>
          </div>

          {/* Major Employers */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💼</span> Employment Data
              {geoResult.zip && (
                <span className="text-sm font-normal text-gray-500">for ZIP {geoResult.zip}</span>
              )}
            </h2>
            {!geoResult.zip ? (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-amber-700 font-medium">ZIP code required for employment data</p>
                <p className="text-amber-500 text-sm mt-1">
                  Try searching with a specific ZIP code (e.g., &ldquo;90210&rdquo;) to see employer statistics.
                </p>
              </div>
            ) : (
              <EmployerSection data={employers} />
            )}
          </div>

          {/* Area Stats */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span> Neighborhood Scores
            </h2>
            <AreaStats
              dining={diningPlaces}
              shopping={shoppingPlaces}
              attractions={attractionPlaces}
              parks={parkPlaces}
              city={geoResult.city}
              state={geoResult.state}
            />
          </div>
        </TabView>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 px-4 py-6 text-center text-gray-400 text-sm">
        <p>
          Data from{' '}
          <a href="https://nominatim.openstreetmap.org/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">Nominatim</a>
          {', '}
          <a href="https://overpass-api.de/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">Overpass API</a>
          {', and '}
          <a href="https://www.census.gov/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">US Census Bureau</a>
        </p>
      </footer>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { location } = await params;
  const decodedLocation = decodeURIComponent(location);
  return {
    title: `Explore ${decodedLocation} - Neighborhood Discovery`,
    description: `Discover restaurants, shops, attractions, and employer data for ${decodedLocation}.`,
  };
}
