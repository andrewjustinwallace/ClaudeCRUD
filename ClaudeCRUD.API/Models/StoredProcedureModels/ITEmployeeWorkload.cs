namespace ClaudeCRUD.API.Models.StoredProcedureModels;

public class ITEmployeeWorkload
{
    public string ITEmployeeName { get; set; } = string.Empty;
    public long PendingTasks { get; set; }
    public long CompletedTasks { get; set; }
    public long TotalTasks { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}