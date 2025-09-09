using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task_Product_Management.Api.DTOs.Task;
using Task_Product_Management.Api.Services.Interfaces;

namespace Task_Product_Management.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ViewerOrHigher")]
public class TasksController(ITaskService svc) : ControllerBase
{
    private readonly ITaskService _svc = svc;

    [HttpPost]
    [Authorize(Policy = "ProjectManagerOrHigher")]
    public async Task<IActionResult> Create(TaskCreateDto dto)
    {
        var result = await _svc.CreateAsync(dto);
        return Ok(result);
    }


    [HttpGet("{projectId:int}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var result = await _svc.GetByProjectAsync(projectId);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "TeamMemberOrHigher")]
    public async Task<IActionResult> Update(int id, TaskUpdateDto dto)
    {
        var updateTask = await _svc.UpdateAsync(id, dto);
        return updateTask is null ? NotFound() : Ok(updateTask);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "ProjectManagerOrHigher")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _svc.DeleteAsync(id);
        return result ? NoContent() : NotFound();

    }

    [HttpPost("{id:int}/attachments")]
    [Authorize(Policy = "TeamMemberOrHigher")]
    [RequestSizeLimit(50_000_000)] // 50MB
    public async Task<IActionResult> Upload(int id, IFormFile? document, IFormFile? image)
    {
        var result = await _svc.UploadAttachmentsAsync(id, document, image);
        return result ? NoContent() : NotFound();
    }

}
