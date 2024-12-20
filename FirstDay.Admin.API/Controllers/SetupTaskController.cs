using FirstDay.Admin.API.DTOs;
using FirstDay.Admin.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FirstDay.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetupTaskController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly ILogger<SetupTaskController> _logger;

    public SetupTaskController(
        IAdminService adminService,
        ILogger<SetupTaskController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    [HttpGet("company/{companyId}")]
    public async Task<ActionResult<IEnumerable<SetupTaskDTO>>> GetSetupTasksByCompany(int companyId)
    {
        try
        {
            var tasks = await _adminService.GetSetupTasksByCompanyAsync(companyId);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving setup tasks for company ID: {CompanyId}", companyId);
            return StatusCode(500, "An error occurred while retrieving setup tasks");
        }
    }

    [HttpGet("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<SetupTaskDTO>>> GetSetupTasksByEmployee(int employeeId)
    {
        try
        {
            var tasks = await _adminService.GetSetupTasksByEmployeeAsync(employeeId);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving setup tasks for employee ID: {EmployeeId}", employeeId);
            return StatusCode(500, "An error occurred while retrieving setup tasks");
        }
    }

    [HttpGet("newhire/{newHireId}")]
    public async Task<ActionResult<IEnumerable<SetupTaskDTO>>> GetSetupTasksByNewHire(int newHireId)
    {
        try
        {
            var tasks = await _adminService.GetSetupTasksByNewHireAsync(newHireId);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving setup tasks for new hire ID: {NewHireId}", newHireId);
            return StatusCode(500, "An error occurred while retrieving setup tasks");
        }
    }
    
    [HttpPost]
    public async Task<ActionResult<int>> UpsertSetupTask(SetupTaskDTO setupTask)
    {
        try
        {
            var id = await _adminService.UpsertSetupTaskAsync(setupTask);
            return Ok(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error upserting setup task");
            return StatusCode(500, "An error occurred while saving the setup task");
        }
    }

    [HttpPost("complete")]
    public async Task<ActionResult<bool>> CompleteSetupTask(CompleteSetupTaskRequest request)
    {
        try
        {
            var success = await _adminService.CompleteSetupTaskAsync(
                request.TaskId,
                request.ItEmployeeId,
                request.NewHireId,
                request.Notes);
            return Ok(success);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing setup task ID: {TaskId}", request.TaskId);
            return StatusCode(500, "An error occurred while completing the setup task");
        }
    }
}

public class CompleteSetupTaskRequest
{
    public int TaskId { get; set; }
    public int ItEmployeeId { get; set; }
    public int NewHireId { get; set; }
    public string Notes { get; set; }
}