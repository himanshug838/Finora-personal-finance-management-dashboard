import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import {
  createLinkToken,
  exchangePublicToken,
  syncAccounts,
  syncTransactions,
} from "../../services/plaidApi";

const PlaidConnect = ({ onConnected }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLinkToken = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await createLinkToken();
      if (data?.linkToken) {
        setLinkToken(data.linkToken);
      }
    } catch (err) {
      console.warn("Plaid link token note:", err);
      // We store a user friendly note if Plaid environment is missing credentials
      setError(err.message || "Plaid link token creation failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinkToken();
  }, [fetchLinkToken]);

  const onSuccess = useCallback(
    async (publicToken, metadata) => {
      try {
        setLoading(true);
        setError("");

        const exchangeResponse = await exchangePublicToken({
          publicToken,
          institutionId: metadata?.institution?.institution_id,
          institutionName: metadata?.institution?.name,
        });

        const itemId = exchangeResponse.itemId;
        await syncAccounts(itemId).catch(() => {});
        await syncTransactions(itemId).catch(() => {});

        if (onConnected) {
          await onConnected();
        }
      } catch (err) {
        setError(err.message || "Error completing Plaid link.");
      } finally {
        setLoading(false);
      }
    },
    [onConnected]
  );

  const config = {
    token: linkToken,
    onSuccess,
    onExit: (err) => {
      if (err) console.error("Plaid exit:", err);
    },
  };

  const { open, ready } = usePlaidLink(config);

  const handleClick = () => {
    if (ready && linkToken) {
      open();
    } else {
      setLoading(true);
      createLinkToken()
        .then((data) => {
          if (data?.linkToken) {
            setLinkToken(data.linkToken);
            open();
          }
        })
        .catch((err) => {
          setError(err.message || "Plaid credentials not configured.");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-violet-600
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-lg
          transition
          hover:bg-violet-700
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? "Connecting..." : "Connect Bank Account"}
      </button>

      {error && (
        <span className="text-xs text-red-400 font-medium">{error}</span>
      )}
    </div>
  );
};

export default PlaidConnect;