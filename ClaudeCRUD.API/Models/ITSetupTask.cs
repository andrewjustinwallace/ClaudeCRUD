using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClaudeCRUD.API.Models;

[Table("itsettasks", Schema = "test")]
public class ITSetupTask
{
    [Column("itsettaskid")]
    public int ITSetupTaskId { get; set; }

    [Column("itemployeeid")]
    public int ITEmployeeId { get; set; }

    [Column("newhireid")]
    public int NewHireId { get; set; }

    [Column("setuptypeid")]
    public int SetupTypeId { get; set; }

    [Column("scheduleddate")]
    public DateTime ScheduledDate { get; set; }

    [Column("iscompleted")]
    public bool IsCompleted { get; set; }

    [Column("completeddate")]
    public DateTime? CompletedDate { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("createddate")]
    public DateTime CreatedDate { get; set; }

    [Column("modifieddate")]
    public DateTime ModifiedDate { get; set; }

    [ForeignKey("ITEmployeeId")]
    public ITEmployee ITEmployee { get; set; } = null!;

    [ForeignKey("NewHireId")]
    public NewHire NewHire { get; set; } = null!;

    [ForeignKey("SetupTypeId")]
    public SetupType SetupType { get; set; } = null!;
}