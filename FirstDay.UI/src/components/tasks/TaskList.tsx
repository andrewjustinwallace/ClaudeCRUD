import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CompletionDialog } from "./CompletionDialog";

interface Task {
  itsetuptaskid: number;
  itemployeeid: number;
  newhireid: number;
  setuptype: string;
  newhirename: string;
  scheduleddate: string;
  companyname: string;
}

const TaskList = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await api.get("/itemployee/pendingtasks");
      return data;
    },
  });

  const handleCompleteTask = async (notes: string) => {
    if (!selectedTask) return;

    try {
      await api.put("/tasks/complete", {
        taskId: selectedTask.itsetuptaskid,
        itEmployeeId: selectedTask.itemployeeid,
        newHireId: selectedTask.newhireid,
        notes: notes,
      });

      // Invalidate and refetch tasks
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // Close dialog
      setIsCompletionDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error completing task:", error);
      // You might want to add a toast notification here
    }
  };

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
    <>
      <div className="space-y-4">
        {tasks?.map((task: Task) => (
          <div
            key={task.itsetuptaskid}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {task.setuptype}
              </h3>
              <button
                onClick={() => {
                  setSelectedTask(task);
                  setIsCompletionDialogOpen(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Pending
              </button>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              Scheduled: {new Date(task.scheduleddate).toLocaleDateString()}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              New Hire: {task.newhirename}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Company: {task.companyname}
            </div>
          </div>
        ))}
      </div>

      <CompletionDialog
        isOpen={isCompletionDialogOpen}
        onClose={() => {
          setIsCompletionDialogOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={handleCompleteTask}
      />
    </>
  );
};

export default TaskList;
