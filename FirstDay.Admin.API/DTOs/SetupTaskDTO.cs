namespace FirstDay.Admin.API.DTOs;

public class SetupTaskDTO
{
    public int TaskId { get; set; }
    public string SetupType { get; set; }
    public int SetupTypeId { get; set; }
    public int ItEmployeeId { get; set; }
    public string ItEmployeeName { get; set; }
    public int NewHireId { get; set; }
    public string NewHireName { get; set; }
    public int CompanyId { get; set; }
    public string CompanyName { get; set; }
    public DateTime ScheduledDate { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedDate { get; set; }
    public string Notes { get; set; }
    public string Details { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }
}