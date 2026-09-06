import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 transition-colors duration-500 dark:bg-[#050816] dark:text-white">

      <Navbar />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute left-[-10%] top-[15%] h-72 w-72 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/20" />

        <div className="absolute right-[-5%] top-[20%] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/20" />

        <div className="absolute bottom-[-10%] left-[30%] h-80 w-80 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/20" />

      </div>

      {/* Hero */}
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-36 lg:px-8">

        <section className="grid min-h-[680px] items-center gap-16 lg:grid-cols-2">

          {/* Left */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Your money. One intelligent dashboard.
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">

              Take control of
              <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                your finances.
              </span>

            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Track your income, expenses, investments and savings
              from one beautiful financial workspace designed to help
              you make smarter decisions.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/signup"
                className="group rounded-2xl bg-slate-950 px-7 py-4 text-center font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-white dark:text-slate-950"
              >
                Start managing money
                <span className="ml-2 transition group-hover:ml-3">
                  →
                </span>
              </Link>

              <Link
                to="/login"
                className="rounded-2xl border border-black/10 bg-white/60 px-7 py-4 text-center font-semibold backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                Sign in
              </Link>

            </div>

            {/* Stats */}
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-4">

              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  Financial visibility
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">360°</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  Money overview
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  Smart dashboard
                </p>
              </div>

            </div>

          </div>

          {/* 3D Dashboard */}
          <div className="relative perspective-[1200px]">

            <div className="relative mx-auto max-w-xl rotate-y-[-8deg] rotate-x-[4deg] transition duration-700 hover:rotate-y-0 hover:rotate-x-0">

              {/* Main glass card */}
              <div className="rounded-[2rem] border border-white/30 bg-white/60 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.07]">

                {/* Header */}
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total Balance
                    </p>

                    <p className="mt-1 text-3xl font-bold">
                      ₹2,84,560
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    +12.8%
                  </div>

                </div>

                {/* Chart */}
                <div className="mt-8 h-48">

                  <svg
                    viewBox="0 0 500 180"
                    className="h-full w-full"
                    fill="none"
                  >

                    <path
                      d="M0 150 C70 130 80 100 140 120 C200 140 210 70 270 90 C330 110 350 30 410 60 C450 80 470 40 500 20"
                      stroke="currentColor"
                      strokeWidth="5"
                      className="text-violet-500"
                    />

                    <path
                      d="M0 150 C70 130 80 100 140 120 C200 140 210 70 270 90 C330 110 350 30 410 60 C450 80 470 40 500 20 L500 180 L0 180 Z"
                      className="fill-violet-500/10"
                    />

                  </svg>

                </div>

                {/* Cards */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs text-slate-500">
                      Income
                    </p>

                    <p className="mt-2 text-xl font-bold">
                      ₹68,420
                    </p>

                    <p className="mt-1 text-xs text-emerald-500">
                      +8.4%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs text-slate-500">
                      Expenses
                    </p>

                    <p className="mt-2 text-xl font-bold">
                      ₹31,280
                    </p>

                    <p className="mt-1 text-xs text-red-500">
                      -4.2%
                    </p>
                  </div>

                </div>

              </div>

              {/* Floating card */}
              <div className="absolute -bottom-10 -left-10 w-48 rounded-2xl border border-white/30 bg-white/70 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70">

                <div className="flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    Savings
                  </span>

                  <span className="text-xs text-emerald-500">
                    +18%
                  </span>

                </div>

                <p className="mt-2 text-xl font-bold">
                  ₹37,140
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-full w-[75%] rounded-full bg-emerald-500" />
                </div>

              </div>

              {/* Floating notification */}
              <div className="absolute -right-8 -top-8 hidden w-52 rounded-2xl border border-white/30 bg-white/70 p-4 shadow-2xl backdrop-blur-2xl sm:block dark:border-white/10 dark:bg-slate-900/70">

                <div className="flex gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
                    ✦
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Budget insight
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      You're spending less this month.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Features */}
        <section
          id="features"
          className="py-24"
        >

          <div className="mb-12 max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              Everything in one place
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Understand your money.
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {[
              {
                icon: "◈",
                title: "Smart Analytics",
                text: "Understand spending patterns with intuitive visualizations."
              },
              {
                icon: "◉",
                title: "Budget Tracking",
                text: "Set budgets and see exactly where your money is going."
              },
              {
                icon: "↗",
                title: "Net Worth",
                text: "Track assets, liabilities and financial growth over time."
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-black/5 bg-white/60 p-7 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04]"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white dark:bg-white dark:text-slate-950">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
                  {feature.text}
                </p>

              </div>
            ))}

          </div>

        </section>

      </main>
    </div>
  );
};

export default Landing;