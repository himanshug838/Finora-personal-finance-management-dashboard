import express from "express";

import {
  createBudget,
  getBudgets,
  getBudget,
  getBudgetProgress,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";

import {
  validateBudget,
  validateBudgetUpdate,
} from "../validators/budget.validator.js";

const budgetRoute = express.Router();

// All budget routes require authentication
budgetRoute.use(verificationToken);

// Create budget
budgetRoute.post("/", validateBudget, createBudget);

// Get all budgets
budgetRoute.get("/", getBudgets);

// Get single budget
budgetRoute.get("/:id", getBudget);

// Get budget progress
budgetRoute.get("/:id/progress", getBudgetProgress);

// Update budget
budgetRoute.put("/:id", validateBudgetUpdate, updateBudget);

// Delete budget
budgetRoute.delete("/:id", deleteBudget);

export default budgetRoute;
