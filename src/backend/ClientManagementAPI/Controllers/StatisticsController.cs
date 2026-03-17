using ClientManagementAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ClientManagementAPI.Controllers;

// ===========================
// Statistics DTOs
// ===========================

public class StatisticDto
{
    public int StatisticId { get; set; }
    public int ClientId { get; set; }
    public string MetricName { get; set; } = string.Empty;
    public decimal MetricValue { get; set; }
    public string? Unit { get; set; }
    public string? Category { get; set; }
    public DateTime RecordedAt { get; set; }
    public string? Notes { get; set; }
}

public class CreateStatisticDto
{
    [Required]
    public int ClientId { get; set; }
    [Required]
    public string MetricName { get; set; } = string.Empty;
    [Required]
    public decimal MetricValue { get; set; }
    public string? Unit { get; set; }
    public string? Category { get; set; }
    public DateTime? RecordedAt { get; set; }
    public string? Notes { get; set; }
}

public class UsageMetricDto
{
    public int UsageId { get; set; }
    public int ClientId { get; set; }
    public int? ActiveUsers { get; set; }
    public long? TotalRequests { get; set; }
    public long? DataTransferMB { get; set; }
    public int? StorageUsedGB { get; set; }
    public DateTime RecordedAt { get; set; }
}

public class CreateUsageMetricDto
{
    [Required]
    public int ClientId { get; set; }
    public int? ActiveUsers { get; set; }
    public long? TotalRequests { get; set; }
    public long? DataTransferMB { get; set; }
    public int? StorageUsedGB { get; set; }
}

public class PerformanceMetricDto
{
    public int PerformanceId { get; set; }
    public int ClientId { get; set; }
    public int? AvgResponseTime { get; set; }
    public decimal? ErrorRate { get; set; }
    public decimal? Uptime { get; set; }
    public int? Throughput { get; set; }
    public DateTime RecordedAt { get; set; }
}

public class CreatePerformanceMetricDto
{
    [Required]
    public int ClientId { get; set; }
    public int? AvgResponseTime { get; set; }
    public decimal? ErrorRate { get; set; }
    public decimal? Uptime { get; set; }
    public int? Throughput { get; set; }
}

public class FinancialMetricDto
{
    public int FinancialId { get; set; }
    public int ClientId { get; set; }
    public decimal? Revenue { get; set; }
    public decimal? Cost { get; set; }
    public decimal? Profit { get; set; }
    public string? Currency { get; set; }
    public string Period { get; set; } = string.Empty;
    public DateTime RecordedAt { get; set; }
}

public class CreateFinancialMetricDto
{
    [Required]
    public int ClientId { get; set; }
    public decimal? Revenue { get; set; }
    public decimal? Cost { get; set; }
    public decimal? Profit { get; set; }
    public string? Currency { get; set; }
    [Required]
    public string Period { get; set; } = string.Empty;
}

// ===========================
// Statistics Repository
// ===========================

public interface IStatisticsRepository
{
    Task<IEnumerable<StatisticDto>> GetByClientAsync(int clientId);
    Task<int> CreateAsync(CreateStatisticDto dto);
    Task<IEnumerable<UsageMetricDto>> GetUsageAsync(int clientId);
    Task<int> CreateUsageAsync(CreateUsageMetricDto dto);
    Task<IEnumerable<PerformanceMetricDto>> GetPerformanceAsync(int clientId);
    Task<int> CreatePerformanceAsync(CreatePerformanceMetricDto dto);
    Task<IEnumerable<FinancialMetricDto>> GetFinancialAsync(int clientId);
    Task<int> CreateFinancialAsync(CreateFinancialMetricDto dto);
}

public class StatisticsRepository : IStatisticsRepository
{
    private readonly string _connectionString;

    public StatisticsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<StatisticDto>> GetByClientAsync(int clientId)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<StatisticDto>(
            connection,
            "sp_GetStatisticsByClient",
            new { ClientId = clientId },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(CreateStatisticDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QuerySingleAsync<int>(
            connection,
            "sp_CreateStatistic",
            dto,
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<UsageMetricDto>> GetUsageAsync(int clientId)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<UsageMetricDto>(
            connection,
            "sp_GetUsageMetricsByClient",
            new { ClientId = clientId },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateUsageAsync(CreateUsageMetricDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.ExecuteScalarAsync<int>(
            connection,
            "sp_CreateUsageMetric",
            dto,
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<PerformanceMetricDto>> GetPerformanceAsync(int clientId)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<PerformanceMetricDto>(
            connection,
            "sp_GetPerformanceMetricsByClient",
            new { ClientId = clientId },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<int> CreatePerformanceAsync(CreatePerformanceMetricDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.ExecuteScalarAsync<int>(
            connection,
            "sp_CreatePerformanceMetric",
            dto,
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<FinancialMetricDto>> GetFinancialAsync(int clientId)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<FinancialMetricDto>(
            connection,
            "sp_GetFinancialMetricsByClient",
            new { ClientId = clientId },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateFinancialAsync(CreateFinancialMetricDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.ExecuteScalarAsync<int>(
            connection,
            "sp_CreateFinancialMetric",
            dto,
            commandType: System.Data.CommandType.StoredProcedure
        );
    }
}

// ===========================
// Statistics Controller
// ===========================

[ApiController]
[Route("api/statistics")]
[Authorize]
public class StatisticsController : ControllerBase
{
    private readonly IStatisticsRepository _statisticsRepository;

    public StatisticsController(IStatisticsRepository statisticsRepository)
    {
        _statisticsRepository = statisticsRepository;
    }

    // General Statistics
    [HttpGet("client/{clientId}")]
    public async Task<ActionResult<IEnumerable<StatisticDto>>> GetByClient(int clientId)
    {
        var stats = await _statisticsRepository.GetByClientAsync(clientId);
        return Ok(stats);
    }

    [HttpPost]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Create([FromBody] CreateStatisticDto dto)
    {
        var id = await _statisticsRepository.CreateAsync(dto);
        return Ok(new { statisticId = id });
    }

    // Usage Metrics
    [HttpGet("usage/client/{clientId}")]
    public async Task<ActionResult<IEnumerable<UsageMetricDto>>> GetUsage(int clientId)
    {
        var metrics = await _statisticsRepository.GetUsageAsync(clientId);
        return Ok(metrics);
    }

    [HttpPost("usage")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> CreateUsage([FromBody] CreateUsageMetricDto dto)
    {
        var id = await _statisticsRepository.CreateUsageAsync(dto);
        return Ok(new { usageId = id });
    }

    // Performance Metrics
    [HttpGet("performance/client/{clientId}")]
    public async Task<ActionResult<IEnumerable<PerformanceMetricDto>>> GetPerformance(int clientId)
    {
        var metrics = await _statisticsRepository.GetPerformanceAsync(clientId);
        return Ok(metrics);
    }

    [HttpPost("performance")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> CreatePerformance([FromBody] CreatePerformanceMetricDto dto)
    {
        var id = await _statisticsRepository.CreatePerformanceAsync(dto);
        return Ok(new { performanceId = id });
    }

    // Financial Metrics
    [HttpGet("financial/client/{clientId}")]
    public async Task<ActionResult<IEnumerable<FinancialMetricDto>>> GetFinancial(int clientId)
    {
        var metrics = await _statisticsRepository.GetFinancialAsync(clientId);
        return Ok(metrics);
    }

    [HttpPost("financial")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> CreateFinancial([FromBody] CreateFinancialMetricDto dto)
    {
        var id = await _statisticsRepository.CreateFinancialAsync(dto);
        return Ok(new { financialId = id });
    }
}
