import api from "./api";
import {
  Company,
  CompanyDTO,
  CompanyAssignmentDTO,
  CompanyStatistics,
  CompanyWorkloadDistribution,
  NewHireOnboardingStatus,
} from "../types/Company";

export const getActiveCompanies = async (): Promise<Company[]> => {
  const response = await api.get<Company[]>("/company");
  return response.data;
};

export const upsertCompany = async (company: CompanyDTO): Promise<number> => {
  const response = await api.post<number>("/company", company);
  return response.data;
};

export const assignCompanyToEmployee = async (
  assignment: CompanyAssignmentDTO
): Promise<boolean> => {
  const response = await api.post<boolean>("/company/assign", assignment);
  return response.data;
};

export const removeCompanyFromEmployee = async (
  assignment: CompanyAssignmentDTO
): Promise<boolean> => {
  const response = await api.post<boolean>("/company/remove", assignment);
  return response.data;
};

export const getEmployeeCompanyAssignments = async (
  employeeId: number
): Promise<Company[]> => {
  const response = await api.get<Company[]>(
    `/company/employee/${employeeId}/assignments`
  );
  return response.data;
};

export const getCompanyStatistics = async (): Promise<CompanyStatistics[]> => {
  const response = await api.get<CompanyStatistics[]>("/company/statistics");
  return response.data;
};

export const getCompanyWorkloadDistribution = async (
  companyId: number
): Promise<CompanyWorkloadDistribution[]> => {
  const response = await api.get<CompanyWorkloadDistribution[]>(
    `/company/${companyId}/workload`
  );
  return response.data;
};

export const getNewHireOnboardingStatus = async (
  companyId: number
): Promise<NewHireOnboardingStatus[]> => {
  const response = await api.get<NewHireOnboardingStatus[]>(
    `/company/${companyId}/onboarding`
  );
  return response.data;
};
