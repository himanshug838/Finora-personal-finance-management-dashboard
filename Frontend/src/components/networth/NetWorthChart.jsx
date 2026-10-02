import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/95">
        <p className="mb-2 font-bold text-slate-800 dark:text-slate-200">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className="text-xs font-semibold"
            style={{ color: entry.color || entry.fill }}
          >
            {entry.name}: ₹
            {Number(entry.value || 0).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const NetWorthChart = ({ history = [] }) => {
  const chartData = history.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    }),
    "Net Worth": Number(item.netWorth) || 0,
    Assets: Number(item.totalAssets) || 0,
    Liabilities: Number(item.totalLiabilities) || 0,
  }));

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Net Worth Growth Curve
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Historical trend showing total wealth trajectory over recorded snapshots
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-6 text-center text-slate-400">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">
            No historical net worth snapshots logged yet.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Click "📸 Log Snapshot" above to record your first wealth milestone.
          </p>
        </div>
      ) : (
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="assetsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="#94a3b8" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 15 }} />
              <Area
                type="monotone"
                dataKey="Assets"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#assetsGrad)"
              />
              <Area
                type="monotone"
                dataKey="Net Worth"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#netWorthGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default NetWorthChart;