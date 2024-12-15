namespace FirstDay.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserTypeController : ControllerBase
{
    private readonly IAdminService _adminService;

    public UserTypeController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserType>>> GetUserTypes()
    {
        var userTypes = await _adminService.GetUserTypesAsync();
        return Ok(userTypes);
    }

    [HttpPost]
    public async Task<ActionResult<int>> UpsertUserType(UserTypeDTO userType)
    {
        var id = await _adminService.UpsertUserTypeAsync(userType);
        return Ok(id);
    }
}