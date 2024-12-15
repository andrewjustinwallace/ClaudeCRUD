namespace FirstDay.Admin.API.Services;

public class AdminService : IAdminService
{
    private readonly string _connectionString;

    public AdminService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? 
            throw new ArgumentNullException(nameof(configuration));
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
            new { 
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
            new { 
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
            new { 
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
}