import { Place } from '@/lib/places';

const SCHOOL_ICONS: Record<string, string> = {
  school: '🏫',
  college: '🎓',
  university: '🏛️',
  kindergarten: '🧸',
  library: '📚',
};

const SCHOOL_LABELS: Record<string, string> = {
  school: 'K–12 School',
  college: 'College',
  university: 'University',
  kindergarten: 'Preschool / Kindergarten',
  library: 'Public Library',
};

const SCHOOL_COLORS: Record<string, string> = {
  school: 'bg-blue-50 border-blue-200 hover:border-blue-300',
  college: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
  university: 'bg-violet-50 border-violet-200 hover:border-violet-300',
  kindergarten: 'bg-pink-50 border-pink-200 hover:border-pink-300',
  library: 'bg-teal-50 border-teal-200 hover:border-teal-300',
};

const ICON_BG: Record<string, string> = {
  school: 'bg-blue-100',
  college: 'bg-indigo-100',
  university: 'bg-violet-100',
  kindergarten: 'bg-pink-100',
  library: 'bg-teal-100',
};

interface SchoolCardProps {
  place: Place;
}

export default function SchoolCard({ place }: SchoolCardProps) {
  const sub = place.subcategory;
  const icon = SCHOOL_ICONS[sub] ?? '🏫';
  const label = SCHOOL_LABELS[sub] ?? 'School';
  const cardColor = SCHOOL_COLORS[sub] ?? 'bg-blue-50 border-blue-200';
  const iconBg = ICON_BG[sub] ?? 'bg-blue-100';

  const grades = place.tags['grades'] || place.tags['school:grades'];
  const operator = place.tags['operator'];
  const phone = place.tags['phone'] || place.tags['contact:phone'];
  const website = place.tags['website'] || place.tags['contact:website'];

  return (
    <div className={`rounded-xl border-2 p-4 transition-all hover:shadow-md ${cardColor}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg text-xl ${iconBg}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate" title={place.name}>
            {place.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {place.address !== 'Address not available' && (
          <div className="flex items-start gap-1.5 text-xs text-gray-600">
            <span className="mt-0.5 flex-shrink-0">📍</span>
            <span className="leading-relaxed">{place.address}</span>
          </div>
        )}
        {grades && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>📖</span>
            <span>Grades: {grades}</span>
          </div>
        )}
        {operator && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>🏢</span>
            <span className="truncate">{operator}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>📞</span>
            <a href={`tel:${phone}`} className="text-blue-600 hover:underline truncate">
              {phone}
            </a>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>🌐</span>
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              {website.replace(/^https?:\/\//, '').split('/')[0]}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
