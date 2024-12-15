namespace FirstDay.Admin.API.Models.StoredProcedureModels;

public class NewHireOnboardingStatus
{
    public int NewHireId { get; set; }
    public string NewHireName { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public long TotalTasks { get; set; }
    public long CompletedTasks { get; set; }
    public long PendingTasks { get; set; }
    public decimal CompletionPercentage { get; set; }
    public int DaysUntilStart { get; set; }
    public bool IsOverdue { get; set; }
}