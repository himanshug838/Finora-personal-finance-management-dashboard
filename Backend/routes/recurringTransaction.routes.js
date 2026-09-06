import express from "express";

import {
    createRecurringTransaction,
    getRecurringTransactions,
    getRecurringTransaction,
    updateRecurringTransaction,
    pauseRecurringTransaction,
    resumeRecurringTransaction,
    deleteRecurringTransaction,
    getRecurringTransactionSummary
} from "../controllers/recurringTransaction.controller.js";

import verificationToken
    from "../middleware/verifyToken.middle.js";

const router =
    express.Router();

router.use(
    verificationToken
);


// ==========================================
// SUMMARY
// ==========================================

router.get(
    "/summary",
    getRecurringTransactionSummary
);


// ==========================================
// CRUD
// ==========================================

router.post(
    "/",
    createRecurringTransaction
);

router.get(
    "/",
    getRecurringTransactions
);

router.get(
    "/:id",
    getRecurringTransaction
);

router.put(
    "/:id",
    updateRecurringTransaction
);


// ==========================================
// STATUS
// ==========================================

router.patch(
    "/:id/pause",
    pauseRecurringTransaction
);

router.patch(
    "/:id/resume",
    resumeRecurringTransaction
);


// ==========================================
// DELETE / CANCEL
// ==========================================

router.delete(
    "/:id",
    deleteRecurringTransaction
);


export default router;