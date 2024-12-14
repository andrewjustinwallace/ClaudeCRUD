import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.authenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoginPage = location.pathname === '/login';
  const showNavigation = !isLoginPage && user.userType === 'Admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavigation && <Navigation />}
      <main className={`${showNavigation ? 'pt-4' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/employee/:employeeId"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;