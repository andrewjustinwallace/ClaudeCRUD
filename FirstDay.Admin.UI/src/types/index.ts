export interface Company {
  companyId: number;
  companyName: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface ITEmployee {
  itEmployeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  userTypeId: number;
  userTypeName: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  companies?: { companyId: number; companyName: string }[];
  companyCount: number;
}

export interface NewHire {
  newHireId: number;
  firstName: string;
  lastName: string;
  email: string;
  companyId: number;
  companyName: string;
  hireDate: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface NewHireFormData {
  newHireId?: number;
  firstName: string;
  lastName: string;
  email: string;
  companyId: number;
  hireDate: string;
  isActive: boolean;
}

export interface SetupType {
  setupTypeId: number;
  setupName: string;
  description: string;
  estimatedDurationMinutes: number;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface UserType {
  userTypeId: number;
  typeName: string;
  createdDate: string;
  modifiedDate: string;
}

export interface CompanyStatistics {
  companyId: number;
  companyName: string;
  totalEmployees: number;
  totalNewHires: number;
  pendingSetups: number;
  completedSetups: number;
  overdueTasks: number;
  avgCompletionRate: number;
}
