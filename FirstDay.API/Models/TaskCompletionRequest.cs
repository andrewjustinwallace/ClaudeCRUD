namespace FirstDay.API.Models;

public class TaskCompletionRequest
{
    public int TaskId { get; set; }
    public int ITEmployeeId { get; set; }
    public int NewHireId { get; set; }
    public string? Notes { get; set; }
}