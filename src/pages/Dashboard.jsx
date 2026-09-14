import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar.jsx";
import LogoutButton from "../components/LogoutButton.jsx";
import PlaidConnect from "../components/plaid/PlaidConnect";
import AccountBalances from "../components/plaid/AccountBalances";
import ConnectedAccounts from "../components/plaid/ConnectedAccounts";
import { getAccounts } from "../services/accountsApi";
import { getTransactions } from "../services/transactionsApi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#3b82f6",
  "#a855f7",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/95">
        {label && (
          <p className="mb-1 font-semibold text-slate-800 dark:text-slate-200">
            {label}
          </p>
        )}
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className="text-xs font-medium"
            style={{ color: entry.color || entry.fill }}
          >
            {entry.name}: ₹
            {Number(entry.value || 0).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [accData, txData] = await Promise.all([
        getAccounts().catch(() => []),
        getTransactions().catch(() => []),
      ]);
      setAccounts(Array.isArray(accData) ? accData : []);
      setTransactions(Array.isArray(txData) ? txData : []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Check if accounts exist
  const isDisconnected = accounts.length === 0;

  // 1. Total Balance: ₹0 when disconnected, or sum of balances when connected
  const totalBalance = isDisconnected
    ? 0
    : accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);

  // 2. Current Month filtering for Income & Expenses
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTx = isDisconnected
    ? []
    : transactions.filter((t) => {
        if (!t.date) return true;
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

  const activeTxList =
    currentMonthTx.length > 0
      ? currentMonthTx
      : isDisconnected
      ? []
      : transactions;

  // Monthly Income
  const monthlyIncome = isDisconnected
    ? 0
    : activeTxList
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // Monthly Expenses
  const monthlyExpenses = isDisconnected
    ? 0
    : activeTxList
        .filter((t) => t.type === "expense" || t.type === "spending")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // Savings
  const savings = isDisconnected
    ? 0
    : Math.max(0, monthlyIncome - monthlyExpenses);

  // Bar Graph: Monthly Cash Flow (Last 6 Months) - Always rendered
  const barChartData = (() => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString("default", { month: "short" });
      const m = d.getMonth();
      const y = d.getFullYear();

      const monthTx = isDisconnected
        ? []
        : transactions.filter((t) => {
            if (!t.date) return false;
            const td = new Date(t.date);
            return td.getMonth() === m && td.getFullYear() === y;
          });

      const inc = monthTx
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const exp = monthTx
        .filter((t) => t.type === "expense" || t.type === "spending")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      result.push({
        month: monthName,
        Income: inc,
        Expenses: exp,
      });
    }
    return result;
  })();

  // Pie Chart: Expense Breakdown or Asset Distribution - Always rendered
  const pieChartData = (() => {
    if (!isDisconnected && transactions.length > 0) {
      const expenseTx = transactions.filter(
        (t) => t.type === "expense" || t.type === "spending"
      );

      if (expenseTx.length > 0) {
        const catMap = {};
        expenseTx.forEach((t) => {
          const cat = t.category || "General";
          catMap[cat] = (catMap[cat] || 0) + (Number(t.amount) || 0);
        });

        return Object.keys(catMap).map((cat) => ({
          name: cat,
          value: catMap[cat],
        }));
      }
    }

    if (!isDisconnected && accounts.length > 0) {
      const accMap = {};
      accounts.forEach((a) => {
        const type = (a.accountType || "Bank").toUpperCase();
        accMap[type] = (accMap[type] || 0) + (Number(a.balance) || 0);
      });

      return Object.keys(accMap).map((type) => ({
        name: type,
        value: accMap[type],
      }));
    }

    // Default overview structure so Pie Chart is always visible
    return [
      { name: "Savings", value: 40 },
      { name: "Expenses", value: 30 },
      { name: "Investments", value: 20 },
      { name: "Cash", value: 10 },
    ];
  })();

  const formatRupees = (val) => {
    return `₹${Number(val || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div
      className="
        min-h-screen
        overflow-hidden
        bg-slate-50
        text-slate-950
        transition-colors
        duration-500
        dark:bg-[#050816]
        dark:text-white
      "
    >
      <Navbar />

      {/* BACKGROUND */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-[-10%]
            top-[15%]
            h-72
            w-72
            rounded-full
            bg-violet-400/20
            blur-3xl
            dark:bg-violet-600/20
          "
        />

        <div
          className="
            absolute
            right-[-5%]
            top-[20%]
            h-96
            w-96
            rounded-full
            bg-cyan-400/20
            blur-3xl
            dark:bg-cyan-500/20
          "
        />

        <div
          className="
            absolute
            bottom-[-10%]
            left-[30%]
            h-80
            w-80
            rounded-full
            bg-blue-400/20
            blur-3xl
            dark:bg-blue-600/20
          "
        />
      </div>

      {/* MAIN */}
      <main
        className="
          mx-auto
          max-w-7xl
          px-5
          pb-16
          pt-28
          sm:px-6
          lg:px-8
        "
      >
        {/* HEADER */}
        <section
          className="
            mb-8
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <div
              className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-black/10
                bg-white/60
                px-4
                py-2
                text-xs
                font-medium
                shadow-sm
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-white/5
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-500
                "
              />
              FINANCIAL OVERVIEW
            </div>

            <h1
              className="
                text-3xl
                font-black
                tracking-tight
                sm:text-4xl
              "
            >
              Financial Dashboard
            </h1>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              Manage your accounts, track your spending and keep your finances
              organized in one place.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <PlaidConnect
              onConnected={() => {
                fetchDashboardData();
              }}
            />
            <LogoutButton />
          </div>
        </section>

        {/* QUICK SUMMARY */}
        <section
          className="
            mb-8
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {/* Total Balance */}
          <div
            className="
              rounded-3xl
              border
              border-black/5
              bg-white/60
              p-6
              shadow-sm
              backdrop-blur-xl
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              dark:border-white/10
              dark:bg-white/[0.05]
            "
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Total Balance
            </p>

            <p className="mt-3 text-2xl font-bold">
              {formatRupees(totalBalance)}
            </p>

            <p
              className="
                mt-2
                text-xs
                text-slate-400
              "
            >
              Across connected accounts
            </p>
          </div>

          {/* Income */}
          <div
            className="
              rounded-3xl
              border
              border-black/5
              bg-white/60
              p-6
              shadow-sm
              backdrop-blur-xl
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              dark:border-white/10
              dark:bg-white/[0.05]
            "
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Monthly Income
            </p>

            <p className="mt-3 text-2xl font-bold">
              {formatRupees(monthlyIncome)}
            </p>

            <p
              className="
                mt-2
                text-xs
                text-emerald-500
              "
            >
              Income overview
            </p>
          </div>

          {/* Expenses */}
          <div
            className="
              rounded-3xl
              border
              border-black/5
              bg-white/60
              p-6
              shadow-sm
              backdrop-blur-xl
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              dark:border-white/10
              dark:bg-white/[0.05]
            "
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Monthly Expenses
            </p>

            <p className="mt-3 text-2xl font-bold">
              {formatRupees(monthlyExpenses)}
            </p>

            <p
              className="
                mt-2
                text-xs
                text-red-500
              "
            >
              Expense overview
            </p>
          </div>

          {/* Savings */}
          <div
            className="
              rounded-3xl
              border
              border-black/5
              bg-white/60
              p-6
              shadow-sm
              backdrop-blur-xl
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              dark:border-white/10
              dark:bg-white/[0.05]
            "
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Savings
            </p>

            <p className="mt-3 text-2xl font-bold">
              {formatRupees(savings)}
            </p>

            <p
              className="
                mt-2
                text-xs
                text-violet-500
              "
            >
              This month
            </p>
          </div>
        </section>

        {/* CHARTS SECTION - ALWAYS VISIBLE */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* BAR GRAPH: Cash Flow Overview */}
          <div className="rounded-[2rem] border border-black/5 bg-white/50 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Cash Flow Overview
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Monthly income vs. expense comparison
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                6-Month Trend
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                  />
                  <Bar
                    dataKey="Income"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Expenses"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART: Spending & Asset Distribution */}
          <div className="rounded-[2rem] border border-black/5 bg-white/50 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Spending & Asset Distribution
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Category breakdown & account allocation
                </p>
              </div>
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                Distribution
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ACCOUNTS */}
        <section
          className="
            mb-8
            rounded-[2rem]
            border
            border-black/5
            bg-white/50
            p-5
            shadow-sm
            backdrop-blur-xl
            sm:p-7
            dark:border-white/10
            dark:bg-white/[0.04]
          "
        >
          <AccountBalances />
        </section>

        {/* CONNECTED BANKS */}
        <section
          className="
            rounded-[2rem]
            border
            border-black/5
            bg-white/50
            p-5
            shadow-sm
            backdrop-blur-xl
            sm:p-7
            dark:border-white/10
            dark:bg-white/[0.04]
          "
        >
          <ConnectedAccounts />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;