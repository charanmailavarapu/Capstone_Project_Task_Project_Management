using Microsoft.EntityFrameworkCore;
using Task_Product_Management.Api.Data;
using Task_Product_Management.Api.DTOs.Task;
using Task_Product_Management.Api.Models;
using Task_Product_Management.Api.Services.Interfaces;

namespace Task_Product_Management.Api.Services;

public class TaskService(AppDbContext db) : ITaskService
{
    private readonly AppDbContext _db = db;

    public async Task<TaskDto> CreateAsync(TaskCreateDto dto)
    {
        if (!await _db.Projects.AnyAsync(p => p.Id == dto.ProjectId))
            throw new InvalidOperationException("Project not found");

        var t = new TaskItem
        {
            ProjectId = dto.ProjectId,
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            AssigneeId = dto.AssigneeId
        };
        _db.Tasks.Add(t);
        await _db.SaveChangesAsync();
        return Map(t);
    }

    public async Task<IEnumerable<TaskDto>> GetByProjectAsync(int projectId)
    {
        return await _db.Tasks
            .Where(t => t.ProjectId == projectId)
            .Select(t => new TaskDto(t.Id, t.ProjectId, t.Title, t.Description, t.Status, t.AssigneeId, t.DocumentName, t.ImageName))
            .ToListAsync();
    }

    public async Task<TaskDto?> UpdateAsync(int id, TaskUpdateDto dto)
    {
        var t = await _db.Tasks.FindAsync(id);
        if (t is null) return null;
        t.Title = dto.Title;
        t.Description = dto.Description;
        t.Status = dto.Status;
        t.AssigneeId = dto.AssigneeId;
        await _db.SaveChangesAsync();
        return Map(t);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var t = await _db.Tasks.FindAsync(id);
        if (t is null) return false;
        _db.Tasks.Remove(t);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UploadAttachmentsAsync(int id, IFormFile? document, IFormFile? image)
    {
        var t = await _db.Tasks.FindAsync(id);
        if (t is null) return false;

        if (document is not null)
        {
            using var ms = new MemoryStream();
            await document.CopyToAsync(ms);
            t.Document = ms.ToArray();
            t.DocumentName = document.FileName;
        }

        if (image is not null)
        {
            using var ms2 = new MemoryStream();
            await image.CopyToAsync(ms2);
            t.Image = ms2.ToArray();
            t.ImageName = image.FileName;
        }

        await _db.SaveChangesAsync();
        return true;
    }

    private static TaskDto Map(TaskItem t)
        => new TaskDto(t.Id, t.ProjectId, t.Title, t.Description, t.Status, t.AssigneeId, t.DocumentName, t.ImageName);
}
