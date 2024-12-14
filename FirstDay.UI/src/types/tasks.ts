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