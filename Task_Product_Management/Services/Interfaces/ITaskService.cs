using Task_Product_Management.Api.DTOs.Task;
namespace Task_Product_Management.Api.Services.Interfaces;
public interface ITaskService
{
    Task<TaskDto> CreateAsync(TaskCreateDto dto);
    Task<IEnumerable<TaskDto>> GetByProjectAsync(int projectId);
    Task<TaskDto?> UpdateAsync(int id, TaskUpdateDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> UploadAttachmentsAsync(int id, IFormFile? document, IFormFile? image);
}
