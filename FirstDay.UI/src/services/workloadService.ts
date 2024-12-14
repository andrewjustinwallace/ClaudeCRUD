import api from "./api";
import { ITEmployeeWorkload } from "../types/workload";

export const workloadService = {
  getITEmployeeWorkload: async (): Promise<ITEmployeeWorkload[]> => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const companyId = user.selectedCompanyId;

    if (!companyId) {
      throw new Error("Company ID not found");
    }

    const { data } = await api.get(
      `/onboarding/itemployee/${companyId}/workload`
    );
    return data;
  },

  getPendingTasks: async (employeeId: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const companyId = user.selectedCompanyId;

    if (!companyId) {
      throw new Error("Company ID not found");
    }

    const { data } = await api.get(
      `/onboarding/itemployee/${employeeId}/company/${companyId}/pendingtasks`
    );
    return data;
  },
};
