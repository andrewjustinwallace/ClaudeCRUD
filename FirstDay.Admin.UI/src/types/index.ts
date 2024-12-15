export interface Company {
  companyId: number;
  companyName: string;
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

export interface SetupType {
  setupTypeId: number;
  setupName: string;
  description: string;
  estimatedDurationMinutes: number;
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
}

export interface NewHire {
  newHireId: number;
  firstName: string;
  lastName: string;
  email: string;
  companyId: number;
  companyName: string;
  hireDate: string;
  createdDate: string;
  modifiedDate: string;
}

export interface NewHireFormData {
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  company: string;
  department: string;
}

export interface SetupTask {
  taskId: number;
  itEmployeeId: number;
  newHireId: number;
  setupTypeId: number;
  scheduledDate: string;
  isCompleted: boolean;
  completedDate?: string;
  notes?: string;
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

export interface CompanyWorkloadDistribution {
  itEmployeeId: number;
  employeeName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  avgCompletionDays: number;
}