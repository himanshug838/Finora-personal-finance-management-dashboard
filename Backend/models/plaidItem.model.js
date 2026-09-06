import mongoose from "mongoose";

const plaidItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    itemId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    accessToken: {
      type: String,
      required: true,
      select: false,
    },

    institutionId: {
      type: String,
      default: "",
    },

    institutionName: {
      type: String,
      default: "",
      trim: true,
    },

    syncCursor: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "active",
        "login_required",
        "error",
        "disconnected",
      ],
      default: "active",
    },

    lastSyncedAt: {
      type: Date,
      default: null,
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

const PlaidItem = mongoose.model(
  "PlaidItem",
  plaidItemSchema
);

export default PlaidItem;