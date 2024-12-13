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

    [HttpGet("itemployee/{id}/pending-tasks")]
    public async Task<ActionResult<IEnumerable<ITEmployeePendingTask>>> GetITEmployeePendingTasks(int id)
    {
        var tasks = await _onboardingService.GetITEmployeePendingTasksAsync(id);
        return Ok(tasks);
    }

    [HttpGet("newhire/{id}/setup-status")]
    public async Task<ActionResult<IEnumerable<NewHireSetupStatus>>> GetNewHireSetupStatus(int id)
    {
        var status = await _onboardingService.GetNewHireSetupStatusAsync(id);
        return Ok(status);
    }

    [HttpGet("itemployee/workload")]
    public async Task<ActionResult<IEnumerable<ITEmployeeWorkload>>> GetITEmployeeWorkload()
    {
        var workload = await _onboardingService.GetITEmployeeWorkloadAsync();
        return Ok(workload);
    }

    [HttpGet("tasks/today")]
    public async Task<ActionResult<IEnumerable<TodaysTask>>> GetTodaysTasks()
    {
        var tasks = await _onboardingService.GetTodaysTasksAsync();
        return Ok(tasks);
    }

    [HttpGet("company/{id}/onboarding-progress")]
    public async Task<ActionResult<IEnumerable<CompanyOnboardingProgress>>> GetCompanyOnboardingProgress(int id)
    {
        var progress = await _onboardingService.GetCompanyOnboardingProgressAsync(id);
        return Ok(progress);
    }

    [HttpGet("tasks/overdue")]
    public async Task<ActionResult<IEnumerable<OverdueTask>>> GetOverdueTasks()
    {
        var tasks = await _onboardingService.GetOverdueTasksAsync();
        return Ok(tasks);
    }
}