import api from "./api";
import { ITEmployeeWorkload } from "../types/workload";

export const workloadService = {
  getITEmployeeWorkload: async (): Promise<ITEmployeeWorkload[]> => {
    const { data } = await api.get("/onboarding/itemployee/workload");
    return data;
  },

  getPendingTasks: async (employeeId: number) => {
    const { data } = await api.get(
      `/onboarding/itemployee/${employeeId}/pendingtasks`
    );
    return data;
  },
};
