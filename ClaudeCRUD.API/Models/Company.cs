using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClaudeCRUD.API.Models;

[Table("companies", Schema = "test")]
public class Company
{
    [Column("companyid")]
    public int CompanyId { get; set; }

    [Column("companyname")]
    [Required]
    public string CompanyName { get; set; } = null!;

    [Column("createddate")]
    public DateTime CreatedDate { get; set; }

    [Column("modifieddate")]
    public DateTime ModifiedDate { get; set; }
}