namespace FirstDay.Admin.API.DTOs;

public class NewHireDTO
{
    public int? NewHireId { get; set; }
    public int CompanyId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public bool IsActive { get; set; }
    public int? AssignedToEmployeeId { get; set; }
}