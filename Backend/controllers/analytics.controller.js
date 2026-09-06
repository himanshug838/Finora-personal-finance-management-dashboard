import {
    getAnalyticsOverview,
    getIncomeExpenseAnalytics,
    getSpendingAnalytics,
    getMonthlyTrends,
    getBudgetPerformance,
    getInvestmentAnalytics,
    getNetWorthAnalytics,
    getFinancialReport
} from "../services/analytics.service.js";


/*
|--------------------------------------------------------------------------
| Analytics Overview
|--------------------------------------------------------------------------
*/

export const getOverview = async (req, res) => {

    const userId = req.user.id;

    const {
        startDate,
        endDate
    } = req.query;


    const data =
        await getAnalyticsOverview(
            userId,
            startDate,
            endDate
        );


    res.status(200).json({

        success: true,

        message:
            "Analytics overview fetched successfully",

        data
    });
};


/*
|--------------------------------------------------------------------------
| Income vs Expense
|--------------------------------------------------------------------------
*/

export const getIncomeExpense = async (
    req,
    res
) => {

    const userId = req.user.id;

    const {
        startDate,
        endDate
    } = req.query;


    const data =
        await getIncomeExpenseAnalytics(
            userId,
            startDate,
            endDate
        );


    res.status(200).json({

        success: true,

        message:
            "Income and expense analytics fetched successfully",

        data
    });
};


/*
|--------------------------------------------------------------------------
| Spending Analytics
|--------------------------------------------------------------------------
*/

export const getSpending = async (
    req,
    res
) => {

    const userId = req.user.id;

    const {
        startDate,
        endDate
    } = req.query;


    const data =
        await getSpendingAnalytics(
            userId,
            startDate,
            endDate
        );


    res.status(200).json({

        success: true,

        message:
            "Spending analytics fetched successfully",

        data
    });
};


/*
|--------------------------------------------------------------------------
| Monthly Trends
|--------------------------------------------------------------------------
*/

export const getMonthlyTrend = async (
    req,
    res
) => {

    const {
        months = 6
    } = req.query;


    const data =
        await getMonthlyTrends(
            req.user.id,
            months
        );


    res.status(200).json({

        success: true,

        message:
            "Monthly financial trends fetched successfully",

        data
    });
};


/*
|--------------------------------------------------------------------------
| Budget Performance
|--------------------------------------------------------------------------
*/

export const getBudgetAnalytics = async (
    req,
    res
) => {

    const data =
        await getBudgetPerformance(
            req.user.id
        );


    res.status(200).json({

        success: true,

        message:
            "Budget performance fetched successfully",

        data
    });
};


/*
|--------------------------------------------------------------------------
| Investment Analytics
|--------------------------------------------------------------------------
*/

export const getInvestmentAnalyticsData = async (
    req,
    res
) => {

    const data =
        await getInvestmentAnalytics(
            req.user.id
        );


    res.status(200).json({

        success: true,

        message:
            "Investment analytics fetched successfully",

        data
    });
};


/*
|--------------------------------------------------------------------------
| Net Worth Analytics
|--------------------------------------------------------------------------
*/

export const getNetWorthAnalyticsData = async (
    req,
    res
) => {

    const {
        months = 6
    } = req.query;


    const data =
        await getNetWorthAnalytics(
            req.user.id,
            months
        );


    res.status(200).json({

        success: true,

        message:
            "Net worth analytics fetched successfully",

        data
    });
};


/*
|--------------------------------------------------------------------------
| Complete Financial Report
|--------------------------------------------------------------------------
*/

export const getReport = async (
    req,
    res
) => {

    const userId = req.user.id;

    const {
        startDate,
        endDate
    } = req.query;


    const data =
        await getFinancialReport(
            userId,
            startDate,
            endDate
        );


    res.status(200).json({

        success: true,

        message:
            "Financial report generated successfully",

        data
    });
};