import express from "express";

import {
    createFinancialGoal,
    getFinancialGoals,
    getFinancialGoal,
    updateFinancialGoal,
    addMoneyToGoal,
    withdrawMoneyFromGoal,
    deleteFinancialGoal,
    getFinancialGoalSummary
} from "../controllers/financialGoal.controller.js";

import verificationToken
    from "../middleware/verifyToken.middle.js";

const router = express.Router();

// ==========================================
// AUTHENTICATION
// ==========================================

router.use(verificationToken);

// ==========================================
// SUMMARY
// ==========================================

router.get(
    "/summary",
    getFinancialGoalSummary
);

// ==========================================
// CREATE GOAL
// ==========================================

router.post(
    "/",
    createFinancialGoal
);

// ==========================================
// GET ALL GOALS
// ==========================================

router.get(
    "/",
    getFinancialGoals
);

// ==========================================
// GET SINGLE GOAL
// ==========================================

router.get(
    "/:id",
    getFinancialGoal
);

// ==========================================
// UPDATE GOAL
// ==========================================

router.put(
    "/:id",
    updateFinancialGoal
);

// ==========================================
// ADD MONEY
// ==========================================

router.post(
    "/:id/add",
    addMoneyToGoal
);

// ==========================================
// WITHDRAW MONEY
// ==========================================

router.post(
    "/:id/withdraw",
    withdrawMoneyFromGoal
);

// ==========================================
// DELETE GOAL
// ==========================================

router.delete(
    "/:id",
    deleteFinancialGoal
);

export default router;