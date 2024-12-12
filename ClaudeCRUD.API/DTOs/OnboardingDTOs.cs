namespace ClaudeCRUD.API.DTOs;

public record ITEmployeePendingTaskDTO(
    int TaskId,
    string NewHireName,
    string SetupType,
    DateTime ScheduledDate,
    string CompanyName
);

public record NewHireSetupStatusDTO(
    string SetupType,
    string ITEmployeeName,
    DateTime ScheduledDate,
    bool IsCompleted,
    DateTime? CompletedDate
);

public record ITEmployeeWorkloadDTO(
    string ITEmployeeName,
    long PendingTasks,
    long CompletedTasks,
    long TotalTasks,
    string CompanyName
);

public record TodaysTaskDTO(
    int TaskId,
    string ITEmployeeName,
    string NewHireName,
    string SetupType,
    bool IsCompleted,
    string CompanyName
);

public record CompanyOnboardingProgressDTO(
    string NewHireName,
    long TotalTasks,
    long CompletedTasks,
    decimal CompletionPercentage,
    DateTime HireDate
);

public record OverdueTaskDTO(
    int TaskId,
    string ITEmployeeName,
    string NewHireName,
    string SetupType,
    DateTime ScheduledDate,
    int DaysOverdue,
    string CompanyName
);