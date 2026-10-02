import { useEffect, useState, useCallback } from "react";
import {
  getNetWorth,
  getNetWorthBreakdown,
  getNetWorthHistory,
  createNetWorthSnapshot,
} from "../services/netWorthApi.js";
import Navbar from "../components/Navbar.jsx";
import NetWorthCard from "../components/networth/NetWorthCard.jsx";
import NetWorthBreakdown from "../components/networth/NetWorthBreakdown.jsx";
import NetWorthChart from "../components/networth/NetWorthChart.jsx";
import { RefreshCw, CheckCircle2, Lightbulb } from "lucide-react";

const NetWorth = () => {
  const [netWorth, setNetWorth] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [netWorthData, breakdownData, historyData] = await Promise.all([
        getNetWorth(),
        getNetWorthBreakdown(),
        getNetWorthHistory(12).catch(() => []),
      ]);

      setNetWorth(netWorthData);
      setBreakdown(breakdownData);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      setError(err.message || "Failed to load net worth data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateSnapshot = async () => {
    try {
      setSnapshotLoading(true);
      await createNetWorthSnapshot();
      setToastMessage("Snapshot successfully recorded!");
      setTimeout(() => setToastMessage(""), 4000);
      await loadData();
    } catch (err) {
      alert(err.message || "Failed to record snapshot.");
    } finally {
      setSnapshotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-950 dark:bg-[#070b14] dark:text-white sm:px-6 lg:px-8">
      <Navbar />

      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Net Worth Monitor
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track your complete assets, liabilities, solvency ratio, and wealth trajectory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* TOAST MESSAGE */}
        {toastMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-500">
            <CheckCircle2 size={18} />
            {toastMessage}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            Analyzing net worth metrics...
          </div>
        ) : (
          <div className="space-y-8">
            {/* NET WORTH CARD */}
            <NetWorthCard
              data={netWorth}
              onSnapshot={handleCreateSnapshot}
              snapshotLoading={snapshotLoading}
            />

            {/* FINANCIAL ADVICE BOX */}
            <div className="flex items-start gap-4 rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6 backdrop-blur-xl dark:border-violet-400/20 dark:bg-violet-500/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white">
                <Lightbulb size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Wealth Growth Insights & Tip
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {netWorth?.totalLiabilities > 0
                    ? `Your current debt ratio stands at ${Math.round(
                        (netWorth.totalLiabilities / (netWorth.totalAssets || 1)) * 100
                      )}%. Allocating extra surplus to high-interest loans will improve your solvency ratio faster.`
                    : "Excellent solvency position with zero liabilities recorded. Consider reinvesting liquidity into long-term wealth funds to outpace inflation."}
                </p>
              </div>
            </div>

            {/* BREAKDOWN */}
            <NetWorthBreakdown data={breakdown} />

            {/* HISTORY CHART */}
            <NetWorthChart history={history} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NetWorth;