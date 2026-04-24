import Link from 'next/link';
import { geocodeLocation } from '@/lib/geocode';
import { getNearbyPlaces, Place } from '@/lib/places';
import { getEmployerData, EmployerData } from '@/lib/employers';
import SearchBar from '@/components/SearchBar';
import PlaceCard from '@/components/PlaceCard';
import SchoolCard from '@/components/SchoolCard';
import EmployerSection from '@/components/EmployerSection';
import AreaStats from '@/components/AreaStats';
import TabView from '@/components/TabView';
import NeighborhoodSummary from '@/components/NeighborhoodSummary';

interface PageProps {
  params: Promise<{ location: string }>;
}

const TABS = [
  { id: 'dining', label: 'Food & Shops', emoji: '🍽️' },
  { id: 'attractions', label: 'Parks & Fun', emoji: '🌳' },
  { id: 'schools', label: 'Schools', emoji: '🏫' },
  { id: 'employers', label: 'Jobs', emoji: '💼' },
  { id: 'stats', label: 'Our Score', emoji: '📊' },
];

function PlacesGrid({ places, category }: { places: Place[]; category: string }) {
  if (places.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
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

function SchoolsGrid({ places }: { places: Place[] }) {
  if (places.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <div className="text-4xl mb-3">🏫</div>
        <p className="font-medium">No schools found nearby</p>
        <p className="text-sm mt-1 text-gray-400">
          Try searching by a specific ZIP code, or school data may be limited for this area in OpenStreetMap.
        </p>
      </div>
    );
  }
  const schools = places.filter((p) => ['school', 'kindergarten', 'college', 'university'].includes(p.subcategory));
  const libraries = places.filter((p) => p.subcategory === 'library');

  return (
    <div className="space-y-6">
      {schools.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>🏫</span> Schools &amp; Colleges ({schools.length})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schools.map((place) => (
              <SchoolCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      )}
      {libraries.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📚</span> Public Libraries ({libraries.length})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {libraries.map((place) => (
              <SchoolCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function ExplorePage({ params }: PageProps) {
  const { location } = await params;
  const decodedLocation = decodeURIComponent(location);

  const geoResult = await geocodeLocation(decodedLocation);

  if (!geoResult) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">We couldn&apos;t find that location</h1>
          <p className="text-gray-600 mb-2">
            We searched for <strong>&ldquo;{decodedLocation}&rdquo;</strong> but didn&apos;t get a match.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Try being more specific — for example, instead of &ldquo;Springfield&rdquo; try &ldquo;Springfield MO&rdquo; or enter a ZIP code like &ldquo;65801&rdquo;.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            ← Try a Different Search
          </Link>
        </div>
      </div>
    );
  }

  const [dining, shopping, attractions, parks, schools, safetyPlaces, employerData] = await Promise.allSettled([
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'dining'),
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'shopping'),
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'attractions'),
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'parks'),
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'schools'),
    getNearbyPlaces(geoResult.lat, geoResult.lon, 'safety'),
    geoResult.zip ? getEmployerData(geoResult.zip) : Promise.resolve(null),
  ]);

  const diningPlaces: Place[] = dining.status === 'fulfilled' ? dining.value : [];
  const shoppingPlaces: Place[] = shopping.status === 'fulfilled' ? shopping.value : [];
  const attractionPlaces: Place[] = attractions.status === 'fulfilled' ? attractions.value : [];
  const parkPlaces: Place[] = parks.status === 'fulfilled' ? parks.value : [];
  const schoolPlaces: Place[] = schools.status === 'fulfilled' ? schools.value : [];
  const safetyInfra: Place[] = safetyPlaces.status === 'fulfilled' ? safetyPlaces.value : [];
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
          <h1 className="text-3xl font-bold sm:text-4xl">{locationTitle}</h1>
          {geoResult.zip && (
            <p className="mt-1 text-amber-200 text-sm">ZIP Code: {geoResult.zip}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
              📍 {totalPlaces} places found nearby
            </span>
            {schoolPlaces.length > 0 && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                🏫 {schoolPlaces.length} schools
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <SearchBar initialValue={decodedLocation} />
        </div>
      </div>

      {/* Summary Card */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-6">
        <NeighborhoodSummary
          city={geoResult.city}
          state={geoResult.state}
          dining={diningPlaces}
          shopping={shoppingPlaces}
          attractions={attractionPlaces}
          parks={parkPlaces}
          schools={schoolPlaces}
          employers={employers}
        />
      </div>

      {/* Tabs */}
      <div className="flex-1 mt-2">
        <TabView tabs={TABS}>
          {/* Food & Shops */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span>🍽️</span> Restaurants &amp; Cafes
              </h2>
              <p className="text-sm text-gray-500 mb-4">{diningPlaces.length} place{diningPlaces.length !== 1 ? 's' : ''} found within about a mile</p>
              <PlacesGrid places={diningPlaces} category="restaurants" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span>🛒</span> Grocery &amp; Shopping
              </h2>
              <p className="text-sm text-gray-500 mb-4">{shoppingPlaces.length} place{shoppingPlaces.length !== 1 ? 's' : ''} found within about a mile</p>
              <PlacesGrid places={shoppingPlaces} category="shops" />
            </div>
          </div>

          {/* Parks & Fun */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span>🌳</span> Parks &amp; Green Spaces
              </h2>
              <p className="text-sm text-gray-500 mb-4">{parkPlaces.length} park{parkPlaces.length !== 1 ? 's' : ''} found — great for kids and outdoor time</p>
              <PlacesGrid places={parkPlaces} category="parks" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span>🎭</span> Attractions &amp; Things to Do
              </h2>
              <p className="text-sm text-gray-500 mb-4">{attractionPlaces.length} attraction{attractionPlaces.length !== 1 ? 's' : ''} found nearby</p>
              <PlacesGrid places={attractionPlaces} category="attractions" />
            </div>
          </div>

          {/* Schools */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <span>🏫</span> Schools &amp; Libraries
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {schoolPlaces.length} school{schoolPlaces.length !== 1 ? 's' : ''} and librar{schoolPlaces.filter(p => p.subcategory === 'library').length !== 1 ? 'ies' : 'y'} found within about a mile
            </p>
            <SchoolsGrid places={schoolPlaces} />
            <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> For school ratings and test scores, visit{' '}
                <a href="https://www.greatschools.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                  GreatSchools.org
                </a>{' '}
                and search for {locationTitle}.
              </p>
            </div>
          </div>

          {/* Jobs */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <span>💼</span> Jobs &amp; Major Employers
            </h2>
            {!geoResult.zip ? (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-center mt-4">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-amber-700 font-medium">Enter a ZIP code to see job data</p>
                <p className="text-amber-500 text-sm mt-1">
                  Search with a specific ZIP code (like &ldquo;78701&rdquo;) to see who the biggest employers are in that area.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">Based on US Census data for ZIP {geoResult.zip}</p>
                <EmployerSection data={employers} />
              </>
            )}
          </div>

          {/* Our Score */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <span>📊</span> Neighborhood Score
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              We score this area based on what&apos;s nearby. Higher is better — but a lower score just means it&apos;s more rural or quiet.
            </p>
            <AreaStats
              dining={diningPlaces}
              shopping={shoppingPlaces}
              attractions={attractionPlaces}
              parks={parkPlaces}
              schools={schoolPlaces}
              safety={safetyInfra}
              city={geoResult.city}
              state={geoResult.state}
            />
          </div>
        </TabView>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 px-4 py-6 text-center text-gray-400 text-sm">
        <p className="mb-1">Free to use · No account required</p>
        <p>
          Data from{' '}
          <a href="https://nominatim.openstreetmap.org/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
          {' and '}
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
    title: `${decodedLocation} — Neighborhood Report`,
    description: `Schools, restaurants, parks, shops, and job data for ${decodedLocation}. Is it a good place for your family?`,
  };
}
