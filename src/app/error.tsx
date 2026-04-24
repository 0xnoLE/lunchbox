'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
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
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We hit a snag loading this page. It&apos;s usually a temporary glitch — try again or head back home.
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
            Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}
