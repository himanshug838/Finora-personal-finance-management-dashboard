import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getInvestments, createInvestment, deleteInvestment } from "../services/investmentsApi.js";

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    assetType: "stocks",
    quantity: "",
    buyPrice: "",
    currentPrice: "",
  });

  const loadInvestments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getInvestments();
      setInvestments(data);
    } catch (err) {
      setError(err.message || "Failed to load investments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInvestment({
        ...formData,
        investmentType: formData.assetType,
        quantity: Number(formData.quantity) || 1,
        buyPrice: Number(formData.buyPrice) || 0,
        currentPrice: Number(formData.currentPrice) || Number(formData.buyPrice) || 0,
      });
      setShowModal(false);
      setFormData({
        name: "",
        symbol: "",
        assetType: "stocks",
        quantity: "",
        buyPrice: "",
        currentPrice: "",
      });
      loadInvestments();
    } catch (err) {
      alert(err.message || "Failed to add investment.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this investment holding?")) {
      try {
        await deleteInvestment(id);
        loadInvestments();
      } catch (err) {
        alert(err.message || "Failed to delete investment.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-950 dark:bg-[#070b14] dark:text-white sm:px-6 lg:px-8">
      <Navbar />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Investments</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track your portfolio holdings, asset allocation, and market performance.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700"
          >
            + Add Holding
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading investments...</div>
        ) : investments.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-12 text-center dark:border-white/10 dark:bg-white/5">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">No investment holdings found.</p>
            <p className="mt-1 text-sm text-slate-400">Add your stocks, mutual funds, or crypto assets to track performance.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {investments.map((inv) => (
              <div
                key={inv._id}
                className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase text-cyan-500">
                    {inv.assetType}
                  </span>
                  <button
                    onClick={() => handleDelete(inv._id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>

                <h3 className="mt-4 text-xl font-bold">{inv.name}</h3>
                {inv.symbol && <p className="text-xs font-semibold text-slate-400">{inv.symbol}</p>}

                <div className="mt-6 flex justify-between border-t border-slate-100 pt-4 dark:border-white/5">
                  <div>
                    <p className="text-xs text-slate-400">Invested</p>
                    <p className="text-lg font-bold">₹{(inv.investedAmount || (inv.quantity * inv.buyPrice) || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Current Value</p>
                    <p className="text-lg font-bold text-emerald-500">₹{(inv.currentValue || (inv.quantity * inv.currentPrice) || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-bold">Add Investment Holding</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Asset Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nifty 50 Index Fund"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Ticker Symbol (Optional)</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="e.g. NIFTY50"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Asset Type</label>
                <select
                  value={formData.assetType}
                  onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                >
                  <option value="stocks">Stocks</option>
                  <option value="mutual_funds">Mutual Funds</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="bonds">Bonds</option>
                  <option value="real_estate">Real Estate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="1"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Buy Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    placeholder="1000"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Save Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
