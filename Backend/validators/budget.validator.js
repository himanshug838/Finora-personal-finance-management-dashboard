import ApiError from "../utils/apiError.util.js";

const allowedPeriods = [
  "weekly",
  "monthly",
  "yearly",
];

const isValidAmount = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return false;
  }

  const number = Number(value);

  return (
    Number.isFinite(number) &&
    number > 0
  );
};

const isValidDate = (value) => {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime());
};


// ==========================================
// CREATE BUDGET
// ==========================================

const validateBudget = (req, res, next) => {
  const {
    category,
    amount,
    period,
    startDate,
    endDate,
  } = req.body;

  const errors = [];

  // Category
  if (
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    errors.push({
      field: "category",
      message: "Budget category is required",
    });
  }

  // Amount
  if (
    amount === undefined ||
    amount === null ||
    amount === ""
  ) {
    errors.push({
      field: "amount",
      message: "Budget amount is required",
    });
  } else if (!isValidAmount(amount)) {
    errors.push({
      field: "amount",
      message:
        "Budget amount must be greater than 0",
    });
  }

  // Period
  if (
    period !== undefined &&
    !allowedPeriods.includes(period)
  ) {
    errors.push({
      field: "period",
      message:
        "Period must be weekly, monthly, or yearly",
    });
  }

  // Start date
  if (!startDate) {
    errors.push({
      field: "startDate",
      message: "Start date is required",
    });
  } else if (!isValidDate(startDate)) {
    errors.push({
      field: "startDate",
      message:
        "Invalid start date. Use YYYY-MM-DD format",
    });
  }

  // End date
  if (!endDate) {
    errors.push({
      field: "endDate",
      message: "End date is required",
    });
  } else if (!isValidDate(endDate)) {
    errors.push({
      field: "endDate",
      message:
        "Invalid end date. Use YYYY-MM-DD format",
    });
  }

  // Date comparison
  if (
    startDate &&
    endDate &&
    isValidDate(startDate) &&
    isValidDate(endDate)
  ) {
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);

    if (end <= start) {
      errors.push({
        field: "endDate",
        message:
          "End date must be after start date",
      });
    }
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Budget validation failed",
        errors
      )
    );
  }

  next();
};


// ==========================================
// UPDATE BUDGET
// ==========================================

const validateBudgetUpdate = (
  req,
  res,
  next
) => {
  const {
    category,
    amount,
    period,
    startDate,
    endDate,
  } = req.body;

  const errors = [];

  if (category !== undefined) {
    if (
      typeof category !== "string" ||
      category.trim().length === 0
    ) {
      errors.push({
        field: "category",
        message:
          "Budget category cannot be empty",
      });
    }
  }

  if (
    amount !== undefined &&
    !isValidAmount(amount)
  ) {
    errors.push({
      field: "amount",
      message:
        "Budget amount must be greater than 0",
    });
  }

  if (
    period !== undefined &&
    !allowedPeriods.includes(period)
  ) {
    errors.push({
      field: "period",
      message:
        "Period must be weekly, monthly, or yearly",
    });
  }

  if (
    startDate !== undefined &&
    !isValidDate(startDate)
  ) {
    errors.push({
      field: "startDate",
      message:
        "Invalid start date. Use YYYY-MM-DD format",
    });
  }

  if (
    endDate !== undefined &&
    !isValidDate(endDate)
  ) {
    errors.push({
      field: "endDate",
      message:
        "Invalid end date. Use YYYY-MM-DD format",
    });
  }

  if (
    startDate &&
    endDate &&
    isValidDate(startDate) &&
    isValidDate(endDate)
  ) {
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);

    if (end <= start) {
      errors.push({
        field: "endDate",
        message:
          "End date must be after start date",
      });
    }
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Budget validation failed",
        errors
      )
    );
  }

  next();
};

export {
  validateBudget,
  validateBudgetUpdate,
};