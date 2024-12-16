export interface Company {
    id: number;
    name: string;
    isActive: boolean;
    createdDate: string;
    lastModifiedDate: string;
}

export interface CompanyDTO {
    id?: number;
    name: string;
    isActive: boolean;
}

export interface CompanyAssignmentDTO {
    employeeId: number;
    companyId: number;
}

export interface CompanyStatistics {
    companyId: number;
    companyName: string;
    totalNewHires: number;
    activeOnboarding: number;
    completedOnboarding: number;
    averageCompletionDays: number;
}

export interface CompanyWorkloadDistribution {
    itEmployeeId: number;
    employeeName: string;
    activeAssignments: number;
    completedAssignments: number;
    averageTaskCompletionTime: number;
}

export interface NewHireOnboardingStatus {
    newHireId: number;
    name: string;
    startDate: string;
    completedTasks: number;
    totalTasks: number;
    status: string;
    assignedTo: string;
}