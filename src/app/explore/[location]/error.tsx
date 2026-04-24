'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ExploreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🗺️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Couldn&apos;t load this neighborhood</h1>
        <p className="text-gray-600 mb-2">
          One of our data sources didn&apos;t respond in time. This is usually temporary.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Try searching for a nearby major city or use a specific ZIP code.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-xl border-2 border-amber-300 px-6 py-3 font-semibold text-amber-700 hover:bg-amber-100 transition-all"
          >
            New Search
          </Link>
        </div>
      </div>
    </div>
  );
}
