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
    errors.push("Account is required");
  }

  // Type
  if (!type) {
    errors.push("Transaction type is required");
  } else if (!allowedTypes.includes(type)) {
    errors.push(
      "Transaction type must be income, expense, or transfer"
    );
  }

  // Amount
  if (amount === undefined || amount === null || amount === "") {
    errors.push("Transaction amount is required");
  } else if (Number(amount) <= 0) {
    errors.push("Transaction amount must be greater than 0");
  }

  // Category
  if (!category || category.trim().length === 0) {
    errors.push("Transaction category is required");
  }

  // Payment method
  if (
    paymentMethod &&
    !allowedPaymentMethods.includes(paymentMethod)
  ) {
    errors.push("Invalid payment method");
  }

  // Transfer validation
  if (type === "transfer") {
    if (!transferAccount) {
      errors.push(
        "Destination account is required for a transfer"
      );
    }

    if (
      account &&
      transferAccount &&
      account === transferAccount
    ) {
      errors.push(
        "Source and destination accounts cannot be the same"
      );
    }
  }

  // Date
  if (date && isNaN(new Date(date).getTime())) {
    errors.push("Invalid transaction date");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(", "),
    });
  }

  next();
};

const validateTransactionUpdate = (req, res, next) => {
  const {
    type,
    amount,
    category,
    paymentMethod,
    date,
  } = req.body;

  const errors = [];

  if (
    type !== undefined &&
    !allowedTypes.includes(type)
  ) {
    errors.push(
      "Transaction type must be income, expense, or transfer"
    );
  }

  if (
    amount !== undefined &&
    (amount === "" || Number(amount) <= 0)
  ) {
    errors.push(
      "Transaction amount must be greater than 0"
    );
  }

  if (
    category !== undefined &&
    category.trim().length === 0
  ) {
    errors.push("Transaction category cannot be empty");
  }

  if (
    paymentMethod !== undefined &&
    !allowedPaymentMethods.includes(paymentMethod)
  ) {
    errors.push("Invalid payment method");
  }

  if (
    date !== undefined &&
    isNaN(new Date(date).getTime())
  ) {
    errors.push("Invalid transaction date");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(", "),
    });
  }

  next();
};

export {
  validateTransaction,
  validateTransactionUpdate,
};