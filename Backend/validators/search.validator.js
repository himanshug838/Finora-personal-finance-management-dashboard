import ApiError from "../utils/apiError.util.js";

const allowedTypes = [
  "all",
  "transaction",
  "account",
  "investment",
  "budget",
  "goal",
  "recurring",
];

const allowedSortOrders = [
  "asc",
  "desc",
];

const isValidDate = (value) => {
  if (!value) return true;

  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime());
};

const isValidNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number);
};


// ==========================================
// SEARCH VALIDATION
// ==========================================

export const validateSearchQuery = (
  req,
  res,
  next
) => {
  const {
    type = "all",
    minAmount,
    maxAmount,
    startDate,
    endDate,
    page = "1",
    limit = "20",
    sortOrder = "desc",
  } = req.query;

  const errors = [];

  // Type
  if (!allowedTypes.includes(type)) {
    errors.push({
      field: "type",
      message:
        "Invalid type. Allowed values: all, transaction, account, investment, budget, goal, recurring",
    });
  }

  // Minimum amount
  if (
    minAmount !== undefined &&
    (
      !isValidNumber(minAmount) ||
      Number(minAmount) < 0
    )
  ) {
    errors.push({
      field: "minAmount",
      message:
        "minAmount must be a valid non-negative number",
    });
  }

  // Maximum amount
  if (
    maxAmount !== undefined &&
    (
      !isValidNumber(maxAmount) ||
      Number(maxAmount) < 0
    )
  ) {
    errors.push({
      field: "maxAmount",
      message:
        "maxAmount must be a valid non-negative number",
    });
  }

  // Amount comparison
  if (
    minAmount !== undefined &&
    maxAmount !== undefined &&
    isValidNumber(minAmount) &&
    isValidNumber(maxAmount) &&
    Number(minAmount) > Number(maxAmount)
  ) {
    errors.push({
      field: "amountRange",
      message:
        "minAmount cannot be greater than maxAmount",
    });
  }

  // Start date
  if (
    startDate &&
    !isValidDate(startDate)
  ) {
    errors.push({
      field: "startDate",
      message:
        "Invalid startDate. Use YYYY-MM-DD format",
    });
  }

  // End date
  if (
    endDate &&
    !isValidDate(endDate)
  ) {
    errors.push({
      field: "endDate",
      message:
        "Invalid endDate. Use YYYY-MM-DD format",
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

    if (start > end) {
      errors.push({
        field: "dateRange",
        message:
          "startDate cannot be greater than endDate",
      });
    }
  }

  // Page
  const parsedPage = Number(page);

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {
    errors.push({
      field: "page",
      message:
        "page must be a positive integer",
    });
  }

  // Limit
  const parsedLimit = Number(limit);

  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 100
  ) {
    errors.push({
      field: "limit",
      message:
        "limit must be an integer between 1 and 100",
    });
  }

  // Sort order
  if (!allowedSortOrders.includes(sortOrder)) {
    errors.push({
      field: "sortOrder",
      message:
        "sortOrder must be either asc or desc",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Search validation failed",
        errors
      )
    );
  }

  next();
};