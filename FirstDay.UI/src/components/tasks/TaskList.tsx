import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Task {
    id: string;
    title: string;
    status: string;
    dueDate: string;
    assignedTo: string;
}

const TaskList = () => {
    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const { data } = await api.get('/itemployee/pending-tasks');
            return data;
        }
    });

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                Error loading tasks. Please try again later.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tasks?.map((task: Task) => (
                <div 
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                            {task.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                            task.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {task.status}
                        </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Assigned to: {task.assignedTo}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;