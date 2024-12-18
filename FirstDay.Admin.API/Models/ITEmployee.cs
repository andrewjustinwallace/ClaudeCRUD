namespace FirstDay.Admin.API.Models;

public class ITEmployee
{
    public int ITEmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTimeOffset HireDate { get; set; }
    public int UserTypeId { get; set; }
    public UserType? UserType { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset CreatedDate { get; set; }
    public DateTimeOffset ModifiedDate { get; set; }

    // Navigation properties
    public ICollection<ITSetupTask> ITSetupTasks { get; set; } = new List<ITSetupTask>();
    public ICollection<EmployeeCompanyAssignment> CompanyAssignments { get; set; } = new List<EmployeeCompanyAssignment>();
}