import { Place } from '@/lib/places';

const CATEGORY_ICONS: Record<string, string> = {
  restaurant: '🍽️',
  cafe: '☕',
  fast_food: '🍔',
  bar: '🍺',
  pub: '🍻',
  food_court: '🥡',
  supermarket: '🛒',
  mall: '🏬',
  clothes: '👗',
  electronics: '📱',
  department_store: '🏪',
  convenience: '🏪',
  attraction: '⭐',
  museum: '🏛️',
  theme_park: '🎡',
  zoo: '🦁',
  aquarium: '🐠',
  gallery: '🖼️',
  viewpoint: '🔭',
  park: '🌳',
  nature_reserve: '🌿',
  garden: '🌸',
  playground: '🛝',
};

const CATEGORY_COLORS: Record<string, string> = {
  dining: 'bg-orange-50 border-orange-200 hover:border-orange-300',
  shopping: 'bg-rose-50 border-rose-200 hover:border-rose-300',
  attractions: 'bg-purple-50 border-purple-200 hover:border-purple-300',
  parks: 'bg-green-50 border-green-200 hover:border-green-300',
};

const ICON_BG_COLORS: Record<string, string> = {
  dining: 'bg-orange-100',
  shopping: 'bg-rose-100',
  attractions: 'bg-purple-100',
  parks: 'bg-green-100',
};

interface PlaceCardProps {
  place: Place;
}

function formatSubcategory(sub: string): string {
  return sub.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const icon = CATEGORY_ICONS[place.subcategory] || CATEGORY_ICONS[place.category] || '📍';
  const cardColor = CATEGORY_COLORS[place.category] || 'bg-gray-50 border-gray-200 hover:border-gray-300';
  const iconBg = ICON_BG_COLORS[place.category] || 'bg-gray-100';

  const website = place.tags?.website || place.tags?.['contact:website'];
  const phone = place.tags?.phone || place.tags?.['contact:phone'];
  const openingHours = place.tags?.opening_hours;

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
          <p className="text-xs text-gray-500 mt-0.5">{formatSubcategory(place.subcategory)}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {place.address !== 'Address not available' && (
          <div className="flex items-start gap-1.5 text-xs text-gray-600">
            <span className="mt-0.5 flex-shrink-0">📍</span>
            <span className="leading-relaxed">{place.address}</span>
          </div>
        )}
        {openingHours && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>🕐</span>
            <span className="truncate">{openingHours}</span>
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
