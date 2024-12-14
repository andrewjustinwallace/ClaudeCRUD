using Dapper;
using FirstDay.API.Models;
using Npgsql;
using System.Threading.Tasks;

namespace FirstDay.API.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly string _connectionString;

        public TaskRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? 
                throw new ArgumentNullException("DefaultConnection string is missing");
        }

        public async Task<IEnumerable<ITSetupTask>> GetPendingTasksByEmployeeAsync(int itEmployeeId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<ITSetupTask>(
                "SELECT * FROM test.get_it_employee_pending_tasks(@ItEmployeeId)",
                new { ItEmployeeId = itEmployeeId });
        }

        public async Task<IEnumerable<ITSetupTask>> GetNewHireSetupStatusAsync(int newHireId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<ITSetupTask>(
                "SELECT * FROM test.get_new_hire_setup_status(@NewHireId)",
                new { NewHireId = newHireId });
        }

        public async Task<IEnumerable<ITEmployeeWorkload>> GetITEmployeeWorkloadAsync(int companyId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<ITEmployeeWorkload>(
                "SELECT * FROM test.get_it_employee_workload(@CompanyId)",
                new { CompanyId = companyId });
        }

        public async Task<IEnumerable<TodayTask>> GetTodaysTasksAsync()
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<TodayTask>(
                "SELECT * FROM test.get_todays_tasks()");
        }

        public async Task<IEnumerable<CompanyOnboardingProgress>> GetCompanyOnboardingProgressAsync(int companyId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<CompanyOnboardingProgress>(
                "SELECT * FROM test.get_company_onboarding_progress(@CompanyId)",
                new { CompanyId = companyId });
        }

        public async Task<IEnumerable<OverdueTask>> GetOverdueTasksAsync(int itEmployeeId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<OverdueTask>(
                "SELECT * FROM test.get_overdue_tasks(@ItEmployeeId)",
                new { ItEmployeeId = itEmployeeId });
        }

        public async Task<bool> UpdateTaskCompletionAsync(TaskCompletionRequest request)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            try
            {
                return await connection.QuerySingleOrDefaultAsync<bool>(
                    "select * from test.update_task_completion(@TaskId, @ItEmployeeId, @NewHireId, @Notes)",
                    new { TaskId = request.TaskId, ItEmployeeId = request.ITEmployeeId, NewHireId = request.NewHireId, Notes = request.Notes });
            }
            catch
            {
                return false;
            }
        }
    }
}