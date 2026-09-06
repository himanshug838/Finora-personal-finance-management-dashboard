import express from "express";

import {
  createLinkToken,
  exchangePublicToken,
  getConnectedBanks,
  syncAccounts,
  syncTransactions,
  disconnectBank,
} from "../controllers/plaid.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";


const plaidRoute =
  express.Router();


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

plaidRoute.use(
  verificationToken
);


/*
|--------------------------------------------------------------------------
| CREATE LINK TOKEN
|--------------------------------------------------------------------------
*/

plaidRoute.post(
  "/create-link-token",
  createLinkToken
);


/*
|--------------------------------------------------------------------------
| EXCHANGE PUBLIC TOKEN
|--------------------------------------------------------------------------
*/

plaidRoute.post(
  "/exchange-token",
  exchangePublicToken
);


/*
|--------------------------------------------------------------------------
| CONNECTED BANKS
|--------------------------------------------------------------------------
*/

plaidRoute.get(
  "/items",
  getConnectedBanks
);


/*
|--------------------------------------------------------------------------
| SYNC ACCOUNTS
|--------------------------------------------------------------------------
*/

plaidRoute.post(
  "/sync-accounts/:itemId",
  syncAccounts
);


/*
|--------------------------------------------------------------------------
| SYNC TRANSACTIONS
|--------------------------------------------------------------------------
*/

plaidRoute.post(
  "/sync-transactions/:itemId",
  syncTransactions
);


/*
|--------------------------------------------------------------------------
| DISCONNECT
|--------------------------------------------------------------------------
*/

plaidRoute.delete(
  "/items/:itemId",
  disconnectBank
);


export default plaidRoute;