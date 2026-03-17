using ClientManagementAPI.Models.DTOs.Auth;

namespace ClientManagementAPI.Repositories;

public interface IAuthRepository
{
    Task<UserDto?> GetUserByUsernameAsync(string username);
    Task UpdateLastLoginAsync(int userId);
    Task<int> CreateUserAsync(string username, string email, string passwordHash, string role);
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
}
