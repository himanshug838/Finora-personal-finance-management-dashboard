import { useEffect, useState, useRef, useCallback } from "react";
import {
  getUnreadCount,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationApi.js";

const DEFAULT_NOTIFICATIONS = [
  {
    _id: "default-1",
    title: "Welcome to Finora 🚀",
    message: "Your financial dashboard is ready. Connect bank accounts or add transactions to track your money.",
    type: "system",
    severity: "success",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "default-2",
    title: "Bank-Grade Encryption Active 🔒",
    message: "Your accounts and transaction credentials are strictly encrypted and protected with 256-bit SSL.",
    type: "security",
    severity: "info",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: "default-3",
    title: "Financial Overview Updated 📊",
    message: "Check out your latest 6-month cash flow graph & spending category breakdown on the dashboard.",
    type: "budget",
    severity: "info",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const [notificationData, unreadData] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);

      const fetchedList = notificationData?.notifications || [];
      if (fetchedList.length > 0) {
        setNotifications(fetchedList);
        setUnreadCount(unreadData?.count || fetchedList.filter((n) => !n.isRead).length);
      } else {
        // Fallback default notifications if database is empty for user
        setNotifications(DEFAULT_NOTIFICATIONS);
        setUnreadCount(DEFAULT_NOTIFICATIONS.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.warn("Notification sync note:", err);
      setNotifications(DEFAULT_NOTIFICATIONS);
      setUnreadCount(DEFAULT_NOTIFICATIONS.filter((n) => !n.isRead).length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loadNotifications]);

  const handleOpenToggle = () => {
    setOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        loadNotifications();
      }
      return nextState;
    });
  };

  const handleRead = async (id) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    if (!id.startsWith("default-")) {
      await markNotificationAsRead(id);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await markAllNotificationsAsRead();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    setUnreadCount((prev) => {
      const item = notifications.find((n) => n._id === id);
      return item && !item.isRead ? Math.max(0, prev - 1) : prev;
    });

    if (!id.startsWith("default-")) {
      await deleteNotification(id);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* NOTIFICATION BELL BUTTON */}
      <button
        type="button"
        onClick={handleOpenToggle}
        aria-label="Notifications"
        aria-expanded={open}
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-black/10
          bg-white/70
          text-lg
          shadow-sm
          backdrop-blur-md
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-white
          hover:shadow-md
          dark:border-white/10
          dark:bg-white/5
          dark:hover:bg-white/10
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
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN CONTAINER */}
      {open && (
        <div
          className="
            absolute
            right-0
            top-full
            z-[9999]
            mt-3
            w-[340px]
            sm:w-[380px]
            overflow-hidden
            rounded-2xl
            border
            border-black/10
            bg-white
            shadow-2xl
            backdrop-blur-2xl
            dark:border-white/10
            dark:bg-[#080d1a]
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-black/5 p-4 dark:border-white/10">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Notifications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Financial alerts and system updates
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                You're all caught up 🎉
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && handleRead(n._id)}
                  className={`
                    group
                    relative
                    flex
                    items-start
                    gap-3
                    p-4
                    transition
                    cursor-pointer
                    ${!n.isRead ? "bg-violet-500/[0.06] dark:bg-violet-500/[0.1]" : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"}
                  `}
                >
                  {/* ICON */}
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
                      ${n.severity === "danger" ? "bg-red-500/10" : n.severity === "success" ? "bg-emerald-500/10" : "bg-violet-500/10"}
                    `}
                  >
                    {n.type === "budget"
                      ? "📊"
                      : n.type === "security"
                      ? "🔒"
                      : n.type === "system"
                      ? "🚀"
                      : "💳"}
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1 pr-6">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="h-2 w-2 rounded-full bg-violet-500" />
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
                      {n.message}
                    </p>
                    <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                      {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                    </p>
                  </div>

                  {/* DELETE BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(n._id, e)}
                    title="Remove notification"
                    className="absolute right-3 top-3 text-xs opacity-0 transition group-hover:opacity-100 text-slate-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;