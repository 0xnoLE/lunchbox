import { Place } from '@/lib/places';
import { EmployerData } from '@/lib/employers';

interface NeighborhoodSummaryProps {
  city: string;
  state: string;
  dining: Place[];
  shopping: Place[];
  attractions: Place[];
  parks: Place[];
  employers: EmployerData | null;
}

function getVerdict(score: number): { emoji: string; headline: string; color: string; bg: string; border: string } {
  if (score >= 75) return { emoji: '🏆', headline: 'Looks like a great place to live!', color: 'text-green-800', bg: 'bg-green-50', border: 'border-green-300' };
  if (score >= 55) return { emoji: '👍', headline: 'A solid neighborhood worth exploring.', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-300' };
  if (score >= 35) return { emoji: '🏠', headline: 'A quiet area — great if you prefer less hustle.', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-300' };
  return { emoji: '🌾', headline: 'Rural or developing area — fewer amenities nearby.', color: 'text-gray-800', bg: 'bg-gray-50', border: 'border-gray-300' };
}

function computeOverall(dining: number, shopping: number, attractions: number, parks: number): number {
  const score = (count: number) => Math.min(Math.round((Math.log(count + 1) / Math.log(21)) * 100), 100);
  return Math.round((score(dining) + score(shopping) + score(attractions) + score(parks)) / 4);
}

export default function NeighborhoodSummary({
  city, state, dining, shopping, attractions, parks, employers,
}: NeighborhoodSummaryProps) {
  const overall = computeOverall(dining.length, shopping.length, attractions.length, parks.length);
  const verdict = getVerdict(overall);
  const locationName = [city, state].filter(Boolean).join(', ');

  const highlights: string[] = [];
  if (dining.length > 0) highlights.push(`${dining.length} place${dining.length !== 1 ? 's' : ''} to eat`);
  if (shopping.length > 0) highlights.push(`${shopping.length} shop${shopping.length !== 1 ? 's' : ''}`);
  if (parks.length > 0) highlights.push(`${parks.length} park${parks.length !== 1 ? 's' : ''} & green space${parks.length !== 1 ? 's' : ''}`);
  if (attractions.length > 0) highlights.push(`${attractions.length} attraction${attractions.length !== 1 ? 's' : ''}`);

  const topIndustry = employers?.sectors?.[0];

  return (
    <div className={`rounded-2xl border-2 p-5 ${verdict.bg} ${verdict.border}`}>
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{verdict.emoji}</div>
        <div className="flex-1">
          <h2 className={`text-xl font-bold ${verdict.color} mb-1`}>
            {verdict.headline}
          </h2>
          {locationName && (
            <p className="text-sm text-gray-600 mb-3">
              Here&apos;s what we found within about a mile of <strong>{locationName}</strong>:
            </p>
          )}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {highlights.map((h) => (
                <span key={h} className="rounded-full bg-white/70 border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                  {h}
                </span>
              ))}
            </div>
          )}
          {topIndustry && (
            <p className="text-sm text-gray-600">
              <span className="mr-1">{topIndustry.emoji}</span>
              Biggest local employer sector: <strong>{topIndustry.label}</strong> ({topIndustry.employees.toLocaleString()} employees)
            </p>
          )}
          {highlights.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              Not much data found — this may be a rural area or OpenStreetMap coverage may be limited here.
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-center hidden sm:block">
          <div className="text-3xl font-bold text-gray-800">{overall}</div>
          <div className="text-xs text-gray-500">out of 100</div>
        </div>
      </div>
    </div>
  );
}
