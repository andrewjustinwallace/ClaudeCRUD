using FirstDay.API.Models;
using System.ComponentModel.Design;

namespace FirstDay.API.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<ITSetupTask>> GetPendingTasksByEmployeeAsync(int itEmployeeId);
        Task<IEnumerable<ITSetupTask>> GetNewHireSetupStatusAsync(int newHireId);
        Task<IEnumerable<ITEmployeeWorkload>> GetITEmployeeWorkloadAsync(int companyId);
        Task<IEnumerable<TodayTask>> GetTodaysTasksAsync();
        Task<IEnumerable<CompanyOnboardingProgress>> GetCompanyOnboardingProgressAsync(int companyId);
        Task<IEnumerable<OverdueTask>> GetOverdueTasksAsync(int itEmployeeId);
        Task<bool> UpdateTaskCompletionAsync(TaskCompletionRequest request);
    }
}