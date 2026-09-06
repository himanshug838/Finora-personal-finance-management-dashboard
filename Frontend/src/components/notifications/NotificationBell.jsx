import { useEffect, useState } from "react";

import {
  getUnreadCount,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationApi.js";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load notifications
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        setError("");

        const [notificationData, unreadData] =
          await Promise.all([
            getNotifications(),
            getUnreadCount(),
          ]);

        if (cancelled) return;

        setNotifications(
          notificationData?.notifications || []
        );

        setUnreadCount(
          unreadData?.count || 0
        );
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Notification error:",
          error.message
        );

        setError(
          error.message ||
            "Unable to load notifications"
        );
      }
    };

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Refresh notifications
  |--------------------------------------------------------------------------
  */

  const refreshNotifications = async () => {
    try {
      setError("");

      const [notificationData, unreadData] =
        await Promise.all([
          getNotifications(),
          getUnreadCount(),
        ]);

      setNotifications(
        notificationData?.notifications || []
      );

      setUnreadCount(
        unreadData?.count || 0
      );
    } catch (error) {
      console.error(
        "Notification refresh error:",
        error.message
      );

      setError(
        error.message ||
          "Unable to refresh notifications"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle dropdown
  |--------------------------------------------------------------------------
  */

  const handleOpen = () => {
    setOpen((previous) => !previous);
  };

  /*
  |--------------------------------------------------------------------------
  | Mark single notification as read
  |--------------------------------------------------------------------------
  */

  const handleRead = async (id) => {
    try {
      setLoading(true);
      setError("");

      await markNotificationAsRead(id);

      await refreshNotifications();
    } catch (error) {
      console.error(
        "Mark notification error:",
        error.message
      );

      setError(
        error.message ||
          "Unable to mark notification as read"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Mark all notifications as read
  |--------------------------------------------------------------------------
  */

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      setError("");

      await markAllNotificationsAsRead();

      await refreshNotifications();
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error.message
      );

      setError(
        error.message ||
          "Unable to mark notifications as read"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* ================================================================ */}
      {/* Notification Bell */}
      {/* ================================================================ */}

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        aria-expanded={open}
        className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-black/10
          bg-white/70
          text-lg
          shadow-sm
          transition
          duration-200
          hover:-translate-y-0.5
          hover:shadow-lg
          dark:border-white/10
          dark:bg-white/5
        "
      >
        🔔

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[10px]
              font-bold
              text-white
              shadow-sm
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* ================================================================ */}
      {/* Notification Dropdown */}
      {/* ================================================================ */}

      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-3
            w-[350px]
            overflow-hidden
            rounded-2xl
            border
            border-black/10
            bg-white/95
            shadow-2xl
            backdrop-blur-xl
            dark:border-white/10
            dark:bg-[#0b1020]/95
          "
        >
          {/* ============================================================ */}
          {/* Header */}
          {/* ============================================================ */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-black/5
              p-4
              dark:border-white/10
            "
          >
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Notifications
              </h3>

              <p
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Financial alerts and updates
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                disabled={loading}
                onClick={handleMarkAllRead}
                className="
                  text-xs
                  font-semibold
                  text-violet-600
                  transition
                  hover:underline
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:text-violet-400
                "
              >
                {loading
                  ? "Updating..."
                  : "Mark all read"}
              </button>
            )}
          </div>

          {/* ============================================================ */}
          {/* Error */}
          {/* ============================================================ */}

          {error && (
            <div
              className="
                border-b
                border-red-500/10
                bg-red-500/5
                px-4
                py-3
                text-xs
                text-red-500
              "
            >
              {error}
            </div>
          )}

          {/* ============================================================ */}
          {/* Notifications List */}
          {/* ============================================================ */}

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div
                className="
                  p-8
                  text-center
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                You're all caught up 🎉
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  disabled={
                    loading ||
                    notification.isRead
                  }
                  onClick={() =>
                    handleRead(
                      notification._id
                    )
                  }
                  className={`
                    w-full
                    border-b
                    border-black/5
                    p-4
                    text-left
                    transition
                    dark:border-white/5

                    ${
                      !notification.isRead
                        ? "bg-violet-500/[0.05]"
                        : ""
                    }

                    ${
                      !notification.isRead
                        ? "hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                        : ""
                    }
                  `}
                >
                  <div className="flex gap-3">
                    {/* ================================================== */}
                    {/* Notification Icon */}
                    {/* ================================================== */}

                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-sm

                        ${
                          notification.severity ===
                          "danger"
                            ? "bg-red-500/10"
                            : notification.severity ===
                              "warning"
                            ? "bg-orange-500/10"
                            : notification.severity ===
                              "success"
                            ? "bg-emerald-500/10"
                            : "bg-violet-500/10"
                        }
                      `}
                    >
                      {notification.type ===
                      "budget"
                        ? "📊"
                        : notification.type ===
                          "expense"
                        ? "💳"
                        : notification.type ===
                          "balance"
                        ? "🏦"
                        : notification.type ===
                          "investment"
                        ? "📈"
                        : notification.type ===
                          "plaid"
                        ? "🔗"
                        : "ℹ️"}
                    </div>

                    {/* ================================================== */}
                    {/* Notification Content */}
                    {/* ================================================== */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className="
                            text-sm
                            font-semibold
                            text-slate-900
                            dark:text-white
                          "
                        >
                          {notification.title}
                        </p>

                        {!notification.isRead && (
                          <span
                            className="
                              h-2
                              w-2
                              shrink-0
                              rounded-full
                              bg-violet-500
                            "
                          />
                        )}
                      </div>

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-5
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {notification.message}
                      </p>

                      <p
                        className="
                          mt-2
                          text-[10px]
                          text-slate-400
                        "
                      >
                        {notification.createdAt
                          ? new Date(
                              notification.createdAt
                            ).toLocaleString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;