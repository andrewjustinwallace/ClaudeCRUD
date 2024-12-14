using FirstDay.API.Models;
using FirstDay.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FirstDay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;

    public TaskController(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    [HttpPut("complete")]
    public async Task<IActionResult> CompleteTask([FromBody] TaskCompletionRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _taskRepository.UpdateTaskCompletionAsync(request);
        
        if (!result)
        {
            return NotFound("Task not found or already completed");
        }

        return Ok(new { success = true, message = "Task completed successfully" });
    }
}