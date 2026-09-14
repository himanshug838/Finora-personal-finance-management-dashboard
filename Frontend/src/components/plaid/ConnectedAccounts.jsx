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
          <h2 className="text-xl font-semibold">
            Connected Banks
          </h2>

          <p className="text-sm text-gray-500">
            Your accounts connected through Plaid
          </p>
        </div>

        <PlaidConnect onConnected={loadAccounts} />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:opacity-80"
          >
            Try Again
          </button>

        </div>
      )}

      {/* No accounts */}
      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">

          <p className="text-gray-500">
            No bank accounts connected yet.
          </p>

          <p className="mt-1 text-sm text-gray-400 mb-4">
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
              className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
            >

              {/* Bank information */}
              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <h3 className="truncate font-semibold">
                    {item.institutionName ||
                      "Connected Bank"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">

                    Status:{" "}

                    <span className="capitalize">
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
                  className="shrink-0 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-50"
                >
                  Disconnect
                </button>

              </div>

              {/* Sync information */}
              <div className="mt-4 border-t pt-4">

                <p className="text-xs text-gray-500">
                  Last synced
                </p>

                <p className="mt-1 text-sm">

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