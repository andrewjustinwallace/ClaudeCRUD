import api from "./api";
import { TodaysTask, OverdueTask } from "../types/tasks";

interface CompleteTaskRequest {
  taskId: number;
  itEmployeeId: number;
  newHireId: number;
  notes?: string;
}

export const taskService = {
  getTodaysTasks: async (): Promise<TodaysTask[]> => {
    const { data } = await api.get("/onboarding/tasks/today");
    return data;
  },

  getOverdueTasks: async (): Promise<OverdueTask[]> => {
    const { data } = await api.get("/onboarding/tasks/overdue");
    return data;
  },

  completeTask: async (request: CompleteTaskRequest): Promise<void> => {
    await api.put("/task/complete", request);
  },
};