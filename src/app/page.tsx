'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'next/navigation';

const features = [
  {
    emoji: '🍽️',
    title: 'Restaurants & Cafes',
    description: 'Find out how many places to eat and grab coffee are nearby.',
    color: 'bg-orange-50 border-orange-200',
    iconBg: 'bg-orange-100',
  },
  {
    emoji: '🛒',
    title: 'Grocery & Shopping',
    description: 'See supermarkets, pharmacies, and everyday stores close by.',
    color: 'bg-rose-50 border-rose-200',
    iconBg: 'bg-rose-100',
  },
  {
    emoji: '🌳',
    title: 'Parks & Playgrounds',
    description: 'Check for green spaces, playgrounds, and nature nearby — great for kids.',
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100',
  },
  {
    emoji: '💼',
    title: 'Jobs & Industries',
    description: 'See what kinds of jobs are in the area and how many people work there.',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
  },
];

const EXAMPLES = [
  { label: 'Austin, TX', query: 'Austin TX' },
  { label: 'Nashville, TN', query: 'Nashville TN' },
  { label: 'Raleigh, NC', query: 'Raleigh NC' },
  { label: 'Phoenix, AZ', query: 'Phoenix AZ' },
  { label: 'Denver, CO', query: 'Denver CO' },
];

const HOW_IT_WORKS = [
  { emoji: '🔍', title: 'Type a ZIP or City', desc: 'Enter any ZIP code like "30301" or a city name like "Charlotte NC".' },
  { emoji: '📊', title: 'We Look It Up', desc: 'We instantly pull restaurants, parks, shops, and job data for that area.' },
  { emoji: '✅', title: 'You Decide', desc: "See a plain-English summary and score to help you decide if it's the right fit." },
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

  const handleClick = (query: string) => {
    const encoded = encodeURIComponent(query);
    try {
      const recent: string[] = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updated = [query, ...recent.filter((r) => r !== query)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch { /* ignore */ }
    router.push(`/explore/${encoded}`);
  };

  const clearRecent = () => {
    try {
      localStorage.removeItem('recentSearches');
      setRecentSearches([]);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-4 pt-14 pb-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <span>🏘️</span>
            <span>Free Neighborhood Discovery Tool</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold leading-tight sm:text-5xl">
            Is This the Right Place
            <br />
            <span className="text-amber-200">for Your Family?</span>
          </h1>
          <p className="mb-8 text-lg text-amber-100 max-w-xl mx-auto">
            Type any ZIP code or city name. We&apos;ll show you nearby restaurants, parks, shops, and jobs — and give you a simple score.
          </p>
          <div className="mx-auto max-w-2xl">
            <SearchBar large />
          </div>
          {/* Example cities */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="text-amber-200 text-sm mr-1 self-center">Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.query}
                onClick={() => handleClick(ex.query)}
                className="rounded-full bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-1.5 text-sm text-white transition-colors backdrop-blur-sm"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <section className="bg-white px-4 py-5 shadow-sm border-b border-gray-100">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Your Recent Searches</h2>
              <button onClick={clearRecent} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleClick(search)}
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

      {/* How it works */}
      <section className="bg-white px-4 py-12 border-b border-gray-100">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.title} className="text-center px-4">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl">
                  {item.emoji}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">What You&apos;ll See</h2>
          <p className="text-center text-gray-500 mb-8">No technical jargon — just the info your family needs.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className={`rounded-2xl border-2 p-5 ${f.color}`}>
                <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${f.iconBg}`}>
                  {f.emoji}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Family callout */}
      <section className="bg-gradient-to-r from-green-50 to-teal-50 px-4 py-12 border-t border-green-100">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-5xl">👨‍👩‍👧‍👦</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Built for Families on the Move</h2>
          <p className="mb-6 text-gray-600 leading-relaxed">
            Whether your lease is ending, you got a new job, or you just drove through a neighborhood you loved —
            this tool helps you quickly figure out if an area is worth a closer look.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['🌳 Parks & Playgrounds', '🏫 Schools Nearby', '🛡️ Safety Indicators', '🚶 Walkability', '💰 Job Market'].map((item) => (
              <span key={item} className="rounded-full bg-white border border-green-200 px-4 py-2 text-sm font-medium text-green-800 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 px-4 py-8 text-center text-gray-400 text-sm">
        <p className="mb-1">Free to use · No account required · No data collected</p>
        <p>
          Powered by open data from{' '}
          <a href="https://nominatim.openstreetmap.org/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
          {' and '}
          <a href="https://www.census.gov/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">US Census Bureau</a>
        </p>
      </footer>
    </div>
  );
}
