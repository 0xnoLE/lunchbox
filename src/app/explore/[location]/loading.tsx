export default function Loading() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 rounded-full bg-white/30" />
            <div className="h-8 w-64 rounded-lg bg-white/30" />
            <div className="h-5 w-48 rounded-full bg-white/20" />
          </div>
          <p className="mt-4 text-amber-100 text-sm animate-pulse">
            🔍 Looking up restaurants, parks, shops, and jobs nearby...
          </p>
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse h-12 w-full max-w-xl rounded-2xl bg-gray-200" />
        </div>
      </div>

      {/* Tab Bar Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-6 py-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 w-28 rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-48 rounded bg-gray-200 mb-6" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl border-2 border-gray-200 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
