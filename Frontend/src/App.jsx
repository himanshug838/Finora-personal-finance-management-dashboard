import { Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NetWorth from "./pages/NetWorth.jsx";
import FinancialGoals from "./pages/FinancialGoals.jsx";
import Accounts from "./pages/Accounts.jsx";
import Transactions from "./pages/Transactions.jsx";
import Investments from "./pages/Investments.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/net-worth" element={<NetWorth />} />
            <Route path="/goals" element={<FinancialGoals />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/investments" element={<Investments />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
