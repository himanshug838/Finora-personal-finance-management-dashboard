import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear messages while user is typing
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    // -----------------------------
    // Frontend validation
    // -----------------------------

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create your account."
        );
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative
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

      {/* =========================================
          BACKGROUND GLOW
      ========================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          overflow-hidden
        "
      >
        {/* Violet glow */}
        <div
          className="
            absolute
            left-[-10%]
            top-[10%]
            h-80
            w-80
            rounded-full
            bg-violet-400/20
            blur-3xl
            dark:bg-violet-600/20
          "
        />

        {/* Cyan glow */}
        <div
          className="
            absolute
            right-[-8%]
            top-[25%]
            h-96
            w-96
            rounded-full
            bg-cyan-400/20
            blur-3xl
            dark:bg-cyan-500/20
          "
        />

        {/* Blue glow */}
        <div
          className="
            absolute
            bottom-[-15%]
            left-[30%]
            h-96
            w-96
            rounded-full
            bg-blue-400/20
            blur-3xl
            dark:bg-blue-600/20
          "
        />
      </div>

      {/* =========================================
          SIGNUP CONTAINER
      ========================================== */}

      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          pb-12
          pt-28
        "
      >
        <div
          className="
            grid
            w-full
            max-w-6xl
            overflow-hidden
            rounded-[2rem]
            border
            border-black/10
            bg-white/60
            shadow-2xl
            backdrop-blur-2xl
            dark:border-white/10
            dark:bg-white/[0.05]
            lg:grid-cols-2
          "
        >
          {/* =========================================
              LEFT INFORMATION PANEL
          ========================================== */}

          <div
            className="
              relative
              hidden
              overflow-hidden
              bg-slate-950
              p-12
              text-white
              lg:flex
              lg:flex-col
              lg:justify-between
              dark:bg-white
              dark:text-slate-950
            "
          >
            {/* Decorative circle */}

            <div
              className="
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                border
                border-white/10
                dark:border-black/10
              "
            />

            <div
              className="
                absolute
                -bottom-32
                -left-20
                h-80
                w-80
                rounded-full
                border
                border-white/10
                dark:border-black/10
              "
            />

            <div className="relative z-10">

              {/* Logo */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-xl
                  font-bold
                  text-slate-950
                  shadow-xl
                  dark:bg-slate-950
                  dark:text-white
                "
              >
                ₹
              </div>

              <p
                className="
                  mt-10
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-violet-400
                  dark:text-violet-600
                "
              >
                Personal Finance
              </p>

              <h2
                className="
                  mt-4
                  max-w-lg
                  text-4xl
                  font-black
                  leading-tight
                "
              >
                Take control of
                <span
                  className="
                    block
                    text-violet-400
                    dark:text-violet-600
                  "
                >
                  your finances.
                </span>
              </h2>

              <p
                className="
                  mt-6
                  max-w-md
                  text-base
                  leading-7
                  text-slate-400
                  dark:text-slate-600
                "
              >
                Track your accounts, understand your
                spending, manage budgets and monitor your
                investments from one beautiful dashboard.
              </p>
            </div>

            {/* Feature cards */}

            <div className="relative z-10 space-y-3">

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-4
                  backdrop-blur-xl
                  dark:border-black/10
                  dark:bg-black/5
                "
              >
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-500/10
                      text-emerald-400
                      dark:text-emerald-600
                    "
                  >
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      All your accounts
                    </p>

                    <p
                      className="
                        text-xs
                        text-slate-400
                        dark:text-slate-600
                      "
                    >
                      Connected in one place
                    </p>
                  </div>

                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-4
                  backdrop-blur-xl
                  dark:border-black/10
                  dark:bg-black/5
                "
              >
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-violet-500/10
                      text-violet-400
                      dark:text-violet-600
                    "
                  >
                    ↗
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Smarter financial decisions
                    </p>

                    <p
                      className="
                        text-xs
                        text-slate-400
                        dark:text-slate-600
                      "
                    >
                      Insights from your data
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* =========================================
              SIGNUP FORM
          ========================================== */}

          <div className="p-7 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              {/* Heading */}

              <div className="mb-8">

                <div
                  className="
                    mb-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-violet-500/20
                    bg-violet-500/10
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-violet-600
                    dark:text-violet-400
                  "
                >
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-violet-500
                    "
                  />

                  Get started
                </div>

                <h1
                  className="
                    text-3xl
                    font-black
                    tracking-tight
                    sm:text-4xl
                  "
                >
                  Create your account
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Create your account and start getting a
                  clearer picture of your finances.
                </p>

              </div>

              {/* =====================================
                  ERROR MESSAGE
              ====================================== */}

              {error && (
                <div
                  className="
                    mb-6
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-4
                    py-3
                  "
                >
                  <div className="flex gap-3">

                    <span className="text-red-500">
                      !
                    </span>

                    <p className="text-sm text-red-500">
                      {error}
                    </p>

                  </div>
                </div>
              )}

              {/* =====================================
                  SUCCESS MESSAGE
              ====================================== */}

              {success && (
                <div
                  className="
                    mb-6
                    rounded-2xl
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-4
                    py-3
                  "
                >
                  <div className="flex gap-3">

                    <span className="text-emerald-500">
                      ✓
                    </span>

                    <p className="text-sm text-emerald-500">
                      {success}
                    </p>

                  </div>
                </div>
              )}

              {/* =====================================
                  FORM
              ====================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* NAME */}

                <div>

                  <label
                    htmlFor="name"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={loading}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-black/10
                      bg-white/70
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-violet-500
                      focus:ring-4
                      focus:ring-violet-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      dark:border-white/10
                      dark:bg-white/5
                    "
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-black/10
                      bg-white/70
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-violet-500
                      focus:ring-4
                      focus:ring-violet-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      dark:border-white/10
                      dark:bg-white/5
                    "
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    Password
                  </label>

                  <div className="relative">

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      disabled={loading}
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-black/10
                        bg-white/70
                        px-4
                        py-3.5
                        pr-16
                        text-sm
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-violet-500
                        focus:ring-4
                        focus:ring-violet-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:border-white/10
                        dark:bg-white/5
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-xs
                        font-semibold
                        text-slate-500
                        hover:text-violet-600
                        dark:text-slate-400
                        dark:hover:text-violet-400
                      "
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-slate-400
                    "
                  >
                    Password must contain at least 6
                    characters.
                  </p>

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    Confirm password
                  </label>

                  <div className="relative">

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      disabled={loading}
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-black/10
                        bg-white/70
                        px-4
                        py-3.5
                        pr-16
                        text-sm
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-violet-500
                        focus:ring-4
                        focus:ring-violet-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:border-white/10
                        dark:bg-white/5
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-xs
                        font-semibold
                        text-slate-500
                        hover:text-violet-600
                        dark:text-slate-400
                        dark:hover:text-violet-400
                      "
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>

                {/* TERMS */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-black/5
                    bg-black/[0.02]
                    p-4
                    dark:border-white/5
                    dark:bg-white/[0.03]
                  "
                >
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="
                      mt-0.5
                      h-4
                      w-4
                      accent-violet-600
                    "
                  />

                  <label
                    htmlFor="terms"
                    className="
                      text-xs
                      leading-5
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    I agree to the terms and conditions and
                    understand that my financial information
                    will be handled securely.
                  </label>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    relative
                    w-full
                    overflow-hidden
                    rounded-2xl
                    bg-slate-950
                    py-4
                    font-semibold
                    text-white
                    shadow-xl
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-2xl
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    dark:bg-white
                    dark:text-slate-950
                  "
                >
                  <span className="relative z-10">

                    {loading
                      ? "Creating account..."
                      : "Create account →"}

                  </span>

                  <span
                    className="
                      absolute
                      inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-violet-500
                      via-fuchsia-500
                      to-cyan-500
                      transition-transform
                      duration-500
                      group-hover:translate-x-0
                    "
                  />

                </button>

              </form>

              {/* LOGIN */}

              <p
                className="
                  mt-7
                  text-center
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="
                    font-semibold
                    text-violet-600
                    hover:underline
                    dark:text-violet-400
                  "
                >
                  Sign in
                </Link>
              </p>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;