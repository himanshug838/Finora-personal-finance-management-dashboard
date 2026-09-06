const validTypes = [
  "income",
  "expense",
];

const validFrequencies = [
  "daily",
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

  const date = new Date(
    `${value}T00:00:00Z`
  );

  return !Number.isNaN(date.getTime());
};


// ==========================================
// RECURRING TRANSACTION VALIDATION
// ==========================================

export const validateRecurringTransaction = (
  data
) => {

  const {
    name,
    account,
    type,
    amount,
    frequency,
    startDate,
    endDate,
  } = data;

  // Name
  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    return "Recurring transaction name is required.";
  }

  if (name.trim().length > 100) {
    return "Recurring transaction name cannot exceed 100 characters.";
  }

  // Account
  if (!account) {
    return "Account is required.";
  }

  // Type
  if (!validTypes.includes(type)) {
    return "Type must be income or expense.";
  }

  // Amount
  if (!isValidAmount(amount)) {
    return "Amount must be greater than 0.";
  }

  // Frequency
  if (!validFrequencies.includes(frequency)) {
    return "Invalid frequency.";
  }

  // Start date
  if (!startDate) {
    return "Start date is required.";
  }

  if (!isValidDate(startDate)) {
    return "Invalid start date. Use YYYY-MM-DD format.";
  }

  // End date
  if (endDate) {

    if (!isValidDate(endDate)) {
      return "Invalid end date. Use YYYY-MM-DD format.";
    }

    const parsedStartDate =
      new Date(`${startDate}T00:00:00Z`);

    const parsedEndDate =
      new Date(`${endDate}T00:00:00Z`);

    if (parsedEndDate < parsedStartDate) {
      return "End date cannot be before start date.";
    }
  }

  return null;
};