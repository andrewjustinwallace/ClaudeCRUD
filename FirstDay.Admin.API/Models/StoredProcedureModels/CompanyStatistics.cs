namespace FirstDay.Admin.API.Models.StoredProcedureModels;

public class CompanyStatistics
{
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public long TotalEmployees { get; set; }
    public long TotalNewHires { get; set; }
    public long PendingSetups { get; set; }
    public long CompletedSetups { get; set; }
    public long OverdueTasks { get; set; }
    public decimal AvgCompletionRate { get; set; }
}