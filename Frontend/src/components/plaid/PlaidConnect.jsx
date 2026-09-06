import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  usePlaidLink,
} from "react-plaid-link";

import {
  createLinkToken,
  exchangePublicToken,
  syncAccounts,
  syncTransactions,
} from "../../services/plaidApi";


const PlaidConnect = ({
  onConnected,
}) => {

  const [
    linkToken,
    setLinkToken,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Generate Link Token
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const generateLinkToken =
      async () => {

        try {

          setError("");

          const data =
            await createLinkToken();

          setLinkToken(
            data.linkToken
          );

        } catch (error) {

          setError(
            error.message
          );

        }

      };


    generateLinkToken();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Successful Plaid Link
  |--------------------------------------------------------------------------
  */

  const onSuccess =
    useCallback(
      async (
        publicToken,
        metadata
      ) => {

        try {

          setLoading(true);

          setError("");


          /*
          |--------------------------------------------------------------------------
          | Exchange token
          |--------------------------------------------------------------------------
          */

          const exchangeResponse =
            await exchangePublicToken({

              publicToken,

              institutionId:
                metadata
                  ?.institution
                  ?.institution_id,

              institutionName:
                metadata
                  ?.institution
                  ?.name,

            });


          const itemId =
            exchangeResponse.itemId;


          /*
          |--------------------------------------------------------------------------
          | Sync accounts
          |--------------------------------------------------------------------------
          */

          await syncAccounts(
            itemId
          );


          /*
          |--------------------------------------------------------------------------
          | Sync transactions
          |--------------------------------------------------------------------------
          */

          await syncTransactions(
            itemId
          );


          /*
          |--------------------------------------------------------------------------
          | Notify parent
          |--------------------------------------------------------------------------
          */

          if (onConnected) {

            await onConnected();

          }

        } catch (error) {

          setError(
            error.message
          );

        } finally {

          setLoading(false);

        }

      },
      [onConnected]
    );


  /*
  |--------------------------------------------------------------------------
  | Plaid Link configuration
  |--------------------------------------------------------------------------
  */

  const config = {

    token: linkToken,

    onSuccess,

    onExit: (
      error,
    ) => {

      if (error) {

        console.error(
          "Plaid Link error:",
          error
        );

      }

    },

  };


  const {
    open,
    ready,
  } = usePlaidLink(config);


  return (

    <div className="space-y-3">

      <button

        type="button"

        onClick={() => open()}

        disabled={
          !ready ||
          loading
        }

        className="
          rounded-xl
          bg-black
          px-5
          py-3
          text-white
          font-medium
          transition
          hover:scale-[1.02]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "

      >

        {loading
          ? "Connecting..."
          : "Connect Bank Account"}

      </button>


      {error && (

        <p className="text-sm text-red-500">

          {error}

        </p>

      )}

    </div>

  );

};


export default PlaidConnect;