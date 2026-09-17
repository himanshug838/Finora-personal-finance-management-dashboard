import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getTransactions, createTransaction, deleteTransaction } from "../services/transactionsApi.js";
import { getAccounts } from "../services/accountsApi.js";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "Food", 
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

      await createTransaction({
        ...formData,
        amount: Number(formData.amount) || 0,
      });

      setShowModal(false);
      setFormData({
        type: "expense",
        amount: "",
        category: "Food",
        account: accounts[0]?._id || "",
        transferAccount: "",
        paymentMethod: "upi",
        date: new Date().toISOString().split("T")[0],
        description: "",
        notes: "",
      });
      loadData();
    } catch (err) {
      alert(err.message || "Failed to log transaction.");
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
              View, spend, and manage your income, expenses, and transfer history.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
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
              onClick={() => setShowModal(true)}
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
                  <th className="px-6 py-4 text-right">Action</th>
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
                    <td className="px-6 py-4 font-medium capitalize">{tx.category || "General"}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {tx.account?.accountName || "Main Account"}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ₹{(tx.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {tx.date ? new Date(tx.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="text-xs text-red-400 hover:text-red-600"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-bold">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Transaction Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                >
                  <option value="expense">Expense (Spend)</option>
                  <option value="income">Income (Deposit)</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 500"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                />
              </div>

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
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Destination Account</label>
                  <select
                    value={formData.transferAccount}
                    onChange={(e) => setFormData({ ...formData, transferAccount: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <option value="">Select Destination Account</option>
                    {accounts.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.accountName} ({acc.institutionName || "Bank"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="net_banking">Net Banking</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Description (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Dinner with friends"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-white/10 dark:bg-white/5"
                />
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
                  Save Transaction
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
