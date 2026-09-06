const allowedInvestmentTypes = [
  "stock",
  "mutual_fund",
  "etf",
  "crypto",
  "fixed_deposit",
  "bond",
  "other",
];


const validateInvestment = (req, res, next) => {

  const {
    name,
    investmentType,
    quantity,
    buyPrice,
    currentPrice,
    purchaseDate,
  } = req.body;

  const errors = [];


  if (!name || name.trim().length === 0) {
    errors.push("Investment name is required");
  }


  if (!investmentType) {
    errors.push("Investment type is required");
  } else if (
    !allowedInvestmentTypes.includes(
      investmentType
    )
  ) {
    errors.push("Invalid investment type");
  }


  if (
    quantity === undefined ||
    quantity === null ||
    quantity === ""
  ) {
    errors.push("Quantity is required");
  } else if (Number(quantity) <= 0) {
    errors.push(
      "Quantity must be greater than 0"
    );
  }


  if (
    buyPrice === undefined ||
    buyPrice === null ||
    buyPrice === ""
  ) {
    errors.push("Buy price is required");
  } else if (Number(buyPrice) < 0) {
    errors.push(
      "Buy price cannot be negative"
    );
  }


  if (
    currentPrice === undefined ||
    currentPrice === null ||
    currentPrice === ""
  ) {
    errors.push("Current price is required");
  } else if (Number(currentPrice) < 0) {
    errors.push(
      "Current price cannot be negative"
    );
  }


  if (
    purchaseDate &&
    isNaN(new Date(purchaseDate).getTime())
  ) {
    errors.push("Invalid purchase date");
  }


  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(", "),
    });
  }


  next();
};


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


  if (
    name !== undefined &&
    name.trim().length === 0
  ) {
    errors.push(
      "Investment name cannot be empty"
    );
  }


  if (
    investmentType !== undefined &&
    !allowedInvestmentTypes.includes(
      investmentType
    )
  ) {
    errors.push(
      "Invalid investment type"
    );
  }


  if (
    quantity !== undefined &&
    (quantity === "" || Number(quantity) <= 0)
  ) {
    errors.push(
      "Quantity must be greater than 0"
    );
  }


  if (
    buyPrice !== undefined &&
    (buyPrice === "" || Number(buyPrice) < 0)
  ) {
    errors.push(
      "Buy price cannot be negative"
    );
  }


  if (
    currentPrice !== undefined &&
    (currentPrice === "" ||
      Number(currentPrice) < 0)
  ) {
    errors.push(
      "Current price cannot be negative"
    );
  }


  if (
    purchaseDate !== undefined &&
    isNaN(new Date(purchaseDate).getTime())
  ) {
    errors.push("Invalid purchase date");
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
  validateInvestment,
  validateInvestmentUpdate,
};