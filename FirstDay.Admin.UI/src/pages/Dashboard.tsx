import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  UsersIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  UserPlusIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

interface CompanyStatistics {
  companyId: number;
  companyName: string;
  totalEmployees: number;
  totalNewHires: number;
  pendingSetups: number;
  completedSetups: number;
  overdueTasks: number;
  avgCompletionRate: number;
}

const StatsCard = ({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) => (
  <Card className="p-6">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState<CompanyStatistics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockStats: CompanyStatistics[] = [
      {
        companyId: 1,
        companyName: "Demo Company",
        totalEmployees: 25,
        totalNewHires: 5,
        pendingSetups: 8,
        completedSetups: 12,
        overdueTasks: 2,
        avgCompletionRate: 85.5
      }
    ];
    
    // Simulating API call
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  const totalStats = stats.reduce(
    (acc, company) => ({
      totalEmployees: acc.totalEmployees + company.totalEmployees,
      totalNewHires: acc.totalNewHires + company.totalNewHires,
      pendingSetups: acc.pendingSetups + company.pendingSetups,
      completedSetups: acc.completedSetups + company.completedSetups,
      overdueTasks: acc.overdueTasks + company.overdueTasks,
    }),
    { totalEmployees: 0, totalNewHires: 0, pendingSetups: 0, completedSetups: 0, overdueTasks: 0 }
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Current statistics across all companies
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total IT Staff"
          value={totalStats.totalEmployees}
          icon={<UsersIcon className="w-6 h-6 text-blue-600" />}
        />
        <StatsCard
          title="Active New Hires"
          value={totalStats.totalNewHires}
          icon={<UserPlusIcon className="w-6 h-6 text-blue-600" />}
        />
        <StatsCard
          title="Pending Setups"
          value={totalStats.pendingSetups}
          icon={<ComputerDesktopIcon className="w-6 h-6 text-blue-600" />}
        />
        <StatsCard
          title="Completed Setups"
          value={totalStats.completedSetups}
          icon={<DocumentCheckIcon className="w-6 h-6 text-blue-600" />}
        />
        <StatsCard
          title="Total Companies"
          value={stats.length}
          icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-600" />}
        />
        <StatsCard
          title="Overdue Tasks"
          value={totalStats.overdueTasks}
          icon={<DocumentCheckIcon className="w-6 h-6 text-red-600" />}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company-wise Statistics</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IT Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Hires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overdue Tasks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((company) => (
                <tr key={company.companyId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.totalEmployees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.totalNewHires}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.avgCompletionRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.overdueTasks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}