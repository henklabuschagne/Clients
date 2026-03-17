using ClientManagementAPI.Models.DTOs.Auth;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ClientManagementAPI.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly string _connectionString;

    public AuthRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string not configured");
    }

    public async Task<UserDto?> GetUserByUsernameAsync(string username)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<UserDto>(
            "sp_GetUserByUsername",
            new { Username = username },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task UpdateLastLoginAsync(int userId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateLastLogin",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateUserAsync(string username, string email, string passwordHash, string role)
    {
        using var connection = new SqlConnection(_connectionString);
        var result = await connection.QuerySingleAsync<int>(
            "sp_CreateUser",
            new { Username = username, Email = email, PasswordHash = passwordHash, Role = role },
            commandType: CommandType.StoredProcedure
        );
        return result;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<UserDto>(
            "sp_GetAllUsers",
            commandType: CommandType.StoredProcedure
        );
    }
}
