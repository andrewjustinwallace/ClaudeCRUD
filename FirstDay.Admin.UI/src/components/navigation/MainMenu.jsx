import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MainMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-gray-900 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('companies');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">
                FirstDay Admin
              </span>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/"
                )}`}
              >
                Dashboard
              </Link>
              <Link
                to="/companies"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/companies"
                )}`}
              >
                Companies
              </Link>
              <Link
                to="/employees"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/employees"
                )}`}
              >
                IT Employees
              </Link>
              <Link
                to="/newhire"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/newhire"
                )}`}
              >
                New Hires
              </Link>
              <Link
                to="/itsetup"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/itsetup"
                )}`}
              >
                IT Setup Types
              </Link>
              <Link
                to="/setuptasks"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/setuptasks"
                )}`}
              >
                Setup Tasks
              </Link>
            </div>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainMenu;