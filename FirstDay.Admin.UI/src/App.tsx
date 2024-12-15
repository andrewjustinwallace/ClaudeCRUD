import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Companies from '@/pages/Companies';
import SetupTypes from '@/pages/SetupTypes';
import ITEmployees from '@/pages/ITEmployees';
import NewHires from '@/pages/NewHires';
import ITEmployeeEdit from '@/pages/ITEmployeeEdit';
import NewHireCreate from '@/pages/NewHireCreate';
import NewHireEdit from '@/pages/NewHireEdit';
import NewHireProgress from '@/pages/NewHireProgress';
import SetupTypeEdit from '@/pages/SetupTypeEdit';
import { AuthProvider } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/setuptypes" element={<SetupTypes />} />
              <Route path="/setuptypes/:id" element={<SetupTypeEdit />} />
              <Route path="/employees" element={<ITEmployees />} />
              <Route path="/employees/:id" element={<ITEmployeeEdit />} />
              <Route path="/newhires" element={<NewHires />} />
              <Route path="/newhires/create" element={<NewHireCreate />} />
              <Route path="/newhires/:id/edit" element={<NewHireEdit />} />
              <Route path="/newhires/:id/progress" element={<NewHireProgress />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;