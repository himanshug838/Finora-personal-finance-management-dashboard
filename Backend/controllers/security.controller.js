import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import bcrypt from "bcryptjs";

import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";

import {
  revokeAllUserRefreshTokens,
} from "../services/token.service.js";


// ==========================================
// LOGOUT ALL DEVICES
// ==========================================

export const logoutAllDevices = asyncHandler(
  async (req, res) => {

    const userId = req.user.id;

    await revokeAllUserRefreshTokens(userId);

    return res.status(200).json({
      success: true,
      message:
        "Logged out from all devices successfully",
    });
  }
);


// ==========================================
// VERIFY CURRENT PASSWORD
// ==========================================

export const verifyCurrentPassword = asyncHandler(
  async (req, res) => {

    const { currentPassword } = req.body;

    if (!currentPassword) {
      throw new ApiError(
        400,
        "Current password is required"
      );
    }

    const user = await User.findById(
      req.user.id
    ).select("+password");

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    const isValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValid) {
      throw new ApiError(
        401,
        "Current password is incorrect"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Password verified successfully",
    });
  }
);