using Task_Product_Management.Api.DTOs.Auth;

namespace Task_Product_Management.Api.Services.Interfaces;
public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}
