import ApiError from "../utils/apiError.util.js";

const allowedTypes = [
  "income",
  "expense",
  "transfer",
];

const allowedPaymentMethods = [
  "cash",
  "upi",
  "debit_card",
  "credit_card",
  "bank_transfer",
  "net_banking",
  "other",
];

const isValidAmount = (value) => {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  const number = Number(value);

  return (
    Number.isFinite(number) &&
    number > 0
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
// CREATE TRANSACTION
// ==========================================

const validateTransaction = (req, res, next) => {
  const {
    account,
    transferAccount,
    type,
    amount,
    category,
    paymentMethod,
    date,
  } = req.body;

  const errors = [];

  // Account
  if (!account) {
    errors.push({
      field: "account",
      message: "Account is required",
    });
  }

  // Type
  if (!type) {
    errors.push({
      field: "type",
      message: "Transaction type is required",
    });
  } else if (!allowedTypes.includes(type)) {
    errors.push({
      field: "type",
      message:
        "Transaction type must be income, expense, or transfer",
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
      message: "Transaction amount is required",
    });
  } else if (!isValidAmount(amount)) {
    errors.push({
      field: "amount",
      message: "Transaction amount must be greater than 0",
    });
  }

  // Category
  if (
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    errors.push({
      field: "category",
      message: "Transaction category is required",
    });
  }

  // Payment method
  if (
    paymentMethod !== undefined &&
    !allowedPaymentMethods.includes(paymentMethod)
  ) {
    errors.push({
      field: "paymentMethod",
      message: "Invalid payment method",
    });
  }

  // Transfer validation
  if (type === "transfer") {
    if (!transferAccount) {
      errors.push({
        field: "transferAccount",
        message:
          "Destination account is required for a transfer",
      });
    }

    if (
      account &&
      transferAccount &&
      account === transferAccount
    ) {
      errors.push({
        field: "transferAccount",
        message:
          "Source and destination accounts cannot be the same",
      });
    }
  }

  // Date
  if (date !== undefined && !isValidDate(date)) {
    errors.push({
      field: "date",
      message:
        "Invalid transaction date. Use YYYY-MM-DD format",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Transaction validation failed",
        errors
      )
    );
  }

  next();
};


// ==========================================
// UPDATE TRANSACTION
// ==========================================

const validateTransactionUpdate = (
  req,
  res,
  next
) => {
  const {
    type,
    amount,
    category,
    paymentMethod,
    date,
    transferAccount,
  } = req.body;

  const errors = [];

  // Type
  if (
    type !== undefined &&
    !allowedTypes.includes(type)
  ) {
    errors.push({
      field: "type",
      message:
        "Transaction type must be income, expense, or transfer",
    });
  }

  // Amount
  if (
    amount !== undefined &&
    !isValidAmount(amount)
  ) {
    errors.push({
      field: "amount",
      message:
        "Transaction amount must be greater than 0",
    });
  }

  // Category
  if (category !== undefined) {
    if (
      typeof category !== "string" ||
      category.trim().length === 0
    ) {
      errors.push({
        field: "category",
        message:
          "Transaction category cannot be empty",
      });
    }
  }

  // Payment method
  if (
    paymentMethod !== undefined &&
    !allowedPaymentMethods.includes(paymentMethod)
  ) {
    errors.push({
      field: "paymentMethod",
      message: "Invalid payment method",
    });
  }

  // Date
  if (
    date !== undefined &&
    !isValidDate(date)
  ) {
    errors.push({
      field: "date",
      message:
        "Invalid transaction date. Use YYYY-MM-DD format",
    });
  }

  // Transfer account
  if (
    type === "transfer" &&
    !transferAccount
  ) {
    errors.push({
      field: "transferAccount",
      message:
        "Destination account is required for a transfer",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Transaction validation failed",
        errors
      )
    );
  }

  next();
};

export {
  validateTransaction,
  validateTransactionUpdate,
};