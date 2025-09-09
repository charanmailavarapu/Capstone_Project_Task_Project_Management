using Microsoft.EntityFrameworkCore;
using Task_Product_Management.Api.Data;
using Task_Product_Management.Api.DTOs.Project;
using Task_Product_Management.Api.Models;
using Task_Product_Management.Api.Services.Interfaces;

namespace Task_Product_Management.Api.Services;

public class ProjectService(AppDbContext db) : IProjectService
{
    private readonly AppDbContext _db = db;

    public async Task<ProjectDto> CreateAsync(int creatorId, ProjectCreateDto dto)
    {
        var p = new Project { Name = dto.Name, Description = dto.Description, CreatedById = creatorId };
        _db.Projects.Add(p);
        await _db.SaveChangesAsync();
        return new ProjectDto(p.Id, p.Name, p.Description, p.CreatedById, p.CreatedAt);
    }

    public async Task<IEnumerable<ProjectDto>> GetAllAsync()
    {
        return await _db.Projects
           .OrderByDescending(p => p.CreatedAt)
           .Select(p => new ProjectDto(p.Id, p.Name, p.Description, p.CreatedById, p.CreatedAt))
           .ToListAsync();
    }

    public async Task<ProjectDto?> GetByIdAsync(int id)
    {
        return await _db.Projects
            .Where(p => p.Id == id)
            .Select(p => new ProjectDto(p.Id, p.Name, p.Description, p.CreatedById, p.CreatedAt))
            .FirstOrDefaultAsync();
    }

    public async Task<ProjectDto?> UpdateAsync(int id, ProjectUpdateDto dto)
    {
        var p = await _db.Projects.FindAsync(id);
        if (p is null) return null;
        p.Name = dto.Name;
        p.Description = dto.Description;
        await _db.SaveChangesAsync();
        return new ProjectDto(p.Id, p.Name, p.Description, p.CreatedById, p.CreatedAt);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var p = await _db.Projects.FindAsync(id);
        if (p is null) return false;
        _db.Projects.Remove(p);
        await _db.SaveChangesAsync();
        return true;
    }
}
