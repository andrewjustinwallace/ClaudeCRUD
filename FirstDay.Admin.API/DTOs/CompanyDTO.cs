namespace FirstDay.Admin.API.DTOs;

public class CompanyDTO
{
    public int? CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class CompanyAssignmentDTO
{
    public int ITEmployeeId { get; set; }
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}