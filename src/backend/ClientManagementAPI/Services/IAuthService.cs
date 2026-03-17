using ClientManagementAPI.Models.DTOs.Auth;

namespace ClientManagementAPI.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
    string GenerateJwtToken(UserDto user);
}
