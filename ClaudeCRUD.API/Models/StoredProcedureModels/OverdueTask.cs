namespace ClaudeCRUD.API.Models.StoredProcedureModels;

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