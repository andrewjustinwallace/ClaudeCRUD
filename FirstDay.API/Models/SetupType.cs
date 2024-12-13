namespace FirstDay.API.Models;

public class SetupType
{
    public int SetupTypeId { get; set; }
    public string SetupName { get; set; } = string.Empty;
    public ICollection<ITSetupTask> ITSetupTasks { get; set; } = new List<ITSetupTask>();
}