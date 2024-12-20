using FirstDay.Admin.API.DTOs;

namespace FirstDay.Admin.API.Services;

public class AdminService : IAdminService
{
    private readonly string _connectionString;
    private readonly ILogger<AdminService> _logger;

    public AdminService(IConfiguration configuration, ILogger<AdminService> logger)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") ??
            throw new ArgumentNullException(nameof(configuration));
        _logger = logger;
    }

    // Company Management
    public async Task<IEnumerable<Company>> GetActiveCompaniesAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<Company>(
            "SELECT * FROM test.get_active_companies()");
    }

    public async Task<int> UpsertCompanyAsync(CompanyDTO company)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "SELECT test.upsert_company(@CompanyId, @CompanyName, @IsActive)",
            new
            {
                CompanyId = company.CompanyId ?? 0,
                company.CompanyName,
                company.IsActive
            });
    }

    public async Task<bool> AssignCompanyToEmployeeAsync(CompanyAssignmentDTO assignment)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<bool>(
            "SELECT test.assign_company_to_employee(@ITEmployeeId, @CompanyId)",
            assignment);
    }

    public async Task<bool> RemoveCompanyFromEmployeeAsync(CompanyAssignmentDTO assignment)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<bool>(
            "SELECT test.remove_company_from_employee(@ITEmployeeId, @CompanyId)",
            assignment);
    }

    public async Task<IEnumerable<Company>> GetEmployeeCompanyAssignmentsAsync(int itEmployeeId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<Company>(
            "SELECT * FROM test.get_employee_company_assignments(@ITEmployeeId)",
            new { ITEmployeeId = itEmployeeId });
    }

    // User Type Management
    public async Task<IEnumerable<UserType>> GetUserTypesAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<UserType>(
            "SELECT * FROM test.get_user_types()");
    }

    public async Task<int> UpsertUserTypeAsync(UserTypeDTO userType)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "SELECT test.upsert_user_type(@UserTypeId, @TypeName)",
            new
            {
                UserTypeId = userType.UserTypeId ?? 0,
                userType.TypeName
            });
    }

    // Setup Type Management
    public async Task<IEnumerable<SetupType>> GetActiveSetupTypesAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<SetupType>(
            "SELECT * FROM test.get_active_setup_types()");
    }

    public async Task<int> UpsertSetupTypeAsync(SetupTypeDTO setupType)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "SELECT test.upsert_setup_type(@SetupTypeId, @SetupName, @Description, @EstimatedDurationMinutes, @IsActive)",
            new
            {
                SetupTypeId = setupType.SetupTypeId ?? 0,
                setupType.SetupName,
                setupType.Description,
                setupType.EstimatedDurationMinutes,
                setupType.IsActive
            });
    }

    // Statistics and Monitoring
    public async Task<IEnumerable<CompanyStatistics>> GetCompanyStatisticsAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<CompanyStatistics>(
            "SELECT * FROM test.get_company_statistics()");
    }

    public async Task<IEnumerable<CompanyWorkloadDistribution>> GetCompanyWorkloadDistributionAsync(int companyId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<CompanyWorkloadDistribution>(
            "SELECT * FROM test.get_company_workload_distribution(@CompanyId)",
            new { CompanyId = companyId });
    }

    public async Task<IEnumerable<SetupTypeStatistics>> GetSetupTypeStatisticsAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<SetupTypeStatistics>(
            "SELECT * FROM test.get_setup_type_statistics()");
    }

    public async Task<IEnumerable<NewHireOnboardingStatus>> GetNewHireOnboardingStatusAsync(int companyId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<NewHireOnboardingStatus>(
            "SELECT * FROM test.get_new_hire_onboarding_status(@CompanyId)",
            new { CompanyId = companyId });
    }

    public async Task<IEnumerable<RecentChange>> GetRecentChangesAsync(AuditRequestDTO request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<RecentChange>(
            "SELECT * FROM test.get_recent_changes(@CompanyId, @Days)",
            new { request.CompanyId, request.Days });
    }

    public async Task<IEnumerable<NewHire>> GetActiveNewHiresAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<NewHire>(
            "SELECT * FROM test.get_new_hires()");
    }

    public async Task<NewHireDTO?> GetNewHireByIdAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<NewHireDTO>(
            "SELECT * FROM test.get_new_hire_by_id(@NewHireId)",
            new { NewHireId = id });
    }

    public async Task<int> UpsertNewHireAsync(NewHireDTO newHire)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "SELECT test.upsert_new_hire(@NewHireId, @FirstName, @LastName, " +
            "@Email, @CompanyId, @StartDate, @IsActive)",
            new
            {
                NewHireId = newHire.NewHireId ?? 0,
                FirstName = newHire.FirstName,
                LastName = newHire.LastName,
                Email = newHire.Email,
                CompanyId = newHire.CompanyId,
                StartDate = newHire.StartDate.Year.ToString() + "-" + newHire.StartDate.Month.ToString() + "-" + newHire.StartDate.Day.ToString(),
                IsActive = newHire.IsActive
            });
    }
    public async Task<bool> DeleteNewHireAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<bool>(
            "SELECT test.delete_new_hire(@NewHireId)",
            new { NewHireId = id });
    }

    public async Task<NewHireProgress?> GetNewHireProgressAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<NewHireProgress>(
            "SELECT * FROM test.get_new_hire_progress(@NewHireId)",
            new { NewHireId = id });
    }

    public async Task<bool> UpdateNewHireProgressAsync(NewHireProgressDTO progress)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<bool>(
            "SELECT test.update_new_hire_progress(@NewHireId, @SetupCompleted, @EquipmentOrdered, " +
            "@EquipmentReceived, @WorkspaceAssigned, @SystemAccessGranted, @TrainingScheduled, @IsCompleted)",
            progress);
    }

    public async Task<IEnumerable<NewHire>> GetNewHiresByCompanyAsync(int companyId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<NewHire>(
            "SELECT * FROM test.get_new_hires_by_company(@CompanyId)",
            new { CompanyId = companyId });
    }

    public async Task<IEnumerable<NewHireSetupStatus>> GetNewHireSetupStatusAsync(int? companyId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<NewHireSetupStatus>(
            "SELECT * FROM test.get_new_hire_setup_status(@CompanyId)",
            new { CompanyId = companyId });
    }

    public async Task<bool> CompleteNewHireSetupAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<bool>(
            "SELECT test.complete_new_hire_setup(@NewHireId)",
            new { NewHireId = id });
    }

    public async Task<IEnumerable<ITEmployeeDTO>> GetITEmployeesAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<ITEmployeeDTO>(
            "SELECT * FROM test.get_it_employees()");
    }

    public async Task<ITEmployeeDTO?> GetITEmployeeByIdAsync(int id)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            var result = await connection.QuerySingleOrDefaultAsync<ITEmployeeDTO>(
                "SELECT * FROM test.get_it_employee(@ITEmployeeId)",
                new { ITEmployeeId = id });
            return result;
        }
        catch (Exception ex)
        {
            return new ITEmployeeDTO();
        }
    }

    public async Task<int> UpsertITEmployeeAsync(ITEmployeeDTO employeeDto)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<int>(
            "SELECT test.upsert_it_employee(@itemployeeid, @firstname, @lastname, @email, @hiredate, @usertypeid, @username, @password, @isactive);",
            new
            {
                itemployeeid = employeeDto.ITEmployeeId,
                firstname = employeeDto.FirstName,
                lastname = employeeDto.LastName,
                email = employeeDto.Email,
                hiredate = employeeDto.HireDate.Date.Year.ToString() + "-" + employeeDto.HireDate.Date.Month.ToString() + "-" + employeeDto.HireDate.Date.Day.ToString(),
                usertypeid = employeeDto.UserTypeId,
                username = employeeDto.Username,
                password = employeeDto.Password,
                isactive = employeeDto.IsActive
            });
    }

    public async Task<bool> AssignCompanyToEmployeeAsync(int companyId, int employeeId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<bool>(
            "SELECT * FROM test.get_active_it_employees()");
    }

    public async Task<bool> RemoveCompanyFromEmployeeAsync(int companyId, int employeeId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<bool>(
            "SELECT * FROM test.get_active_it_employees()");
    }

    public async Task<IEnumerable<SetupTaskDTO>> GetSetupTasksByCompanyAsync(int companyId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<SetupTaskDTO>(
            "SELECT * FROM test.get_setup_tasks_by_company(@CompanyId)",
                new { CompanyId = companyId });
    }

    public async Task<IEnumerable<SetupTaskDTO>> GetSetupTasksByEmployeeAsync(int employeeId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<SetupTaskDTO>(
            "SELECT * FROM test.get_setup_tasks_by_employee(@ITEmployeeId)",
                new { ITEmployeeId = employeeId });
    }

    public async Task<IEnumerable<SetupTaskDTO>> GetSetupTasksByNewHireAsync(int newHireId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<SetupTaskDTO>(
            "SELECT * FROM test.get_setup_tasks_by_newhire(@NewHireId)",
                new { NewHireId = newHireId });
    }

    public async Task<int> UpsertSetupTaskAsync(SetupTaskDTO setupTask)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            @"SELECT test.upsert_setup_task(
                @ITSetupTaskId, @ITEmployeeId, @NewHireId, @SetupTypeId, 
                @ScheduledDate, @IsCompleted, @CompletedDate, @Notes, @Details)",
            new
            {
                ITSetupTaskId = setupTask.TaskId,
                ITEmployeeId = setupTask.ItEmployeeId,
                NewHireId = setupTask.NewHireId,
                SetupTypeId = setupTask.SetupTypeId,
                ScheduledDate = setupTask.ScheduledDate,
                IsCompleted = setupTask.IsCompleted,
                CompletedDate = setupTask.CompletedDate,
                Notes = setupTask.Notes ?? string.Empty,
                Details = setupTask.Details ?? string.Empty
            });
    }

    public async Task<bool> CompleteSetupTaskAsync(int taskId, int itEmployeeId, int newHireId, string notes)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleAsync<bool>(
            "SELECT test.update_task_completion(@TaskId, @ITEmployeeId, @NewHireId, @Notes)",
            new 
            { 
                TaskId = taskId,
                ITEmployeeId = itEmployeeId,
                NewHireId = newHireId,
                Notes = notes ?? string.Empty
            });
    }
}