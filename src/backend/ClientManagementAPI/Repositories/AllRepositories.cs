using ClientManagementAPI.Models.DTOs;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ClientManagementAPI.Repositories;

// ===========================
// VPN Repository
// ===========================

public interface IVPNRepository
{
    Task<IEnumerable<VPNConfigurationDto>> GetByClientAsync(int clientId);
    Task<VPNConfigurationDto?> GetByIdAsync(int vpnId);
    Task<int> CreateAsync(CreateVPNConfigurationDto dto);
    Task UpdateAsync(UpdateVPNConfigurationDto dto);
    Task DeleteAsync(int vpnId);
}

public class VPNRepository : IVPNRepository
{
    private readonly string _connectionString;

    public VPNRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<VPNConfigurationDto>> GetByClientAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<VPNConfigurationDto>(
            "sp_GetVPNConfigurationsByClient",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<VPNConfigurationDto?> GetByIdAsync(int vpnId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<VPNConfigurationDto>(
            "sp_GetVPNConfigurationById",
            new { VPNId = vpnId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(CreateVPNConfigurationDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "sp_CreateVPNConfiguration",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task UpdateAsync(UpdateVPNConfigurationDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateVPNConfiguration",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeleteAsync(int vpnId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteVPNConfiguration",
            new { VPNId = vpnId },
            commandType: CommandType.StoredProcedure
        );
    }
}

// ===========================
// Connection Repository
// ===========================

public interface IConnectionRepository
{
    Task<IEnumerable<ConnectionDto>> GetByClientAsync(int clientId);
    Task<ConnectionDto?> GetByIdAsync(int connectionId);
    Task<int> CreateAsync(CreateConnectionDto dto);
    Task UpdateAsync(UpdateConnectionDto dto);
    Task DeleteAsync(int connectionId);
}

public class ConnectionRepository : IConnectionRepository
{
    private readonly string _connectionString;

    public ConnectionRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<ConnectionDto>> GetByClientAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<ConnectionDto>(
            "sp_GetConnectionsByClient",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<ConnectionDto?> GetByIdAsync(int connectionId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<ConnectionDto>(
            "sp_GetConnectionById",
            new { ConnectionId = connectionId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(CreateConnectionDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "sp_CreateConnection",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task UpdateAsync(UpdateConnectionDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateConnection",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeleteAsync(int connectionId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteConnection",
            new { ConnectionId = connectionId },
            commandType: CommandType.StoredProcedure
        );
    }
}

// ===========================
// Server Repository
// ===========================

public interface IServerRepository
{
    Task<IEnumerable<ServerDto>> GetByClientAsync(int clientId);
    Task<ServerDto?> GetByIdAsync(int serverId);
    Task<int> CreateAsync(CreateServerDto dto);
    Task UpdateAsync(UpdateServerDto dto);
    Task DeleteAsync(int serverId);
}

public class ServerRepository : IServerRepository
{
    private readonly string _connectionString;

    public ServerRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<ServerDto>> GetByClientAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<ServerDto>(
            "sp_GetServersByClient",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<ServerDto?> GetByIdAsync(int serverId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<ServerDto>(
            "sp_GetServerById",
            new { ServerId = serverId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(CreateServerDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "sp_CreateServer",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task UpdateAsync(UpdateServerDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateServer",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeleteAsync(int serverId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteServer",
            new { ServerId = serverId },
            commandType: CommandType.StoredProcedure
        );
    }
}

// ===========================
// Contact Repository
// ===========================

public interface IContactRepository
{
    Task<IEnumerable<ContactDto>> GetByClientAsync(int clientId);
    Task<ContactDto?> GetByIdAsync(int contactId);
    Task<int> CreateAsync(CreateContactDto dto);
    Task UpdateAsync(UpdateContactDto dto);
    Task DeleteAsync(int contactId);
}

public class ContactRepository : IContactRepository
{
    private readonly string _connectionString;

    public ContactRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<ContactDto>> GetByClientAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<ContactDto>(
            "sp_GetContactsByClient",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<ContactDto?> GetByIdAsync(int contactId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<ContactDto>(
            "sp_GetContactById",
            new { ContactId = contactId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(CreateContactDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "sp_CreateContact",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task UpdateAsync(UpdateContactDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateContact",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeleteAsync(int contactId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteContact",
            new { ContactId = contactId },
            commandType: CommandType.StoredProcedure
        );
    }
}

// ===========================
// License Repository
// ===========================

public interface ILicenseRepository
{
    Task<IEnumerable<LicenseDto>> GetByClientAsync(int clientId);
    Task<LicenseDto?> GetByIdAsync(int licenseId);
    Task<int> CreateAsync(CreateLicenseDto dto);
    Task UpdateAsync(UpdateLicenseDto dto);
    Task DeleteAsync(int licenseId);
    Task<IEnumerable<LicenseDto>> GetExpiringAsync(int days);
}

public class LicenseRepository : ILicenseRepository
{
    private readonly string _connectionString;

    public LicenseRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<LicenseDto>> GetByClientAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<LicenseDto>(
            "sp_GetLicensesByClient",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<LicenseDto?> GetByIdAsync(int licenseId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<LicenseDto>(
            "sp_GetLicenseById",
            new { LicenseId = licenseId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(CreateLicenseDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "sp_CreateLicense",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task UpdateAsync(UpdateLicenseDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateLicense",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeleteAsync(int licenseId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteLicense",
            new { LicenseId = licenseId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<LicenseDto>> GetExpiringAsync(int days)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<LicenseDto>(
            "sp_GetExpiringLicenses",
            new { Days = days },
            commandType: CommandType.StoredProcedure
        );
    }
}

// ===========================
// Ticket Repository
// ===========================

public interface ITicketRepository
{
    Task<IEnumerable<TicketDto>> GetAllAsync();
    Task<IEnumerable<TicketDto>> GetByClientAsync(int clientId);
    Task<TicketDto?> GetByIdAsync(int ticketId);
    Task<int> CreateAsync(CreateTicketDto dto);
    Task UpdateAsync(UpdateTicketDto dto);
    Task DeleteAsync(int ticketId);
    Task<IEnumerable<TicketCommentDto>> GetCommentsAsync(int ticketId);
    Task<int> CreateCommentAsync(CreateTicketCommentDto dto);
    Task<TicketStatisticsDto> GetStatisticsAsync();
}

public class TicketRepository : ITicketRepository
{
    private readonly string _connectionString;

    public TicketRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<TicketDto>> GetAllAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<TicketDto>(
            "sp_GetAllTickets",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<TicketDto>> GetByClientAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<TicketDto>(
            "sp_GetTicketsByClient",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<TicketDto?> GetByIdAsync(int ticketId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<TicketDto>(
            "sp_GetTicketById",
            new { TicketId = ticketId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(CreateTicketDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "sp_CreateTicket",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task UpdateAsync(UpdateTicketDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateTicket",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeleteAsync(int ticketId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteTicket",
            new { TicketId = ticketId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<TicketCommentDto>> GetCommentsAsync(int ticketId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<TicketCommentDto>(
            "sp_GetTicketComments",
            new { TicketId = ticketId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateCommentAsync(CreateTicketCommentDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "sp_CreateTicketComment",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<TicketStatisticsDto> GetStatisticsAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<TicketStatisticsDto>(
            "sp_GetTicketStatistics",
            commandType: CommandType.StoredProcedure
        );
    }
}

// ===========================
// Update Repository
// ===========================

public interface IUpdateRepository
{
    Task<IEnumerable<UpdateDto>> GetAllAsync();
    Task<IEnumerable<UpdateDto>> GetByClientAsync(int clientId);
    Task<UpdateDto?> GetByIdAsync(int updateId);
    Task<int> CreateAsync(CreateUpdateDto dto);
    Task UpdateAsync(UpdateUpdateDto dto);
    Task DeleteAsync(int updateId);
    Task<IEnumerable<UpdateDto>> GetUpcomingAsync(int days);
}

public class UpdateRepository : IUpdateRepository
{
    private readonly string _connectionString;

    public UpdateRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<UpdateDto>> GetAllAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<UpdateDto>(
            "sp_GetAllUpdates",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<UpdateDto>> GetByClientAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<UpdateDto>(
            "sp_GetUpdatesByClient",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<UpdateDto?> GetByIdAsync(int updateId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<UpdateDto>(
            "sp_GetUpdateById",
            new { UpdateId = updateId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(CreateUpdateDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<int>(
            "sp_CreateUpdate",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task UpdateAsync(UpdateUpdateDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateUpdate",
            dto,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeleteAsync(int updateId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteUpdate",
            new { UpdateId = updateId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<UpdateDto>> GetUpcomingAsync(int days)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<UpdateDto>(
            "sp_GetUpcomingUpdates",
            new { Days = days },
            commandType: CommandType.StoredProcedure
        );
    }
}
