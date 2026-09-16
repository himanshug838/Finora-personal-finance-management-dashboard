import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    accountName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    institutionName: {
      type: String,
      trim: true,
      default: "",
    },

    accountType: {
      type: String,
      enum: [
        "bank",
        "savings",
        "checking",
        "credit",
        "credit_card",
        "cash",
        "investment",
        "loan",
        "other",
      ],
      required: true,
    },

    accountNumber: {
      type: String,
      default: "",
      select: false,
    },

    balance: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    source: {
      type: String,
      enum: ["manual", "plaid"],
      default: "manual",
    },

    plaidAccountId: {
      type: String,
      default: "",
      select: false,
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

const Account = mongoose.model("Account", accountSchema);

export default Account;