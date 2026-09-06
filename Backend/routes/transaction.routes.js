import express from "express";

import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";

import {
  validateTransaction,
  validateTransactionUpdate,
} from "../validators/transaction.validator.js";


const transactionRoute =
  express.Router();


// Every transaction API requires JWT
transactionRoute.use(
  verificationToken
);


// Create transaction
transactionRoute.post(
  "/",
  validateTransaction,
  createTransaction
);


// Get all transactions
transactionRoute.get(
  "/",
  getTransactions
);


// Get single transaction
transactionRoute.get(
  "/:id",
  getTransaction
);


// Update transaction
transactionRoute.put(
  "/:id",
  validateTransactionUpdate,
  updateTransaction
);


// Delete transaction
transactionRoute.delete(
  "/:id",
  deleteTransaction
);


export default transactionRoute;