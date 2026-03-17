using ClientManagementAPI.Models.DTOs.Clients;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ClientManagementAPI.Repositories;

public interface IClientRepository
{
    Task<IEnumerable<ClientDto>> GetAllAsync();
    Task<ClientDto?> GetByIdAsync(int clientId);
    Task<int> CreateAsync(CreateClientDto dto);
    Task UpdateAsync(UpdateClientDto dto);
    Task DeleteAsync(int clientId);
}

public class ClientRepository : IClientRepository
{
    private readonly string _connectionString;

    public ClientRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not configured");
    }

    public async Task<IEnumerable<ClientDto>> GetAllAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<ClientDto>(
            "sp_GetAllClients",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<ClientDto?> GetByIdAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<ClientDto>(
            "sp_GetClientById",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(CreateClientDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        var result = await connection.QuerySingleAsync<int>(
            "sp_CreateClient",
            new
            {
                dto.Name,
                dto.Company,
                dto.Email,
                dto.Phone,
                dto.Address,
                dto.City,
                dto.Country,
                dto.Status,
                dto.Hosted,
                dto.InstallLink,
                dto.OnboardingDate,
                dto.Notes
            },
            commandType: CommandType.StoredProcedure
        );
        return result;
    }

    public async Task UpdateAsync(UpdateClientDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateClient",
            new
            {
                dto.ClientId,
                dto.Name,
                dto.Company,
                dto.Email,
                dto.Phone,
                dto.Address,
                dto.City,
                dto.Country,
                dto.Status,
                dto.Hosted,
                dto.InstallLink,
                dto.OnboardingDate,
                dto.Notes
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeleteAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteClient",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure
        );
    }
}
