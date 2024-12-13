namespace FirstDay.API.Models;

public class NewHire
{
    public int NewHireId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public int CompanyId { get; set; }
    public Company? Company { get; set; }
    public ICollection<ITSetupTask> ITSetupTasks { get; set; } = new List<ITSetupTask>();
}