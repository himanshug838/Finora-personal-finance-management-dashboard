import express from "express";

import {
    createSnapshot,
    getSnapshotHistory,
    getLatestSnapshot
} from "../controllers/netWorthSnapshot.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";

const router = express.Router();

// ==========================================
// AUTHENTICATION
// ==========================================

router.use(verificationToken);

// ==========================================
// CREATE SNAPSHOT
// ==========================================

router.post("/", createSnapshot);

// ==========================================
// SNAPSHOT HISTORY
// ==========================================

router.get("/history", getSnapshotHistory);

// ==========================================
// LATEST SNAPSHOT
// ==========================================

router.get("/latest", getLatestSnapshot);

export default router;