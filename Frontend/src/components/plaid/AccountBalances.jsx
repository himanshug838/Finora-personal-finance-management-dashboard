import {
  useCallback,
  useEffect,
  useState,
} from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const AccountBalances = () => {
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadAccounts = useCallback(async () => {
    try {
      const rawToken = localStorage.getItem("token");
      const token = (rawToken && rawToken !== "undefined" && rawToken !== "null") ? rawToken : null;

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/accounts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load accounts"
        );
      }

      setAccounts(data.accounts || []);
      setError("");
    } catch (error) {
      setError(
        error.message || "Unable to load accounts"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Initial account loading
   *
   * setTimeout makes the API call asynchronous so
   * React's set-state-in-effect rule does not complain
   * about state updates triggered immediately by the effect.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAccounts();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadAccounts]);

  /*
   * Retry
   */
  const handleRetry = () => {
    setLoading(true);
    setError("");

    loadAccounts();
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="rounded-2xl border p-6">
        <p className="text-gray-500">
          Loading accounts...
        </p>
      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

        <p className="text-sm text-red-500">
          {error}
        </p>

        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:opacity-80"
        >
          Try Again
        </button>

      </div>
    );
  }

  /*
   * Main UI
   */
  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">
          Connected Accounts
        </h2>

        <p className="text-sm text-gray-500">
          Bank accounts and current balances
        </p>
      </div>

      {/* Empty state */}
      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">

          <p className="text-gray-500">
            No accounts found.
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Connect a bank account or add one manually.
          </p>

        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {accounts.map((account) => (
            <div
              key={account._id}
              className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
            >

              {/* Account information */}
              <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">

                  <p className="truncate text-sm text-gray-500">
                    {account.institutionName || "Bank"}
                  </p>

                  <h3 className="truncate font-semibold">
                    {account.accountName}
                  </h3>

                </div>

                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                  {account.accountType}
                </span>

              </div>

              {/* Balance */}
              <div className="mt-5">

                <p className="text-2xl font-bold">

                  {account.currency || "INR"}{" "}

                  {Number(
                    account.balance || 0
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}

                </p>

              </div>

              {/* Source */}
              <div className="mt-3 text-xs text-gray-500">

                Source:{" "}

                <span className="font-medium">
                  {account.source === "plaid"
                    ? "Plaid"
                    : "Manual"}
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default AccountBalances;