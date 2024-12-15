using FirstDay.Admin.API.DTOs;
using FirstDay.Admin.API.Models;
using FirstDay.Admin.API.Models.StoredProcedureModels;

namespace FirstDay.Admin.API.Services;

public interface IAdminService
{
    // Company Management
    Task<IEnumerable<Company>> GetActiveCompaniesAsync();
    Task<int> UpsertCompanyAsync(CompanyDTO company);
    Task<bool> AssignCompanyToEmployeeAsync(CompanyAssignmentDTO assignment);
    Task<bool> RemoveCompanyFromEmployeeAsync(CompanyAssignmentDTO assignment);
    Task<IEnumerable<Company>> GetEmployeeCompanyAssignmentsAsync(int itEmployeeId);

    // User Type Management
    Task<IEnumerable<UserType>> GetUserTypesAsync();
    Task<int> UpsertUserTypeAsync(UserTypeDTO userType);

    // Setup Type Management
    Task<IEnumerable<SetupType>> GetActiveSetupTypesAsync();
    Task<int> UpsertSetupTypeAsync(SetupTypeDTO setupType);

    // Statistics and Monitoring
    Task<IEnumerable<CompanyStatistics>> GetCompanyStatisticsAsync();
    Task<IEnumerable<CompanyWorkloadDistribution>> GetCompanyWorkloadDistributionAsync(int companyId);
    Task<IEnumerable<SetupTypeStatistics>> GetSetupTypeStatisticsAsync();
    Task<IEnumerable<NewHireOnboardingStatus>> GetNewHireOnboardingStatusAsync(int companyId);
    Task<IEnumerable<RecentChange>> GetRecentChangesAsync(AuditRequestDTO request);
}