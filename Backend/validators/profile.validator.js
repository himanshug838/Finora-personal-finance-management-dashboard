const allowedCurrencies = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "JPY",
];

const allowedDateFormats = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
];

const allowedTransactionTypes = [
  "income",
  "expense",
];

export const validateProfileUpdate = (req, res, next) => {
  const {
    name,
    currency,
    monthlyIncome,
  } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 50 characters",
      });
    }
  }

  if (currency !== undefined) {
    if (
      typeof currency !== "string" ||
      !allowedCurrencies.includes(currency.toUpperCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid currency",
      });
    }
  }

  if (monthlyIncome !== undefined) {
    if (
      typeof monthlyIncome !== "number" ||
      Number.isNaN(monthlyIncome) ||
      monthlyIncome < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Monthly income must be a valid positive number",
      });
    }
  }

  next();
};

export const validatePreferencesUpdate = (req, res, next) => {
  const {
    timezone,
    language,
    dateFormat,
    weekStartsOn,
    defaultTransactionType,
  } = req.body;

  if (timezone !== undefined && typeof timezone !== "string") {
    return res.status(400).json({
      success: false,
      message: "Timezone must be a string",
    });
  }

  if (language !== undefined && typeof language !== "string") {
    return res.status(400).json({
      success: false,
      message: "Language must be a string",
    });
  }

  if (
    dateFormat !== undefined &&
    !allowedDateFormats.includes(dateFormat)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  if (
    weekStartsOn !== undefined &&
    ![0, 1].includes(weekStartsOn)
  ) {
    return res.status(400).json({
      success: false,
      message: "weekStartsOn must be 0 or 1",
    });
  }

  if (
    defaultTransactionType !== undefined &&
    !allowedTransactionTypes.includes(defaultTransactionType)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid default transaction type",
    });
  }

  next();
};

export const validateNotificationPreferences = (
  req,
  res,
  next
) => {
  const allowedFields = [
    "budgetAlerts",
    "transactionAlerts",
    "recurringTransactionAlerts",
    "goalAlerts",
    "netWorthAlerts",
    "emailNotifications",
  ];

  for (const field of allowedFields) {
    if (
      req.body[field] !== undefined &&
      typeof req.body[field] !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: `${field} must be a boolean`,
      });
    }
  }

  next();
};

export const validatePasswordChange = (req, res, next) => {
  const {
    currentPassword,
    newPassword,
  } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different from current password",
    });
  }

  next();
};