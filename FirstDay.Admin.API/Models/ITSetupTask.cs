namespace FirstDay.Admin.API.Models;

public class ITSetupTask
{
    public int TaskId { get; set; }
    public int NewHireId { get; set; }
    public string NewHireName { get; set; } = string.Empty;
    public string SetupType { get; set; } = string.Empty;
    public DateTime ScheduledDate { get; set; }
    public bool IsCompleted { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}

public class ITEmployeeWorkload
{
    public int ITEmployeeId { get; set; }
    public string ITEmployeeName { get; set; } = string.Empty;
    public int PendingTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int TotalTasks { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}

public class TodayTask
{
    public int TaskId { get; set; }
    public string ITEmployeeName { get; set; } = string.Empty;
    public string NewHireName { get; set; } = string.Empty;
    public string SetupType { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}

public class CompanyOnboardingProgress
{
    public string NewHireName { get; set; } = string.Empty;
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public decimal CompletionPercentage { get; set; }
    public DateTime HireDate { get; set; }
}

public class OverdueTask
{
    public int TaskId { get; set; }
    public string ITEmployeeName { get; set; } = string.Empty;
    public string NewHireName { get; set; } = string.Empty;
    public string SetupType { get; set; } = string.Empty;
    public DateTime ScheduledDate { get; set; }
    public int DaysOverdue { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}

