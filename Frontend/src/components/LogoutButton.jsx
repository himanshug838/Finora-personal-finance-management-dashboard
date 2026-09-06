import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication token
    localStorage.removeItem("token");

    // Optional: remove any other stored user data
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="
        rounded-2xl
        border
        border-black/10
        bg-white/60
        px-4
        py-2.5
        text-sm
        font-semibold
        text-slate-700
        shadow-sm
        backdrop-blur-xl
        transition
        duration-300
        hover:-translate-y-0.5
        hover:bg-white
        hover:shadow-lg
        dark:border-white/10
        dark:bg-white/5
        dark:text-white
        dark:hover:bg-white/10
      "
    >
      Logout
    </button>
  );
};

export default LogoutButton;