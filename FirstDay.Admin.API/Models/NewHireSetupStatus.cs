namespace FirstDay.Admin.API.Models;

public class NewHireSetupStatus
{
    public int NewHireId { get; set; }
    public string NewHireName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public int TotalSetupItems { get; set; }
    public int CompletedSetupItems { get; set; }
    public decimal ProgressPercentage { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsDelayed { get; set; }
    public int? DaysDelayed { get; set; }
}