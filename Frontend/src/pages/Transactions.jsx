import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionsApi.js";
import { getAccounts } from "../services/accountsApi.js";
import CustomSelect from "../components/CustomSelect.jsx";

const CATEGORY_LIST = [
  { value: "", label: "Select Category" },
  { value: "food", label: "Food" },
  { value: "shopping", label: "Shopping" },
  { value: "salary", label: "Salary" },
  { value: "bills", label: "Bills" },
  { value: "entertainment", label: "Entertainment" },
  { value: "travel", label: "Travel" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const CATEGORY_ICONS = {
  food: "🍔",
  shopping: "🛍️",
  salary: "💵",
  bills: "💡",
  entertainment: "🎬",
  travel: "✈️",
  health: "🏥",
  education: "🎓",
  other: "📦",
};

const getCategoryIcon = (cat) => {
  if (!cat) return "📦";
  const key = String(cat).toLowerCase();
  return CATEGORY_ICONS[key] || "🏷️";
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    account: "",
    transferAccount: "",
    paymentMethod: "upi",
    date: new Date().toISOString().split("T")[0],
    description: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [txData, accData] = await Promise.all([
        getTransactions(),
        getAccounts().catch(() => []),
      ]);
      setTransactions(txData);
      setAccounts(accData);
      if (accData.length > 0 && !formData.account) {
        setFormData((prev) => ({ ...prev, account: accData[0]._id }));
      }
    } catch (err) {
      setError(err.message || "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  const resetForm = () => {
    setEditingTransaction(null);
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      account: accounts[0]?._id || "",
      transferAccount: "",
      paymentMethod: "upi",
      date: new Date().toISOString().split("T")[0],
      description: "",
      notes: "",
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx);
    setFormData({
      type: tx.type || "expense",
      amount: tx.amount || "",
      category: tx.category || "",
      account: typeof tx.account === "object" ? tx.account._id : tx.account || "",
      transferAccount: typeof tx.transferAccount === "object" ? tx.transferAccount?._id : tx.transferAccount || "",
      paymentMethod: tx.paymentMethod || "upi",
      date: tx.date ? new Date(tx.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      description: tx.description || "",
      notes: tx.notes || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.account && accounts.length > 0) {
        formData.account = accounts[0]._id;
      }
      if (!formData.account) {
        alert("Please create a bank/cash account first in Accounts page.");
        return;
      }

      const payload = {
        ...formData,
        category: formData.category || "other",
        amount: Number(formData.amount) || 0,
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, payload);
      } else {
        await createTransaction(payload);
      }

      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      alert(err.message || "Failed to save transaction.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this transaction?")) {
      try {
        await deleteTransaction(id);
        loadData();
      } catch (err) {
        alert(err.message || "Failed to delete transaction.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-950 dark:bg-[#070b14] dark:text-white sm:px-6 lg:px-8">
      <Navbar />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Transactions</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View, spend, edit, and manage your income, expenses, and transfer history.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700"
          >
            + Add Transaction
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-12 text-center dark:border-white/10 dark:bg-white/5">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">No transactions recorded.</p>
            <p className="mt-1 text-sm text-slate-400 mb-6">Transactions will appear here as you log income or expenses.</p>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700"
            >
              + Add Transaction Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-100/50 text-xs font-bold uppercase text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                    <td className="whitespace-nowrap px-6 py-4 capitalize font-semibold">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs ${
                        tx.type === "income"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : tx.type === "expense"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium capitalize">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{getCategoryIcon(tx.category)}</span>
                        <span>{tx.category || "General"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {tx.account?.accountName || "Main Account"}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ₹{(tx.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {tx.date ? new Date(tx.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleOpenEditModal(tx)}
                        className="text-xs font-semibold text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="text-xs font-semibold text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm pt-8 sm:pt-14 pb-48">
          <div className="relative my-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-bold">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 pb-8">
              <CustomSelect
                label="Transaction Type"
                value={formData.type}
                onChange={(val) => handleTypeChange(val)}
                options={[
                  { value: "expense", label: "Expense (Spend)" },
                  { value: "income", label: "Income (Deposit)" },
                  { value: "transfer", label: "Transfer" },
                ]}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 500"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <CustomSelect
                label="Category"
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                options={CATEGORY_LIST}
              />

              <CustomSelect
                label="Account"
                value={formData.account}
                onChange={(val) => setFormData({ ...formData, account: val })}
                options={
                  accounts.length === 0
                    ? [{ value: "", label: "No Accounts (Will auto-select default)" }]
                    : accounts.map((acc) => ({
                        value: acc._id,
                        label: `${acc.accountName} (${acc.institutionName || "Bank"}) - ₹${acc.balance}`,
                      }))
                }
              />
             <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                >
                  <option value="">Select Category</option>
                  <option value="food">Food</option>
                  <option value="shopping">Shopping</option>
                  <option value="salary">Salary</option>
                  <option value="bills">Bills</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="travel">Travel</option>
                  <option value="health">Health</option>
                  <option value="education">Education</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Account</label>
                <select
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                >
                  {accounts.length === 0 ? (
                    <option value="">No Accounts (Will auto-select default)</option>
                  ) : (
                    accounts.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.accountName} ({acc.institutionName || "Bank"}) - ₹{acc.balance}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {formData.type === "transfer" && (
                <CustomSelect
                  label="Destination Account"
                  value={formData.transferAccount}
                  onChange={(val) => setFormData({ ...formData, transferAccount: val })}
                  options={[
                    { value: "", label: "Select Destination Account" },
                    ...accounts.map((acc) => ({
                      value: acc._id,
                      label: `${acc.accountName} (${acc.institutionName || "Bank"})`,
                    })),
                  ]}
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <CustomSelect
                  label="Payment Method"
                  value={formData.paymentMethod}
                  onChange={(val) => setFormData({ ...formData, paymentMethod: val })}
                  options={[
                    { value: "upi", label: "UPI" },
                    { value: "cash", label: "Cash" },
                    { value: "debit_card", label: "Debit Card" },
                    { value: "credit_card", label: "Credit Card" },
                    { value: "bank_transfer", label: "Bank Transfer" },
                    { value: "net_banking", label: "Net Banking" },
                    { value: "other", label: "Other" },
                  ]}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Description / Merchant (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value, merchant: e.target.value })}
                  placeholder="e.g. Swiggy order or Amazon"
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
                  {editingTransaction ? "Update Transaction" : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
