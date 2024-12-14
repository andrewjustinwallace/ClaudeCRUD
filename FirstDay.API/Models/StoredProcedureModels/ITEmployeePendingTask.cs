using Dapper;

namespace FirstDay.API.Models.StoredProcedureModels;

[System.Runtime.Serialization.DataContract]
public class ITEmployeePendingTask
{
    [System.Runtime.Serialization.DataMember(Name = "taskid")]
    public int TaskId { get; set; }

    [System.Runtime.Serialization.DataMember(Name = "newhireid")]
    public int NewHireId { get; set; }

    [System.Runtime.Serialization.DataMember(Name = "newhirename")]
    public string NewHireName { get; set; } = string.Empty;

    [System.Runtime.Serialization.DataMember(Name = "setuptype")]
    public string SetupType { get; set; } = string.Empty;

    [System.Runtime.Serialization.DataMember(Name = "scheduleddate")]
    public DateTime ScheduledDate { get; set; }

    [System.Runtime.Serialization.DataMember(Name = "iscompleted")]
    public bool IsCompleted { get; set; }

    [System.Runtime.Serialization.DataMember(Name = "companyname")]
    public string CompanyName { get; set; } = string.Empty;

    [System.Runtime.Serialization.DataMember(Name = "details")]
    public string Details { get; set; } = string.Empty;
}
