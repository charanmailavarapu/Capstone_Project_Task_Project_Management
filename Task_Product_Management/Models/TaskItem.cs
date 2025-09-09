namespace Task_Product_Management.Api.Models;
public class TaskItem
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public Project Project { get; set; } = default!;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskStatus Status { get; set; } = TaskStatus.ToDo;
    public int? AssigneeId { get; set; }
    public string? DocumentName { get; set; }
    public byte[]? Document { get; set; }
    public string? ImageName { get; set; }
    public byte[]? Image { get; set; }
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}


