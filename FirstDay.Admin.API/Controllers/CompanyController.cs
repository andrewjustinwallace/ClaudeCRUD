namespace FirstDay.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
    private readonly IAdminService _adminService;

    public CompanyController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Company>>> GetActiveCompanies()
    {
        var companies = await _adminService.GetActiveCompaniesAsync();
        return Ok(companies);
    }

    [HttpPost]
    public async Task<ActionResult<int>> UpsertCompany(CompanyDTO company)
    {
        var id = await _adminService.UpsertCompanyAsync(company);
        return Ok(id);
    }

    [HttpPost("assign")]
    public async Task<ActionResult<bool>> AssignCompanyToEmployee(CompanyAssignmentDTO assignment)
    {
        var result = await _adminService.AssignCompanyToEmployeeAsync(assignment);
        return Ok(result);
    }

    [HttpPost("remove")]
    public async Task<ActionResult<bool>> RemoveCompanyFromEmployee(CompanyAssignmentDTO assignment)
    {
        var result = await _adminService.RemoveCompanyFromEmployeeAsync(assignment);
        return Ok(result);
    }

    [HttpGet("employee/{id}/assignments")]
    public async Task<ActionResult<IEnumerable<Company>>> GetEmployeeCompanyAssignments(int id)
    {
        var assignments = await _adminService.GetEmployeeCompanyAssignmentsAsync(id);
        return Ok(assignments);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<IEnumerable<CompanyStatistics>>> GetCompanyStatistics()
    {
        var statistics = await _adminService.GetCompanyStatisticsAsync();
        return Ok(statistics);
    }

    [HttpGet("{id}/workload")]
    public async Task<ActionResult<IEnumerable<CompanyWorkloadDistribution>>> GetCompanyWorkloadDistribution(int id)
    {
        var workload = await _adminService.GetCompanyWorkloadDistributionAsync(id);
        return Ok(workload);
    }

    [HttpGet("{id}/onboarding")]
    public async Task<ActionResult<IEnumerable<NewHireOnboardingStatus>>> GetNewHireOnboardingStatus(int id)
    {
        var status = await _adminService.GetNewHireOnboardingStatusAsync(id);
        return Ok(status);
    }
}