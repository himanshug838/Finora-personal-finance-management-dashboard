import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      /*
       * Save JWT token
       */
      localStorage.setItem("token", data.token);

      /*
       * Save user information if backend provides it.
       * This won't cause an issue if it doesn't.
       */
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      /*
       * If the user was redirected to login
       * from a protected page, return them there.
       *
       * Otherwise go to dashboard.
       */
      const destination =
        location.state?.from?.pathname ||
        "/dashboard";

      navigate(destination, {
        replace: true,
      });

    } catch (error) {
      setError(
        error.message ||
          "Something went wrong while logging in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-950
        dark:bg-[#050816]
        dark:text-white
      "
    >
      <Navbar />

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          pt-24
          pb-10
        "
      >
        <div
          className="
            grid
            w-full
            max-w-5xl
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
          {/* LEFT SIDE */}
          <div
            className="
              hidden
              bg-slate-950
              p-12
              text-white
              lg:flex
              lg:flex-col
              lg:justify-between
              dark:bg-white
            "
          >
            <div>
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-xl
                  text-black
                  dark:bg-black
                  dark:text-white
                "
              >
                ₹
              </div>

              <h2
                className="
                  mt-10
                  text-4xl
                  font-bold
                  dark:text-black
                "
              >
                Welcome back.
              </h2>

              <p
                className="
                  mt-4
                  max-w-sm
                  leading-7
                  text-slate-400
                  dark:text-slate-600
                "
              >
                Your financial overview is waiting for
                you. Continue managing your money with
                clarity.
              </p>
            </div>

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-6
                dark:border-black/10
                dark:bg-black/5
              "
            >
              <p
                className="
                  text-sm
                  leading-6
                  text-slate-300
                  dark:text-slate-600
                "
              >
                "The best way to manage your money is to
                understand where it goes."
              </p>

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  dark:text-black
                "
              >
                Finora
              </p>
            </div>
          </div>

          {/* FORM SIDE */}
          <div className="p-8 sm:p-12">
            <div className="mx-auto max-w-md">

              <p
                className="
                  text-sm
                  font-medium
                  text-violet-600
                  dark:text-violet-400
                "
              >
                ACCOUNT LOGIN
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                Sign in to your account
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Enter your details to continue.
              </p>

              {/* ERROR */}
              {error && (
                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-4
                    py-3
                  "
                >
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
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
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-black/10
                      bg-white/70
                      px-4
                      py-3.5
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-violet-500
                      focus:ring-4
                      focus:ring-violet-500/10
                      dark:border-white/10
                      dark:bg-white/5
                    "
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="
                        text-xs
                        font-semibold
                        text-violet-600
                        hover:underline
                        dark:text-violet-400
                      "
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-black/10
                      bg-white/70
                      px-4
                      py-3.5
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-violet-500
                      focus:ring-4
                      focus:ring-violet-500/10
                      dark:border-white/10
                      dark:bg-white/5
                    "
                  />
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    rounded-2xl
                    bg-slate-950
                    py-4
                    font-semibold
                    text-white
                    shadow-xl
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-2xl
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    dark:bg-white
                    dark:text-slate-950
                  "
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in →"}
                </button>
              </form>

              <p
                className="
                  mt-8
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="
                    font-semibold
                    text-violet-600
                    hover:underline
                    dark:text-violet-400
                  "
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;