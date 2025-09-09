using Task_Product_Management.Api.Models;
using TaskStatus = Task_Product_Management.Api.Models.TaskStatus;
namespace Task_Product_Management.Api.DTOs.Task;
public record TaskUpdateDto(string Title, string? Description, TaskStatus Status, int? AssigneeId);
