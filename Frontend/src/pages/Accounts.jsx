import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getAccounts, createAccount, deleteAccount } from "../services/accountsApi.js";
import PlaidConnect from "../components/plaid/PlaidConnect.jsx";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    accountName: "",
    institutionName: "",
    accountType: "bank",
    balance: "",
    currency: "INR",
  });

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err.message || "Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setSubmitting(true);
    try {
      await createAccount({
        ...formData,
        balance: Number(formData.balance) || 0,
      });
      setShowModal(false);
      setFormData({
        accountName: "",
        institutionName: "",
        accountType: "bank",
        balance: "",
        currency: "INR",
      });
      loadAccounts();
    } catch (err) {
      setModalError(err.message || "Failed to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccount(id);
        loadAccounts();
      } catch (err) {
        alert(err.message || "Failed to delete account.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-950 dark:bg-[#070b14] dark:text-white sm:px-6 lg:px-8">
      <Navbar />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Accounts</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your manual and linked financial accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PlaidConnect onConnected={loadAccounts} />
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700"
            >
              + Add Manual Account
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-12 text-center dark:border-white/10 dark:bg-white/5">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">No accounts found.</p>
            <p className="mt-1 text-sm text-slate-400">Connect your bank account via Plaid or add a manual account below.</p>
            <div className="mt-6 flex justify-center gap-3">
              <PlaidConnect onConnected={loadAccounts} />
              <button
                onClick={() => setShowModal(true)}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
              >
                + Add Manual Account
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((acc) => (
              <div
                key={acc._id}
                className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase text-violet-500">
                    {acc.accountType}
                  </span>
                  <button
                    onClick={() => handleDelete(acc._id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>

                <h3 className="mt-4 text-xl font-bold">{acc.accountName}</h3>
                <p className="text-xs text-slate-400">{acc.institutionName || "Manual Bank"}</p>

                <div className="mt-6">
                  <p className="text-xs text-slate-400">Current Balance</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    ₹{(acc.balance || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-bold">Add New Account</h2>

            {modalError && (
              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Account Name</label>
                <input
                  type="text"
                  required
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="e.g. HDFC Savings"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Institution Name</label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="e.g. HDFC Bank"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Account Type</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                >
                  <option value="bank">Bank Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="checking">Checking Account</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="investment">Investment Account</option>
                  <option value="cash">Cash Wallet</option>
                  <option value="loan">Loan / Mortgage</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Initial Balance (₹)</label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setModalError("");
                  }}
                  className="rounded-xl px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
