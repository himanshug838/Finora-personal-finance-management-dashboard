import {
  Route,
  Routes,
} from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NetWorth from "./pages/NetWorth.jsx";
import FinancialGoals from "./pages/FinancialGoals.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Landing />}
      />

      <Route
        path="/net-worth"
        element={
            <ProtectedRoute>
                <NetWorth />
            </ProtectedRoute>}
       />

       <Route
        path="/goals"
        element={
            <ProtectedRoute>
                <FinancialGoals />
            </ProtectedRoute>
            }
        />

    </Routes>
  );
}

export default App;
