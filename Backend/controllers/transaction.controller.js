import mongoose from "mongoose";

import Transaction from "../models/transaction.model.js";
import Account from "../models/account.model.js";

import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";


// ======================================================
// HELPER: GET ACCOUNT
// ======================================================

const getUserAccount = async (
  accountId,
  userId,
  session
) => {
  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    throw new ApiError(400, "Invalid account ID");
  }

  const account = await Account.findOne({
    _id: accountId,
    user: userId,
    isActive: true,
  }).session(session);

  if (!account) {
    throw new ApiError(
      404,
      "Account not found or does not belong to you"
    );
  }

  return account;
};


// ======================================================
// HELPER: APPLY TRANSACTION TO ACCOUNT BALANCE
// ======================================================

const applyTransactionBalance = async (
  transaction,
  session
) => {
  const amount = transaction.amount;

  // Income → Add money
  if (transaction.type === "income") {
    await Account.findByIdAndUpdate(
      transaction.account,
      {
        $inc: {
          balance: amount,
        },
      },
      {
        session,
        runValidators: true,
      }
    );
  }

  // Expense → Remove money
  else if (transaction.type === "expense") {
    await Account.findByIdAndUpdate(
      transaction.account,
      {
        $inc: {
          balance: -amount,
        },
      },
      {
        session,
        runValidators: true,
      }
    );
  }

  // Transfer
  else if (transaction.type === "transfer") {
    await Account.findByIdAndUpdate(
      transaction.account,
      {
        $inc: {
          balance: -amount,
        },
      },
      {
        session,
        runValidators: true,
      }
    );

    await Account.findByIdAndUpdate(
      transaction.transferAccount,
      {
        $inc: {
          balance: amount,
        },
      },
      {
        session,
        runValidators: true,
      }
    );
  }
};


// ======================================================
// HELPER: REVERSE TRANSACTION FROM ACCOUNT BALANCE
// ======================================================

const reverseTransactionBalance = async (
  transaction,
  session
) => {
  const amount = transaction.amount;

  // Reverse income
  if (transaction.type === "income") {
    await Account.findByIdAndUpdate(
      transaction.account,
      {
        $inc: {
          balance: -amount,
        },
      },
      {
        session,
        runValidators: true,
      }
    );
  }

  // Reverse expense
  else if (transaction.type === "expense") {
    await Account.findByIdAndUpdate(
      transaction.account,
      {
        $inc: {
          balance: amount,
        },
      },
      {
        session,
        runValidators: true,
      }
    );
  }

  // Reverse transfer
  else if (transaction.type === "transfer") {
    await Account.findByIdAndUpdate(
      transaction.account,
      {
        $inc: {
          balance: amount,
        },
      },
      {
        session,
        runValidators: true,
      }
    );

    await Account.findByIdAndUpdate(
      transaction.transferAccount,
      {
        $inc: {
          balance: -amount,
        },
      },
      {
        session,
        runValidators: true,
      }
    );
  }
};


// ======================================================
// CREATE TRANSACTION
// ======================================================

const createTransaction = asyncHandler(
  async (req, res) => {

    const userId = req.user.id;

    const {
      account,
      transferAccount,
      type,
      amount,
      category,
      description,
      merchant,
      paymentMethod,
      date,
      notes,
    } = req.body;


    const session =
      await mongoose.startSession();


    try {

      let createdTransaction;


      await session.withTransaction(
        async () => {

          // Validate source account
          await getUserAccount(
            account,
            userId,
            session
          );


          // Validate destination account
          if (type === "transfer") {

            await getUserAccount(
              transferAccount,
              userId,
              session
            );

            if (
              account.toString() ===
              transferAccount.toString()
            ) {
              throw new ApiError(
                400,
                "Source and destination accounts cannot be the same"
              );
            }
          }


          // Create transaction
          const transaction =
            new Transaction({
              user: userId,
              account,
              transferAccount:
                type === "transfer"
                  ? transferAccount
                  : null,
              type,
              amount: Number(amount),
              category:
                category.toLowerCase(),
              description,
              merchant,
              paymentMethod,
              date: date || Date.now(),
              notes,
              source: "manual",
            });


          await transaction.save({
            session,
          });


          // Update account balances
          await applyTransactionBalance(
            transaction,
            session
          );


          createdTransaction =
            transaction;
        }
      );


      const populatedTransaction =
        await Transaction.findById(
          createdTransaction._id
        )
          .populate(
            "account",
            "accountName institutionName accountType balance currency"
          )
          .populate(
            "transferAccount",
            "accountName institutionName accountType balance currency"
          );


      res.status(201).json({
        success: true,
        message:
          "Transaction created successfully",
        transaction:
          populatedTransaction,
      });

    } finally {

      await session.endSession();

    }
  }
);


// ======================================================
// GET ALL TRANSACTIONS
// ======================================================

