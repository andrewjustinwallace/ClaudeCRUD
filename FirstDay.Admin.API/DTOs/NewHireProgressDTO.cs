namespace FirstDay.Admin.API.DTOs;

public class NewHireProgressDTO
{
    public int NewHireId { get; set; }
    public int CompanyId { get; set; }
    public List<NewHireSetupItemDTO> SetupItems { get; set; } = new();
}

public class NewHireSetupItemDTO
{
    public int SetupTypeId { get; set; }
    public bool IsCompleted { get; set; }
    public string? Notes { get; set; }
    public DateTime? CompletedDate { get; set; }
}