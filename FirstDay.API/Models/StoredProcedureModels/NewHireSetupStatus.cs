namespace FirstDay.API.Models.StoredProcedureModels;

public class NewHireSetupStatus
{
    public string SetupType { get; set; } = string.Empty;
    public string ITEmployeeName { get; set; } = string.Empty;
    public DateTime ScheduledDate { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedDate { get; set; }
}