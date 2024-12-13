using FirstDay.API.Models.StoredProcedureModels;

namespace FirstDay.API.Services;

public interface IOnboardingService
{
    Task<IEnumerable<ITEmployeePendingTask>> GetITEmployeePendingTasksAsync(int itEmployeeId);
    Task<IEnumerable<NewHireSetupStatus>> GetNewHireSetupStatusAsync(int newHireId);
    Task<IEnumerable<ITEmployeeWorkload>> GetITEmployeeWorkloadAsync();
    Task<IEnumerable<TodaysTask>> GetTodaysTasksAsync();
    Task<IEnumerable<CompanyOnboardingProgress>> GetCompanyOnboardingProgressAsync(int companyId);
    Task<IEnumerable<OverdueTask>> GetOverdueTasksAsync();
}