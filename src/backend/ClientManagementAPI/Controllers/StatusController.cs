using ClientManagementAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClientManagementAPI.Controllers;

// ===========================
// Client Status DTOs
// ===========================

public class ClientStatusDto
{
    public int StatusId { get; set; }
    public int ClientId { get; set; }
    public string StatusType { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string? AffectedServices { get; set; }
    public DateTime ReportedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public int CreatedBy { get; set; }
}

public class CreateClientStatusDto
{
    public int ClientId { get; set; }
    public string StatusType { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string? AffectedServices { get; set; }
    public DateTime? ReportedAt { get; set; }
    public int CreatedBy { get; set; }
}

public class HealthCheckDto
{
    public int HealthCheckId { get; set; }
    public int ClientId { get; set; }
    public string CheckType { get; set; } = string.Empty;
    public string? Endpoint { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? ResponseTime { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CheckedAt { get; set; }
}

public class CreateHealthCheckDto
{
    public int ClientId { get; set; }
    public string CheckType { get; set; } = string.Empty;
    public string? Endpoint { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? ResponseTime { get; set; }
    public string? ErrorMessage { get; set; }
}

// ===========================
// Status Repository
// ===========================

public interface IStatusRepository
{
    Task<IEnumerable<ClientStatusDto>> GetClientStatusesAsync(int clientId);
    Task<ClientStatusDto?> GetLatestClientStatusAsync(int clientId);
    Task<int> CreateClientStatusAsync(CreateClientStatusDto dto);
    Task<IEnumerable<HealthCheckDto>> GetClientHealthChecksAsync(int clientId, int limit = 100);
    Task<int> CreateHealthCheckAsync(CreateHealthCheckDto dto);
}

public class StatusRepository : IStatusRepository
{
    private readonly string _connectionString;

    public StatusRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<ClientStatusDto>> GetClientStatusesAsync(int clientId)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<ClientStatusDto>(
            connection,
            "sp_GetClientStatuses",
            new { ClientId = clientId },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<ClientStatusDto?> GetLatestClientStatusAsync(int clientId)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QuerySingleOrDefaultAsync<ClientStatusDto>(
            connection,
            "sp_GetLatestClientStatus",
            new { ClientId = clientId },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateClientStatusAsync(CreateClientStatusDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QuerySingleAsync<int>(
            connection,
            "sp_CreateClientStatus",
            dto,
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<HealthCheckDto>> GetClientHealthChecksAsync(int clientId, int limit = 100)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<HealthCheckDto>(
            connection,
            "sp_GetClientHealthChecks",
            new { ClientId = clientId, Limit = limit },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateHealthCheckAsync(CreateHealthCheckDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QuerySingleAsync<int>(
            connection,
            "sp_CreateHealthCheck",
            dto,
            commandType: System.Data.CommandType.StoredProcedure
        );
    }
}

// ===========================
// Status Controller
// ===========================

[ApiController]
[Route("api/clients")]
[Authorize]
public class StatusController : ControllerBase
{
    private readonly IStatusRepository _statusRepository;

    public StatusController(IStatusRepository statusRepository)
    {
        _statusRepository = statusRepository;
    }

    [HttpGet("{clientId}/statuses")]
    public async Task<ActionResult<IEnumerable<ClientStatusDto>>> GetStatuses(int clientId)
    {
        var statuses = await _statusRepository.GetClientStatusesAsync(clientId);
        return Ok(statuses);
    }

    [HttpPost("statuses")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult<ClientStatusDto>> CreateStatus([FromBody] CreateClientStatusDto dto)
    {
        var statusId = await _statusRepository.CreateClientStatusAsync(dto);
        var statuses = await _statusRepository.GetClientStatusesAsync(dto.ClientId);
        var created = statuses.FirstOrDefault(s => s.StatusId == statusId);
        return Ok(created);
    }

    [HttpGet("{clientId}/health-checks")]
    public async Task<ActionResult<IEnumerable<HealthCheckDto>>> GetHealthChecks(int clientId, [FromQuery] int limit = 100)
    {
        var checks = await _statusRepository.GetClientHealthChecksAsync(clientId, limit);
        return Ok(checks);
    }

    [HttpPost("health-checks")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult<HealthCheckDto>> CreateHealthCheck([FromBody] CreateHealthCheckDto dto)
    {
        var checkId = await _statusRepository.CreateHealthCheckAsync(dto);
        var checks = await _statusRepository.GetClientHealthChecksAsync(dto.ClientId);
        var created = checks.FirstOrDefault(c => c.HealthCheckId == checkId);
        return Ok(created);
    }
}
