import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { WorkloadSummary } from "../../../types/workload";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { workloadService } from "../../../services/workloadService";

const WorkloadChart = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<WorkloadSummary>({
    queryKey: ["workload"],
    queryFn: () => workloadService.getWorkloadSummary(),
    retry: 1,
    onError: (error) => {
      console.error('Workload fetch error:', error);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 rounded-full bg-slate-200"></div>
          <div className="space-y-3">
            <div className="h-4 w-[250px] bg-slate-200 rounded"></div>
            <div className="h-4 w-[200px] bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
        <span>Error loading workload data</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          IT Team Workload Distribution
        </h3>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Total Employees</p>
            <p className="text-2xl font-semibold text-blue-900">
              {data?.totalEmployees ?? 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Total Tasks</p>
            <p className="text-2xl font-semibold text-green-900">
              {data?.totalTasks ?? 0}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Avg Tasks/Employee</p>
            <p className="text-2xl font-semibold text-purple-900">
              {data?.averageTasksPerEmployee?.toFixed(1) ?? '0.0'}
            </p>
          </div>
        </div>

        {/* Employee Workload Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overdue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.employees?.map((employee) => (
                <tr
                  key={employee.employeeId}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedEmployee === employee.employeeId ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedEmployee(employee.employeeId)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {employee.assignedTasks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {employee.pendingTasks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        employee.overdueTasks > 0
                          ? "bg-red-100 text-red-800"
                          : "text-gray-500"
                      }`}
                    >
                      {employee.overdueTasks}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkloadChart;