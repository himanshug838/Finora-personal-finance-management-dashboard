import Navbar from "../components/Navbar.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

import PlaidConnect from "../components/plaid/PlaidConnect";
import AccountBalances from "../components/plaid/AccountBalances";
import ConnectedAccounts from "../components/plaid/ConnectedAccounts";

const Dashboard = () => {
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
              Manage your accounts, track your spending
              and keep your finances organized in one
              place.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <PlaidConnect
              onConnected={() => {
                window.location.reload();
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
              ₹0
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
              ₹0
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
              ₹0
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
              ₹0
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