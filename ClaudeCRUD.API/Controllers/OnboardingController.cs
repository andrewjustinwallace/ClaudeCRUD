using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClaudeCRUD.API.Data;
using ClaudeCRUD.API.DTOs;

namespace ClaudeCRUD.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OnboardingController : ControllerBase
{
    private readonly OnboardingContext _context;

    public OnboardingController(OnboardingContext context)
    {
        _context = context;
    }

    [HttpGet("it-employee/{id}/pending-tasks")]
    public async Task<ActionResult<IEnumerable<ITEmployeePendingTaskDTO>>> GetITEmployeePendingTasks(int id)
    {
        var tasks = await _context.ITSetupTasks
            .Where(t => t.ITEmployeeId == id && !t.IsCompleted)
            .Include(t => t.NewHire)
            .Include(t => t.SetupType)
            .Include(t => t.NewHire.Company)
            .Select(t => new ITEmployeePendingTaskDTO(
                t.ITSetupTaskId,
                $"{t.NewHire.FirstName} {t.NewHire.LastName}",
                t.SetupType.SetupName,
                t.ScheduledDate,
                t.NewHire.Company.CompanyName
            ))
            .OrderBy(t => t.ScheduledDate)
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("new-hire/{id}/setup-status")]
    public async Task<ActionResult<IEnumerable<NewHireSetupStatusDTO>>> GetNewHireSetupStatus(int id)
    {
        var tasks = await _context.ITSetupTasks
            .Where(t => t.NewHireId == id)
            .Include(t => t.ITEmployee)
            .Include(t => t.SetupType)
            .Select(t => new NewHireSetupStatusDTO(
                t.SetupType.SetupName,
                $"{t.ITEmployee.FirstName} {t.ITEmployee.LastName}",
                t.ScheduledDate,
                t.IsCompleted,
                t.CompletedDate
            ))
            .OrderBy(t => t.ScheduledDate)
            .ThenBy(t => t.SetupType)
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("it-employee/workload")]
    public async Task<ActionResult<IEnumerable<ITEmployeeWorkloadDTO>>> GetITEmployeeWorkload()
    {
        var workloads = await _context.ITEmployees
            .Include(e => e.Company)
            .Select(e => new ITEmployeeWorkloadDTO(
                $"{e.FirstName} {e.LastName}",
                e.ITSetupTasks.Count(t => !t.IsCompleted),
                e.ITSetupTasks.Count(t => t.IsCompleted),
                e.ITSetupTasks.Count,
                e.Company != null ? e.Company.CompanyName : "N/A"
            ))
            .OrderByDescending(w => w.PendingTasks)
            .ToListAsync();

        return Ok(workloads);
    }

    [HttpGet("today")]
    public async Task<ActionResult<IEnumerable<TodaysTaskDTO>>> GetTodaysTasks()
    {
        var today = DateTime.Today;
        var tasks = await _context.ITSetupTasks
            .Where(t => t.ScheduledDate.Date == today)
            .Include(t => t.ITEmployee)
            .Include(t => t.NewHire)
            .Include(t => t.SetupType)
            .Include(t => t.NewHire.Company)
            .Select(t => new TodaysTaskDTO(
                t.ITSetupTaskId,
                $"{t.ITEmployee.FirstName} {t.ITEmployee.LastName}",
                $"{t.NewHire.FirstName} {t.NewHire.LastName}",
                t.SetupType.SetupName,
                t.IsCompleted,
                t.NewHire.Company.CompanyName
            ))
            .OrderBy(t => t.ITEmployeeName)
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("company/{id}/progress")]
    public async Task<ActionResult<IEnumerable<CompanyOnboardingProgressDTO>>> GetCompanyOnboardingProgress(int id)
    {
        var progress = await _context.NewHires
            .Where(nh => nh.CompanyId == id)
            .Select(nh => new CompanyOnboardingProgressDTO(
                $"{nh.FirstName} {nh.LastName}",
                nh.ITSetupTasks.Count,
                nh.ITSetupTasks.Count(t => t.IsCompleted),
                nh.ITSetupTasks.Any() 
                    ? Math.Round((decimal)nh.ITSetupTasks.Count(t => t.IsCompleted) / nh.ITSetupTasks.Count * 100, 2)
                    : 0,
                nh.HireDate
            ))
            .OrderByDescending(p => p.HireDate)
            .ToListAsync();

        return Ok(progress);
    }

    [HttpGet("overdue")]
    public async Task<ActionResult<IEnumerable<OverdueTaskDTO>>> GetOverdueTasks()
    {
        var today = DateTime.Today;
        var tasks = await _context.ITSetupTasks
            .Where(t => !t.IsCompleted && t.ScheduledDate.Date < today)
            .Include(t => t.ITEmployee)
            .Include(t => t.NewHire)
            .Include(t => t.SetupType)
            .Include(t => t.NewHire.Company)
            .Select(t => new OverdueTaskDTO(
                t.ITSetupTaskId,
                $"{t.ITEmployee.FirstName} {t.ITEmployee.LastName}",
                $"{t.NewHire.FirstName} {t.NewHire.LastName}",
                t.SetupType.SetupName,
                t.ScheduledDate,
                (today - t.ScheduledDate.Date).Days,
                t.NewHire.Company.CompanyName
            ))
            .OrderByDescending(t => t.DaysOverdue)
            .ToListAsync();

        return Ok(tasks);
    }
}