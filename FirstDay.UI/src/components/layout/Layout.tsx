import { Outlet, Link } from 'react-router-dom'
import { HomeIcon, ClipboardDocumentListIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-semibold text-blue-600">FirstDay</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  <HomeIcon className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />
                  Tasks
                </Link>
                <Link
                  to="/progress"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <ChartBarIcon className="h-5 w-5 mr-1" />
                  Progress
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout