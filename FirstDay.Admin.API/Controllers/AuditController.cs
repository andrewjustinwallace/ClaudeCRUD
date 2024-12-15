namespace FirstDay.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AuditController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("changes")]
    public async Task<ActionResult<IEnumerable<RecentChange>>> GetRecentChanges([FromQuery] AuditRequestDTO request)
    {
        var changes = await _adminService.GetRecentChangesAsync(request);
        return Ok(changes);
    }
}