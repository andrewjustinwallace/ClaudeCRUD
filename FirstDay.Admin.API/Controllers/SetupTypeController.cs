namespace FirstDay.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetupTypeController : ControllerBase
{
    private readonly IAdminService _adminService;

    public SetupTypeController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SetupType>>> GetActiveSetupTypes()
    {
        var setupTypes = await _adminService.GetActiveSetupTypesAsync();
        return Ok(setupTypes);
    }

    [HttpPost]
    public async Task<ActionResult<int>> UpsertSetupType(SetupTypeDTO setupType)
    {
        var id = await _adminService.UpsertSetupTypeAsync(setupType);
        return Ok(id);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<IEnumerable<SetupTypeStatistics>>> GetSetupTypeStatistics()
    {
        var statistics = await _adminService.GetSetupTypeStatisticsAsync();
        return Ok(statistics);
    }
}