import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🏠</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
        <p className="text-gray-600 mb-6">
          This page doesn&apos;t exist. Head back to search for a neighborhood.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white hover:from-amber-600 hover:to-orange-600 transition-all"
        >
          Back to Search
        </Link>
      </div>
    </div>
  );
}
