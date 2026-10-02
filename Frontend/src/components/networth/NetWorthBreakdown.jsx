import {
  Building2,
  Banknote,
  CreditCard,
  Landmark,
  TrendingUp,
  PieChart as PieIcon,
  ShieldAlert,
} from "lucide-react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const NetWorthBreakdown = ({ data }) => {
  if (!data) return null;

  const { accounts = {}, investments = {} } = data;

  const totalInvestments = Object.values(investments).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

  const items = [
    {
      name: "Bank Accounts",
      value: accounts.bank || 0,
      icon: Building2,
      type: "asset",
      categoryKey: "bank",
    },
    {
      name: "Cash Wallets",
      value: accounts.cash || 0,
      icon: Banknote,
      type: "asset",
      categoryKey: "cash",
    },
    {
      name: "Investments Portfolio",
      value: totalInvestments,
      icon: TrendingUp,
      type: "asset",
      categoryKey: "investments",
    },
    {
      name: "Credit Cards",
      value: accounts.creditCards || 0,
      icon: CreditCard,
      type: "liability",
      categoryKey: "credit",
    },
    {
      name: "Loans & Mortgages",
      value: accounts.loans || 0,
      icon: Landmark,
      type: "liability",
      categoryKey: "loans",
    },
  ];

  const totalAssetsVal = items
    .filter((i) => i.type === "asset")
    .reduce((sum, i) => sum + i.value, 0);

  const totalLiabilitiesVal = items
    .filter((i) => i.type === "liability")
    .reduce((sum, i) => sum + i.value, 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ASSETS BREAKDOWN CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <PieIcon size={20} className="text-emerald-500" />
              Assets Distribution
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Total Assets: <span className="font-bold text-emerald-500">{formatCurrency(totalAssetsVal)}</span>
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
            Assets
          </span>
        </div>

        <div className="space-y-4">
          {items
            .filter((item) => item.type === "asset")
            .map((item) => {
              const Icon = item.icon;
              const pct = totalAssetsVal > 0 ? Math.round((item.value / totalAssetsVal) * 100) : 0;

              return (
                <div
                  key={item.name}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Icon size={19} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400">{pct}% of total assets</p>
                      </div>
                    </div>
                    <p className="font-bold text-emerald-500">{formatCurrency(item.value)}</p>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* LIABILITIES BREAKDOWN CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <ShieldAlert size={20} className="text-red-500" />
              Liabilities Breakdown
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Total Liabilities: <span className="font-bold text-red-500">{formatCurrency(totalLiabilitiesVal)}</span>
            </p>
          </div>
          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500">
            Liabilities
          </span>
        </div>

        <div className="space-y-4">
          {items
            .filter((item) => item.type === "liability")
            .map((item) => {
              const Icon = item.icon;
              const pct = totalLiabilitiesVal > 0 ? Math.round((item.value / totalLiabilitiesVal) * 100) : 0;

              return (
                <div
                  key={item.name}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                        <Icon size={19} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400">{pct}% of total liabilities</p>
                      </div>
                    </div>
                    <p className="font-bold text-red-500">{formatCurrency(item.value)}</p>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default NetWorthBreakdown;