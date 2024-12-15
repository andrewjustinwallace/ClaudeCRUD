namespace FirstDay.Admin.API.Models.StoredProcedureModels;

public class SetupTypeStatistics
{
    public int SetupTypeId { get; set; }
    public string SetupName { get; set; } = string.Empty;
    public long TotalTasks { get; set; }
    public decimal AvgCompletionTime { get; set; }
    public decimal SuccessRate { get; set; }
    public int EstimatedDuration { get; set; }
    public decimal ActualAvgDuration { get; set; }
}