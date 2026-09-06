import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";

const notificationRoute =
  express.Router();

notificationRoute.use(verificationToken);

notificationRoute.get(
  "/",
  getNotifications
);

notificationRoute.get(
  "/unread-count",
  getUnreadCount
);

notificationRoute.put(
  "/read-all",
  markAllAsRead
);

notificationRoute.put(
  "/:id/read",
  markAsRead
);

notificationRoute.delete(
  "/:id",
  deleteNotification
);

export default notificationRoute;