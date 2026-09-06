import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No fields to update");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) throw new ApiError(404, "User not found");

  res
    .status(200)
    .json({ message: "Profile updated successfully", user: updatedUser });
});

export default updateProfile;