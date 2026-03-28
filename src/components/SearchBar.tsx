'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialValue?: string;
  large?: boolean;
}

function isZipCode(value: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(value.trim());
}

export default function SearchBar({ initialValue = '', large = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);

    // Store in recent searches
    try {
      const recent: string[] = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updated = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
      // ignore localStorage errors
    }

    const encoded = encodeURIComponent(trimmed);
    router.push(`/explore/${encoded}`);
  };

  const placeholder = isZipCode(query)
    ? 'ZIP code detected ✓'
    : 'Enter ZIP code or city name (e.g. "90210" or "Austin TX")';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative flex items-center ${large ? 'shadow-xl' : 'shadow-md'}`}>
        <div className="absolute left-4 text-amber-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${large ? 'h-6 w-6' : 'h-5 w-5'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={large ? 'Enter ZIP code or city name...' : 'Search another location...'}
          className={`w-full rounded-2xl border-2 border-amber-200 bg-white pl-12 pr-36 text-gray-800 placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 ${
            large ? 'py-5 text-lg' : 'py-3 text-base'
          }`}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className={`absolute right-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-white transition-all hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 ${
            large ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Searching...
            </span>
          ) : (
            'Discover'
          )}
        </button>
      </div>
      {large && (
        <p className="mt-3 text-center text-sm text-amber-100">
          {isZipCode(query) ? '📍 ZIP code detected' : '🏙️ Try "90210", "Austin TX", or "Brooklyn NY"'}
        </p>
      )}
    </form>
  );
}
