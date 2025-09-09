using Task_Product_Management.Api.Models;
using TaskStatus = Task_Product_Management.Api.Models.TaskStatus;
namespace Task_Product_Management.Api.DTOs.Task;
public record TaskDto(
    int Id, 
    int ProjectId, 
    string Title, 
    string? Description, 
    TaskStatus Status, 
    int? AssigneeId,
    string? DocumentName, 
    string? ImageName
);
