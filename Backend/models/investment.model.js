import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Investment name is required"],
      trim: true,
      maxlength: 100,
    },

    symbol: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    investmentType: {
      type: String,
      enum: [
        "stock",
        "mutual_fund",
        "etf",
        "crypto",
        "fixed_deposit",
        "bond",
        "other",
      ],
      required: [true, "Investment type is required"],
      index: true,
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },

    buyPrice: {
      type: Number,
      required: [true, "Buy price is required"],
      min: [0, "Buy price cannot be negative"],
    },

    currentPrice: {
      type: Number,
      required: [true, "Current price is required"],
      min: [0, "Current price cannot be negative"],
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    purchaseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    broker: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    source: {
      type: String,
      enum: ["manual", "api"],
      default: "manual",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Investment = mongoose.model(
  "Investment",
  investmentSchema
);

export default Investment;