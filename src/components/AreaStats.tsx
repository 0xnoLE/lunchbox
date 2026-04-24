import { Place } from '@/lib/places';

interface AreaStatsProps {
  dining: Place[];
  shopping: Place[];
  attractions: Place[];
  parks: Place[];
  schools: Place[];
  safety: Place[];
  city: string;
  state: string;
}

interface ScoreBarProps {
  label: string;
  score: number;
  color: string;
  emoji: string;
  note?: string;
}

function ScoreBar({ label, score, color, emoji, note }: ScoreBarProps) {
  const pct = Math.min(Math.round(score), 100);

  const rating =
    pct >= 80 ? 'Excellent'
    : pct >= 60 ? 'Good'
    : pct >= 40 ? 'Fair'
    : pct >= 20 ? 'Limited'
    : 'Minimal';

  const ratingColor =
    pct >= 80 ? 'text-green-600'
    : pct >= 60 ? 'text-blue-600'
    : pct >= 40 ? 'text-amber-600'
    : pct >= 20 ? 'text-orange-600'
    : 'text-red-600';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <div>
            <span className="font-medium text-gray-700">{label}</span>
            {note && <p className="text-xs text-gray-400">{note}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${ratingColor}`}>{rating}</span>
          <span className="text-lg font-bold text-gray-800">{pct}</span>
        </div>
      </div>
      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function computeScore(count: number, maxExpected: number): number {
  if (count === 0) return 0;
  return Math.min(Math.round((Math.log(count + 1) / Math.log(maxExpected + 1)) * 100), 100);
}

interface OverallBadgeProps {
  score: number;
}

function OverallBadge({ score }: OverallBadgeProps) {
  const { label, color, bg, border, emoji } =
    score >= 80
      ? { label: 'Excellent Neighborhood', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', emoji: '⭐' }
      : score >= 60
      ? { label: 'Great Neighborhood', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', emoji: '👍' }
      : score >= 40
      ? { label: 'Decent Neighborhood', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', emoji: '🏠' }
      : score >= 20
      ? { label: 'Developing Area', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', emoji: '🌱' }
      : { label: 'Rural / Sparse Area', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', emoji: '🌾' };

  return (
    <div className={`rounded-2xl border-2 ${bg} ${border} p-6 text-center`}>
      <div className="text-4xl mb-2">{emoji}</div>
      <div className="text-4xl font-bold text-gray-800 mb-1">{score}</div>
      <div className="text-sm text-gray-500 mb-2">out of 100</div>
      <div className={`text-lg font-semibold ${color}`}>{label}</div>
    </div>
  );
}

export default function AreaStats({ dining, shopping, attractions, parks, schools, safety, city, state }: AreaStatsProps) {
  const diningScore = computeScore(dining.length, 20);
  const shoppingScore = computeScore(shopping.length, 20);
  const attractionScore = computeScore(attractions.length, 20);
  const parksScore = computeScore(parks.length, 20);
  const schoolsScore = computeScore(schools.length, 10);
  const safetyScore = computeScore(safety.length, 8);

  const walkabilityScore = Math.round(diningScore * 0.4 + shoppingScore * 0.4 + parksScore * 0.2);
  const familyScore = Math.round(parksScore * 0.35 + schoolsScore * 0.35 + attractionScore * 0.2 + diningScore * 0.1);
  const overallScore = Math.round((diningScore + shoppingScore + attractionScore + parksScore + schoolsScore) / 5);

  const totalPlaces = dining.length + shopping.length + attractions.length + parks.length + schools.length + safety.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <OverallBadge score={overallScore} />
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-3 text-center">
            <div className="text-2xl">🍽️</div>
            <div className="text-xl font-bold text-orange-700">{dining.length}</div>
            <div className="text-xs text-orange-600">Dining</div>
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-center">
            <div className="text-2xl">🛒</div>
            <div className="text-xl font-bold text-rose-700">{shopping.length}</div>
            <div className="text-xs text-rose-600">Shops</div>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-center">
            <div className="text-2xl">🌳</div>
            <div className="text-xl font-bold text-green-700">{parks.length}</div>
            <div className="text-xs text-green-600">Parks</div>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-center">
            <div className="text-2xl">🏫</div>
            <div className="text-xl font-bold text-blue-700">{schools.length}</div>
            <div className="text-xs text-blue-600">Schools</div>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
            <div className="text-2xl">🚑</div>
            <div className="text-xl font-bold text-red-700">{safety.length}</div>
            <div className="text-xs text-red-600">Safety</div>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 text-center">
            <div className="text-2xl">🎭</div>
            <div className="text-xl font-bold text-purple-700">{attractions.length}</div>
            <div className="text-xs text-purple-600">Fun</div>
          </div>
        </div>
      </div>

      {/* Score Bars */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span>📈</span> What the Numbers Mean
        </h3>
        <div className="space-y-3">
          <ScoreBar label="Dining Scene" score={diningScore} emoji="🍽️" color="bg-orange-500" note={`${dining.length} restaurants & cafes found`} />
          <ScoreBar label="Shopping Access" score={shoppingScore} emoji="🛒" color="bg-rose-500" note={`${shopping.length} stores found`} />
          <ScoreBar label="Parks & Outdoors" score={parksScore} emoji="🌳" color="bg-green-500" note={`${parks.length} parks & green spaces found`} />
          <ScoreBar label="Schools Nearby" score={schoolsScore} emoji="🏫" color="bg-blue-500" note={`${schools.length} schools & libraries found`} />
          <ScoreBar label="Safety Infrastructure" score={safetyScore} emoji="🚑" color="bg-red-400" note={`${safety.length} hospitals, police & fire stations`} />
          <ScoreBar label="Attractions & Fun" score={attractionScore} emoji="🎭" color="bg-purple-500" note={`${attractions.length} museums, parks & venues found`} />
          <ScoreBar label="Walkability" score={walkabilityScore} emoji="🚶" color="bg-sky-500" note="Based on dining, shopping & parks density" />
          <ScoreBar label="Family Friendliness" score={familyScore} emoji="👨‍👩‍👧‍👦" color="bg-teal-500" note="Based on parks, schools & attractions" />
        </div>
      </div>

      {/* Context Note */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <h4 className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
          <span>💡</span> About These Scores
        </h4>
        <p className="text-sm text-amber-700 leading-relaxed">
          Scores are based on {totalPlaces} places found within about 1.2 miles
          {city && state ? ` of ${city}, ${state}` : ''} using OpenStreetMap data.
          A lower score doesn&apos;t mean bad — it often just means a quieter, more suburban area.
          Data availability varies by region.
        </p>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Data sourced from OpenStreetMap via Overpass API
      </p>
    </div>
  );
}
