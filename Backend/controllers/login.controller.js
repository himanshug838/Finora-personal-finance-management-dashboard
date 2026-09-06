import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.util.js";

import ApiError from "../utils/apiError.util.js";

import {
  createAccessToken,
  createRawRefreshToken,
  storeRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  hashRefreshToken,
} from "../services/token.service.js";

import {
  REFRESH_TOKEN_COOKIE_NAME,
  getRefreshCookieOptions,
} from "../config/security.config.js";


// =====================================================
// LOGIN
// =====================================================

const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;


  // ---------------------------------------------------
  // Check required fields
  // ---------------------------------------------------

  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }


  // ---------------------------------------------------
  // Find user
  // ---------------------------------------------------

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");


  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }


  // ---------------------------------------------------
  // Check account status
  // ---------------------------------------------------

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated"
    );
  }


  // ---------------------------------------------------
  // Compare password
  // ---------------------------------------------------

  const isValidPass = await bcrypt.compare(
    password,
    user.password
  );


  if (!isValidPass) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }


  // ---------------------------------------------------
  // Create short-lived access token
  // ---------------------------------------------------

  const accessToken = createAccessToken(user);


  // ---------------------------------------------------
  // Create refresh token
  // ---------------------------------------------------

  const refreshToken =
    createRawRefreshToken();


  // ---------------------------------------------------
  // Store refresh token HASH in database
  // ---------------------------------------------------

  await storeRefreshToken({
    userId: user._id,
    rawToken: refreshToken,
    req,
  });


  // ---------------------------------------------------
  // Send refresh token through HTTP-only cookie
  // ---------------------------------------------------

  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    getRefreshCookieOptions()
  );


  // ---------------------------------------------------
  // Response
  // ---------------------------------------------------

  res.status(200).json({

    success: true,

    message: "Login successful",

    data: {

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyIncome: user.monthlyIncome,
      },

      accessToken,
    },
  });
});


// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

export const refreshAccessToken = asyncHandler(
  async (req, res) => {

    // -------------------------------------------------
    // Get refresh token from cookie
    // -------------------------------------------------

    const oldRefreshToken =
      req.cookies[
        REFRESH_TOKEN_COOKIE_NAME
      ];


    if (!oldRefreshToken) {
      throw new ApiError(
        401,
        "Refresh token is required"
      );
    }


    // -------------------------------------------------
    // Find token in database
    // -------------------------------------------------

    const storedToken =
      await findRefreshToken(
        oldRefreshToken
      );


    if (!storedToken) {
      throw new ApiError(
        401,
        "Invalid refresh token"
      );
    }


    // -------------------------------------------------
    // Refresh token reuse detection
    // -------------------------------------------------

    if (storedToken.revokedAt) {

      await revokeAllUserRefreshTokens(
        storedToken.user
      );

      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        getRefreshCookieOptions()
      );

      throw new ApiError(
        401,
        "Refresh token reuse detected. Please login again."
      );
    }


    // -------------------------------------------------
    // Check expiration
    // -------------------------------------------------

    if (
      storedToken.expiresAt <= new Date()
    ) {

      await revokeRefreshToken(
        storedToken
      );

      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        getRefreshCookieOptions()
      );

      throw new ApiError(
        401,
        "Refresh token has expired"
      );
    }


    // -------------------------------------------------
    // Check user
    // -------------------------------------------------

    const user = await User.findById(
      storedToken.user
    );


    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }


    // -------------------------------------------------
    // Check account status
    // -------------------------------------------------

    if (!user.isActive) {

      await revokeAllUserRefreshTokens(
        user._id
      );

      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        getRefreshCookieOptions()
      );

      throw new ApiError(
        403,
        "Your account has been deactivated"
      );
    }


    // -------------------------------------------------
    // Create new access token
    // -------------------------------------------------

    const newAccessToken =
      createAccessToken(user);


    // -------------------------------------------------
    // Create new refresh token
    // -------------------------------------------------

    const newRefreshToken =
      createRawRefreshToken();


    const newRefreshTokenHash =
      hashRefreshToken(
        newRefreshToken
      );


    // -------------------------------------------------
    // Revoke old refresh token
    // -------------------------------------------------

    await revokeRefreshToken(
      storedToken,
      newRefreshTokenHash
    );


    // -------------------------------------------------
    // Store new refresh token
    // -------------------------------------------------

    await storeRefreshToken({
      userId: user._id,
      rawToken: newRefreshToken,
      req,
    });


    // -------------------------------------------------
    // Send new refresh token cookie
    // -------------------------------------------------

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      newRefreshToken,
      getRefreshCookieOptions()
    );


    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    res.status(200).json({

      success: true,

      message:
        "Access token refreshed successfully",

      data: {
        accessToken: newAccessToken,
      },
    });
  }
);


// =====================================================
// LOGOUT
// =====================================================

export const logout = asyncHandler(
  async (req, res) => {

    const refreshToken =
      req.cookies[
        REFRESH_TOKEN_COOKIE_NAME
      ];


    // -------------------------------------------------
    // Revoke refresh token if available
    // -------------------------------------------------

    if (refreshToken) {

      const storedToken =
        await findRefreshToken(
          refreshToken
        );


      if (
        storedToken &&
        !storedToken.revokedAt
      ) {
        await revokeRefreshToken(
          storedToken
        );
      }
    }


    // -------------------------------------------------
    // Clear cookie
    // -------------------------------------------------

    res.clearCookie(
      REFRESH_TOKEN_COOKIE_NAME,
      getRefreshCookieOptions()
    );


    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    res.status(200).json({

      success: true,

      message: "Logout successful",
    });
  }
);


export default login;