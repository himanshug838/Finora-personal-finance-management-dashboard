const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000/api/v1`
    : "http://localhost:5000/api/v1");

const getToken = () => {
  const rawToken = localStorage.getItem("token");
  return (rawToken && rawToken !== "undefined" && rawToken !== "null") ? rawToken : "";
};

// ==========================================
// GET NOTIFICATIONS
// ==========================================

export const getNotifications = async () => {
  try {
    const token = getToken();
    if (!token) return { success: true, count: 0, notifications: [] };

    const response = await fetch(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, count: 0, notifications: [] };
    }
    return data;
  } catch (err) {
    return { success: false, count: 0, notifications: [] };
  }
};

// ==========================================
// GET UNREAD COUNT
// ==========================================

export const getUnreadCount = async () => {
  try {
    const token = getToken();
    if (!token) return { success: true, count: 0 };

    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, count: 0 };
    }
    return data;
  } catch (err) {
    return { success: false, count: 0 };
  }
};

// ==========================================
// MARK AS READ
// ==========================================

export const markNotificationAsRead = async (id) => {
  try {
    const token = getToken();
    if (!token) return { success: true };

    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (err) {
    return { success: false };
  }
};

// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsAsRead = async () => {
  try {
    const token = getToken();
    if (!token) return { success: true };

    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (err) {
    return { success: false };
  }
};

// ==========================================
// DELETE NOTIFICATION
// ==========================================

export const deleteNotification = async (id) => {
  try {
    const token = getToken();
    if (!token) return { success: true };

    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (err) {
    return { success: false };
  }
};