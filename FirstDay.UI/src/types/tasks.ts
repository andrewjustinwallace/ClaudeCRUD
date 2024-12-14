export interface TodaysTask {
    taskId: number;
    newHireName: string;
    setupTypeName: string;
    assignedToEmployee: string;
    dueTime: string;
}

export interface OverdueTask {
    taskId: number;
    newHireName: string;
    setupTypeName: string;
    assignedToEmployee: string;
    dueDate: string;
    daysOverdue: number;
}

export interface PendingTask {
    taskId: number;
    newHireId: number;
    newHireName: string;
    setupType: string;
    scheduledDate: string;
    companyName: string;
    isOverdue?: boolean;
}