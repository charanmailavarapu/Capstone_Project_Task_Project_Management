using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task_Product_Management.Api.DTOs.Project;
using Task_Product_Management.Api.Services.Interfaces;

namespace Task_Product_Management.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ViewerOrHigher")]
public class ProjectsController(IProjectService svc) : ControllerBase
{
    private readonly IProjectService _svc = svc;

    [HttpPost]
    [Authorize(Policy = "ProjectManagerOrHigher")]
    public async Task<IActionResult> Create(ProjectCreateDto dto)
    {
        int creatorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var p = await _svc.CreateAsync(creatorId, dto);
        return CreatedAtAction(nameof(GetById), new { id = p.Id }, p);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _svc.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _svc.GetByIdAsync(id);
        return p is null ? NotFound() : Ok(p);
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "ProjectManagerOrHigher")]
    public async Task<IActionResult> Update(int id, ProjectUpdateDto dto)
    {
        var p = await _svc.UpdateAsync(id, dto);
        return p is null ? NotFound() : Ok(p);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "ProjectManagerOrHigher")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _svc.DeleteAsync(id);
        return result ? NoContent() : NotFound();
    }

}
