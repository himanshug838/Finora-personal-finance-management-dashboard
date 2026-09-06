import express from "express";

import {
  getProfile,
  updateProfile,
  updatePreferences,
  updateNotificationPreferences,
  changePassword,
  deactivateAccount,
} from "../controllers/profile.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";

import {
  validateProfileUpdate,
  validatePreferencesUpdate,
  validateNotificationPreferences,
  validatePasswordChange,
} from "../validators/profile.validator.js";

const profileRouter = express.Router();


// ==========================================
// ALL PROFILE ROUTES REQUIRE AUTHENTICATION
// ==========================================

profileRouter.use(verificationToken);


// ==========================================
// PROFILE
// ==========================================

// GET /api/v1/profile
profileRouter.get(
  "/",
  getProfile
);


// PUT /api/v1/profile
profileRouter.put(
  "/",
  validateProfileUpdate,
  updateProfile
);


// ==========================================
// PREFERENCES
// ==========================================

// PATCH /api/v1/profile/preferences
profileRouter.patch(
  "/preferences",
  validatePreferencesUpdate,
  updatePreferences
);


// ==========================================
// NOTIFICATION PREFERENCES
// ==========================================

// PATCH /api/v1/profile/notification-preferences
profileRouter.patch(
  "/notification-preferences",
  validateNotificationPreferences,
  updateNotificationPreferences
);


// ==========================================
// PASSWORD
// ==========================================

// PATCH /api/v1/profile/password
profileRouter.patch(
  "/password",
  validatePasswordChange,
  changePassword
);


// ==========================================
// ACCOUNT
// ==========================================

// PATCH /api/v1/profile/deactivate
profileRouter.patch(
  "/deactivate",
  deactivateAccount
);


export default profileRouter;