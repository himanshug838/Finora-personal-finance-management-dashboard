import mongoose from "mongoose";

import Investment from "../models/investment.model.js";

import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";


// ======================================================
// HELPER: CALCULATE INVESTMENT
// ======================================================

const calculateInvestment = (investment) => {

  const investedAmount =
    investment.quantity *
    investment.buyPrice;

  const currentValue =
    investment.quantity *
    investment.currentPrice;

  const profitLoss =
    currentValue -
    investedAmount;

  const returnPercentage =
    investedAmount > 0
      ? (profitLoss / investedAmount) * 100
      : 0;


  return {
    investedAmount:
      Number(
        investedAmount.toFixed(2)
      ),

    currentValue:
      Number(
        currentValue.toFixed(2)
      ),

    profitLoss:
      Number(
        profitLoss.toFixed(2)
      ),

    returnPercentage:
      Number(
        returnPercentage.toFixed(2)
      ),
  };
};


// ======================================================
// CREATE INVESTMENT
// ======================================================

const createInvestment =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const {
      name,
      symbol,
      investmentType,
      quantity,
      buyPrice,
      currentPrice,
      currency,
      purchaseDate,
      broker,
      notes,
    } = req.body;


    const investment =
      await Investment.create({

        user: userId,

        name,

        symbol,

        investmentType,

        quantity:
          Number(quantity),

        buyPrice:
          Number(buyPrice),

        currentPrice:
          Number(currentPrice),

        currency:
          currency || "INR",

        purchaseDate:
          purchaseDate || Date.now(),

        broker,

        notes,

        source: "manual",

      });


    const calculations =
      calculateInvestment(
        investment
      );


    res.status(201).json({

      success: true,

      message:
        "Investment created successfully",

      investment,

      calculations,

    });

  });


// ======================================================
// GET ALL INVESTMENTS
// ======================================================

const getInvestments =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const {
      investmentType,
      symbol,
    } = req.query;


    const filter = {

      user: userId,

      isActive: true,

    };


    if (investmentType) {

      filter.investmentType =
        investmentType;

    }


    if (symbol) {

      filter.symbol =
        symbol.toUpperCase();

    }


    const investments =
      await Investment.find(filter)
        .sort({
          purchaseDate: -1,
          createdAt: -1,
        });


    const formattedInvestments =
      investments.map(
        (investment) => ({

          ...investment.toObject(),

          calculations:
            calculateInvestment(
              investment
            ),

        })
      );


    res.status(200).json({

      success: true,

      count:
        formattedInvestments.length,

      investments:
        formattedInvestments,

    });

  });


// ======================================================
// GET SINGLE INVESTMENT
// ======================================================

const getInvestment =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid investment ID"
      );
    }


    const investment =
      await Investment.findOne({

        _id: id,

        user: userId,

        isActive: true,

      });


    if (!investment) {

      throw new ApiError(
        404,
        "Investment not found"
      );

    }


    const calculations =
      calculateInvestment(
        investment
      );


    res.status(200).json({

      success: true,

      investment,

      calculations,

    });

  });


// ======================================================
// UPDATE INVESTMENT
// ======================================================

const updateInvestment =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid investment ID"
      );
    }


    const investment =
      await Investment.findOne({

        _id: id,

        user: userId,

        isActive: true,

      });


    if (!investment) {

      throw new ApiError(
        404,
        "Investment not found"
      );

    }


    const {
      name,
      symbol,
      investmentType,
      quantity,
      buyPrice,
      currentPrice,
      currency,
      purchaseDate,
      broker,
      notes,
    } = req.body;


    if (name !== undefined) {

      investment.name =
        name;

    }


    if (symbol !== undefined) {

      investment.symbol =
        symbol.toUpperCase();

    }


    if (
      investmentType !== undefined
    ) {

      investment.investmentType =
        investmentType;

    }


    if (quantity !== undefined) {

      investment.quantity =
        Number(quantity);

    }


    if (buyPrice !== undefined) {

      investment.buyPrice =
        Number(buyPrice);

    }


    if (
      currentPrice !== undefined
    ) {

      investment.currentPrice =
        Number(currentPrice);

    }


    if (currency !== undefined) {

      investment.currency =
        currency.toUpperCase();

    }


    if (
      purchaseDate !== undefined
    ) {

      investment.purchaseDate =
        new Date(purchaseDate);

    }


    if (broker !== undefined) {

      investment.broker =
        broker;

    }


    if (notes !== undefined) {

      investment.notes =
        notes;

    }


    await investment.save();


    const calculations =
      calculateInvestment(
        investment
      );


    res.status(200).json({

      success: true,

      message:
        "Investment updated successfully",

      investment,

      calculations,

    });

  });


// ======================================================
// DELETE INVESTMENT
// ======================================================

const deleteInvestment =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      throw new ApiError(
        400,
        "Invalid investment ID"
      );

    }


    const investment =
      await Investment.findOneAndUpdate(

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


    if (!investment) {

      throw new ApiError(
        404,
        "Investment not found"
      );

    }


    res.status(200).json({

      success: true,

      message:
        "Investment deleted successfully",

    });

  });


export {
  createInvestment,
  getInvestments,
  getInvestment,
  updateInvestment,
  deleteInvestment,
};