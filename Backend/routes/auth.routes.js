import express from "express";

import { loginLimiter, refreshLimiter } from "../config/rateLimit.config.js";

import login, {
  refreshAccessToken,
  logout,
} from "../controllers/login.controller.js";

import register from "../controllers/register.controller.js";

import updateProfile from "../controllers/updateProfile.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";

import {
  validateLogin,
  validateRegister,
} from "../validators/auth.validator.js";

const authRoute = express.Router();

// =====================================================
// PUBLIC AUTH ROUTES
// =====================================================

// Register
authRoute.post("/register", validateRegister, register);

// Login
authRoute.post("/login", loginLimiter, validateLogin, login);

// Refresh access token
authRoute.post("/refresh", refreshLimiter, refreshAccessToken);

// Logout
authRoute.post("/logout", logout);

// =====================================================
// PROTECTED AUTH ROUTES
// =====================================================

// Update profile
authRoute.put("/update", verificationToken, updateProfile);

export default authRoute;
