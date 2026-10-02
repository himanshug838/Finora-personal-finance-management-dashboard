import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Percent,
  Activity,
} from "lucide-react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const NetWorthCard = ({ data, onSnapshot, snapshotLoading }) => {
  if (!data) return null;

  const { netWorth = 0, totalAssets = 0, totalLiabilities = 0 } = data;

  const isPositive = netWorth >= 0;
  const assetRatio = totalAssets > 0 ? Math.round((netWorth / totalAssets) * 100) : 0;
  const debtRatio = totalAssets > 0 ? Math.round((totalLiabilities / totalAssets) * 100) : 0;

  // Determine Financial Health Grade
  let healthGrade = "Excellent";
  let healthColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  let healthDesc = "Low liability exposure and strong asset capitalization.";

  if (debtRatio > 50) {
    healthGrade = "High Debt Load";
    healthColor = "text-red-500 bg-red-500/10 border-red-500/20";
    healthDesc = "Liabilities exceed 50% of your assets. Focus on debt payoff.";
  } else if (debtRatio > 25) {
    healthGrade = "Moderate Health";
    healthColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
    healthDesc = "Healthy wealth position with manageable leverage.";
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Top Banner */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Wallet size={18} className="text-violet-500" />
            Total Net Worth
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {formatCurrency(netWorth)}
          </h2>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <TrendingUp size={18} className="text-emerald-500" />
              ) : (
                <TrendingDown size={18} className="text-red-500" />
              )}
              <span className={`text-sm font-bold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {isPositive ? "+ Positive Wealth Position" : "- Negative Wealth Position"}
              </span>
            </div>

            <span className="hidden text-slate-300 dark:text-slate-700 sm:inline">•</span>

            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${healthColor}`}>
              <ShieldCheck size={12} />
              {healthGrade}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {onSnapshot && (
          <button
            onClick={onSnapshot}
            disabled={snapshotLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-violet-700 disabled:opacity-50"
          >
            <Activity size={14} />
            {snapshotLoading ? "Logging..." : "📸 Log Snapshot"}
          </button>
        )}
      </div>

      {/* Assets vs Liabilities Metric Grid */}
      <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Total Assets</span>
            <ArrowUpRight size={14} />
          </div>
          <p className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalAssets)}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700/70 dark:text-emerald-300/70">
            Bank, Cash & Investments
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-red-600 dark:text-red-400">
            <span>Total Liabilities</span>
            <TrendingDown size={14} />
          </div>
          <p className="mt-2 text-xl font-black text-red-600 dark:text-red-400">
            {formatCurrency(totalLiabilities)}
          </p>
          <p className="mt-1 text-[11px] text-red-700/70 dark:text-red-300/70">
            Loans & Credit Cards
          </p>
        </div>

        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-violet-600 dark:text-violet-400">
            <span>Solvency Ratio</span>
            <Percent size={14} />
          </div>
          <p className="mt-2 text-xl font-black text-violet-600 dark:text-violet-400">
            {assetRatio}%
          </p>
          <p className="mt-1 text-[11px] text-violet-700/70 dark:text-violet-300/70">
            Net wealth of total assets
          </p>
        </div>
      </div>

      {/* Visual Asset/Liability Ratio Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs font-semibold mb-1.5">
          <span className="text-emerald-500">Assets ({100 - debtRatio}%)</span>
          <span className="text-red-400">Liabilities ({debtRatio}%)</span>
        </div>
        <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(5, 100 - debtRatio)}%` }}
          />
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${Math.min(95, debtRatio)}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-400 italic">{healthDesc}</p>
      </div>
    </div>
  );
};

export default NetWorthCard;