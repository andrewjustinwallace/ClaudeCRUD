namespace FirstDay.Admin.API.Models;

public class NewHireProgress
{
    public int NewHireId { get; set; }
    public string NewHireName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public List<NewHireSetupItem> SetupItems { get; set; } = new();
    public decimal ProgressPercentage { get; set; }
    public bool IsComplete { get; set; }
}

public class NewHireSetupItem
{
    public int SetupTypeId { get; set; }
    public string SetupTypeName { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public string? Notes { get; set; }
    public DateTime? CompletedDate { get; set; }
    public int EstimatedDurationMinutes { get; set; }
    public string? AssignedToEmployeeName { get; set; }
}