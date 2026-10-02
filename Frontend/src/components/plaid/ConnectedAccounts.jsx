import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getConnectedBanks,
  disconnectBank,
} from "../../services/plaidApi";

import PlaidConnect from "./PlaidConnect";

const ConnectedAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Load connected Plaid banks
   */
  const loadAccounts = useCallback(async () => {
    try {
      const data = await getConnectedBanks();

      setAccounts(data.items || []);
      setError("");
    } catch (error) {
      setError(
        error.message ||
          "Unable to load connected accounts"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Initial loading
   *
   * The timeout makes the state updates happen
   * asynchronously instead of synchronously inside
   * the effect.
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
   * Disconnect bank
   */
  const handleDisconnect = async (itemId) => {
    try {
      setLoading(true);
      setError("");

      await disconnectBank(itemId);

      await loadAccounts();
    } catch (error) {
      setError(
        error.message ||
          "Unable to disconnect bank"
      );

      setLoading(false);
    }
  };

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
          Loading connected accounts...
        </p>
      </div>
    );
  }

  /*
   * Main UI
   */
  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Connected Banks
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your accounts connected through Plaid
          </p>
        </div>

        <PlaidConnect onConnected={loadAccounts} />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">

          <p className="text-sm text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white transition hover:bg-violet-700"
          >
            Try Again
          </button>

        </div>
      )}

      {/* No accounts */}
      {accounts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center dark:border-white/20">

          <p className="text-slate-500 dark:text-slate-400">
            No bank accounts connected yet.
          </p>

          <p className="mt-1 text-sm text-slate-400 mb-4 dark:text-slate-500">
            Connect your bank using Plaid to see it here.
          </p>

          <div className="flex justify-center">
            <PlaidConnect onConnected={loadAccounts} />
          </div>

        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">

          {accounts.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
            >

              {/* Bank information */}
              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                    {item.institutionName ||
                      "Connected Bank"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

                    Status:{" "}

                    <span className="font-semibold capitalize text-emerald-500">
                      {item.status || "active"}
                    </span>

                  </p>

                </div>

                {/* Disconnect */}
                <button
                  type="button"
                  onClick={() =>
                    handleDisconnect(item._id)
                  }
                  className="shrink-0 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/10"
                >
                  Disconnect
                </button>

              </div>

              {/* Sync information */}
              <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/10">

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last synced
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">

                  {item.lastSyncedAt
                    ? new Date(
                        item.lastSyncedAt
                      ).toLocaleString("en-IN")
                    : "Never"}

                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default ConnectedAccounts;