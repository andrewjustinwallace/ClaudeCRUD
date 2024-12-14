import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { workloadService } from "../services/workloadService";
import { ITEmployeePendingTask } from "../types/workload";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const Tasks = () => {
  const { employeeId } = useParams<{ employeeId: string }>();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery<ITEmployeePendingTask[]>({
    queryKey: ["pendingTasks", employeeId],
    queryFn: () => workloadService.getPendingTasks(Number(employeeId)),
    enabled: !!employeeId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="space-y-3">
              <div className="h-4 w-[250px] bg-slate-200 rounded"></div>
              <div className="h-4 w-[200px] bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64 text-red-500">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          <span>Error loading tasks</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {employeeId ? "Employee Pending Tasks" : "All Tasks"}
      </h1>

      {tasks && tasks.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Hire
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Setup Type
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.taskId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.newHireName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.setupType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        task.isOverdue
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.isOverdue ? "Overdue" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No pending tasks found.</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
