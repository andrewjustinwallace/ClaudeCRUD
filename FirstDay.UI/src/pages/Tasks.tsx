import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { workloadService } from '../services/workloadService';
import { PendingTask } from '../types/tasks';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { CompletionDialog } from '../components/tasks/CompletionDialog';
import api from '../services/api';

interface GroupedTasks {
    [key: string]: PendingTask[];
}

const Tasks = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());
    const [selectedTask, setSelectedTask] = useState<PendingTask | null>(null);
    const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
    const queryClient = useQueryClient();

    const { data: tasks, isLoading, error } = useQuery<PendingTask[]>({
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

    const handleCompleteTask = async (notes: string) => {
        if (!selectedTask || !employeeId) return;
        
        setIsSubmitting(true);
        try {
            const response = await api.put("/task/complete", {
                taskId: selectedTask.taskId,
                itEmployeeId: Number(employeeId),
                newHireId: selectedTask.newHireId,
                notes: notes
            });

            if (response.data.success) {
                setCompletedTasks(prev => new Set(prev).add(selectedTask.taskId));
                // Refresh the tasks list
                await queryClient.invalidateQueries({ queryKey: ['pendingTasks', employeeId] });
            }
            
            setIsCompletionDialogOpen(false);
            setSelectedTask(null);
        } catch (error) {
            console.error("Error completing task:", error);
        } finally {
            setIsSubmitting(false);
        }
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
                    <p className="text-gray-500">No tasks found.</p>
                </div>
            </div>
        );
    }

    // Group tasks by company and new hire
    const groupedTasks = tasks.reduce<GroupedTasks>((acc, task) => {
        const key = `${task.companyName} - ${task.newHireName}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        // Only use completedTasks Set to augment the API response if needed
        const isCompleted = task.isCompleted || completedTasks.has(task.taskId);
        acc[key].push({ ...task, isCompleted });
        return acc;
    }, {});

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                {employeeId ? 'Employee Tasks' : 'All Tasks'}
            </h1>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {Object.entries(groupedTasks).map(([groupKey, groupTasks]) => (
                        <div key={groupKey} className="bg-white">
                            <div
                                onClick={() => toggleEmployee(groupKey)}
                                className="px-6 py-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    {expandedEmployees.has(groupKey) ? (
                                        <ChevronUpIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    ) : (
                                        <ChevronDownIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    )}
                                    <span className="text-sm font-medium text-gray-900">
                                        {groupKey}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'})
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    {groupTasks.some(task => task.isOverdue && !task.isCompleted) && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                            Has overdue tasks
                                        </span>
                                    )}
                                </div>
                            </div>

                            {expandedEmployees.has(groupKey) && (
                                <div className="px-6 pb-4">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                                    Task ID
                                                </th>
                                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                                    Setup Type
                                                </th>
                                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                                    Due Date
                                                </th>
                                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                                    Status
                                                </th>
                                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {groupTasks.map((task) => (
                                                <tr key={task.taskId}>
                                                    <td className="py-2 text-sm text-gray-900">
                                                        {task.taskId}
                                                    </td>
                                                    <td className="py-2 text-sm text-gray-900">
                                                        {task.setupType}
                                                    </td>
                                                    <td className="py-2 text-sm text-gray-500">
                                                        {new Date(task.scheduledDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-2 text-center">
                                                        <span
                                                            className={`px-2 py-1 text-xs rounded-full ${
                                                                task.isCompleted
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : task.isOverdue
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                        >
                                                            {task.isCompleted ? 'Completed' : task.isOverdue ? 'Overdue' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 text-center">
                                                        {task.isCompleted ? (
                                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                                                                Completed
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedTask(task);
                                                                    setIsCompletionDialogOpen(true);
                                                                }}
                                                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                                                            >
                                                                Complete
                                                            </button>
                                                        )}
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

            <CompletionDialog
                isOpen={isCompletionDialogOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsCompletionDialogOpen(false);
                        setSelectedTask(null);
                    }
                }}
                onConfirm={handleCompleteTask}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default Tasks;