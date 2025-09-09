using Task_Product_Management.Api.Models;
namespace Task_Product_Management.Api.DTOs.Auth;
public record RegisterDto(string Email, string FullName, string Password, UserRole Role);
