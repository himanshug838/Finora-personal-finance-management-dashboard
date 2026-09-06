import ApiError from "../utils/apiError.util.js";

const allowedInvestmentTypes = [
  "stock",
  "mutual_fund",
  "etf",
  "crypto",
  "fixed_deposit",
  "bond",
  "other",
];

const isPositiveNumber = (value) => {
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

const isNonNegativeNumber = (value) => {
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
    number >= 0
  );
};

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


// ==========================================
// CREATE INVESTMENT
// ==========================================

const validateInvestment = (
  req,
  res,
  next
) => {
  const {
    name,
    investmentType,
    quantity,
    buyPrice,
    currentPrice,
    purchaseDate,
  } = req.body;

  const errors = [];

  if (
    typeof name !== "string" ||
    name.trim().length === 0
  ) {
    errors.push({
      field: "name",
      message: "Investment name is required",
    });
  }

  if (!investmentType) {
    errors.push({
      field: "investmentType",
      message:
        "Investment type is required",
    });
  } else if (
    !allowedInvestmentTypes.includes(
      investmentType
    )
  ) {
    errors.push({
      field: "investmentType",
      message:
        "Invalid investment type",
    });
  }

  if (
    quantity === undefined ||
    quantity === null ||
    quantity === ""
  ) {
    errors.push({
      field: "quantity",
      message: "Quantity is required",
    });
  } else if (!isPositiveNumber(quantity)) {
    errors.push({
      field: "quantity",
      message:
        "Quantity must be greater than 0",
    });
  }

  if (
    buyPrice === undefined ||
    buyPrice === null ||
    buyPrice === ""
  ) {
    errors.push({
      field: "buyPrice",
      message: "Buy price is required",
    });
  } else if (!isNonNegativeNumber(buyPrice)) {
    errors.push({
      field: "buyPrice",
      message:
        "Buy price cannot be negative",
    });
  }

  if (
    currentPrice === undefined ||
    currentPrice === null ||
    currentPrice === ""
  ) {
    errors.push({
      field: "currentPrice",
      message: "Current price is required",
    });
  } else if (
    !isNonNegativeNumber(currentPrice)
  ) {
    errors.push({
      field: "currentPrice",
      message:
        "Current price cannot be negative",
    });
  }

  if (
    purchaseDate !== undefined &&
    !isValidDate(purchaseDate)
  ) {
    errors.push({
      field: "purchaseDate",
      message:
        "Invalid purchase date. Use YYYY-MM-DD format",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Investment validation failed",
        errors
      )
    );
  }

  next();
};


// ==========================================
// UPDATE INVESTMENT
// ==========================================

const validateInvestmentUpdate = (
  req,
  res,
  next
) => {
  const {
    name,
    investmentType,
    quantity,
    buyPrice,
    currentPrice,
    purchaseDate,
  } = req.body;

  const errors = [];

  if (name !== undefined) {
    if (
      typeof name !== "string" ||
      name.trim().length === 0
    ) {
      errors.push({
        field: "name",
        message:
          "Investment name cannot be empty",
      });
    }
  }

  if (
    investmentType !== undefined &&
    !allowedInvestmentTypes.includes(
      investmentType
    )
  ) {
    errors.push({
      field: "investmentType",
      message:
        "Invalid investment type",
    });
  }

  if (
    quantity !== undefined &&
    !isPositiveNumber(quantity)
  ) {
    errors.push({
      field: "quantity",
      message:
        "Quantity must be greater than 0",
    });
  }

  if (
    buyPrice !== undefined &&
    !isNonNegativeNumber(buyPrice)
  ) {
    errors.push({
      field: "buyPrice",
      message:
        "Buy price cannot be negative",
    });
  }

  if (
    currentPrice !== undefined &&
    !isNonNegativeNumber(currentPrice)
  ) {
    errors.push({
      field: "currentPrice",
      message:
        "Current price cannot be negative",
    });
  }

  if (
    purchaseDate !== undefined &&
    !isValidDate(purchaseDate)
  ) {
    errors.push({
      field: "purchaseDate",
      message:
        "Invalid purchase date. Use YYYY-MM-DD format",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Investment validation failed",
        errors
      )
    );
  }

  next();
};

export {
  validateInvestment,
  validateInvestmentUpdate,
};