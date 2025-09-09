using Microsoft.AspNetCore.Mvc;
using Task_Product_Management.Api.DTOs.Auth;
using Task_Product_Management.Api.Services.Interfaces;

namespace Task_Product_Management.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService auth) : ControllerBase
{
    private readonly IAuthService _auth = auth;

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _auth.RegisterAsync(dto);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _auth.LoginAsync(dto);
        return Ok(result);
    }

}
