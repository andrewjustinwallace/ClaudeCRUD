namespace FirstDay.Admin.API.DTOs;

public class ITEmployeeDTO
{
    public int ITEmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTimeOffset HireDate { get; set; }
    public int UserTypeId { get; set; }
    public string UserTypeName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTimeOffset CreatedDate { get; set; }
    public DateTimeOffset ModifiedDate { get; set; }
    public List<CompanyAssignmentDTO>? Companies { get; set; }
    public int CompanyCount { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
