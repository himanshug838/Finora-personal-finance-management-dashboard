import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    monthlyIncome: {
      type: Number,
      default: 0,
      min: [0, "Monthly income cannot be negative"],
    },

    preferences: {
      timezone: {
        type: String,
        default: "Asia/Kolkata",
        trim: true,
      },

      language: {
        type: String,
        default: "en",
        trim: true,
      },

      dateFormat: {
        type: String,
        enum: [
          "DD/MM/YYYY",
          "MM/DD/YYYY",
          "YYYY-MM-DD",
        ],
        default: "DD/MM/YYYY",
      },

      weekStartsOn: {
        type: Number,
        enum: [0, 1],
        default: 1,
      },

      defaultTransactionType: {
        type: String,
        enum: ["income", "expense"],
        default: "expense",
      },
    },

    notificationPreferences: {
      budgetAlerts: {
        type: Boolean,
        default: true,
      },

      transactionAlerts: {
        type: Boolean,
        default: true,
      },

      recurringTransactionAlerts: {
        type: Boolean,
        default: true,
      },

      goalAlerts: {
        type: Boolean,
        default: true,
      },

      netWorthAlerts: {
        type: Boolean,
        default: true,
      },

      emailNotifications: {
        type: Boolean,
        default: true,
      },
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

const User = mongoose.model("User", userSchema);

export default User;