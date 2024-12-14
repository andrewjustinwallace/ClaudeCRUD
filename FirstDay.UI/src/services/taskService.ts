import api from "./api";
import { TodaysTask, OverdueTask } from "../types/tasks";

export const taskService = {
  getTodaysTasks: async (): Promise<TodaysTask[]> => {
    const { data } = await api.get("/onboarding/tasks/today");
    return data;
  },

  getOverdueTasks: async (): Promise<OverdueTask[]> => {
    const { data } = await api.get("/onboarding/tasks/overdue");
    return data;
  },
};
