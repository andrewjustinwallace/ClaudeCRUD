import axios from "axios";
import {
  Company,
  ITEmployee,
  UserType,
  SetupType,
  NewHire,
  NewHireFormData,
  CompanyStatistics,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
console.log('API_URL:', API_URL); // Debug log

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Full error object:', error); // Debug log
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('Request error:', {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      });
    }
    throw error;
  }
);

export interface AdminServiceInterface {
  getActiveCompanies(): Promise<Company[]>;
  upsertCompany(company: Partial<Company>): Promise<number>;
  getUserTypes(): Promise<UserType[]>;
  getActiveSetupTypes(): Promise<SetupType[]>;
  upsertSetupType(setupType: Partial<SetupType>): Promise<number>;
  getActiveITEmployees(): Promise<ITEmployee[]>;
  upsertITEmployee(employee: Partial<ITEmployee>): Promise<number>;
  getEmployeeCompanyAssignments(employeeId: number): Promise<Company[]>;
  assignCompanyToEmployee(companyId: number, employeeId: number): Promise<boolean>;
  removeCompanyFromEmployee(companyId: number, employeeId: number): Promise<boolean>;
  getActiveNewHires(): Promise<NewHire[]>;
  getCompanyStatistics(): Promise<CompanyStatistics>;
  upsertNewHire(newHire: Partial<NewHireFormData> & { newHireId?: number }): Promise<number>;
}

class AdminService implements AdminServiceInterface {
  async getActiveCompanies(): Promise<Company[]> {
    const response = await axiosInstance.get(`/company`);
    return response.data;
  }

  async upsertCompany(company: Partial<Company>): Promise<number> {
    const response = await axiosInstance.post(`/company`, company);
    return response.data;
  }

  async getUserTypes(): Promise<UserType[]> {
    const response = await axiosInstance.get(`/usertype`);
    return response.data;
  }

  async getActiveSetupTypes(): Promise<SetupType[]> {
    const response = await axiosInstance.get(`/setuptype`);
    return response.data;
  }

  async upsertSetupType(setupType: Partial<SetupType>): Promise<number> {
    const response = await axiosInstance.post(`/setuptype`, setupType);
    return response.data;
  }

  async getActiveITEmployees(): Promise<ITEmployee[]> {
    const response = await axiosInstance.get(`/employee`);
    return response.data;
  }

  async upsertITEmployee(employee: Partial<ITEmployee>): Promise<number> {
    const response = await axiosInstance.post(`/employee`, employee);
    return response.data;
  }

  async getEmployeeCompanyAssignments(employeeId: number): Promise<Company[]> {
    const response = await axiosInstance.get(
      `/company/employee/${employeeId}/assignments`
    );
    return response.data;
  }

  async assignCompanyToEmployee(
    companyId: number,
    employeeId: number
  ): Promise<boolean> {
    const response = await axiosInstance.post(`/company/assign`, {
      companyId,
      employeeId,
    });
    return response.data;
  }

  async removeCompanyFromEmployee(
    companyId: number,
    employeeId: number
  ): Promise<boolean> {
    const response = await axiosInstance.post(`/company/remove`, {
      companyId,
      employeeId,
    });
    return response.data;
  }

  async getActiveNewHires(): Promise<NewHire[]> {
    const response = await axiosInstance.get(`/newhire`);
    return response.data;
  }

  async getCompanyStatistics(): Promise<CompanyStatistics> {
    console.log('Fetching company statistics from:', `${API_URL}/company/statistics`); // Debug log
    try {
      const response = await axiosInstance.get(`/company/statistics`);
      return response.data;
    } catch (error) {
      console.error('Detailed error in getCompanyStatistics:', error);
      throw error;
    }
  }

  async upsertNewHire(
    newHire: Partial<NewHireFormData> & { newHireId?: number }
  ): Promise<number> {
    const response = await axiosInstance.post(`/newhire`, newHire);
    return response.data;
  }
}

export const adminService = new AdminService();