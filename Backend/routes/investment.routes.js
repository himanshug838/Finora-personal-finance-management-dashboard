import express from "express";

import {
  createInvestment,
  getInvestments,
  getInvestment,
  updateInvestment,
  deleteInvestment,
} from "../controllers/investment.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";

import {
  validateInvestment,
  validateInvestmentUpdate,
} from "../validators/investment.validator.js";


const investmentRoute =
  express.Router();


// All investment routes require login
investmentRoute.use(
  verificationToken
);


// Create investment
investmentRoute.post(
  "/",
  validateInvestment,
  createInvestment
);


// Get all investments
investmentRoute.get(
  "/",
  getInvestments
);


// Get single investment
investmentRoute.get(
  "/:id",
  getInvestment
);


// Update investment
investmentRoute.put(
  "/:id",
  validateInvestmentUpdate,
  updateInvestment
);


// Delete investment
investmentRoute.delete(
  "/:id",
  deleteInvestment
);


export default investmentRoute;