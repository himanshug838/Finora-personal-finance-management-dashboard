import mongoose from "mongoose";

import Budget from "../models/budget.model.js";
import Transaction from "../models/transaction.model.js";

import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";
import createNotification from "../utils/notification.util.js";


// ======================================================
// HELPER: GET DATE RANGE
// ======================================================

const getDateRange = (startDate, endDate) => {

  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);

  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
  };
};


// ======================================================
// CREATE BUDGET
// ======================================================

const createBudget = asyncHandler(
  async (req, res) => {

    const userId = req.user.id;

    const {
      category,
      amount,
      currency,
      period,
      startDate,
      endDate,
      description,
    } = req.body;


    const normalizedCategory =
      category.trim().toLowerCase();


    const { start, end } =
      getDateRange(
        startDate,
        endDate
      );


    // Check duplicate budget
    const existingBudget =
      await Budget.findOne({
        user: userId,
        category: normalizedCategory,
        period: period || "monthly",
        startDate: start,
        isActive: true,
      });


    if (existingBudget) {
      throw new ApiError(
        400,
        "A budget already exists for this category and period"
      );
    }


    const budget = await Budget.create({

      user: userId,

      category:
        normalizedCategory,

      amount: Number(amount),

      currency:
        currency || "INR",

      period:
        period || "monthly",

      startDate: start,

      endDate: end,

      description:
        description || "",

    });


    res.status(201).json({

      success: true,

      message:
        "Budget created successfully",

      budget,

    });

  }
);


// ======================================================
// GET ALL BUDGETS
// ======================================================

const getBudgets = asyncHandler(
  async (req, res) => {

    const userId = req.user.id;


    const {
      period,
      category,
      active,
    } = req.query;


    const filter = {
      user: userId,
    };


    // Active / inactive filter
    if (active === "false") {

      filter.isActive = false;

    } else {

      filter.isActive = true;

    }


    // Period filter
    if (period) {
      filter.period = period;
    }


    // Category filter
    if (category) {

      filter.category =
        category.trim().toLowerCase();

    }


    const budgets =
      await Budget.find(filter)
        .sort({
          startDate: -1,
          createdAt: -1,
        });


    res.status(200).json({

      success: true,

      count: budgets.length,

      budgets,

    });

  }
);


// ======================================================
// GET SINGLE BUDGET
// ======================================================

const getBudget = asyncHandler(
  async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid budget ID"
      );
    }


    const budget =
      await Budget.findOne({

        _id: id,

        user: userId,

        isActive: true,

      });


    if (!budget) {
      throw new ApiError(
        404,
        "Budget not found"
      );
    }


    res.status(200).json({

      success: true,

      budget,

    });

  }
);


// ======================================================
// GET BUDGET PROGRESS
// ======================================================

const getBudgetProgress =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid budget ID"
      );
    }


    const budget =
      await Budget.findOne({

        _id: id,

        user: userId,

        isActive: true,

      });


    if (!budget) {
      throw new ApiError(
        404,
        "Budget not found"
      );
    }


    const { start, end } =
      getDateRange(
        budget.startDate,
        budget.endDate
      );


    // Find expenses for this category
    const result =
      await Transaction.aggregate([

        {
          $match: {

            user:
              new mongoose.Types.ObjectId(
                userId
              ),

            type: "expense",

            category:
              budget.category,

            isActive: true,

            date: {
              $gte: start,
              $lte: end,
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
      result.length > 0
        ? result[0].spent
        : 0;


    const transactionCount =
      result.length > 0
        ? result[0].transactionCount
        : 0;


    const remaining =
      budget.amount - spent;


    const percentageUsed =
      budget.amount > 0
        ? (spent / budget.amount) * 100
        : 0;
        
    if (percentageUsed >= 100) {
      await createNotification({
        user: userId,

        title: "Budget exceeded",

        message:
          `Your ${budget.category} budget has been exceeded. ` +
          `You have spent ${spent.toFixed(2)} ` +
          `out of ${budget.amount.toFixed(2)}.`,

        type: "budget",

        severity: "danger",

        relatedId: budget._id,

        relatedModel: "Budget",
      });
      } else if (percentageUsed >= 80) {
      await createNotification({
        user: userId,

        title: "Budget almost exceeded",

        message:
          `You have used ${percentageUsed.toFixed(0)}% ` +
          `of your ${budget.category} budget.`,

        type: "budget",

        severity: "warning",

        relatedId: budget._id,

        relatedModel: "Budget",
      });
    }


    const isExceeded =
      spent > budget.amount;


    res.status(200).json({

      success: true,

      budget: {

        id: budget._id,

        category:
          budget.category,

        amount:
          budget.amount,

        currency:
          budget.currency,

        period:
          budget.period,

        startDate:
          budget.startDate,

        endDate:
          budget.endDate,

      },

      progress: {

        spent,

        remaining,

        percentageUsed:
          Number(
            percentageUsed.toFixed(2)
          ),

        isExceeded,

        transactionCount,

      },

    });

  }
);


// ======================================================
// UPDATE BUDGET
// ======================================================

const updateBudget =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid budget ID"
      );
    }


    const budget =
      await Budget.findOne({

        _id: id,

        user: userId,

        isActive: true,

      });


    if (!budget) {
      throw new ApiError(
        404,
        "Budget not found"
      );
    }


    const {
      category,
      amount,
      currency,
      period,
      startDate,
      endDate,
      description,
    } = req.body;


    if (category !== undefined) {

      budget.category =
        category.trim().toLowerCase();

    }


    if (amount !== undefined) {

      budget.amount =
        Number(amount);

    }


    if (currency !== undefined) {

      budget.currency =
        currency.toUpperCase();

    }


    if (period !== undefined) {

      budget.period =
        period;

    }


    if (startDate !== undefined) {

      const start =
        new Date(startDate);

      start.setHours(
        0,
        0,
        0,
        0
      );

      budget.startDate =
        start;

    }


    if (endDate !== undefined) {

      const end =
        new Date(endDate);

      end.setHours(
        23,
        59,
        59,
        999
      );

      budget.endDate =
        end;

    }


    if (description !== undefined) {

      budget.description =
        description;

    }


    if (
      budget.endDate <=
      budget.startDate
    ) {
      throw new ApiError(
        400,
        "End date must be after start date"
      );
    }


    await budget.save();


    res.status(200).json({

      success: true,

      message:
        "Budget updated successfully",

      budget,

    });

  }
);


// ======================================================
// DELETE BUDGET
// ======================================================

const deleteBudget =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid budget ID"
      );
    }


    const budget =
      await Budget.findOneAndUpdate(

        {
          _id: id,

          user: userId,

          isActive: true,
        },

        {
          isActive: false,
        },

        {
          new: true,
        }

      );


    if (!budget) {
      throw new ApiError(
        404,
        "Budget not found"
      );
    }


    res.status(200).json({

      success: true,

      message:
        "Budget deleted successfully",

    });

  }
);


export {
  createBudget,
  getBudgets,
  getBudget,
  getBudgetProgress,
  updateBudget,
  deleteBudget,
};