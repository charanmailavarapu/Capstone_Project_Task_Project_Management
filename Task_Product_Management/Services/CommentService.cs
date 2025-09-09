using Microsoft.EntityFrameworkCore;
using Task_Product_Management.Api.Data;
using Task_Product_Management.Api.DTOs.Comment;
using Task_Product_Management.Api.Models;
using Task_Product_Management.Api.Services.Interfaces;

namespace Task_Product_Management.Api.Services;

public class CommentService(AppDbContext db) : ICommentService
{
    private readonly AppDbContext _db = db;

    public async Task<CommentDto> AddAsync(int authorId, CommentCreateDto dto)
    {
        if (!await _db.Tasks.AnyAsync(t => t.Id == dto.TaskId))
            throw new InvalidOperationException("Task not found");

        var c = new Comment { TaskId = dto.TaskId, AuthorId = authorId, Content = dto.Content };
        _db.Comments.Add(c);
        await _db.SaveChangesAsync();
        return new CommentDto(c.Id, c.TaskId, c.AuthorId, c.Content, c.CreatedAt);
    }

    public async Task<IEnumerable<CommentDto>> GetByTaskAsync(int taskId)
    {
        return await _db.Comments
            .Where(c => c.TaskId == taskId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentDto(c.Id, c.TaskId, c.AuthorId, c.Content, c.CreatedAt))
            .ToListAsync();
    }
}
