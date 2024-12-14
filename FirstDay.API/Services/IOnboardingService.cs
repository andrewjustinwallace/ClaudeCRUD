using FirstDay.API.Models.StoredProcedureModels;

namespace FirstDay.API.Services;

public interface IOnboardingService
{
    Task<IEnumerable<ITEmployeePendingTask>> GetITEmployeePendingTasksAsync(int itEmployeeId, int companyId);
    Task<IEnumerable<NewHireSetupStatus>> GetNewHireSetupStatusAsync(int newHireId);
    Task<IEnumerable<ITEmployeeWorkload>> GetITEmployeeWorkloadAsync(int companyId);
    Task<IEnumerable<TodaysTask>> GetTodaysTasksAsync();
    Task<IEnumerable<CompanyOnboardingProgress>> GetCompanyOnboardingProgressAsync(int companyId);
    Task<IEnumerable<OverdueTask>> GetOverdueTasksAsync(int itEmployeeId, int companyId);
}