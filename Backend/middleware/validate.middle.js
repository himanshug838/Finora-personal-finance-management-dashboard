import { validationResult } from "express-validator";

import ApiError from "../utils/apiError.util.js";


const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      location: error.location,
      value:
        error.location === "body"
          ? undefined
          : error.value,
    }));

    throw new ApiError(
      400,
      "Validation failed",
      formattedErrors
    );
  }

  next();
};


export default validateRequest;