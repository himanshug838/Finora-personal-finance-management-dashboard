import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useTheme } from "../context/useTheme.js";
import NotificationBell from "./notifications/NotificationBell.jsx";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  const isLoggedIn = Boolean(
    token && token !== "undefined" && token !== "null"
  );

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMobileMenuOpen(false);

    navigate("/login");
  };

  /*
  |--------------------------------------------------------------------------
  | Close mobile menu
  |--------------------------------------------------------------------------
  */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Navigation link styles
  |--------------------------------------------------------------------------
  */

  const navLinkClass = ({ isActive }) =>
    `
      relative
      text-sm
      font-medium
      transition-all
      duration-200

      ${
        isActive
          ? "text-violet-600 dark:text-violet-400"
          : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
      }

      after:absolute
      after:-bottom-2
      after:left-0
      after:h-[2px]
      after:rounded-full
      after:bg-violet-500
      after:transition-all
      after:duration-300

      ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
    `;

  return (
    <>
      {/* ================================================================ */}
      {/* NAVBAR */}
      {/* ================================================================ */}

      <nav className="fixed left-0 top-0 z-50 w-full px-3 py-3 sm:px-4 sm:py-4">
        <div
          className="
            mx-auto
            max-w-7xl
            rounded-2xl
            border
            border-black/[0.08]
            bg-white/70
            shadow-xl
            shadow-black/[0.04]
            backdrop-blur-2xl
            transition-all
            duration-300

            dark:border-white/[0.08]
            dark:bg-[#070b18]/75
            dark:shadow-black/20
          "
        >
          {/* ============================================================ */}
          {/* MAIN NAVBAR */}
          {/* ============================================================ */}

          <div
            className="
              flex
              h-[68px]
              items-center
              justify-between
              px-4
              sm:px-6
            "
          >
            {/* ========================================================== */}
            {/* LOGO */}
            {/* ========================================================== */}

            <Link
              to={isLoggedIn ? "/dashboard" : "/"}
              className="group flex items-center gap-3"
              onClick={closeMobileMenu}
            >
              {/* Logo icon */}

              <div
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-slate-950
                  text-lg
                  font-bold
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  group-hover:rotate-3
                  group-hover:scale-105
                  group-hover:shadow-violet-500/20

                  dark:bg-white
                  dark:text-slate-950
                "
              >
                <span
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-violet-500/30
                    to-transparent
                    opacity-0
                    transition
                    group-hover:opacity-100
                  "
                />

                <span className="relative">₹</span>
              </div>

              {/* Brand */}

              <div className="leading-none">
                <h1
                  className="
                    text-lg
                    font-bold
                    tracking-tight
                    text-slate-950
                    dark:text-white
                  "
                >
                  Finora
                </h1>

                <p
                  className="
                    mt-1
                    hidden
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-slate-400
                    sm:block
                  "
                >
                  Personal Finance
                </p>
              </div>
            </Link>

            {/* ========================================================== */}
            {/* DESKTOP NAVIGATION */}
            {/* ========================================================== */}

            <div
              className="
                hidden
                items-center
                gap-8
                md:flex
              "
            >
              {!isLoggedIn ? (
                <>
                  {/* Home */}

                  <NavLink
                    to="/"
                    className={navLinkClass}
                  >
                    Home
                  </NavLink>

                  {/* Features */}

                  <a
                    href="/#features"
                    className="
                      relative
                      text-sm
                      font-medium
                      text-slate-600
                      transition
                      hover:text-slate-950

                      dark:text-slate-300
                      dark:hover:text-white

                      after:absolute
                      after:-bottom-2
                      after:left-0
                      after:h-[2px]
                      after:w-0
                      after:rounded-full
                      after:bg-violet-500
                      after:transition-all
                      after:duration-300
                      hover:after:w-full
                    "
                  >
                    Features
                  </a>

                  {/* About */}

                  <a
                    href="/#about"
                    className="
                      relative
                      text-sm
                      font-medium
                      text-slate-600
                      transition
                      hover:text-slate-950

                      dark:text-slate-300
                      dark:hover:text-white

                      after:absolute
                      after:-bottom-2
                      after:left-0
                      after:h-[2px]
                      after:w-0
                      after:rounded-full
                      after:bg-violet-500
                      after:transition-all
                      after:duration-300
                      hover:after:w-full
                    "
                  >
                    About
                  </a>
                </>
              ) : (
                <>
                  {/* Dashboard */}

                  <NavLink
                    to="/dashboard"
                    className={navLinkClass}
                  >
                    Dashboard
                  </NavLink>

                  {/* Accounts */}

                  <NavLink
                    to="/accounts"
                    className={navLinkClass}
                  >
                    Accounts
                  </NavLink>

                  {/* Transactions */}

                  <NavLink
                    to="/transactions"
                    className={navLinkClass}
                  >
                    Transactions
                  </NavLink>

                  {/* Investments */}

                  <NavLink
                    to="/investments"
                    className={navLinkClass}
                  >
                    Investments
                  </NavLink>

                  {/* Net Worth */}

                  <NavLink
                    to="/net-worth"
                    className={navLinkClass}
                  >
                    Net Worth
                  </NavLink>

                  {/* Goals */}

                  <NavLink
                    to="/goals"
                    className={navLinkClass}
                  >
                    Goals
                  </NavLink>
                </>
              )}
            </div>

            {/* ========================================================== */}
            {/* RIGHT SIDE */}
            {/* ========================================================== */}

            <div className="flex items-center gap-2">
              {/* ======================================================== */}
              {/* Notification Bell */}
              {/* ======================================================== */}

              {isLoggedIn && (
                <div className="flex items-center">
                  <NotificationBell />
                </div>
              )}

              {/* ======================================================== */}
              {/* Theme Toggle */}
              {/* ======================================================== */}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="
                  group
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-black/10
                  bg-white/60
                  text-base
                  shadow-sm
                  backdrop-blur-md
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:scale-105
                  hover:bg-white
                  hover:shadow-lg

                  dark:border-white/10
                  dark:bg-white/5
                  dark:hover:bg-white/10
                "
              >
                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover:rotate-12
                  "
                >
                  {theme === "dark" ? "☀️" : "🌙"}
                </span>
              </button>

              {/* ======================================================== */}
              {/* Desktop Authentication */}
              {/* ======================================================== */}

              {!isLoggedIn ? (
                <>
                  {/* Login */}

                  <Link
                    to="/login"
                    className="
                      hidden
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-slate-700
                      transition-all
                      duration-200
                      hover:bg-black/5
                      hover:text-slate-950
                      sm:block

                      dark:text-slate-200
                      dark:hover:bg-white/10
                      dark:hover:text-white
                    "
                  >
                    Login
                  </Link>

                  {/* Get Started */}

                  <Link
                    to="/signup"
                    className="
                      hidden
                      rounded-xl
                      bg-slate-950
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-black/10
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:shadow-xl
                      hover:shadow-violet-500/10
                      sm:block

                      dark:bg-white
                      dark:text-slate-950
                    "
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                /* Logout */

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    hidden
                    rounded-xl
                    border
                    border-red-500/10
                    bg-red-500/5
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-red-500
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-red-500/10
                    hover:shadow-lg
                    sm:block
                  "
                >
                  Logout
                </button>
              )}

              {/* ======================================================== */}
              {/* Mobile Menu Button */}
              {/* ======================================================== */}

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    (previous) => !previous
                  )
                }
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-black/10
                  bg-white/60
                  text-lg
                  transition
                  hover:bg-black/5

                  dark:border-white/10
                  dark:bg-white/5
                  dark:hover:bg-white/10

                  md:hidden
                "
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* MOBILE MENU */}
          {/* ============================================================ */}

          {mobileMenuOpen && (
            <div
              className="
                border-t
                border-black/5
                px-4
                pb-5
                pt-4

                dark:border-white/10

                md:hidden
              "
            >
              <div className="space-y-1">
                {!isLoggedIn ? (
                  <>
                    {/* Home */}

                    <Link
                      to="/"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      Home
                    </Link>

                    {/* Features */}

                    <a
                      href="/#features"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      Features
                    </a>

                    {/* About */}

                    <a
                      href="/#about"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      About
                    </a>

                    <div
                      className="
                        my-3
                        h-px
                        bg-black/5
                        dark:bg-white/10
                      "
                    />

                    {/* Login */}

                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      Login
                    </Link>

                    {/* Get Started */}

                    <Link
                      to="/signup"
                      onClick={closeMobileMenu}
                      className="
                        mt-2
                        block
                        rounded-xl
                        bg-slate-950
                        px-4
                        py-3
                        text-center
                        text-sm
                        font-semibold
                        text-white
                        shadow-lg

                        dark:bg-white
                        dark:text-slate-950
                      "
                    >
                      Get Started →
                    </Link>
                  </>
                ) : (
                  <>
                    {/* ================================================== */}
                    {/* DASHBOARD */}
                    {/* ================================================== */}

                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      📊 Dashboard
                    </Link>

                    {/* ================================================== */}
                    {/* ACCOUNTS */}
                    {/* ================================================== */}

                    <Link
                      to="/accounts"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      🏦 Accounts
                    </Link>

                    {/* ================================================== */}
                    {/* TRANSACTIONS */}
                    {/* ================================================== */}

                    <Link
                      to="/transactions"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      💳 Transactions
                    </Link>

                    {/* ================================================== */}
                    {/* INVESTMENTS */}
                    {/* ================================================== */}

                    <Link
                      to="/investments"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      📈 Investments
                    </Link>

                    {/* ================================================== */}
                    {/* NET WORTH */}
                    {/* ================================================== */}

                    <Link
                      to="/net-worth"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      💰 Net Worth
                    </Link>

                    {/* ================================================== */}
                    {/* FINANCIAL GOALS */}
                    {/* ================================================== */}

                    <Link
                      to="/goals"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-black/5

                        dark:text-slate-200
                        dark:hover:bg-white/5
                      "
                    >
                      🎯 Goals
                    </Link>

                    <div
                      className="
                        my-3
                        h-px
                        bg-black/5
                        dark:bg-white/10
                      "
                    />

                    {/* ================================================== */}
                    {/* LOGOUT */}
                    {/* ================================================== */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        w-full
                        rounded-xl
                        bg-red-500/5
                        px-4
                        py-3
                        text-left
                        text-sm
                        font-semibold
                        text-red-500
                        transition
                        hover:bg-red-500/10
                      "
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;