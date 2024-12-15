namespace FirstDay.Admin.API.Models;

public class UserType
{
    public int UserTypeId { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }
}