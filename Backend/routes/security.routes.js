import express from "express";

import verificationToken from "../middleware/verifyToken.middle.js";

import {
  logoutAllDevices,
  verifyCurrentPassword,
} from "../controllers/security.controller.js";

const securityRouter = express.Router();


// ==========================================
// PROTECTED SECURITY ROUTES
// ==========================================

securityRouter.use(
  verificationToken
);


// ==========================================
// LOGOUT ALL DEVICES
// ==========================================

securityRouter.post(
  "/logout-all",
  logoutAllDevices
);


// ==========================================
// VERIFY PASSWORD
// ==========================================

securityRouter.post(
  "/verify-password",
  verifyCurrentPassword
);


export default securityRouter;