import api from "./api";
import { NewHireSetupStatus } from "../types/newHire";

export const newHireService = {
  getSetupStatus: async (newHireId: number): Promise<NewHireSetupStatus[]> => {
    const { data } = await api.get(
      `/onboarding/newhire/${newHireId}/setupstatus`
    );
    return data;
  },
};
