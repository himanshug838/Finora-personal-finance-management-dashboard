import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar.jsx";
import CustomSelect from "../components/CustomSelect.jsx";
import {
  getBudgets,
  getBudgetProgress,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../services/budgetApi.js";

const CATEGORY_LIST = [
  { value: "food", label: "Food & Dining" },
  { value: "shopping", label: "Shopping" },
  { value: "travel", label: "Travel & Fuel" },
  { value: "bills", label: "Bills & Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health & Medical" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other / General" },
];

const CATEGORY_ICONS = {
  food: "🍔",
  shopping: "🛍️",
  travel: "✈️",
  bills: "💡",
  entertainment: "🎬",
  health: "🏥",
  education: "🎓",
  other: "📦",
};

const getCategoryIcon = (cat) => {
  if (!cat) return "📦";
  const key = String(cat).toLowerCase();
  return CATEGORY_ICONS[key] || "🏷️";
};

const getDefaultDates = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];
  return { start, end };
};

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const { start: defaultStart, end: defaultEnd } = getDefaultDates();

  const [formData, setFormData] = useState({
    category: "food",
    amount: "",
    period: "monthly",
    startDate: defaultStart,
    endDate: defaultEnd,
    description: "",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const bData = await getBudgets();
      const list = Array.isArray(bData) ? bData : [];
      setBudgets(list);

      // Fetch progress for each budget
      const pMap = {};
      await Promise.all(
        list.map(async (b) => {
          try {
            const p = await getBudgetProgress(b._id);
            pMap[b._id] = p;
          } catch {
            pMap[b._id] = { spent: 0, percentage: 0 };
          }
        })
      );
      setProgressMap(pMap);
    } catch (err) {
      setError(err.message || "Failed to load budget data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    const dates = getDefaultDates();
    setEditingBudget(null);
    setFormData({
      category: "food",
      amount: "",
      period: "monthly",
      startDate: dates.start,
      endDate: dates.end,
      description: "",
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category || "food",
      amount: budget.amount || "",
      period: budget.period || "monthly",
      startDate: budget.startDate
        ? new Date(budget.startDate).toISOString().split("T")[0]
        : defaultStart,
      endDate: budget.endDate
        ? new Date(budget.endDate).toISOString().split("T")[0]
        : defaultEnd,
      description: budget.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await updateBudget(editingBudget._id, {
          ...formData,
          amount: Number(formData.amount) || 0,
        });
      } else {
        await createBudget({
          ...formData,
          amount: Number(formData.amount) || 0,
        });
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      alert(err.message || "Failed to save budget.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this budget limit?")) {
      try {
        await deleteBudget(id);
        loadData();
      } catch (err) {
        alert(err.message || "Failed to delete budget.");
      }
    }
  };

  // Calculations
  const totalLimit = budgets.reduce(
    (sum, b) => sum + (Number(b.amount) || 0),
    0
  );

  const totalSpent = budgets.reduce((sum, b) => {
    const prog = progressMap[b._id];
    return sum + (Number(prog?.totalSpent || prog?.spent || 0) || 0);
  }, 0);

  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const overallPercentage =
    totalLimit > 0 ? Math.min(100, Math.round((totalSpent / totalLimit) * 100)) : 0;

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-950 dark:bg-[#070b14] dark:text-white sm:px-6 lg:px-8">
      <Navbar />

      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Monthly Budgets
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Set and track monthly spending limits across categories to stay on top of your finances.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700"
          >
            + Set New Budget Limit
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* OVERVIEW SUMMARY CARDS */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Budget Limit
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              ₹{totalLimit.toLocaleString("en-IN")}
            </h3>
            <p className="mt-1 text-xs text-slate-500">Across {budgets.length} categories</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Spent
            </p>
            <h3 className="mt-2 text-2xl font-bold text-violet-600 dark:text-violet-400">
              ₹{totalSpent.toLocaleString("en-IN")}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{overallPercentage}% of total limit</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Remaining Budget
            </p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-500">
              ₹{totalRemaining.toLocaleString("en-IN")}
            </h3>
            <p className="mt-1 text-xs text-slate-500">Available to spend</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Overall Status
            </p>
            <div className="mt-3">
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    overallPercentage > 90
                      ? "bg-red-500"
                      : overallPercentage > 75
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, overallPercentage)}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {overallPercentage >= 100
                  ? "⚠️ Budget Limit Reached!"
                  : `${overallPercentage}% spent this month`}
              </p>
            </div>
          </div>
        </div>

        {/* BUDGET CARDS GRID */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-12 text-center dark:border-white/10 dark:bg-white/5">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No category budgets set.
            </p>
            <p className="mt-1 text-sm text-slate-400 mb-6">
              Create monthly spending limits to prevent overspending and manage your goals.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700"
            >
              + Create First Budget Limit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {budgets.map((b) => {
              const prog = progressMap[b._id] || {};
              const spent = Number(prog.totalSpent || prog.spent || 0);
              const limit = Number(b.amount) || 1;
              const pct = Math.round((spent / limit) * 100);
              const remaining = Math.max(0, limit - spent);
              const isExceeded = spent > limit;

              let barColor = "bg-emerald-500";
              let badgeColor = "bg-emerald-500/10 text-emerald-500";
              if (pct > 90 || isExceeded) {
                barColor = "bg-red-500";
                badgeColor = "bg-red-500/10 text-red-500";
              } else if (pct > 75) {
                barColor = "bg-amber-500";
                badgeColor = "bg-amber-500/10 text-amber-500";
              }

              return (
                <div
                  key={b._id}
                  className="relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800">
                          {getCategoryIcon(b.category)}
                        </span>
                        <div>
                          <h3 className="font-bold capitalize text-slate-900 dark:text-white">
                            {b.category}
                          </h3>
                          <p className="text-xs text-slate-400 capitalize">{b.period} limit</p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeColor}`}
                      >
                        {isExceeded ? "Exceeded!" : `${pct}%`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-500 dark:text-slate-400">
                          Spent: ₹{spent.toLocaleString("en-IN")}
                        </span>
                        <span className="text-slate-700 dark:text-slate-200">
                          Limit: ₹{limit.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {isExceeded
                          ? `Over budget by ₹${(spent - limit).toLocaleString("en-IN")}`
                          : `₹${remaining.toLocaleString("en-IN")} left`}
                      </span>
                      {b.description && (
                        <span className="truncate max-w-[150px] text-slate-400 italic">
                          {b.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-white/5">
                    <button
                      onClick={() => handleOpenEditModal(b)}
                      className="text-xs font-semibold text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="text-xs font-semibold text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm pt-8 sm:pt-14 pb-48">
          <div className="relative my-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-bold">
              {editingBudget ? "Edit Budget Limit" : "Set New Budget Limit"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 pb-8">
              <CustomSelect
                label="Category"
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                options={CATEGORY_LIST}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Monthly Limit Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 10000"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Max monthly limit for dining out"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-xl px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  {editingBudget ? "Update Budget" : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
