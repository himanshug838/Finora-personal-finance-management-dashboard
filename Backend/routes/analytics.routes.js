import express from "express";

import {
    getOverview,
    getIncomeExpense,
    getSpending,
    getMonthlyTrend,
    getBudgetAnalytics,
    getInvestmentAnalyticsData,
    getNetWorthAnalyticsData,
    getReport
} from "../controllers/analytics.controller.js";

import verificationToken
    from "../middleware/verifyToken.middle.js";

import {
    validateAnalyticsDateRange,
    validateMonths
} from "../validators/analytics.validator.js";


const router = express.Router();


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(verificationToken);


/*
|--------------------------------------------------------------------------
| Advanced Analytics
|--------------------------------------------------------------------------
*/


// Overall financial analytics
router.get(
    "/overview",
    validateAnalyticsDateRange,
    getOverview
);


// Income vs Expense
router.get(
    "/income-expense",
    validateAnalyticsDateRange,
    getIncomeExpense
);


// Spending by category
router.get(
    "/spending",
    validateAnalyticsDateRange,
    getSpending
);


// Monthly income / expense trends
router.get(
    "/monthly-trends",
    validateMonths,
    getMonthlyTrend
);


// Budget performance
router.get(
    "/budget-performance",
    getBudgetAnalytics
);


// Investment analytics
router.get(
    "/investments",
    getInvestmentAnalyticsData
);


// Net worth analytics
router.get(
    "/net-worth",
    validateMonths,
    getNetWorthAnalyticsData
);


// Complete financial report
router.get(
    "/report",
    validateAnalyticsDateRange,
    getReport
);


export default router;