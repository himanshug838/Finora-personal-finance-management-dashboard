import Account from "../models/account.model.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";


// CREATE ACCOUNT
const createAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    accountName,
    institutionName,
    accountType,
    accountNumber,
    balance,
    currency,
  } = req.body;

  if (!accountName || !accountType) {
    throw new ApiError(
      400,
      "Account name and account type are required"
    );
  }

  const account = await Account.create({
    user: userId,
    accountName,
    institutionName,
    accountType,
    accountNumber,
    balance: balance || 0,
    currency: currency || "INR",
    source: "manual",
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    account,
  });
});


// GET ALL ACCOUNTS
const getAccounts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const accounts = await Account.find({
    user: userId,
    isActive: true,
  }).select("-accountNumber -plaidAccountId");

  res.status(200).json({
    success: true,
    count: accounts.length,
    accounts,
  });
});


// GET SINGLE ACCOUNT
const getAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const account = await Account.findOne({
    _id: id,
    user: userId,
    isActive: true,
  }).select("-accountNumber -plaidAccountId");

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  res.status(200).json({
    success: true,
    account,
  });
});


// UPDATE ACCOUNT
const updateAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const {
    accountName,
    institutionName,
    accountType,
    balance,
    currency,
  } = req.body;

  const updateData = {};

  if (accountName) updateData.accountName = accountName;
  if (institutionName) updateData.institutionName = institutionName;
  if (accountType) updateData.accountType = accountType;
  if (balance !== undefined) updateData.balance = balance;
  if (currency) updateData.currency = currency;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No fields to update");
  }

  const account = await Account.findOneAndUpdate(
    {
      _id: id,
      user: userId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).select("-accountNumber -plaidAccountId");

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  res.status(200).json({
    success: true,
    message: "Account updated successfully",
    account,
  });
});


// DELETE ACCOUNT
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const account = await Account.findOneAndUpdate(
    {
      _id: id,
      user: userId,
    },
    {
      isActive: false,
    },
    {
      new: true,
    }
  );

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});


export {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
};