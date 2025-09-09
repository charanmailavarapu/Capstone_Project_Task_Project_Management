namespace Task_Product_Management.Api.DTOs.Comment;
public record CommentDto(int Id, int TaskId, int AuthorId, string Content, DateTime CreatedAt);
