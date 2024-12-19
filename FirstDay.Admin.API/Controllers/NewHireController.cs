using Microsoft.AspNetCore.Mvc;

namespace FirstDay.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewHireController : ControllerBase
{
    private readonly IAdminService _adminService;

    public NewHireController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewHire>>> GetActiveNewHires()
    {
        var newHires = await _adminService.GetActiveNewHiresAsync();
        return Ok(newHires);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NewHire>> GetNewHireById(int id)
    {
        var newHire = await _adminService.GetNewHireByIdAsync(id);
        if (newHire == null)
        {
            return NotFound();
        }
        return Ok(newHire);
    }

    [HttpPost]
    public async Task<ActionResult<int>> UpsertNewHire(NewHireDTO newHire)
    {
        var id = await _adminService.UpsertNewHireAsync(newHire);
        return Ok(id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteNewHire(int id)
    {
        var newHire = await _adminService.GetNewHireByIdAsync(id);
        if (newHire == null)
        {
            return NotFound();
        }
        newHire.IsActive = !newHire.IsActive;
        await _adminService.UpsertNewHireAsync(newHire);
        return Ok(true);
    }

    [HttpGet("{id}/progress")]
    public async Task<ActionResult<NewHireProgress>> GetNewHireProgress(int id)
    {
        var progress = await _adminService.GetNewHireProgressAsync(id);
        if (progress == null)
        {
            return NotFound();
        }
        return Ok(progress);
    }

    [HttpPost("{id}/progress")]
    public async Task<ActionResult<bool>> UpdateNewHireProgress(int id, [FromBody] NewHireProgressDTO progress)
    {
        if (id != progress.NewHireId)
        {
            return BadRequest("ID mismatch");
        }
        var result = await _adminService.UpdateNewHireProgressAsync(progress);
        return Ok(result);
    }

    [HttpGet("company/{companyId}")]
    public async Task<ActionResult<IEnumerable<NewHire>>> GetNewHiresByCompany(int companyId)
    {
        var newHires = await _adminService.GetNewHiresByCompanyAsync(companyId);
        return Ok(newHires);
    }

    [HttpGet("setup-status")]
    public async Task<ActionResult<IEnumerable<NewHireSetupStatus>>> GetNewHireSetupStatus([FromQuery] int? companyId = null)
    {
        var status = await _adminService.GetNewHireSetupStatusAsync(companyId);
        return Ok(status);
    }

    [HttpPost("{id}/complete")]
    public async Task<ActionResult<bool>> CompleteNewHireSetup(int id)
    {
        var result = await _adminService.CompleteNewHireSetupAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return Ok(true);
    }
}