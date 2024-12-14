using Dapper;

namespace FirstDay.API.Models.StoredProcedureModels;

[System.Runtime.Serialization.DataContract]
public class OverdueTask
{
    [System.Runtime.Serialization.DataMember(Name = "itsetuptaskid")]
    public int TaskId { get; set; }

    [System.Runtime.Serialization.DataMember(Name = "itemployeename")]
    public string ITEmployeeName { get; set; } = string.Empty;

    [System.Runtime.Serialization.DataMember(Name = "newhirename")]
    public string NewHireName { get; set; } = string.Empty;

    [System.Runtime.Serialization.DataMember(Name = "setuptype")]
    public string SetupType { get; set; } = string.Empty;

    [System.Runtime.Serialization.DataMember(Name = "scheduleddate")]
    public DateTime ScheduledDate { get; set; }

    [System.Runtime.Serialization.DataMember(Name = "daysoverdue")]
    public int DaysOverdue { get; set; }

    [System.Runtime.Serialization.DataMember(Name = "companyname")]
    public string CompanyName { get; set; } = string.Empty;
}
