const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000/api/v1`
    : "http://localhost:5000/api/v1");


const getToken = () => {
  const rawToken = localStorage.getItem("token");
  return (rawToken && rawToken !== "undefined" && rawToken !== "null") ? rawToken : "";
};


/*
|--------------------------------------------------------------------------
| Common headers
|--------------------------------------------------------------------------
*/

const getHeaders = () => {

  const token =
    getToken();

  return {

    "Content-Type":
      "application/json",

    Authorization:
      `Bearer ${token}`,

  };

};


/*
|--------------------------------------------------------------------------
| CREATE LINK TOKEN
|--------------------------------------------------------------------------
*/

export const createLinkToken =
  async () => {

    const response =
      await fetch(
        `${API_URL}/plaid/create-link-token`,
        {
          method: "POST",
          headers:
            getHeaders(),
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to create Plaid Link token"
      );

    }


    return data;

  };


/*
|--------------------------------------------------------------------------
| EXCHANGE PUBLIC TOKEN
|--------------------------------------------------------------------------
*/

export const exchangePublicToken =
  async ({
    publicToken,
    institutionId,
    institutionName,
  }) => {

    const response =
      await fetch(
        `${API_URL}/plaid/exchange-token`,
        {

          method: "POST",

          headers:
            getHeaders(),

          body: JSON.stringify({

            publicToken,

            institutionId,

            institutionName,

          }),

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to connect bank"
      );

    }


    return data;

  };


/*
|--------------------------------------------------------------------------
| GET CONNECTED BANKS
|--------------------------------------------------------------------------
*/

export const getConnectedBanks =
  async () => {

    const response =
      await fetch(
        `${API_URL}/plaid/items`,
        {

          method: "GET",

          headers:
            getHeaders(),

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to fetch connected banks"
      );

    }


    return data;

  };


/*
|--------------------------------------------------------------------------
| SYNC ACCOUNTS
|--------------------------------------------------------------------------
*/

export const syncAccounts =
  async (itemId) => {

    const response =
      await fetch(
        `${API_URL}/plaid/sync-accounts/${itemId}`,
        {

          method: "POST",

          headers:
            getHeaders(),

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to sync accounts"
      );

    }


    return data;

  };


/*
|--------------------------------------------------------------------------
| SYNC TRANSACTIONS
|--------------------------------------------------------------------------
*/

export const syncTransactions =
  async (itemId) => {

    const response =
      await fetch(
        `${API_URL}/plaid/sync-transactions/${itemId}`,
        {

          method: "POST",

          headers:
            getHeaders(),

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to sync transactions"
      );

    }


    return data;

  };


/*
|--------------------------------------------------------------------------
| DISCONNECT BANK
|--------------------------------------------------------------------------
*/

export const disconnectBank =
  async (itemId) => {

    const response =
      await fetch(
        `${API_URL}/plaid/items/${itemId}`,
        {

          method: "DELETE",

          headers:
            getHeaders(),

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to disconnect bank"
      );

    }


    return data;

  };