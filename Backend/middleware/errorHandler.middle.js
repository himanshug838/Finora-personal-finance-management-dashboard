import mongoose from "mongoose";

import ApiError from "../utils/apiError.util.js";


const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", {
    message: err.message,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });


  // ------------------------------------------
  // 1. API ERROR
  // ------------------------------------------

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,

      message: err.message,

      errors:
        err.errors && err.errors.length > 0
          ? err.errors
          : undefined,

      details:
        process.env.NODE_ENV === "development"
          ? err.details
          : undefined,
    });
  }


  // ------------------------------------------
  // 2. MONGOOSE VALIDATION ERROR
  // ------------------------------------------

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(
      (error) => ({
        field: error.path,
        message: error.message,
        value: error.value,
      })
    );

    return res.status(400).json({
      success: false,
      message: "Database validation failed",
      errors,
    });
  }


  // ------------------------------------------
  // 3. INVALID MONGOOSE OBJECT ID
  // ------------------------------------------

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}`,
      errors: [
        {
          field: err.path,
          message: `Invalid value: ${err.value}`,
        },
      ],
    });
  }


  // ------------------------------------------
  // 4. DUPLICATE MONGODB KEY
  // ------------------------------------------

  if (err.code === 11000) {
    const duplicateFields = Object.keys(
      err.keyPattern || {}
    );

    const field =
      duplicateFields.length > 0
        ? duplicateFields[0]
        : "field";

    return res.status(409).json({
      success: false,

      message: `${field} already exists`,

      errors: [
        {
          field,
          message: `${field} already exists`,
        },
      ],
    });
  }


  // ------------------------------------------
  // 5. JWT TOKEN EXPIRED
  // ------------------------------------------

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token has expired",
    });
  }


  // ------------------------------------------
  // 6. INVALID JWT
  // ------------------------------------------

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }


  // ------------------------------------------
  // 7. JWT NOT BEFORE
  // ------------------------------------------

  if (err.name === "NotBeforeError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token is not active",
    });
  }


  // ------------------------------------------
  // 8. SYNTAX ERROR / INVALID JSON
  // ------------------------------------------

  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.body
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }


  // ------------------------------------------
  // 9. PAYLOAD TOO LARGE
  // ------------------------------------------

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload is too large",
    });
  }


  // ------------------------------------------
  // 10. UNKNOWN ERROR
  // ------------------------------------------

  const statusCode = err.statusCode || 500;

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Something went wrong";


  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};


export default errorHandler;