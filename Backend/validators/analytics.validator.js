import ApiError from "../utils/apiError.util.js";

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
// ANALYTICS DATE RANGE
// ==========================================

export const validateAnalyticsDateRange = (
  req,
  res,
  next
) => {
  const {
    startDate,
    endDate,
  } = req.query;

  const errors = [];

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

  if (errors.length > 0) {
    return next(
      new ApiError(
        400,
        "Analytics validation failed",
        errors
      )
    );
  }

  next();
};


// ==========================================
// ANALYTICS MONTHS
// ==========================================

export const validateMonths = (
  req,
  res,
  next
) => {
  const { months } = req.query;

  if (months === undefined) {
    return next();
  }

  const parsedMonths = Number(months);

  if (
    !Number.isInteger(parsedMonths) ||
    parsedMonths < 1 ||
    parsedMonths > 24
  ) {
    return next(
      new ApiError(
        400,
        "Analytics validation failed",
        [
          {
            field: "months",
            message:
              "months must be an integer between 1 and 24",
          },
        ]
      )
    );
  }

  next();
};