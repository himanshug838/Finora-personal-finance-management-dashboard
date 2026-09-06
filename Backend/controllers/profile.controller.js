import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE BASIC PROFILE
// ==========================================

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      currency,
      monthlyIncome,
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (currency !== undefined) {
      updateData.currency = currency.toUpperCase();
    }

    if (monthlyIncome !== undefined) {
      updateData.monthlyIncome = monthlyIncome;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE PREFERENCES
// ==========================================

export const updatePreferences = async (req, res) => {
  try {
    const {
      timezone,
      language,
      dateFormat,
      weekStartsOn,
      defaultTransactionType,
    } = req.body;

    const updateData = {};

    if (timezone !== undefined) {
      updateData["preferences.timezone"] = timezone;
    }

    if (language !== undefined) {
      updateData["preferences.language"] = language;
    }

    if (dateFormat !== undefined) {
      updateData["preferences.dateFormat"] = dateFormat;
    }

    if (weekStartsOn !== undefined) {
      updateData["preferences.weekStartsOn"] = weekStartsOn;
    }

    if (defaultTransactionType !== undefined) {
      updateData[
        "preferences.defaultTransactionType"
      ] = defaultTransactionType;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      data: user.preferences,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update preferences",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE NOTIFICATION PREFERENCES
// ==========================================

export const updateNotificationPreferences = async (
  req,
  res
) => {
  try {
    const allowedFields = [
      "budgetAlerts",
      "transactionAlerts",
      "recurringTransactionAlerts",
      "goalAlerts",
      "netWorthAlerts",
      "emailNotifications",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[
          `notificationPreferences.${field}`
        ] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Notification preferences updated successfully",
      data: user.notificationPreferences,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to update notification preferences",
      error: error.message,
    });
  }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user.id).select(
      "+password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};


// ==========================================
// DEACTIVATE ACCOUNT
// ==========================================

export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to deactivate account",
      error: error.message,
    });
  }
};