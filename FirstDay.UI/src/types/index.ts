export interface ITEmployeePendingTask {
    taskId: number;
    newHireName: string;
    setupType: string;
    scheduledDate: string;
    companyName: string;
}

export interface NewHireSetupStatus {
    setupType: string;
    itEmployeeName: string;
    scheduledDate: string;
    isCompleted: boolean;
    completedDate: string | null;
}

export interface ITEmployeeWorkload {
    itEmployeeName: string;
    pendingTasks: number;
    completedTasks: number;
    totalTasks: number;
    companyName: string;
}

export interface TodaysTask {
    taskId: number;
    itEmployeeName: string;
    newHireName: string;
    setupType: string;
    isCompleted: boolean;
    companyName: string;
}

export interface CompanyOnboardingProgress {
    newHireName: string;
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
    hireDate: string;
}

export interface OverdueTask {
    taskId: number;
    itEmployeeName: string;
    newHireName: string;
    setupType: string;
    scheduledDate: string;
    daysOverdue: number;
    companyName: string;
}