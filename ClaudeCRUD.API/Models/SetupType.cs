using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClaudeCRUD.API.Models;

[Table("setuptypes", Schema = "test")]
public class SetupType
{
    [Column("setuptypeid")]
    public int SetupTypeId { get; set; }

    [Column("setupname")]
    [Required]
    public string SetupName { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("estimateddurationminutes")]
    public int? EstimatedDurationMinutes { get; set; }

    [Column("createddate")]
    public DateTime CreatedDate { get; set; }

    [Column("modifieddate")]
    public DateTime ModifiedDate { get; set; }
}