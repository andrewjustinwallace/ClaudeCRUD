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
  setupType: string;
  scheduledDate: string;
  isOverdue: boolean;
  isCompleted: boolean;
  companyName: string;
  newHireName: string;
  details: string;
}