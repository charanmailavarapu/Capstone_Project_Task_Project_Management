using System.Text.Json.Serialization;
using Task_Product_Management.Api.Models;
namespace Task_Product_Management.Api.DTOs.Auth;
public record AuthResponseDto(
    string Token, 
    int Id, 
    string Email, 
    string FullName,
    [property: JsonConverter(typeof(JsonStringEnumConverter))]
    UserRole Role
);
