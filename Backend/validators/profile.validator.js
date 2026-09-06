import ApiError from "../utils/apiError.util.js";

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

const isStrongPassword = (password) => {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};


// ==========================================
// PROFILE UPDATE
// ==========================================

export const validateProfileUpdate = (
  req,
  res,
  next
) => {
  const {
    name,
    currency,
    monthlyIncome,
  } = req.body;

  const errors = [];

  // Name
  if (name !== undefined) {
    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      errors.push({
        field: "name",
        message:
          "Name must be at least 2 characters",
      });
    }

    if (
      typeof name === "string" &&
      name.trim().length > 50
    ) {
      errors.push({
        field: "name",
        message:
          "Name cannot exceed 50 characters",
      });
    }
  }

  // Currency
  if (currency !== undefined) {
    if (
      typeof currency !== "string" ||
      !allowedCurrencies.includes(
        currency.toUpperCase()
      )
    ) {
      errors.push({
        field: "currency",
        message: "Invalid currency",
      });
    }
  }

  // Monthly income
  if (monthlyIncome !== undefined) {
    if (
      typeof monthlyIncome !== "number" ||
      !Number.isFinite(monthlyIncome) ||
      monthlyIncome < 0
    ) {
      errors.push({
        field: "monthlyIncome",
        message:
          "Monthly income must be a valid non-negative number",
      });
    }
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Profile validation failed",
        errors
      )
    );
  }

  next();
};


// ==========================================
// PREFERENCES
// ==========================================

export const validatePreferencesUpdate = (
  req,
  res,
  next
) => {
  const {
    timezone,
    language,
    dateFormat,
    weekStartsOn,
    defaultTransactionType,
  } = req.body;

  const errors = [];

  if (
    timezone !== undefined &&
    (
      typeof timezone !== "string" ||
      timezone.trim().length === 0
    )
  ) {
    errors.push({
      field: "timezone",
      message:
        "Timezone must be a valid string",
    });
  }

  if (
    language !== undefined &&
    (
      typeof language !== "string" ||
      language.trim().length === 0
    )
  ) {
    errors.push({
      field: "language",
      message:
        "Language must be a valid string",
    });
  }

  if (
    dateFormat !== undefined &&
    !allowedDateFormats.includes(dateFormat)
  ) {
    errors.push({
      field: "dateFormat",
      message:
        "Invalid date format",
    });
  }

  if (
    weekStartsOn !== undefined &&
    ![0, 1].includes(weekStartsOn)
  ) {
    errors.push({
      field: "weekStartsOn",
      message:
        "weekStartsOn must be 0 or 1",
    });
  }

  if (
    defaultTransactionType !== undefined &&
    !allowedTransactionTypes.includes(
      defaultTransactionType
    )
  ) {
    errors.push({
      field: "defaultTransactionType",
      message:
        "Invalid default transaction type",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Preferences validation failed",
        errors
      )
    );
  }

  next();
};


// ==========================================
// NOTIFICATION PREFERENCES
// ==========================================

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

  const errors = [];

  for (const field of allowedFields) {
    if (
      req.body[field] !== undefined &&
      typeof req.body[field] !== "boolean"
    ) {
      errors.push({
        field,
        message:
          `${field} must be a boolean`,
      });
    }
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Notification preferences validation failed",
        errors
      )
    );
  }

  next();
};


// ==========================================
// PASSWORD CHANGE
// ==========================================

export const validatePasswordChange = (
  req,
  res,
  next
) => {
  const {
    currentPassword,
    newPassword,
  } = req.body;

  const errors = [];

  if (!currentPassword) {
    errors.push({
      field: "currentPassword",
      message:
        "Current password is required",
    });
  }

  if (!newPassword) {
    errors.push({
      field: "newPassword",
      message:
        "New password is required",
    });
  }

  if (
    newPassword &&
    !isStrongPassword(newPassword)
  ) {
    errors.push({
      field: "newPassword",
      message:
        "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character",
    });
  }

  if (
    currentPassword &&
    newPassword &&
    currentPassword === newPassword
  ) {
    errors.push({
      field: "newPassword",
      message:
        "New password must be different from current password",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Password validation failed",
        errors
      )
    );
  }

  next();
};