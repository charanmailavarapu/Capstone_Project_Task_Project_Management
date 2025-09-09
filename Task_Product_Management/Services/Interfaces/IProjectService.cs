using Task_Product_Management.Api.DTOs.Project;
namespace Task_Product_Management.Api.Services.Interfaces;
public interface IProjectService
{
    Task<ProjectDto> CreateAsync(int creatorId, ProjectCreateDto dto);
    Task<IEnumerable<ProjectDto>> GetAllAsync();
    Task<ProjectDto?> GetByIdAsync(int id);
    Task<ProjectDto?> UpdateAsync(int id, ProjectUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
