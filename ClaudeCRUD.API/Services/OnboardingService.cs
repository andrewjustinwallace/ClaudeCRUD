using ClaudeCRUD.API.Models.StoredProcedureModels;
using Dapper;
using Npgsql;

namespace ClaudeCRUD.API.Services;

public class OnboardingService : IOnboardingService
{
    private readonly string _connectionString;

    public OnboardingService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
    }

    public async Task<IEnumerable<ITEmployeePendingTask>> GetITEmployeePendingTasksAsync(int itEmployeeId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<ITEmployeePendingTask>(
            "SELECT * FROM test.get_it_employee_pending_tasks(@ITEmployeeId)",
            new { ITEmployeeId = itEmployeeId });
    }

    public async Task<IEnumerable<NewHireSetupStatus>> GetNewHireSetupStatusAsync(int newHireId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<NewHireSetupStatus>(
            "SELECT * FROM test.get_new_hire_setup_status(@NewHireId)",
            new { NewHireId = newHireId });
    }

    public async Task<IEnumerable<ITEmployeeWorkload>> GetITEmployeeWorkloadAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<ITEmployeeWorkload>(
            "SELECT * FROM test.get_it_employee_workload()");
    }

    public async Task<IEnumerable<TodaysTask>> GetTodaysTasksAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<TodaysTask>(
            "SELECT * FROM test.get_todays_tasks()");
    }

    public async Task<IEnumerable<CompanyOnboardingProgress>> GetCompanyOnboardingProgressAsync(int companyId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<CompanyOnboardingProgress>(
            "SELECT * FROM test.get_company_onboarding_progress(@CompanyId)",
            new { CompanyId = companyId });
    }

    public async Task<IEnumerable<OverdueTask>> GetOverdueTasksAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<OverdueTask>(
            "SELECT * FROM test.get_overdue_tasks()");
    }
}