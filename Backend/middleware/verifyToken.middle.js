import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.util.js";

import ApiError from "../utils/apiError.util.js";


const verifyToken = asyncHandler(
  async (req, res, next) => {

    const authHeader = req.headers.authorization;


    // ------------------------------------------
    // Authorization header
    // ------------------------------------------

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new ApiError(
        401,
        "Authorization token is required"
      );
    }


    const token = authHeader.split(" ")[1];


    if (!token) {
      throw new ApiError(
        401,
        "Access token is required"
      );
    }


    let decoded;


    // ------------------------------------------
    // Verify JWT
    // ------------------------------------------

    try {

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    } catch (error) {

      if (
        error.name === "TokenExpiredError"
      ) {
        throw new ApiError(
          401,
          "Access token has expired"
        );
      }


      if (
        error.name === "JsonWebTokenError"
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


    // ------------------------------------------
    // Find user
    // ------------------------------------------

    const user = await User.findById(
      decoded.id
    ).select("isActive");


    if (!user) {
      throw new ApiError(
        401,
        "User account not found"
      );
    }


    if (!user.isActive) {
      throw new ApiError(
        403,
        "User account is inactive"
      );
    }


    // ------------------------------------------
    // Attach user to request
    // ------------------------------------------

    req.user = decoded;


    next();
  }
);


export default verifyToken;