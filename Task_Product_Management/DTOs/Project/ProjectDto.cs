using Task_Product_Management.Api.Models;
namespace Task_Product_Management.Api.DTOs.Project;
public record ProjectDto(
    int Id, 
    string Name, 
    string? Description, 
    int CreatedById, 
    DateTime CreatedAt
);
