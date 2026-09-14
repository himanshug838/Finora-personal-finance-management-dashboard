import mongoose from "mongoose";

import plaidClient from "../config/plaid.config.js";

import PlaidItem from "../models/plaidItem.model.js";
import Account from "../models/account.model.js";
import Transaction from "../models/transaction.model.js";

import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";

import {
  encryptPlaidToken,
  decryptPlaidToken,
} from "../utils/plaidCrypto.util.js";


/*
|--------------------------------------------------------------------------
| CREATE LINK TOKEN
|--------------------------------------------------------------------------
|
| POST /api/v1/plaid/create-link-token
|--------------------------------------------------------------------------
*/

const createLinkToken = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;

    try {
      const response = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: userId.toString(),
        },
        client_name: "Personal Finance Management Dashboard",
        products: ["transactions"],
        country_codes: [process.env.PLAID_COUNTRY_CODES || "US"],
        language: "en",
      });

      res.status(200).json({
        success: true,
        linkToken: response.data.link_token,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message ||
        error.message ||
        "Plaid service configuration issue";

      res.status(400).json({
        success: false,
        message: `Plaid Integration: ${errorMessage}`,
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| EXCHANGE PUBLIC TOKEN
|--------------------------------------------------------------------------
|
| POST /api/v1/plaid/exchange-token
|--------------------------------------------------------------------------
*/

const exchangePublicToken =
  asyncHandler(
    async (req, res) => {

      const userId = req.user.id;

      const {
        publicToken,
        institutionId,
        institutionName,
      } = req.body;


      if (!publicToken) {

        throw new ApiError(
          400,
          "Plaid public token is required"
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Exchange public token
      |--------------------------------------------------------------------------
      */

      const response =
        await plaidClient.itemPublicTokenExchange(
          {
            public_token:
              publicToken,
          }
        );


      const {
        access_token,
        item_id,
      } = response.data;


      /*
      |--------------------------------------------------------------------------
      | Encrypt access token
      |--------------------------------------------------------------------------
      */

      const encryptedAccessToken =
        encryptPlaidToken(
          access_token
        );


      /*
      |--------------------------------------------------------------------------
      | Prevent duplicate Item
      |--------------------------------------------------------------------------
      */

      const existingItem =
        await PlaidItem.findOne({
          itemId: item_id,
        });


      if (existingItem) {

        throw new ApiError(
          409,
          "This bank is already connected"
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Save Item
      |--------------------------------------------------------------------------
      */

      const plaidItem =
        await PlaidItem.create({

          user: userId,

          itemId: item_id,

          accessToken:
            encryptedAccessToken,

          institutionId:
            institutionId || "",

          institutionName:
            institutionName || "",

          status: "active",

        });


      res.status(201).json({

        success: true,

        message:
          "Bank connected successfully",

        itemId:
          plaidItem._id,

      });

    }
  );


/*
|--------------------------------------------------------------------------
| GET CONNECTED BANKS
|--------------------------------------------------------------------------
|
| GET /api/v1/plaid/items
|--------------------------------------------------------------------------
*/

const getConnectedBanks =
  asyncHandler(
    async (req, res) => {

      const userId = req.user.id;


      const items =
        await PlaidItem.find({

          user: userId,

          isActive: true,

        })
        .select(
          "-accessToken -__v"
        )
        .sort({
          createdAt: -1,
        });


      res.status(200).json({

        success: true,

        count:
          items.length,

        items,

      });

    }
  );


/*
|--------------------------------------------------------------------------
| SYNC ACCOUNTS
|--------------------------------------------------------------------------
|
| POST /api/v1/plaid/sync-accounts/:itemId
|--------------------------------------------------------------------------
*/

const syncAccounts =
  asyncHandler(
    async (req, res) => {

      const userId = req.user.id;

      const {
        itemId,
      } = req.params;


      const plaidItem =
        await PlaidItem.findOne({

          _id: itemId,

          user: userId,

          isActive: true,

        })
        .select(
          "+accessToken"
        );


      if (!plaidItem) {

        throw new ApiError(
          404,
          "Connected bank not found"
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Decrypt access token
      |--------------------------------------------------------------------------
      */

      const accessToken =
        decryptPlaidToken(
          plaidItem.accessToken
        );


      /*
      |--------------------------------------------------------------------------
      | Get accounts
      |--------------------------------------------------------------------------
      */

      const response =
        await plaidClient.accountsGet({

          access_token:
            accessToken,

        });


      const plaidAccounts =
        response.data.accounts;


      const savedAccounts = [];


      /*
      |--------------------------------------------------------------------------
      | Save accounts
      |--------------------------------------------------------------------------
      */

      for (
        const plaidAccount
        of plaidAccounts
      ) {

        const accountType =
          mapPlaidAccountType(
            plaidAccount.type,
            plaidAccount.subtype
          );


        const account =
          await Account.findOneAndUpdate(

            {
              user: userId,

              plaidAccountId:
                plaidAccount.account_id,

            },

            {

              user: userId,

              accountName:
                plaidAccount.name,

              institutionName:
                plaidItem.institutionName,

              accountType,

              balance:
                plaidAccount.balances.current ??
                0,

              currency:
                plaidAccount
                  .balances
                  .iso_currency_code ||
                "USD",

              source: "plaid",

              plaidAccountId:
                plaidAccount.account_id,

              isActive: true,

            },

            {

              new: true,

              upsert: true,

              runValidators: true,

            }

          );


        savedAccounts.push(
          account
        );

      }


      plaidItem.lastSyncedAt =
        new Date();

      await plaidItem.save();


      res.status(200).json({

        success: true,

        message:
          "Accounts synchronized successfully",

        count:
          savedAccounts.length,

        accounts:
          savedAccounts.map(
            (account) => ({

              id: account._id,

              accountName:
                account.accountName,

              institutionName:
                account.institutionName,

              accountType:
                account.accountType,

              balance:
                account.balance,

              currency:
                account.currency,

              source:
                account.source,

            })
          ),

      });

    }
  );


/*
|--------------------------------------------------------------------------
| SYNC TRANSACTIONS
|--------------------------------------------------------------------------
|
| POST /api/v1/plaid/sync-transactions/:itemId
|--------------------------------------------------------------------------
|
| Uses transactionsSync with cursor pagination.
|--------------------------------------------------------------------------
*/

const syncTransactions =
  asyncHandler(
    async (req, res) => {

      const userId = req.user.id;

      const {
        itemId,
      } = req.params;


      const plaidItem =
        await PlaidItem.findOne({

          _id: itemId,

          user: userId,

          isActive: true,

        })
        .select(
          "+accessToken"
        );


      if (!plaidItem) {

        throw new ApiError(
          404,
          "Connected bank not found"
        );

      }


      const accessToken =
        decryptPlaidToken(
          plaidItem.accessToken
        );


      /*
      |--------------------------------------------------------------------------
      | Find user's Plaid accounts
      |--------------------------------------------------------------------------
      */

      const accounts =
        await Account.find({

          user: userId,

          source: "plaid",

          isActive: true,

        });


      const accountMap =
        new Map();


      accounts.forEach(
        (account) => {

          accountMap.set(
            account.plaidAccountId,
            account._id
          );

        }
      );


      /*
      |--------------------------------------------------------------------------
      | Cursor
      |--------------------------------------------------------------------------
      */

      let cursor =
        plaidItem.syncCursor || "";


      let hasMore = true;

      let addedCount = 0;

      let modifiedCount = 0;

      let removedCount = 0;


      /*
      |--------------------------------------------------------------------------
      | Sync loop
      |--------------------------------------------------------------------------
      */

      while (hasMore) {

        const response =
          await plaidClient.transactionsSync({

            access_token:
              accessToken,

            cursor:
              cursor || undefined,

          });


        const data =
          response.data;


        /*
        |--------------------------------------------------------------------------
        | ADDED TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        for (
          const plaidTransaction
          of data.added
        ) {

          const accountId =
            accountMap.get(
              plaidTransaction.account_id
            );


          if (!accountId) {
            continue;
          }


          const transactionType =
            plaidTransaction.amount < 0
              ? "income"
              : "expense";


          const amount =
            Math.abs(
              plaidTransaction.amount
            );


          const category =
            getPlaidCategory(
              plaidTransaction
            );


          await Transaction.findOneAndUpdate(

            {
              plaidTransactionId:
                plaidTransaction.transaction_id,

            },

            {

              user: userId,

              account:
                accountId,

              type:
                transactionType,

              category,

              amount,

              description:
                plaidTransaction.name,

              date:
                new Date(
                  plaidTransaction.date
                ),

              source:
                "plaid",

              plaidTransactionId:
                plaidTransaction.transaction_id,

              isActive: true,

            },

            {

              upsert: true,

              new: true,

              runValidators: true,

            }

          );


          addedCount++;

        }


        /*
        |--------------------------------------------------------------------------
        | MODIFIED TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        for (
          const plaidTransaction
          of data.modified
        ) {

          const accountId =
            accountMap.get(
              plaidTransaction.account_id
            );


          if (!accountId) {
            continue;
          }


          await Transaction.findOneAndUpdate(

            {

              plaidTransactionId:
                plaidTransaction.transaction_id,

              user: userId,

            },

            {

              account:
                accountId,

              type:
                plaidTransaction.amount < 0
                  ? "income"
                  : "expense",

              category:
                getPlaidCategory(
                  plaidTransaction
                ),

              amount:
                Math.abs(
                  plaidTransaction.amount
                ),

              description:
                plaidTransaction.name,

              date:
                new Date(
                  plaidTransaction.date
                ),

            },

            {

              new: true,

              runValidators: true,

            }

          );


          modifiedCount++;

        }


        /*
        |--------------------------------------------------------------------------
        | REMOVED TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        for (
          const removedTransaction
          of data.removed
        ) {

          await Transaction.findOneAndUpdate(

            {

              plaidTransactionId:
                removedTransaction.transaction_id,

              user: userId,

            },

            {

              isActive: false,

            }

          );


          removedCount++;

        }


        /*
        |--------------------------------------------------------------------------
        | Save cursor
        |--------------------------------------------------------------------------
        */

        cursor =
          data.next_cursor;


        hasMore =
          data.has_more;

      }


      /*
      |--------------------------------------------------------------------------
      | Save cursor
      |--------------------------------------------------------------------------
      */

      plaidItem.syncCursor =
        cursor;

      plaidItem.lastSyncedAt =
        new Date();

      await plaidItem.save();


      res.status(200).json({

        success: true,

        message:
          "Transactions synchronized successfully",

        added:
          addedCount,

        modified:
          modifiedCount,

        removed:
          removedCount,

      });

    }
  );


/*
|--------------------------------------------------------------------------
| DISCONNECT BANK
|--------------------------------------------------------------------------
|
| DELETE /api/v1/plaid/items/:itemId
|--------------------------------------------------------------------------
*/

const disconnectBank =
  asyncHandler(
    async (req, res) => {

      const userId = req.user.id;

      const {
        itemId,
      } = req.params;


      const plaidItem =
        await PlaidItem.findOne({

          _id: itemId,

          user: userId,

          isActive: true,

        })
        .select(
          "+accessToken"
        );


      if (!plaidItem) {

        throw new ApiError(
          404,
          "Connected bank not found"
        );

      }


      const accessToken =
        decryptPlaidToken(
          plaidItem.accessToken
        );


      /*
      |--------------------------------------------------------------------------
      | Remove Item from Plaid
      |--------------------------------------------------------------------------
      */

      await plaidClient.itemRemove({

        access_token:
          accessToken,

      });


      /*
      |--------------------------------------------------------------------------
      | Soft delete Item
      |--------------------------------------------------------------------------
      */

      plaidItem.isActive =
        false;

      plaidItem.status =
        "disconnected";

      await plaidItem.save();


      /*
      |--------------------------------------------------------------------------
      | Disable linked accounts
      |--------------------------------------------------------------------------
      */

      await Account.updateMany(

        {

          user: userId,

          source: "plaid",

          /*
           * Ideally use the specific Plaid
           * account IDs belonging to this Item.
           */

        },

        {

          isActive: false,

        }

      );


      res.status(200).json({

        success: true,

        message:
          "Bank disconnected successfully",

      });

    }
  );


/*
|--------------------------------------------------------------------------
| PLAID ACCOUNT TYPE MAPPER
|--------------------------------------------------------------------------
*/

const mapPlaidAccountType =
  (type, subtype) => {

    if (type === "credit") {

      return "credit_card";

    }


    if (type === "loan") {

      return "loan";

    }


    if (type === "investment") {

      return "investment";

    }


    if (type === "depository") {

      return "bank";

    }


    return "other";

  };


/*
|--------------------------------------------------------------------------
| PLAID CATEGORY
|--------------------------------------------------------------------------
*/

const getPlaidCategory =
  (transaction) => {

    const primary =
      transaction
        .personal_finance_category
        ?.primary;


    if (primary) {

      return primary
        .toLowerCase()
        .replaceAll("_", " ");

    }


    return "other";

  };


export {
  createLinkToken,
  exchangePublicToken,
  getConnectedBanks,
  syncAccounts,
  syncTransactions,
  disconnectBank,
};