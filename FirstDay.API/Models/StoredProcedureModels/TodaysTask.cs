namespace FirstDay.API.Models.StoredProcedureModels;

public class TodaysTask
{
    public int TaskId { get; set; }
    public string ITEmployeeName { get; set; } = string.Empty;
    public string NewHireName { get; set; } = string.Empty;
    public string SetupType { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}