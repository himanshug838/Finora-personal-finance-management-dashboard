import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    // User who owns this budget
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Budget category
    category: {
      type: String,
      required: [true, "Budget category is required"],
      trim: true,
      lowercase: true,
    },

    // Maximum amount allowed for this budget
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: [0.01, "Budget amount must be greater than 0"],
    },

    // Currency
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    // Budget period
    period: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      default: "monthly",
    },

    // Start date of budget
    startDate: {
      type: Date,
      required: true,
    },

    // End date of budget
    endDate: {
      type: Date,
      required: true,
    },

    // Optional description
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
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


// Prevent duplicate active budgets
// for the same user/category/period/start date
budgetSchema.index(
  {
    user: 1,
    category: 1,
    period: 1,
    startDate: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isActive: true,
    },
  }
);


const Budget = mongoose.model(
  "Budget",
  budgetSchema
);

export default Budget;