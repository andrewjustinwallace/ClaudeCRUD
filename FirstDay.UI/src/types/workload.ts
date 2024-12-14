export interface ITEmployeeWorkload {
  itEmployeeId: number;
  itEmployeeName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export interface ITEmployeePendingTask {
  taskId: number;
  newHireName: string;
  setupType: string;
  dueDate: string;
  isOverdue: boolean;
}
