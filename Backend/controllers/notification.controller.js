import Notification from "../models/notification.model.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";

// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

const getNotifications = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;

    const notifications =
      await Notification.find({
        user: userId,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  }
);

// ==========================================
// GET UNREAD COUNT
// ==========================================

const getUnreadCount = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;

    const count =
      await Notification.countDocuments({
        user: userId,
        isActive: true,
        isRead: false,
      });

    res.status(200).json({
      success: true,
      count,
    });
  }
);

// ==========================================
// MARK SINGLE NOTIFICATION AS READ
// ==========================================

const markAsRead = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: id,
          user: userId,
          isActive: true,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found"
      );
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  }
);

// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllAsRead = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;

    await Notification.updateMany(
      {
        user: userId,
        isActive: true,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  }
);

// ==========================================
// DELETE NOTIFICATION
// ==========================================

const deleteNotification = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: id,
          user: userId,
          isActive: true,
        },
        {
          isActive: false,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found"
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully",
    });
  }
);

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};