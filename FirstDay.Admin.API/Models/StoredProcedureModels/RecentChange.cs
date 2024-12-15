namespace FirstDay.Admin.API.Models.StoredProcedureModels;

public class RecentChange
{
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string EntityName { get; set; } = string.Empty;
    public string ActionType { get; set; } = string.Empty;
    public DateTime ModifiedDate { get; set; }
}