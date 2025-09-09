using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task_Product_Management.Api.DTOs.Comment;
using Task_Product_Management.Api.Services.Interfaces;

namespace Task_Product_Management.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ViewerOrHigher")]
public class CommentsController(ICommentService svc) : ControllerBase
{
    private readonly ICommentService _svc = svc;

    [HttpPost]
    [Authorize(Policy = "TeamMemberOrHigher")]
    public async Task<IActionResult> Create(CommentCreateDto dto)
    {
        int authorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _svc.AddAsync(authorId, dto));
    }

    [HttpGet("{taskId:int}")]
    public async Task<IActionResult> GetByTask(int taskId)
    {
        var result = await _svc.GetByTaskAsync(taskId);
        return Ok(result);
    }

}
