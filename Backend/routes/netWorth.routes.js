import express from "express";

import {
    getNetWorth,
    getNetWorthBreakdown,
    getNetWorthSummary,
    getNetWorthHistory
} from "../controllers/netWorth.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";

const router = express.Router();

// ==========================================
// AUTHENTICATION
// ==========================================

router.use(verificationToken);

// ==========================================
// CURRENT NET WORTH
// ==========================================

router.get("/", getNetWorth);

// ==========================================
// NET WORTH BREAKDOWN
// ==========================================

router.get("/breakdown", getNetWorthBreakdown);

// ==========================================
// NET WORTH SUMMARY
// ==========================================

router.get("/summary", getNetWorthSummary);

// ==========================================
// NET WORTH HISTORY
// ==========================================

router.get("/history", getNetWorthHistory);

export default router;