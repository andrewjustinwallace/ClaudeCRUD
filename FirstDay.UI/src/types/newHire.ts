export interface NewHireSetupStatus {
    setupTypeId: number;
    setupTypeName: string;
    isComplete: boolean;
    assignedToEmployee: string;
    completionDate?: string;
    dueDate: string;
}