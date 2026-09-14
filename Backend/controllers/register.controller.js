import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";
import createNotification from "../utils/notification.util.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  if (!/[0-9]/.test(password)) {
    throw new ApiError(
      400,
      "Password must contain at least one number"
    );
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'+=~`]/.test(password)) {
    throw new ApiError(
      400,
      "Password must contain at least one special character"
    );
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  await user.save();

  await createNotification({
    user: user._id,
    title: "Welcome to Finora! 🎉",
    message: `Hello ${name}! Welcome to your personal finance management dashboard. Track your accounts, transactions, and investments seamlessly.`,
    type: "system",
    severity: "success",
  });

  res.status(201).json({
    message: "User created successfully",
  });
});

export default register;