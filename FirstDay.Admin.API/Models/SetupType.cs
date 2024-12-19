namespace FirstDay.Admin.API.Models;

public class SetupType
{
    public int SetupTypeId { get; set; }
    public string SetupName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int EstimatedDurationMinutes { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }
}