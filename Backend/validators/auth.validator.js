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
// REGISTER VALIDATION
// ============================================

export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")

    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage(
      "Name must be between 2 and 50 characters"
    ),


  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")

    .isEmail()
    .withMessage("Please provide a valid email address")

    .normalizeEmail(),


  body("password")
    .notEmpty()
    .withMessage("Password is required")

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


// ============================================
// LOGIN VALIDATION
// ============================================

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")

    .isEmail()
    .withMessage("Please provide a valid email address")

    .normalizeEmail(),


  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  handleValidation,
];