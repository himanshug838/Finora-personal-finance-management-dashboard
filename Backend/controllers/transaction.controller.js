import mongoose from "mongoose";

import Transaction from "../models/transaction.model.js";
import Account from "../models/account.model.js";

import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";


// ======================================================
// HELPER: EXECUTE WITH OPTIONAL TRANSACTION / SESSION
// ======================================================

const runWithSession = async (workFn) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    let result;
    await session.withTransaction(async () => {
      result = await workFn(session);
    });
    return result;
  } catch (error) {
    const isStandaloneError =
      error.message &&
      (error.message.includes("replica set") ||
       error.message.includes("Transaction numbers") ||
       error.code === 20 ||
       error.codeName === "IllegalOperation");

    if (isStandaloneError) {
      return await workFn(null);
    }
    throw error;
  } finally {
    if (session) {
      await session.endSession().catch(() => {});
    }
  }
};


// ======================================================
// HELPER: GET ACCOUNT
// ======================================================

const getUserAccount = async (
  accountId,
  userId,
  session
) => {
  if (!accountId) {
    let queryAcc = Account.findOne({ user: userId, isActive: true });
    if (session) queryAcc.session(session);
    let userAcc = await queryAcc;
    if (!userAcc) {
      if (session) {
        const created = await Account.create([{
          user: userId,
          accountName: "Main Cash Account",
          institutionName: "Cash / General",
          accountType: "savings",
          balance: 0,
          currency: "INR",
          source: "manual",
        }], { session });
        userAcc = created[0];
      } else {
        userAcc = await Account.create({
          user: userId,
          accountName: "Main Cash Account",
          institutionName: "Cash / General",
          accountType: "savings",
          balance: 0,
          currency: "INR",
          source: "manual",
        });
      }
    }
    return userAcc;
  }

  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    throw new ApiError(400, "Invalid account ID");
  }

  const query = Account.findOne({
    _id: accountId,
    user: userId,
    isActive: true,
  });

  if (session) {
    query.session(session);
  }

  const account = await query;

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
  const opts = session ? { session, runValidators: true } : { runValidators: true };

  // Income → Add money
  if (transaction.type === "income") {
    await Account.findByIdAndUpdate(
      transaction.account,
      {
        $inc: {
          balance: amount,
        },
      },
      opts
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
      opts
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
      opts
    );

    await Account.findByIdAndUpdate(
      transaction.transferAccount,
      {
        $inc: {
          balance: amount,
        },
      },
      opts
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
  const opts = session ? { session, runValidators: true } : { runValidators: true };

  // Reverse income
  if (transaction.type === "income") {
    await Account.findByIdAndUpdate(
      transaction.account,
      {
        $inc: {
          balance: -amount,
        },
      },
      opts
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
      opts
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
      opts
    );

    await Account.findByIdAndUpdate(
      transaction.transferAccount,
      {
        $inc: {
          balance: -amount,
        },
      },
      opts
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


    const createdTransaction = await runWithSession(async (session) => {
      const sourceAcc = await getUserAccount(
        account,
        userId,
        session
      );

      const accId = sourceAcc._id;
      let destAccId = null;

      if (type === "transfer") {
        const destAcc = await getUserAccount(
          transferAccount,
          userId,
          session
        );
        destAccId = destAcc._id;

        if (accId.toString() === destAccId.toString()) {
          throw new ApiError(
            400,
            "Source and destination accounts cannot be the same"
          );
        }
      }

      let transaction;
      if (session) {
        const created = await Transaction.create([{
          user: userId,
          account: accId,
          transferAccount: type === "transfer" ? destAccId : null,
          type,
          amount: Number(amount),
          category: category.toLowerCase(),
          description,
          merchant,
          paymentMethod,
          date: date || Date.now(),
          notes,
          source: "manual",
        }], { session });
        transaction = created[0];
      } else {
        transaction = await Transaction.create({
          user: userId,
          account: accId,
          transferAccount: type === "transfer" ? destAccId : null,
          type,
          amount: Number(amount),
          category: category.toLowerCase(),
          description,
          merchant,
          paymentMethod,
          date: date || Date.now(),
          notes,
          source: "manual",
        });
      }

      await applyTransactionBalance(
        transaction,
        session
      );

      return transaction;
    });


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


    const updatedTransaction = await runWithSession(async (session) => {
      let queryTx = Transaction.findOne({
        _id: id,
        user: userId,
        isActive: true,
      });
      if (session) queryTx.session(session);

      const transaction = await queryTx;

      if (!transaction) {
        throw new ApiError(
          404,
          "Transaction not found"
        );
      }

      const oldTransaction = transaction.toObject();

      await reverseTransactionBalance(
        oldTransaction,
        session
      );

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

      const newAccount = account || transaction.account;
      const newType = type || transaction.type;
      const newAmount = amount !== undefined ? Number(amount) : transaction.amount;
      const newCategory = category || transaction.category;

      await getUserAccount(
        newAccount,
        userId,
        session
      );

      let newTransferAccount = transaction.transferAccount;

      if (newType === "transfer") {
        newTransferAccount = transferAccount || transaction.transferAccount;

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

      transaction.account = newAccount;
      transaction.transferAccount = newTransferAccount;
      transaction.type = newType;
      transaction.amount = newAmount;
      transaction.category = newCategory.toLowerCase();

      if (description !== undefined) {
        transaction.description = description;
      }

      if (merchant !== undefined) {
        transaction.merchant = merchant;
      }

      if (paymentMethod !== undefined) {
        transaction.paymentMethod = paymentMethod;
      }

      if (date !== undefined) {
        transaction.date = new Date(date);
      }

      if (notes !== undefined) {
        transaction.notes = notes;
      }

      const saveOpts = session ? { session } : {};
      await transaction.save(saveOpts);

      await applyTransactionBalance(
        transaction,
        session
      );

      return transaction;
    });


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


    await runWithSession(async (session) => {
      let queryTx = Transaction.findOne({
        _id: id,
        user: userId,
        isActive: true,
      });
      if (session) queryTx.session(session);

      const transaction = await queryTx;

      if (!transaction) {
        throw new ApiError(
          404,
          "Transaction not found"
        );
      }

      await reverseTransactionBalance(
        transaction,
        session
      );

      transaction.isActive = false;

      const saveOpts = session ? { session } : {};
      await transaction.save(saveOpts);
    });


    res.status(200).json({
      success: true,
      message:
        "Transaction deleted successfully",
    });

  });


export {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};