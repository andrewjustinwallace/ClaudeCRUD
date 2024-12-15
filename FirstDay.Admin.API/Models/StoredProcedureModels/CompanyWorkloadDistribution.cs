namespace FirstDay.Admin.API.Models.StoredProcedureModels;

public class CompanyWorkloadDistribution
{
    public int ITEmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public long TotalTasks { get; set; }
    public long CompletedTasks { get; set; }
    public long PendingTasks { get; set; }
    public long OverdueTasks { get; set; }
    public decimal AvgCompletionDays { get; set; }
}