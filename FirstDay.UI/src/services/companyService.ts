import api from "./api";
import { CompanyOnboardingProgress } from "../types/company";

export const companyService = {
  getOnboardingProgress: async (
    companyId: number
  ): Promise<CompanyOnboardingProgress[]> => {
    const { data } = await api.get(
      `/onboarding/company/${companyId}/onboardingprogress`
    );
    return data;
  },
};
