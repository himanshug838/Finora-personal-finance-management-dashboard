import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

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
import financialGoalRoute from "../routes/financialGoal.routes.js";
import recurringTransactionRoute from "../routes/recurringTransaction.routes.js";
import analyticsRoute from "../routes/analytics.routes.js";
import searchRoute from "../routes/search.routes.js";
import profileRouter from "../routes/profile.routes.js";


// Finora-personal-finance-management-dashboard

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));

// Logger
app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser());




// Routes
app.get("/", (req, res) => {
  res.json({ message: "pfm dashboard is running" });
});


app.use("/api/v1/auth", authRoute);
app.use("/api/v1/accounts", accountRoute);
app.use("/api/v1/transactions", transactionRoute);
app.use("/api/v1/budgets", budgetRoute);
app.use("/api/v1/investments", investmentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/net-worth", netWorthRoute);
app.use("/api/v1/plaid",plaidRoute);
app.use("/api/v1/notifications",notificationRoute);
app.use("/api/v1/net-worth-snapshots",netWorthSnapshotRoute);
app.use("/api/v1/goals",financialGoalRoute);
app.use("/api/v1/recurring-transactions",recurringTransactionRoute);
app.use("/api/v1/analytics",analyticsRoute);
app.use("/api/v1/search",searchRoute);
app.use("/api/v1/profile",profileRouter);


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export default app;