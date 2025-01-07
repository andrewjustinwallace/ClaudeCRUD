import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import MainMenu from "./components/navigation/MainMenu";
import Dashboard from "./components/Dashboard";
import CompaniesGrid from "./components/companies/CompaniesGrid";
import EmployeesGrid from "./components/employees/EmployeesGrid";
import NewHiresGrid from "./components/newhires/NewHiresGrid";
import ITSetupGrid from "./components/itsetup/ITSetupGrid";
import SetupTasksGrid from "./components/setuptasks/SetupTasksGrid";
import Login from "./components/auth/Login";

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const userData = JSON.parse(user);
    if (userData.userType !== "Admin") {
      localStorage.removeItem("user");
      localStorage.removeItem("companies");
      return <Navigate to="/login" state={{ message: "Access denied. Admin privileges required." }} replace />;
    }
    return children;
  } catch (e) {
    localStorage.removeItem("user");
    localStorage.removeItem("companies");
    return <Navigate to="/login" state={{ message: "Invalid session. Please login again." }} replace />;
  }
};

const PublicRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.userType === "Admin") {
        return <Navigate to={location.state?.from?.pathname || "/"} replace />;
      }
      // If not admin, clear storage and stay on login page
      localStorage.removeItem("user");
      localStorage.removeItem("companies");
    } catch (e) {
      localStorage.removeItem("user");
      localStorage.removeItem("companies");
    }
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-100">
                <MainMenu />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/companies" element={<CompaniesGrid />} />
                  <Route path="/employees" element={<EmployeesGrid />} />
                  <Route path="/newhire" element={<NewHiresGrid />} />
                  <Route path="/itsetup" element={<ITSetupGrid />} />
                  <Route path="/setuptasks" element={<SetupTasksGrid />} />
                </Routes>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;