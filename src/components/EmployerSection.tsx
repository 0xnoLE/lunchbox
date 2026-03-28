import { EmployerData } from '@/lib/employers';

interface EmployerSectionProps {
  data: EmployerData | null;
  error?: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

const BAR_COLORS = [
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-teal-500',
];

export default function EmployerSection({ data, error }: EmployerSectionProps) {
  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <div className="text-3xl mb-2">⚠️</div>
        <p className="text-red-700 font-medium">Unable to load employment data</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-center">
        <div className="text-3xl mb-2">📊</div>
        <p className="text-amber-700 font-medium">Employment data not available</p>
        <p className="text-amber-500 text-sm mt-1">
          Census data may not be available for this area. Try searching by ZIP code for better results.
        </p>
      </div>
    );
  }

  const maxEmployees = Math.max(...data.sectors.map((s) => s.employees), 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">{formatNumber(data.totalEmployees)}</div>
          <div className="text-sm text-blue-600 mt-1">Total Employees</div>
        </div>
        <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 text-center">
          <div className="text-3xl font-bold text-indigo-700">{formatNumber(data.totalEstablishments)}</div>
          <div className="text-sm text-indigo-600 mt-1">Businesses</div>
        </div>
        <div className="rounded-xl bg-violet-50 border border-violet-200 p-4 text-center col-span-2 sm:col-span-1">
          <div className="text-3xl font-bold text-violet-700">{data.sectors.length}</div>
          <div className="text-sm text-violet-600 mt-1">Industry Sectors</div>
        </div>
      </div>

      {/* Industry Breakdown */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span>📊</span>
          Top Industries by Employment
        </h3>
        <div className="space-y-3">
          {data.sectors.map((sector, idx) => {
            const pct = Math.round((sector.employees / maxEmployees) * 100);
            const barColor = BAR_COLORS[idx % BAR_COLORS.length];

            return (
              <div key={sector.naicsCode} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sector.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{sector.label}</p>
                      <p className="text-xs text-gray-500">
                        {formatNumber(sector.establishments)} establishments
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatNumber(sector.employees)}</p>
                    <p className="text-xs text-gray-500">employees</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Data source: US Census Bureau County Business Patterns (2021)
      </p>
    </div>
  );
}
