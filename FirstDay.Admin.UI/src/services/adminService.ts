import axios from 'axios';
import { Company, ITEmployee, UserType, SetupType, NewHire, NewHireFormData, CompanyStatistics } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

export interface IAdminService {
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

class AdminService implements IAdminService {
  async getActiveCompanies(): Promise<Company[]> {
    const response = await axios.get(`${API_URL}/api/company`);
    return response.data;
  }

  async upsertCompany(company: Partial<Company>): Promise<number> {
    const response = await axios.post(`${API_URL}/api/company`, company);
    return response.data;
  }

  async getUserTypes(): Promise<UserType[]> {
    const response = await axios.get(`${API_URL}/api/usertype`);
    return response.data;
  }

  async getActiveSetupTypes(): Promise<SetupType[]> {
    const response = await axios.get(`${API_URL}/api/setuptype`);
    return response.data;
  }

  async upsertSetupType(setupType: Partial<SetupType>): Promise<number> {
    const response = await axios.post(`${API_URL}/api/setuptype`, setupType);
    return response.data;
  }

  async getActiveITEmployees(): Promise<ITEmployee[]> {
    const response = await axios.get(`${API_URL}/api/employee`);
    return response.data;
  }

  async upsertITEmployee(employee: Partial<ITEmployee>): Promise<number> {
    const response = await axios.post(`${API_URL}/api/employee`, employee);
    return response.data;
  }

  async getEmployeeCompanyAssignments(employeeId: number): Promise<Company[]> {
    const response = await axios.get(`${API_URL}/api/company/employee/${employeeId}/assignments`);
    return response.data;
  }

  async assignCompanyToEmployee(companyId: number, employeeId: number): Promise<boolean> {
    const response = await axios.post(`${API_URL}/api/company/assign`, { companyId, employeeId });
    return response.data;
  }

  async removeCompanyFromEmployee(companyId: number, employeeId: number): Promise<boolean> {
    const response = await axios.post(`${API_URL}/api/company/remove`, { companyId, employeeId });
    return response.data;
  }

  async getActiveNewHires(): Promise<NewHire[]> {
    const response = await axios.get(`${API_URL}/api/newhire`);
    return response.data;
  }

  async getCompanyStatistics(): Promise<CompanyStatistics> {
    const response = await axios.get(`${API_URL}/api/company/statistics`);
    return response.data;
  }

  async upsertNewHire(newHire: Partial<NewHireFormData> & { newHireId?: number }): Promise<number> {
    const response = await axios.post(`${API_URL}/api/newhire`, newHire);
    return response.data;
  }
}

export const adminService = new AdminService();