using FirstDay.Admin.API.DTOs;
using FirstDay.Admin.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FirstDay.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ITEmployeeController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly ILogger<ITEmployeeController> _logger;

    public ITEmployeeController(
        IAdminService adminService,
        ILogger<ITEmployeeController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ITEmployeeDTO>>> GetTEmployees()
    {
        try
        {
            var employees = await _adminService.GetITEmployeesAsync();
            return Ok(employees);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active IT employees");
            return StatusCode(500, "An error occurred while retrieving IT employees");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ITEmployeeDTO>> GetITEmployeeById(int id)
    {
        try
        {
            var employee = await _adminService.GetITEmployeeByIdAsync(id);
            if (employee == null)
            {
                return NotFound();
            }
            return Ok(employee);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving IT employee with ID: {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the IT employee");
        }
    }

    [HttpPost]
    public async Task<ActionResult<int>> UpsertITEmployee(ITEmployeeDTO employee)
    {
        try
        {
            var id = await _adminService.UpsertITEmployeeAsync(employee);
            return Ok(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error upserting IT employee");
            return StatusCode(500, "An error occurred while saving the IT employee");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> DeleteITEmployee(int id)
    {
        try
        {
            var employee = await _adminService.GetITEmployeeByIdAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            // Set IsActive to false instead of physically deleting
            employee.IsActive = !employee.IsActive;
            await _adminService.UpsertITEmployeeAsync(employee);
            return Ok(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting IT employee with ID: {Id}", id);
            return StatusCode(500, "An error occurred while deleting the IT employee");
        }
    }

    [HttpGet("assignments/{employeeId}")]
    public async Task<ActionResult<IEnumerable<CompanyAssignmentDTO>>> GetEmployeeCompanyAssignments(int employeeId)
    {
        try
        {
            var assignments = await _adminService.GetEmployeeCompanyAssignmentsAsync(employeeId);
            return Ok(assignments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving company assignments for employee ID: {EmployeeId}", employeeId);
            return StatusCode(500, "An error occurred while retrieving company assignments");
        }
    }

    [HttpPost("assign")]
    public async Task<ActionResult<bool>> AssignCompanyToEmployee([FromBody] CompanyEmployeeAssignmentRequest request)
    {
        try
        {
            var result = await _adminService.AssignCompanyToEmployeeAsync(
                request.CompanyId,
                request.EmployeeId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning company {CompanyId} to employee {EmployeeId}",
                request.CompanyId, request.EmployeeId);
            return StatusCode(500, "An error occurred while assigning the company");
        }
    }

    [HttpPost("remove")]
    public async Task<ActionResult<bool>> RemoveCompanyFromEmployee([FromBody] CompanyEmployeeAssignmentRequest request)
    {
        try
        {
            var result = await _adminService.RemoveCompanyFromEmployeeAsync(
                request.CompanyId,
                request.EmployeeId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing company {CompanyId} from employee {EmployeeId}",
                request.CompanyId, request.EmployeeId);
            return StatusCode(500, "An error occurred while removing the company assignment");
        }
    }
}

public class CompanyEmployeeAssignmentRequest
{
    public int CompanyId { get; set; }
    public int EmployeeId { get; set; }
}