import { useState } from "react";
import { Link } from "react-router-dom";

const FINANCIAL_TIPS = [
  "Rule of 72: Divide 72 by your expected rate of return to estimate how many years it takes to double your money.",
  "Emergency Fund: Keep 3 to 6 months of living expenses in an easily accessible high-yield account.",
  "50/30/20 Rule: Allocate 50% of income to needs, 30% to wants, and 20% to savings & debt reduction.",
  "Compound Interest: Starting to invest 5 years earlier can double your retirement nest egg.",
  "Track Every Expense: Small daily leaks in spending add up to large annual financial losses.",
  "Diversification: Never put all your capital in a single asset class or individual stock.",
];

const RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
  AED: 0.044,
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Currency Converter Widget state
  const [calcAmount, setCalcAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");

  // Daily Tip State
  const [tipIndex, setTipIndex] = useState(0);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const convertedValue = (
    (Number(calcAmount || 0) / RATES[fromCurrency]) *
    RATES[toCurrency]
  ).toFixed(2);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-slate-200/80 bg-white/70 text-slate-700 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#040711]/90 dark:text-slate-300">
      {/* GLOW DECORATIONS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-6 lg:px-8">
        {/* TOP SECTION: Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* COL 1 & 2: BRAND & MISSION & STATUS */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white font-bold shadow-lg transition duration-300 group-hover:rotate-6 dark:bg-white dark:text-slate-950">
                ₹
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                  Finora
                </span>
                <span className="ml-2 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                  v2.0
                </span>
              </div>
            </Link>

            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400 max-w-md">
              Finora empowers your personal financial journey with intelligent account aggregation, real-time analytics, spending classification, and bank-grade security.
            </p>

            {/* LIVE SYSTEM STATUS BADGE */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All Systems Operational • 256-bit Encrypted
            </div>

            {/* DAILY MONEY TIP WIDGET */}
            <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  💡 Financial Tip of the Day
                </span>
                <button
                  onClick={() =>
                    setTipIndex((prev) => (prev + 1) % FINANCIAL_TIPS.length)
                  }
                  className="text-[11px] text-slate-400 hover:text-violet-500 transition"
                  title="Next Tip"
                >
                  Next ↺
                </button>
              </div>
              <p className="mt-2 text-xs italic leading-5 text-slate-600 dark:text-slate-300">
                "{FINANCIAL_TIPS[tipIndex]}"
              </p>
            </div>
          </div>

          {/* COL 3: PRODUCT NAVIGATION */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/accounts"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  Bank Accounts
                </Link>
              </li>
              <li>
                <Link
                  to="/transactions"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  Transactions Tracker
                </Link>
              </li>
              <li>
                <Link
                  to="/investments"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  Investment Portfolio
                </Link>
              </li>
              <li>
                <Link
                  to="/net-worth"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  Net Worth Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/goals"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  Financial Goals
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 4: DEVELOPERS & RESOURCES */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
              Developers & Resources
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="/#features"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  Features Overview
                </a>
              </li>
              <li>
                <a
                  href="/#about"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  About Finora
                </a>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">
                  Security & Compliance
                </span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">
                  Plaid Integration
                </span>
              </li>
            </ul>
          </div>

          {/* COL 5: QUICK CURRENCY CONVERTER WIDGET */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
              Quick Currency Converter
            </h3>
            <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      From
                    </label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium dark:border-white/10 dark:bg-slate-900 dark:text-white"
                    >
                      {Object.keys(RATES).map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      To
                    </label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium dark:border-white/10 dark:bg-slate-900 dark:text-white"
                    >
                      {Object.keys(RATES).map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-2 rounded-lg bg-violet-500/10 p-2 text-center">
                  <span className="text-[10px] text-slate-400">Converted Value: </span>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    {toCurrency === "INR" ? "₹" : toCurrency === "USD" ? "$" : toCurrency === "EUR" ? "€" : toCurrency === "GBP" ? "£" : ""}{" "}
                    {convertedValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Newsletter Subscription */}
        <div className="mt-12 rounded-3xl border border-slate-200/80 bg-slate-900 p-6 text-white shadow-xl dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h4 className="text-lg font-bold">
                Subscribe to Finora Financial Digest 📩
              </h4>
              <p className="text-xs text-slate-400">
                Get weekly budgeting tips, portfolio strategies, and product updates delivered straight to your inbox.
              </p>
            </div>

            {subscribed ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-400">
                ✓ Thank you for subscribing! Check your inbox soon.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex w-full max-w-md items-center gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-violet-700"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Finora Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              Security Standards
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              ↑ Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
