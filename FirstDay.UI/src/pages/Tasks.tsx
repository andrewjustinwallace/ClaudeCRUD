import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workloadService } from '../services/workloadService';
import { ITEmployeePendingTask } from '../types/workload';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface GroupedTasks {
    [key: string]: ITEmployeePendingTask[];
}

const Tasks = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());

    const { data: tasks, isLoading, error } = useQuery<ITEmployeePendingTask[]>({
        queryKey: ['pendingTasks', employeeId],
        queryFn: () => workloadService.getPendingTasks(Number(employeeId)),
        enabled: !!employeeId
    });

    const toggleEmployee = (employee: string) => {
        const newExpanded = new Set(expandedEmployees);
        if (newExpanded.has(employee)) {
            newExpanded.delete(employee);
        } else {
            newExpanded.add(employee);
        }
        setExpandedEmployees(newExpanded);
    };

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

    if (!tasks || tasks.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    {employeeId ? 'Employee Pending Tasks' : 'All Tasks'}
                </h1>
                <div className="text-center py-12">
                    <p className="text-gray-500">No pending tasks found.</p>
                </div>
            </div>
        );
    }

    // Group tasks by employee name
    const groupedTasks = tasks.reduce<GroupedTasks>((acc, task) => {
        if (!acc[task.newHireName]) {
            acc[task.newHireName] = [];
        }
        acc[task.newHireName].push(task);
        return acc;
    }, {});

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                {employeeId ? 'Employee Pending Tasks' : 'All Tasks'}
            </h1>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {Object.entries(groupedTasks).map(([employeeName, employeeTasks]) => (
                        <div key={employeeName} className="bg-white">
                            <div
                                onClick={() => toggleEmployee(employeeName)}
                                className="px-6 py-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    {expandedEmployees.has(employeeName) ? (
                                        <ChevronUpIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    ) : (
                                        <ChevronDownIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    )}
                                    <span className="text-sm font-medium text-gray-900">
                                        {employeeName}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({employeeTasks.length} {employeeTasks.length === 1 ? 'task' : 'tasks'})
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    {employeeTasks.some(task => task.isOverdue) && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                            Has overdue tasks
                                        </span>
                                    )}
                                </div>
                            </div>

                            {expandedEmployees.has(employeeName) && (
                                <div className="px-6 pb-4">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                                    Setup Type
                                                </th>
                                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                                    Due Date
                                                </th>
                                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {employeeTasks.map((task) => (
                                                <tr key={task.taskId}>
                                                    <td className="py-2 text-sm text-gray-900">
                                                        {task.setupType}
                                                    </td>
                                                    <td className="py-2 text-sm text-gray-500">
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-2 text-center">
                                                        <span
                                                            className={`px-2 py-1 text-xs rounded-full ${
                                                                task.isOverdue
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                        >
                                                            {task.isOverdue ? 'Overdue' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;