namespace FirstDay.API.Models;

public class ITEmployee
{
    public int ITEmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int CompanyId { get; set; }
    public Company? Company { get; set; }
    public ICollection<ITSetupTask> ITSetupTasks { get; set; } = new List<ITSetupTask>();
}