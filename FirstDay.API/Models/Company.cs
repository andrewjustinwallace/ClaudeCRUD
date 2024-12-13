namespace FirstDay.API.Models;

public class Company
{
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public ICollection<ITEmployee> ITEmployees { get; set; } = new List<ITEmployee>();
    public ICollection<NewHire> NewHires { get; set; } = new List<NewHire>();
}