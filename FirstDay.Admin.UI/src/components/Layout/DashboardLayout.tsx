import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: true },
  { name: 'Companies', href: '/companies', current: false },
  { name: 'Setup Types', href: '/setuptypes', current: false },
  { name: 'IT Employees', href: '/employees', current: false },
  { name: 'New Hires', href: '/newhires', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  // Get user initials safely
  const getUserInitial = () => {
    return user?.firstName ? user.firstName[0]?.toUpperCase() : '?';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-indigo-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-white text-xl font-bold">FirstDay Admin</span>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-indigo-700 text-white'
                              : 'text-white hover:bg-indigo-500',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-indigo-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                          <span className="sr-only">Open user menu</span>
                          <span className="h-8 w-8 rounded-full bg-indigo-700 flex items-center justify-center">
                            {getUserInitial()}
                          </span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-700 text-white'
                        : 'text-white hover:bg-indigo-500',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-indigo-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <span className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center text-white">
                      {getUserInitial()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm font-medium text-indigo-300">
                      {user?.userType}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:text-white w-full text-left"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}