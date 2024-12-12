using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClaudeCRUD.API.Models;

[Table("newhires", Schema = "test")]
public class NewHire
{
    [Column("newhireid")]
    public int NewHireId { get; set; }

    [Column("firstname")]
    [Required]
    public string FirstName { get; set; } = null!;

    [Column("lastname")]
    [Required]
    public string LastName { get; set; } = null!;

    [Column("email")]
    [Required]
    public string Email { get; set; } = null!;

    [Column("companyid")]
    public int CompanyId { get; set; }

    [Column("hiredate")]
    public DateTime HireDate { get; set; }

    [Column("createddate")]
    public DateTime CreatedDate { get; set; }

    [Column("modifieddate")]
    public DateTime ModifiedDate { get; set; }

    [ForeignKey("CompanyId")]
    public Company Company { get; set; } = null!;
}