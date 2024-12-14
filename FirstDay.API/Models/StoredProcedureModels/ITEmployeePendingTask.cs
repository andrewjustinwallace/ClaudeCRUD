using System.Diagnostics.Eventing.Reader;

namespace FirstDay.API.Models.StoredProcedureModels;

public class ITEmployeePendingTask
{
    public int TaskId { get; set; }
    public int NewHireId { get; set; }
    public string NewHireName { get; set; } = string.Empty;
    public string SetupType { get; set; } = string.Empty;
    public DateTime ScheduledDate { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public string Details { get; set; } = string.Empty;
}