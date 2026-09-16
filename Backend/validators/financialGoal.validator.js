// ==========================================
// FINANCIAL GOAL VALIDATION
// ==========================================

const validateFinancialGoal = ({
  name,
  targetAmount,
  targetDate,
}) => {

  // Goal name
  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    return "Goal name is required";
  }

  if (name.trim().length < 2) {
    return "Goal name must contain at least 2 characters";
  }

  if (name.trim().length > 100) {
    return "Goal name cannot exceed 100 characters";
  }

  // Target amount
  if (
    targetAmount === undefined ||
    targetAmount === null ||
    targetAmount === ""
  ) {
    return "Target amount is required";
  }

  const amount = Number(targetAmount);

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return "Target amount must be greater than 0";
  }

  // Target date
  if (!targetDate) {
    return "Target date is required";
  }

  if (
    typeof targetDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)
  ) {
    return "Invalid target date. Use YYYY-MM-DD format";
  }

  const parsedDate = new Date(
    `${targetDate}T00:00:00Z`
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid target date";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (parsedDate < today) {
    return "Target date cannot be in the past";
  }

  return null;
};

export {
  validateFinancialGoal,
};