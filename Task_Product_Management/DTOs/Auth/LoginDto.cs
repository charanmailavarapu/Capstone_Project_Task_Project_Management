using Task_Product_Management.Api.Models;

namespace Task_Product_Management.Api.DTOs.Auth;
public record LoginDto(
    string Email, 
    string Password  
);
