import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // User who owns this transaction
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Account from which / into which the transaction occurs
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },

    // Used only when transaction type is transfer
    // account = source account
    // transferAccount = destination account
    transferAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      default: null,
    },

    // Transaction type
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
      index: true,
    },

    // Transaction amount
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0.01, "Transaction amount must be greater than 0"],
    },

    // Category
    category: {
      type: String,
      required: [true, "Transaction category is required"],
      trim: true,
      lowercase: true,
    },

    // Short description
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    // Merchant / company / person
    merchant: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "upi",
        "debit_card",
        "credit_card",
        "bank_transfer",
        "net_banking",
        "other",
      ],
      default: "other",
    },

    // Date when transaction happened
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    // Additional notes
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    // Manual transaction or Plaid transaction
    source: {
      type: String,
      enum: ["manual", "plaid"],
      default: "manual",
    },

    // Plaid transaction ID
    plaidTransactionId: {
      type: String,
      sparse: true,
      unique: true,
    },

    // Recurring transaction reference
    // This will be populated only when the transaction
    // was automatically created from a recurring transaction.
    recurringTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecurringTransaction",
      default: null,
      index: true,
    },

    // Exact occurrence date of the recurring transaction
    // Helps us prevent duplicate transactions for the same occurrence.
    recurringOccurrenceDate: {
      type: Date,
      default: null,
    },

    // Soft delete
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

export default Transaction;