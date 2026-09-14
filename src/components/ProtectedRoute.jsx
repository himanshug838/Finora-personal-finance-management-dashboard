import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  const rawToken = localStorage.getItem("token");
  const isValid = Boolean(
    rawToken && rawToken !== "undefined" && rawToken !== "null"
  );

  // User is not logged in
  if (!isValid) {
    if (rawToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // User is authenticated
  return <Outlet />;
};

export default ProtectedRoute;