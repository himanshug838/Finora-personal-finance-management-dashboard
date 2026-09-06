import express from "express";

import helmet from "helmet";

import cors from "cors";

import morgan from "morgan";

import cookieParser from "cookie-parser";

// ============================================
// ROUTES
// ============================================

import authRoute from "../routes/auth.routes.js";

import accountRoute from "../routes/account.routes.js";

import transactionRoute from "../routes/transaction.routes.js";

import budgetRoute from "../routes/budget.routes.js";

import investmentRoute from "../routes/investment.routes.js";

import dashboardRoute from "../routes/dashboard.routes.js";

import plaidRoute from "../routes/plaid.routes.js";

import notificationRoute from "../routes/notification.routes.js";

import netWorthRoute from "../routes/netWorth.routes.js";

import netWorthSnapshotRoute from "../routes/netWorthSnapshot.routes.js";

import recurringTransactionRoute from "../routes/recurringTransaction.routes.js";

import analyticsRoute from "../routes/analytics.routes.js";

import searchRoute from "../routes/search.routes.js";

import profileRoute from "../routes/profile.routes.js";

import securityRoute from "../routes/security.routes.js";

// ============================================
// ERROR MIDDLEWARE
// ============================================

import notFound from "../middleware/notFound.middle.js";

import errorHandler from "../middleware/errorHandler.middle.js";

const app = express();

// ============================================
// SECURITY
// ============================================

app.use(helmet());

// ============================================
// CORS
// ============================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ============================================
// LOGGER
// ============================================

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ============================================
// BODY PARSERS
// ============================================

app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);

// ============================================
// COOKIE PARSER
// ============================================

app.use(cookieParser());

// ============================================
// HEALTH CHECK
// ============================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Finora / PFM Dashboard API is running",
  });
});

// ============================================
// API ROUTES
// ============================================

app.use("/api/v1/auth", authRoute);

app.use("/api/v1/accounts", accountRoute);

app.use("/api/v1/transactions", transactionRoute);

app.use("/api/v1/budgets", budgetRoute);

app.use("/api/v1/investments", investmentRoute);

app.use("/api/v1/dashboard", dashboardRoute);

app.use("/api/v1/plaid", plaidRoute);

app.use("/api/v1/notifications", notificationRoute);

app.use("/api/v1/net-worth", netWorthRoute);

app.use("/api/v1/net-worth-snapshots", netWorthSnapshotRoute);

app.use("/api/v1/recurring-transactions", recurringTransactionRoute);

app.use("/api/v1/analytics", analyticsRoute);

app.use("/api/v1/search", searchRoute);

app.use("/api/v1/profile", profileRoute);

app.use("/api/v1/security", securityRoute);

// ============================================
// 404 HANDLER
// ============================================

app.use(notFound);

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);

export default app;