const getTransactions = asyncHandler(
  async (req, res) => {

    const userId = req.user.id;

    const {
      type,
      category,
      account,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;


    const filter = {
      user: userId,
      isActive: true,
    };


    // Filter by type
    if (type) {
      filter.type = type;
    }


    // Filter by category
    if (category) {
      filter.category =
        category.toLowerCase();
    }


    // Filter by account
    if (account) {

      if (
        !mongoose.Types.ObjectId.isValid(
          account
        )
      ) {
        throw new ApiError(
          400,
          "Invalid account ID"
        );
      }

      filter.account = account;
    }


    // Filter by date
    if (startDate || endDate) {

      filter.date = {};

      if (startDate) {

        const start =
          new Date(startDate);

        if (isNaN(start.getTime())) {
          throw new ApiError(
            400,
            "Invalid start date"
          );
        }

        start.setHours(0, 0, 0, 0);

        filter.date.$gte = start;
      }


      if (endDate) {

        const end =
          new Date(endDate);

        if (isNaN(end.getTime())) {
          throw new ApiError(
            400,
            "Invalid end date"
          );
        }

        end.setHours(
          23,
          59,
          59,
          999
        );

        filter.date.$lte = end;
      }
    }


    const pageNumber =
      Math.max(Number(page), 1);

    const limitNumber =
      Math.min(
        Math.max(Number(limit), 1),
        100
      );

    const skip =
      (pageNumber - 1) *
      limitNumber;


    const [
      transactions,
      total,
    ] = await Promise.all([

      Transaction.find(filter)
        .populate(
          "account",
          "accountName institutionName accountType balance currency"
        )
        .populate(
          "transferAccount",
          "accountName institutionName accountType balance currency"
        )
        .sort({
          date: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber),

      Transaction.countDocuments(filter),

    ]);


    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: pageNumber,
      pages: Math.ceil(
        total / limitNumber
      ),
      transactions,
    });

  }
);


// ======================================================
// GET SINGLE TRANSACTION
// ======================================================

const getTransaction = asyncHandler(
  async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid transaction ID"
      );
    }


    const transaction =
      await Transaction.findOne({
        _id: id,
        user: userId,
        isActive: true,
      })
        .populate(
          "account",
          "accountName institutionName accountType balance currency"
        )
        .populate(
          "transferAccount",
          "accountName institutionName accountType balance currency"
        );


    if (!transaction) {
      throw new ApiError(
        404,
        "Transaction not found"
      );
    }


    res.status(200).json({
      success: true,
      transaction,
    });

  }
);


// ======================================================
// UPDATE TRANSACTION
// ======================================================

const updateTransaction =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid transaction ID"
      );
    }


    const session =
      await mongoose.startSession();


    try {

      let updatedTransaction;


      await session.withTransaction(
        async () => {

          // Find old transaction
          const transaction =
            await Transaction.findOne({
              _id: id,
              user: userId,
              isActive: true,
            }).session(session);


          if (!transaction) {
            throw new ApiError(
              404,
              "Transaction not found"
            );
          }


          // Save old transaction data
          const oldTransaction =
            transaction.toObject();


          // Reverse old balance effect
          await reverseTransactionBalance(
            oldTransaction,
            session
          );


          // Get new values
          const {
            account,
            transferAccount,
            type,
            amount,
            category,
            description,
            merchant,
            paymentMethod,
            date,
            notes,
          } = req.body;


          const newAccount =
            account ||
            transaction.account;

          const newType =
            type ||
            transaction.type;

          const newAmount =
            amount !== undefined
              ? Number(amount)
              : transaction.amount;

          const newCategory =
            category ||
            transaction.category;


          // Validate new source account
          await getUserAccount(
            newAccount,
            userId,
            session
          );


          // Validate transfer destination
          let newTransferAccount =
            transaction.transferAccount;


          if (newType === "transfer") {

            newTransferAccount =
              transferAccount ||
              transaction.transferAccount;

            if (!newTransferAccount) {
              throw new ApiError(
                400,
                "Destination account is required for a transfer"
              );
            }


            await getUserAccount(
              newTransferAccount,
              userId,
              session
            );


            if (
              newAccount.toString() ===
              newTransferAccount.toString()
            ) {
              throw new ApiError(
                400,
                "Source and destination accounts cannot be the same"
              );
            }

          } else {

            newTransferAccount = null;

          }


          // Update transaction
          transaction.account =
            newAccount;

          transaction.transferAccount =
            newTransferAccount;

          transaction.type =
            newType;

          transaction.amount =
            newAmount;

          transaction.category =
            newCategory.toLowerCase();


          if (
            description !== undefined
          ) {
            transaction.description =
              description;
          }

          if (
            merchant !== undefined
          ) {
            transaction.merchant =
              merchant;
          }

          if (
            paymentMethod !== undefined
          ) {
            transaction.paymentMethod =
              paymentMethod;
          }

          if (date !== undefined) {
            transaction.date =
              new Date(date);
          }

          if (notes !== undefined) {
            transaction.notes =
              notes;
          }


          await transaction.save({
            session,
          });


          // Apply new balance effect
          await applyTransactionBalance(
            transaction,
            session
          );


          updatedTransaction =
            transaction;
        }
      );


      const populatedTransaction =
        await Transaction.findById(
          updatedTransaction._id
        )
          .populate(
            "account",
            "accountName institutionName accountType balance currency"
          )
          .populate(
            "transferAccount",
            "accountName institutionName accountType balance currency"
          );


      res.status(200).json({
        success: true,
        message:
          "Transaction updated successfully",
        transaction:
          populatedTransaction,
      });

    } finally {

      await session.endSession();

    }

  });


// ======================================================
// DELETE TRANSACTION
// ======================================================

const deleteTransaction =
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid transaction ID"
      );
    }


    const session =
      await mongoose.startSession();


    try {

      await session.withTransaction(
        async () => {

          const transaction =
            await Transaction.findOne({
              _id: id,
              user: userId,
              isActive: true,
            }).session(session);


          if (!transaction) {
            throw new ApiError(
              404,
              "Transaction not found"
            );
          }


          // Reverse transaction effect
          await reverseTransactionBalance(
            transaction,
            session
          );


          // Soft delete
          transaction.isActive =
            false;

          await transaction.save({
            session,
          });

        }
      );


      res.status(200).json({
        success: true,
        message:
          "Transaction deleted successfully",
      });

    } finally {

      await session.endSession();

    }

  });


export {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};