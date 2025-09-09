using Microsoft.EntityFrameworkCore;
using Task_Product_Management.Api.Data;
using Task_Product_Management.Api.DTOs.Auth;
using Task_Product_Management.Api.Models;
using Task_Product_Management.Api.Services.Interfaces;
using Task_Product_Management.Api.Utils;

namespace Task_Product_Management.Api.Services;

public class AuthService(AppDbContext db, IConfiguration cfg) : IAuthService
{
    private readonly AppDbContext _db = db;
    private readonly JwtTokenFactory _jwt = new(cfg);

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            throw new InvalidOperationException("Email already registered");

        PasswordHasher.CreatePasswordHash(dto.Password, out var hash, out var salt);
        var user = new User
        {
            Email = dto.Email,
            FullName = dto.FullName,
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = dto.Role
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _jwt.CreateToken(user);
        return new AuthResponseDto(token, user.Id, user.Email, user.FullName, user.Role);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email)
                   ?? throw new InvalidOperationException("Invalid credentials");
        if (!PasswordHasher.VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt))
            throw new InvalidOperationException("Invalid credentials");

        var token = _jwt.CreateToken(user);
        return new AuthResponseDto(token, user.Id, user.Email, user.FullName, user.Role);
    }

}
