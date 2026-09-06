import express from "express";

import {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/account.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";

const accountRoute = express.Router();


// All account routes are protected
accountRoute.use(verificationToken);


// Create account
accountRoute.post("/", createAccount);


// Get all accounts
accountRoute.get("/", getAccounts);


// Get single account
accountRoute.get("/:id", getAccount);


// Update account
accountRoute.put("/:id", updateAccount);


// Delete account
accountRoute.delete("/:id", deleteAccount);


export default accountRoute;