const allowedPeriods = [
  "weekly",
  "monthly",
  "yearly",
];


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
  if (!category || category.trim().length === 0) {
    errors.push("Budget category is required");
  }


  // Amount
  if (
    amount === undefined ||
    amount === null ||
    amount === ""
  ) {
    errors.push("Budget amount is required");
  } else if (Number(amount) <= 0) {
    errors.push(
      "Budget amount must be greater than 0"
    );
  }


  // Period
  if (
    period &&
    !allowedPeriods.includes(period)
  ) {
    errors.push(
      "Period must be weekly, monthly, or yearly"
    );
  }


  // Start date
  if (!startDate) {
    errors.push("Start date is required");
  } else if (
    isNaN(new Date(startDate).getTime())
  ) {
    errors.push("Invalid start date");
  }


  // End date
  if (!endDate) {
    errors.push("End date is required");
  } else if (
    isNaN(new Date(endDate).getTime())
  ) {
    errors.push("Invalid end date");
  }


  // Date comparison
  if (
    startDate &&
    endDate &&
    !isNaN(new Date(startDate).getTime()) &&
    !isNaN(new Date(endDate).getTime())
  ) {

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      errors.push(
        "End date must be after start date"
      );
    }
  }


  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(", "),
    });
  }


  next();
};


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


  if (
    category !== undefined &&
    category.trim().length === 0
  ) {
    errors.push(
      "Budget category cannot be empty"
    );
  }


  if (
    amount !== undefined &&
    (amount === "" || Number(amount) <= 0)
  ) {
    errors.push(
      "Budget amount must be greater than 0"
    );
  }


  if (
    period !== undefined &&
    !allowedPeriods.includes(period)
  ) {
    errors.push(
      "Period must be weekly, monthly, or yearly"
    );
  }


  if (
    startDate !== undefined &&
    isNaN(new Date(startDate).getTime())
  ) {
    errors.push("Invalid start date");
  }


  if (
    endDate !== undefined &&
    isNaN(new Date(endDate).getTime())
  ) {
    errors.push("Invalid end date");
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
  validateBudget,
  validateBudgetUpdate,
};