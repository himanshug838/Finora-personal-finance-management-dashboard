import mongoose from "mongoose";

import Account from "../models/account.model.js";
import Transaction from "../models/transaction.model.js";
import Budget from "../models/budget.model.js";
import Investment from "../models/investment.model.js";

import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";


/*
|--------------------------------------------------------------------------
| GET DASHBOARD SUMMARY
|--------------------------------------------------------------------------
| GET /api/v1/dashboard
|
| Returns:
| - Total account balance
| - Monthly income
| - Monthly expenses
| - Monthly savings
| - Savings rate
| - Investment value
| - Investment profit/loss
| - Recent transactions
| - Spending by category
| - Budget progress
|--------------------------------------------------------------------------
*/

const getDashboard = asyncHandler(async (req, res) => {

  const userId = new mongoose.Types.ObjectId(req.user.id);

  /*
  |--------------------------------------------------------------------------
  | MONTH FILTER
  |--------------------------------------------------------------------------
  |
  | Example:
  | /api/v1/dashboard?month=9&year=2026
  |
  | If month/year are not provided,
  | current month/year will be used.
  |
  */

  const now = new Date();

  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  if (month < 1 || month > 12) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  if (year < 2000 || year > 2100) {
    throw new ApiError(400, "Invalid year");
  }


  /*
  |--------------------------------------------------------------------------
  | MONTH START / MONTH END
  |--------------------------------------------------------------------------
  */

  const startDate = new Date(year, month - 1, 1);

  const endDate = new Date(year, month, 1);


  /*
  |--------------------------------------------------------------------------
  | 1. TOTAL ACCOUNT BALANCE
  |--------------------------------------------------------------------------
  */

  const accountSummary = await Account.aggregate([
    {
      $match: {
        user: userId,
        isActive: true,
      },
    },

    {
      $group: {
        _id: null,
        totalBalance: {
          $sum: "$balance",
        },
      },
    },
  ]);

  const totalBalance =
    accountSummary.length > 0
      ? accountSummary[0].totalBalance
      : 0;


  /*
  |--------------------------------------------------------------------------
  | 2. MONTHLY INCOME
  |--------------------------------------------------------------------------
  */

  const incomeSummary = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "income",
        isActive: true,

        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },

    {
      $group: {
        _id: null,

        totalIncome: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const monthlyIncome =
    incomeSummary.length > 0
      ? incomeSummary[0].totalIncome
      : 0;


  /*
  |--------------------------------------------------------------------------
  | 3. MONTHLY EXPENSE
  |--------------------------------------------------------------------------
  */

  const expenseSummary = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        isActive: true,

        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },

    {
      $group: {
        _id: null,

        totalExpense: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const monthlyExpense =
    expenseSummary.length > 0
      ? expenseSummary[0].totalExpense
      : 0;


  /*
  |--------------------------------------------------------------------------
  | 4. SAVINGS
  |--------------------------------------------------------------------------
  */

  const savings = monthlyIncome - monthlyExpense;


  /*
  |--------------------------------------------------------------------------
  | 5. SAVINGS RATE
  |--------------------------------------------------------------------------
  */

  const savingsRate =
    monthlyIncome > 0
      ? Number(((savings / monthlyIncome) * 100).toFixed(2))
      : 0;


  /*
  |--------------------------------------------------------------------------
  | 6. INVESTMENT SUMMARY
  |--------------------------------------------------------------------------
  |
  | investedAmount = quantity × buyPrice
  | currentValue   = quantity × currentPrice
  | profitLoss     = currentValue - investedAmount
  |
  */

  const investmentSummary = await Investment.aggregate([
    {
      $match: {
        user: userId,
        isActive: true,
      },
    },

    {
      $project: {
        investedAmount: {
          $multiply: ["$quantity", "$buyPrice"],
        },

        currentValue: {
          $multiply: ["$quantity", "$currentPrice"],
        },
      },
    },

    {
      $group: {
        _id: null,

        totalInvested: {
          $sum: "$investedAmount",
        },

        totalCurrentValue: {
          $sum: "$currentValue",
        },
      },
    },
  ]);

  const totalInvested =
    investmentSummary.length > 0
      ? investmentSummary[0].totalInvested
      : 0;

  const investmentValue =
    investmentSummary.length > 0
      ? investmentSummary[0].totalCurrentValue
      : 0;

  const investmentProfitLoss =
    investmentValue - totalInvested;

  const investmentReturnPercentage =
    totalInvested > 0
      ? Number(
          ((investmentProfitLoss / totalInvested) * 100).toFixed(2)
        )
      : 0;


  /*
  |--------------------------------------------------------------------------
  | 7. SPENDING BY CATEGORY
  |--------------------------------------------------------------------------
  */

  const spendingByCategory = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        isActive: true,

        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },

    {
      $group: {
        _id: "$category",

        amount: {
          $sum: "$amount",
        },

        transactionCount: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        amount: -1,
      },
    },

    {
      $project: {
        _id: 0,

        category: "$_id",

        amount: 1,

        transactionCount: 1,
      },
    },
  ]);


  /*
  |--------------------------------------------------------------------------
  | 8. BUDGET PROGRESS
  |--------------------------------------------------------------------------
  */

  const budgets = await Budget.find({
    user: userId,
    isActive: true,

    startDate: {
      $lte: endDate,
    },

    endDate: {
      $gte: startDate,
    },
  }).lean();


  const budgetProgress = await Promise.all(
    budgets.map(async (budget) => {

      const expenseSummary = await Transaction.aggregate([
        {
          $match: {
            user: userId,

            type: "expense",

            category: budget.category,

            isActive: true,

            date: {
              $gte: budget.startDate,
              $lte: budget.endDate,
            },
          },
        },

        {
          $group: {
            _id: null,

            spent: {
              $sum: "$amount",
            },

            transactionCount: {
              $sum: 1,
            },
          },
        },
      ]);


      const spent =
        expenseSummary.length > 0
          ? expenseSummary[0].spent
          : 0;

      const transactionCount =
        expenseSummary.length > 0
          ? expenseSummary[0].transactionCount
          : 0;


      const remaining = Math.max(
        budget.amount - spent,
        0
      );


      const percentageUsed =
        budget.amount > 0
          ? Number(
              ((spent / budget.amount) * 100).toFixed(2)
            )
          : 0;


      return {
        budgetId: budget._id,

        category: budget.category,

        budgetAmount: budget.amount,

        spent,

        remaining,

        percentageUsed,

        isExceeded: spent > budget.amount,

        transactionCount,

        period: budget.period,

        startDate: budget.startDate,

        endDate: budget.endDate,
      };
    })
  );


  /*
  |--------------------------------------------------------------------------
  | 9. RECENT TRANSACTIONS
  |--------------------------------------------------------------------------
  */

  const recentTransactions = await Transaction.find({
    user: userId,
    isActive: true,
  })
    .sort({
      date: -1,
      createdAt: -1,
    })
    .limit(5)
    .populate(
      "account",
      "accountName institutionName accountType"
    )
    .select("-__v");


  /*
  |--------------------------------------------------------------------------
  | RESPONSE
  |--------------------------------------------------------------------------
  */

  res.status(200).json({

    success: true,

    period: {
      month,
      year,
      startDate,
      endDate,
    },

    summary: {

      totalBalance,

      monthlyIncome,

      monthlyExpense,

      savings,

      savingsRate,

      totalInvested,

      investmentValue,

      investmentProfitLoss,

      investmentReturnPercentage,
    },

    spendingByCategory,

    budgetProgress,

    recentTransactions,
  });
});


export default getDashboard;