namespace FirstDay.Admin.API.DTOs;

public class SetupTypeDTO
{
    public int? SetupTypeId { get; set; }
    public string SetupName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int EstimatedDurationMinutes { get; set; }
    public bool IsActive { get; set; } = true;
}