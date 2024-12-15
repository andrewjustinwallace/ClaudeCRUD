namespace FirstDay.Admin.API.DTOs;

public class AuditRequestDTO
{
    public int CompanyId { get; set; }
    public int Days { get; set; } = 7;
}