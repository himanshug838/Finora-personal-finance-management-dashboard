import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";


const verificationToken = asyncHandler(
  async (req, res, next) => {

    // =================================================
    // Get Authorization Header
    // =================================================

    const authHeader =
      req.headers.authorization;


    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new ApiError(
        401,
        "Authorization token is required"
      );
    }


    // =================================================
    // Extract Access Token
    // =================================================

    const token =
      authHeader.split(" ")[1];


    if (!token) {
      throw new ApiError(
        401,
        "Access token is required"
      );
    }


    // =================================================
    // Verify JWT
    // =================================================

    let decoded;

    try {

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    } catch (error) {

      if (
        error.name ===
        "TokenExpiredError"
      ) {
        throw new ApiError(
          401,
          "Access token has expired"
        );
      }

      if (
        error.name ===
        "JsonWebTokenError"
      ) {
        throw new ApiError(
          401,
          "Invalid access token"
        );
      }

      throw new ApiError(
        401,
        "Authentication failed"
      );
    }


    // =================================================
    // Find User
    // =================================================

    const user =
      await User.findById(
        decoded.id
      ).select(
        "isActive"
      );


    if (!user) {
      throw new ApiError(
        401,
        "User not found"
      );
    }


    // =================================================
    // Check Account Status
    // =================================================

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Account is deactivated"
      );
    }


    // =================================================
    // Attach User Information
    // =================================================

    req.user = decoded;


    // =================================================
    // Continue
    // =================================================

    next();
  }
);


export default verificationToken;