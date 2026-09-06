import Notification from "../models/notification.model.js";

const createNotification = async ({
  user,
  title,
  message,
  type = "system",
  severity = "info",
  relatedId = null,
  relatedModel = null,
}) => {
  try {
    const notification = await Notification.create({
      user,
      title,
      message,
      type,
      severity,
      relatedId,
      relatedModel,
    });

    return notification;
  } catch (error) {
    console.error(
      "Notification creation failed:",
      error.message
    );

    return null;
  }
};

export default createNotification;