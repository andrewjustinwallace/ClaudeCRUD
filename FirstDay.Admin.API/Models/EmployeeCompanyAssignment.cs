namespace FirstDay.Admin.API.Models;

public class EmployeeCompanyAssignment
{
    public int EmployeeCompanyAssignmentId { get; set; }
    public int ITEmployeeId { get; set; }
    public int CompanyId { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset CreatedDate { get; set; }
    public DateTimeOffset ModifiedDate { get; set; }

    // Navigation properties
    public ITEmployee? ITEmployee { get; set; }
    public Company? Company { get; set; }
}