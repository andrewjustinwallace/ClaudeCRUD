import { ReactNode } from 'react';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UsersIcon, 
  ComputerDesktopIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  current: boolean;
}

const NavItem = ({ to, icon, label, current }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md",
      current
        ? "bg-gray-100 text-gray-900"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    )}
  >
    <span className="w-5 h-5 mr-2">{icon}</span>
    {label}
  </Link>
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    {
      to: "/dashboard",
      icon: <HomeIcon />,
      label: "Dashboard"
    },
    {
      to: "/companies",
      icon: <BuildingOfficeIcon />,
      label: "Companies"
    },
    {
      to: "/employees",
      icon: <UsersIcon />,
      label: "IT Staff"
    },
    {
      to: "/setuptypes",
      icon: <ComputerDesktopIcon />,
      label: "Setup Types"
    },
    {
      to: "/newhires",
      icon: <UserPlusIcon />,
      label: "New Hires"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">FirstDay Admin</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                {navigation.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    current={location.pathname === item.to}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}