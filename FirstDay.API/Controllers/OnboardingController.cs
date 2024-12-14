using Microsoft.AspNetCore.Mvc;
using FirstDay.API.Services;
using FirstDay.API.Models.StoredProcedureModels;

namespace FirstDay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OnboardingController : ControllerBase
{
    private readonly IOnboardingService _onboardingService;

    public OnboardingController(IOnboardingService onboardingService)
    {
        _onboardingService = onboardingService;
    }

    [HttpGet("itemployee/{id}/company/{companyId}/pendingtasks")]
    public async Task<ActionResult<IEnumerable<ITEmployeePendingTask>>> GetITEmployeePendingTasks(int id, int companyId)
    {
        var tasks = await _onboardingService.GetITEmployeePendingTasksAsync(id, companyId);
        return Ok(tasks);
    }

    [HttpGet("newhire/{id}/setupstatus")]
    public async Task<ActionResult<IEnumerable<NewHireSetupStatus>>> GetNewHireSetupStatus(int id)
    {
        var status = await _onboardingService.GetNewHireSetupStatusAsync(id);
        return Ok(status);
    }

    [HttpGet("itemployee/{companyId}/workload")]
    public async Task<ActionResult<IEnumerable<ITEmployeeWorkload>>> GetITEmployeeWorkload(int companyId)
    {
        var workload = await _onboardingService.GetITEmployeeWorkloadAsync(companyId);
        return Ok(workload);
    }

    [HttpGet("tasks/today")]
    public async Task<ActionResult<IEnumerable<TodaysTask>>> GetTodaysTasks()
    {
        var tasks = await _onboardingService.GetTodaysTasksAsync();
        return Ok(tasks);
    }

    [HttpGet("company/{id}/onboardingprogress")]
    public async Task<ActionResult<IEnumerable<CompanyOnboardingProgress>>> GetCompanyOnboardingProgress(int id)
    {
        var progress = await _onboardingService.GetCompanyOnboardingProgressAsync(id);
        return Ok(progress);
    }

    [HttpGet("itemployee/{id}/company/{companyId}/overduetasks")]
    public async Task<ActionResult<IEnumerable<OverdueTask>>> GetOverdueTasks(int id, int companyId)
    {
        var tasks = await _onboardingService.GetOverdueTasksAsync(id, companyId);
        return Ok(tasks);
    }
}
