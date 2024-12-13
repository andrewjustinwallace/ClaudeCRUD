export interface EmployeeWorkload {
    employeeId: string;
    name: string;
    assignedTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
}

export interface WorkloadSummary {
    totalEmployees: number;
    totalTasks: number;
    averageTasksPerEmployee: number;
    employees: EmployeeWorkload[];
}