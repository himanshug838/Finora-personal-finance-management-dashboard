import {
  body,
  validationResult,
} from "express-validator";

import ApiError from "../utils/apiError.util.js";


const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    throw new ApiError(
      400,
      "Validation failed",
      formattedErrors
    );
  }

  next();
};


// ============================================
// VERIFY CURRENT PASSWORD
// ============================================

export const validateCurrentPassword = [
  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  handleValidation,
];


// ============================================
// CHANGE PASSWORD
// ============================================

export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage(
      "Current password is required"
    ),


  body("newPassword")
    .notEmpty()
    .withMessage(
      "New password is required"
    )

    .matches(/[a-z]/)
    .withMessage(
      "Password must contain at least one lowercase letter"
    )

    .matches(/[0-9]/)
    .withMessage(
      "Password must contain at least one number"
    )

    .matches(
      /[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'+=~`]/
    )
    .withMessage(
      "Password must contain at least one special character"
    ),

  handleValidation,
];