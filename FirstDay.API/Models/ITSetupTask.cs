namespace FirstDay.API.Models;

public class ITSetupTask
{
    public int ITSetupTaskId { get; set; }
    public int ITEmployeeId { get; set; }
    public int NewHireId { get; set; }
    public int SetupTypeId { get; set; }
    public DateTime ScheduledDate { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedDate { get; set; }

    public ITEmployee? ITEmployee { get; set; }
    public NewHire? NewHire { get; set; }
    public SetupType? SetupType { get; set; }
}