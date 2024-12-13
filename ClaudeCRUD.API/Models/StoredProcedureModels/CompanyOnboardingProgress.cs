namespace ClaudeCRUD.API.Models.StoredProcedureModels;

public class CompanyOnboardingProgress
{
    public string NewHireName { get; set; } = string.Empty;
    public long TotalTasks { get; set; }
    public long CompletedTasks { get; set; }
    public decimal CompletionPercentage { get; set; }
    public DateTime HireDate { get; set; }
}