'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'next/navigation';

const features = [
  {
    emoji: '🍽️',
    title: 'Dining & Cafes',
    description: 'Restaurants, coffee shops, bars, and local eateries near you.',
    color: 'bg-orange-100 border-orange-200',
    iconBg: 'bg-orange-200',
  },
  {
    emoji: '🛍️',
    title: 'Shopping',
    description: 'Supermarkets, malls, boutiques, and everyday convenience stores.',
    color: 'bg-rose-100 border-rose-200',
    iconBg: 'bg-rose-200',
  },
  {
    emoji: '🎭',
    title: 'Attractions',
    description: 'Museums, parks, galleries, and must-see local landmarks.',
    color: 'bg-purple-100 border-purple-200',
    iconBg: 'bg-purple-200',
  },
  {
    emoji: '💼',
    title: 'Jobs & Employers',
    description: 'Major industries and employment opportunities in the area.',
    color: 'bg-blue-100 border-blue-200',
    iconBg: 'bg-blue-200',
  },
];

export default function Home() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(stored);
    } catch {
      // ignore
    }
  }, []);

  const handleRecentClick = (search: string) => {
    const encoded = encodeURIComponent(search);
    router.push(`/explore/${encoded}`);
  };

  const clearRecent = () => {
    try {
      localStorage.removeItem('recentSearches');
      setRecentSearches([]);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-4 py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-white blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <span>🏘️</span>
            <span>Neighborhood Discovery Platform</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Find Your Perfect
            <br />
            <span className="text-amber-200">Neighborhood</span>
          </h1>
          <p className="mb-10 text-lg text-amber-100 sm:text-xl">
            Search any ZIP code or city to explore dining, shopping, attractions,
            and discover if it&apos;s the right place for you.
          </p>
          <div className="mx-auto max-w-2xl">
            <SearchBar large />
          </div>
        </div>
      </section>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <section className="bg-white px-4 py-6 shadow-sm">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Recent Searches
              </h2>
              <button
                onClick={clearRecent}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRecentClick(search)}
                  className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-100 transition-colors"
                >
                  <span>🕐</span>
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feature Highlights */}
      <section className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-800">
              Everything You Need to Know
            </h2>
            <p className="text-gray-500 text-lg">
              Get a complete picture of any neighborhood before you visit or move.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-2xl border-2 p-6 transition-shadow hover:shadow-md ${feature.color}`}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${feature.iconBg}`}>
                  {feature.emoji}
                </div>
                <h3 className="mb-2 font-bold text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Section */}
      <section className="bg-gradient-to-r from-green-50 to-teal-50 px-4 py-14 border-t border-green-100">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 text-5xl">👨‍👩‍👧‍👦</div>
          <h2 className="mb-3 text-2xl font-bold text-gray-800">Is It Family-Friendly?</h2>
          <p className="mb-6 text-gray-600 max-w-xl mx-auto">
            Our Area Stats tab scores neighborhoods based on parks, schools, and safety
            indicators — helping families make confident decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['🌳 Parks & Playgrounds', '🏫 Schools Nearby', '🛡️ Safety Score', '🚶 Walkability'].map((item) => (
              <span key={item} className="rounded-full bg-white border border-green-200 px-4 py-2 text-sm font-medium text-green-800 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 px-4 py-8 text-center text-gray-400 text-sm">
        <p>
          Powered by{' '}
          <a href="https://nominatim.openstreetmap.org/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">
            Nominatim
          </a>
          {', '}
          <a href="https://overpass-api.de/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">
            Overpass API
          </a>
          {', and '}
          <a href="https://www.census.gov/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">
            US Census Bureau
          </a>
          {' · Open data, no API keys required'}
        </p>
      </footer>
    </div>
  );
}
