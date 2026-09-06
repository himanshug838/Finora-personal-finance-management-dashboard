const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api/v1";

const getToken = () => {
  return localStorage.getItem("token");
};

// ==========================================
// GET NOTIFICATIONS
// ==========================================

export const getNotifications =
  async () => {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/notifications`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to fetch notifications"
      );
    }

    return data;
  };

// ==========================================
// GET UNREAD COUNT
// ==========================================

export const getUnreadCount =
  async () => {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/notifications/unread-count`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to fetch notification count"
      );
    }

    return data;
  };

// ==========================================
// MARK AS READ
// ==========================================

export const markNotificationAsRead =
  async (id) => {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/notifications/${id}/read`,
      {
        method: "PUT",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to update notification"
      );
    }

    return data;
  };

// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsAsRead =
  async () => {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/notifications/read-all`,
      {
        method: "PUT",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to update notifications"
      );
    }

    return data;
  };

// ==========================================
// DELETE
// ==========================================

export const deleteNotification =
  async (id) => {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/notifications/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to delete notification"
      );
    }

    return data;
  };