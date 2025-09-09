using Task_Product_Management.Api.DTOs.Comment;
namespace Task_Product_Management.Api.Services.Interfaces;
public interface ICommentService
{
    Task<CommentDto> AddAsync(int authorId, CommentCreateDto dto);
    Task<IEnumerable<CommentDto>> GetByTaskAsync(int taskId);
}
