// =============================================
// Phase 6: Statistics & Analytics Management
// Backend C# Code
// =============================================

// =============================================
// DTOs
// =============================================

// File: Models/DTOs/ClientStatisticDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ClientStatisticDto
    {
        public int StatId { get; set; }
        public int ClientId { get; set; }
        public string MetricName { get; set; }
        public decimal MetricValue { get; set; }
        public string? MetricUnit { get; set; }
        public string? Category { get; set; }
        public DateTime RecordedDate { get; set; }
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/RecordStatisticDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class RecordStatisticDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string MetricName { get; set; }
        
        [Required]
        public decimal MetricValue { get; set; }
        
        [StringLength(50)]
        public string? MetricUnit { get; set; }
        
        [StringLength(50)]
        public string? Category { get; set; }
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/StatisticsSummaryDto.cs
namespace ClientManagement.Models.DTOs
{
    public class StatisticsSummaryDto
    {
        public string MetricName { get; set; }
        public string? Category { get; set; }
        public decimal AverageValue { get; set; }
        public decimal MinValue { get; set; }
        public decimal MaxValue { get; set; }
        public int RecordCount { get; set; }
        public DateTime LastRecorded { get; set; }
    }
}

// File: Models/DTOs/UsageMetricsDto.cs
namespace ClientManagement.Models.DTOs
{
    public class UsageMetricsDto
    {
        public int UsageId { get; set; }
        public int ClientId { get; set; }
        public int? ActiveUsers { get; set; }
        public long? TotalRequests { get; set; }
        public decimal? DataTransferGB { get; set; }
        public decimal? StorageUsedGB { get; set; }
        public long? ApiCalls { get; set; }
        public decimal? ErrorRate { get; set; }
        public int? AverageResponseTime { get; set; }
        public int? PeakConcurrentUsers { get; set; }
        public DateTime RecordedDate { get; set; }
    }
}

// File: Models/DTOs/RecordUsageMetricsDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class RecordUsageMetricsDto
    {
        [Required]
        public int ClientId { get; set; }
        
        public int? ActiveUsers { get; set; }
        public long? TotalRequests { get; set; }
        public decimal? DataTransferGB { get; set; }
        public decimal? StorageUsedGB { get; set; }
        public long? ApiCalls { get; set; }
        public decimal? ErrorRate { get; set; }
        public int? AverageResponseTime { get; set; }
        public int? PeakConcurrentUsers { get; set; }
    }
}

// File: Models/DTOs/PerformanceMetricsDto.cs
namespace ClientManagement.Models.DTOs
{
    public class PerformanceMetricsDto
    {
        public int PerformanceId { get; set; }
        public int ClientId { get; set; }
        public decimal? AvailabilityPercent { get; set; }
        public int? UptimeMinutes { get; set; }
        public int? DowntimeMinutes { get; set; }
        public int? MeanTimeToRepair { get; set; }
        public int? IncidentCount { get; set; }
        public decimal? SuccessRate { get; set; }
        public int? PageLoadTime { get; set; }
        public DateTime RecordedDate { get; set; }
    }
}

// File: Models/DTOs/RecordPerformanceMetricsDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class RecordPerformanceMetricsDto
    {
        [Required]
        public int ClientId { get; set; }
        
        public decimal? AvailabilityPercent { get; set; }
        public int? UptimeMinutes { get; set; }
        public int? DowntimeMinutes { get; set; }
        public int? MeanTimeToRepair { get; set; }
        public int? IncidentCount { get; set; }
        public decimal? SuccessRate { get; set; }
        public int? PageLoadTime { get; set; }
    }
}

// File: Models/DTOs/FinancialMetricsDto.cs
namespace ClientManagement.Models.DTOs
{
    public class FinancialMetricsDto
    {
        public int FinancialId { get; set; }
        public int ClientId { get; set; }
        public decimal? MonthlyRevenue { get; set; }
        public decimal? YearlyRevenue { get; set; }
        public decimal? ContractValue { get; set; }
        public decimal? OutstandingBalance { get; set; }
        public decimal? SupportCosts { get; set; }
        public decimal? InfrastructureCosts { get; set; }
        public decimal? ProfitMargin { get; set; }
        public DateTime RecordedDate { get; set; }
        public string? FiscalPeriod { get; set; }
    }
}

// File: Models/DTOs/RecordFinancialMetricsDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class RecordFinancialMetricsDto
    {
        [Required]
        public int ClientId { get; set; }
        
        public decimal? MonthlyRevenue { get; set; }
        public decimal? YearlyRevenue { get; set; }
        public decimal? ContractValue { get; set; }
        public decimal? OutstandingBalance { get; set; }
        public decimal? SupportCosts { get; set; }
        public decimal? InfrastructureCosts { get; set; }
        public decimal? ProfitMargin { get; set; }
        
        [StringLength(20)]
        public string? FiscalPeriod { get; set; }
    }
}

// File: Models/DTOs/CustomMetricDto.cs
namespace ClientManagement.Models.DTOs
{
    public class CustomMetricDto
    {
        public int CustomMetricId { get; set; }
        public int ClientId { get; set; }
        public string MetricName { get; set; }
        public string MetricValue { get; set; }
        public string DataType { get; set; }
        public int? DisplayOrder { get; set; }
        public bool IsVisible { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/CreateCustomMetricDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateCustomMetricDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string MetricName { get; set; }
        
        [Required]
        public string MetricValue { get; set; }
        
        [Required]
        public string DataType { get; set; }
        
        public int? DisplayOrder { get; set; }
        
        public bool IsVisible { get; set; } = true;
    }
}

// File: Models/DTOs/UpdateCustomMetricDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateCustomMetricDto
    {
        [Required]
        public int CustomMetricId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string MetricName { get; set; }
        
        [Required]
        public string MetricValue { get; set; }
        
        [Required]
        public string DataType { get; set; }
        
        public int? DisplayOrder { get; set; }
        
        [Required]
        public bool IsVisible { get; set; }
    }
}

// =============================================
// REPOSITORIES
// =============================================

// File: Repositories/IStatisticsRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IStatisticsRepository
    {
        // Client Statistics
        Task<ClientStatisticDto> RecordStatisticAsync(RecordStatisticDto dto);
        Task<IEnumerable<ClientStatisticDto>> GetStatisticsAsync(int clientId, string? metricName = null, string? category = null, int days = 30);
        Task<IEnumerable<StatisticsSummaryDto>> GetStatisticsSummaryAsync(int clientId);
        
        // Usage Metrics
        Task<UsageMetricsDto> RecordUsageMetricsAsync(RecordUsageMetricsDto dto);
        Task<IEnumerable<UsageMetricsDto>> GetUsageMetricsAsync(int clientId, int days = 30);
        Task<UsageMetricsDto?> GetLatestUsageMetricsAsync(int clientId);
        
        // Performance Metrics
        Task<PerformanceMetricsDto> RecordPerformanceMetricsAsync(RecordPerformanceMetricsDto dto);
        Task<IEnumerable<PerformanceMetricsDto>> GetPerformanceMetricsAsync(int clientId, int days = 30);
        Task<PerformanceMetricsDto?> GetLatestPerformanceMetricsAsync(int clientId);
        
        // Financial Metrics
        Task<FinancialMetricsDto> RecordFinancialMetricsAsync(RecordFinancialMetricsDto dto);
        Task<IEnumerable<FinancialMetricsDto>> GetFinancialMetricsAsync(int clientId, int months = 12);
        Task<FinancialMetricsDto?> GetLatestFinancialMetricsAsync(int clientId);
        
        // Custom Metrics
        Task<IEnumerable<CustomMetricDto>> GetCustomMetricsAsync(int clientId);
        Task<CustomMetricDto> CreateCustomMetricAsync(CreateCustomMetricDto dto);
        Task<CustomMetricDto?> UpdateCustomMetricAsync(UpdateCustomMetricDto dto);
        Task<bool> DeleteCustomMetricAsync(int customMetricId);
    }
}

// File: Repositories/StatisticsRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class StatisticsRepository : IStatisticsRepository
    {
        private readonly string _connectionString;

        public StatisticsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // Client Statistics
        public async Task<ClientStatisticDto> RecordStatisticAsync(RecordStatisticDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@MetricName", dto.MetricName);
                parameters.Add("@MetricValue", dto.MetricValue);
                parameters.Add("@MetricUnit", dto.MetricUnit);
                parameters.Add("@Category", dto.Category);
                parameters.Add("@Notes", dto.Notes);

                var statistic = await connection.QueryFirstAsync<ClientStatisticDto>(
                    "sp_RecordClientStatistic",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return statistic;
            }
        }

        public async Task<IEnumerable<ClientStatisticDto>> GetStatisticsAsync(int clientId, string? metricName = null, string? category = null, int days = 30)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@MetricName", metricName);
                parameters.Add("@Category", category);
                parameters.Add("@Days", days);

                var statistics = await connection.QueryAsync<ClientStatisticDto>(
                    "sp_GetClientStatistics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return statistics;
            }
        }

        public async Task<IEnumerable<StatisticsSummaryDto>> GetStatisticsSummaryAsync(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);

                var summary = await connection.QueryAsync<StatisticsSummaryDto>(
                    "sp_GetStatisticsSummary",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return summary;
            }
        }

        // Usage Metrics
        public async Task<UsageMetricsDto> RecordUsageMetricsAsync(RecordUsageMetricsDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@ActiveUsers", dto.ActiveUsers);
                parameters.Add("@TotalRequests", dto.TotalRequests);
                parameters.Add("@DataTransferGB", dto.DataTransferGB);
                parameters.Add("@StorageUsedGB", dto.StorageUsedGB);
                parameters.Add("@ApiCalls", dto.ApiCalls);
                parameters.Add("@ErrorRate", dto.ErrorRate);
                parameters.Add("@AverageResponseTime", dto.AverageResponseTime);
                parameters.Add("@PeakConcurrentUsers", dto.PeakConcurrentUsers);

                var metrics = await connection.QueryFirstAsync<UsageMetricsDto>(
                    "sp_RecordUsageMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        public async Task<IEnumerable<UsageMetricsDto>> GetUsageMetricsAsync(int clientId, int days = 30)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@Days", days);

                var metrics = await connection.QueryAsync<UsageMetricsDto>(
                    "sp_GetUsageMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        public async Task<UsageMetricsDto?> GetLatestUsageMetricsAsync(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);

                var metrics = await connection.QueryFirstOrDefaultAsync<UsageMetricsDto>(
                    "sp_GetLatestUsageMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        // Performance Metrics
        public async Task<PerformanceMetricsDto> RecordPerformanceMetricsAsync(RecordPerformanceMetricsDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@AvailabilityPercent", dto.AvailabilityPercent);
                parameters.Add("@UptimeMinutes", dto.UptimeMinutes);
                parameters.Add("@DowntimeMinutes", dto.DowntimeMinutes);
                parameters.Add("@MeanTimeToRepair", dto.MeanTimeToRepair);
                parameters.Add("@IncidentCount", dto.IncidentCount);
                parameters.Add("@SuccessRate", dto.SuccessRate);
                parameters.Add("@PageLoadTime", dto.PageLoadTime);

                var metrics = await connection.QueryFirstAsync<PerformanceMetricsDto>(
                    "sp_RecordPerformanceMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        public async Task<IEnumerable<PerformanceMetricsDto>> GetPerformanceMetricsAsync(int clientId, int days = 30)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@Days", days);

                var metrics = await connection.QueryAsync<PerformanceMetricsDto>(
                    "sp_GetPerformanceMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        public async Task<PerformanceMetricsDto?> GetLatestPerformanceMetricsAsync(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);

                var metrics = await connection.QueryFirstOrDefaultAsync<PerformanceMetricsDto>(
                    "sp_GetLatestPerformanceMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        // Financial Metrics
        public async Task<FinancialMetricsDto> RecordFinancialMetricsAsync(RecordFinancialMetricsDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@MonthlyRevenue", dto.MonthlyRevenue);
                parameters.Add("@YearlyRevenue", dto.YearlyRevenue);
                parameters.Add("@ContractValue", dto.ContractValue);
                parameters.Add("@OutstandingBalance", dto.OutstandingBalance);
                parameters.Add("@SupportCosts", dto.SupportCosts);
                parameters.Add("@InfrastructureCosts", dto.InfrastructureCosts);
                parameters.Add("@ProfitMargin", dto.ProfitMargin);
                parameters.Add("@FiscalPeriod", dto.FiscalPeriod);

                var metrics = await connection.QueryFirstAsync<FinancialMetricsDto>(
                    "sp_RecordFinancialMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        public async Task<IEnumerable<FinancialMetricsDto>> GetFinancialMetricsAsync(int clientId, int months = 12)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@Months", months);

                var metrics = await connection.QueryAsync<FinancialMetricsDto>(
                    "sp_GetFinancialMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        public async Task<FinancialMetricsDto?> GetLatestFinancialMetricsAsync(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);

                var metrics = await connection.QueryFirstOrDefaultAsync<FinancialMetricsDto>(
                    "sp_GetLatestFinancialMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        // Custom Metrics
        public async Task<IEnumerable<CustomMetricDto>> GetCustomMetricsAsync(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);

                var metrics = await connection.QueryAsync<CustomMetricDto>(
                    "sp_GetCustomMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        public async Task<CustomMetricDto> CreateCustomMetricAsync(CreateCustomMetricDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@MetricName", dto.MetricName);
                parameters.Add("@MetricValue", dto.MetricValue);
                parameters.Add("@DataType", dto.DataType);
                parameters.Add("@DisplayOrder", dto.DisplayOrder);
                parameters.Add("@IsVisible", dto.IsVisible);

                var metric = await connection.QueryFirstAsync<CustomMetricDto>(
                    "sp_CreateCustomMetric",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metric;
            }
        }

        public async Task<CustomMetricDto?> UpdateCustomMetricAsync(UpdateCustomMetricDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@CustomMetricId", dto.CustomMetricId);
                parameters.Add("@MetricName", dto.MetricName);
                parameters.Add("@MetricValue", dto.MetricValue);
                parameters.Add("@DataType", dto.DataType);
                parameters.Add("@DisplayOrder", dto.DisplayOrder);
                parameters.Add("@IsVisible", dto.IsVisible);

                var metric = await connection.QueryFirstOrDefaultAsync<CustomMetricDto>(
                    "sp_UpdateCustomMetric",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metric;
            }
        }

        public async Task<bool> DeleteCustomMetricAsync(int customMetricId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@CustomMetricId", customMetricId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteCustomMetric",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }
    }
}

// =============================================
// CONTROLLERS
// =============================================

// File: Controllers/StatisticsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsRepository _statisticsRepository;

        public StatisticsController(IStatisticsRepository statisticsRepository)
        {
            _statisticsRepository = statisticsRepository;
        }

        // Client Statistics
        [HttpPost]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ClientStatisticDto>> RecordStatistic([FromBody] RecordStatisticDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var statistic = await _statisticsRepository.RecordStatisticAsync(dto);
            return Ok(statistic);
        }

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<ClientStatisticDto>>> GetStatistics(
            int clientId,
            [FromQuery] string? metricName = null,
            [FromQuery] string? category = null,
            [FromQuery] int days = 30)
        {
            var statistics = await _statisticsRepository.GetStatisticsAsync(clientId, metricName, category, days);
            return Ok(statistics);
        }

        [HttpGet("client/{clientId}/summary")]
        public async Task<ActionResult<IEnumerable<StatisticsSummaryDto>>> GetStatisticsSummary(int clientId)
        {
            var summary = await _statisticsRepository.GetStatisticsSummaryAsync(clientId);
            return Ok(summary);
        }

        // Usage Metrics
        [HttpPost("usage")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<UsageMetricsDto>> RecordUsageMetrics([FromBody] RecordUsageMetricsDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var metrics = await _statisticsRepository.RecordUsageMetricsAsync(dto);
            return Ok(metrics);
        }

        [HttpGet("usage/client/{clientId}")]
        public async Task<ActionResult<IEnumerable<UsageMetricsDto>>> GetUsageMetrics(
            int clientId,
            [FromQuery] int days = 30)
        {
            var metrics = await _statisticsRepository.GetUsageMetricsAsync(clientId, days);
            return Ok(metrics);
        }

        [HttpGet("usage/client/{clientId}/latest")]
        public async Task<ActionResult<UsageMetricsDto>> GetLatestUsageMetrics(int clientId)
        {
            var metrics = await _statisticsRepository.GetLatestUsageMetricsAsync(clientId);

            if (metrics == null)
            {
                return NotFound(new { message = $"No usage metrics found for client {clientId}" });
            }

            return Ok(metrics);
        }

        // Performance Metrics
        [HttpPost("performance")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<PerformanceMetricsDto>> RecordPerformanceMetrics([FromBody] RecordPerformanceMetricsDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var metrics = await _statisticsRepository.RecordPerformanceMetricsAsync(dto);
            return Ok(metrics);
        }

        [HttpGet("performance/client/{clientId}")]
        public async Task<ActionResult<IEnumerable<PerformanceMetricsDto>>> GetPerformanceMetrics(
            int clientId,
            [FromQuery] int days = 30)
        {
            var metrics = await _statisticsRepository.GetPerformanceMetricsAsync(clientId, days);
            return Ok(metrics);
        }

        [HttpGet("performance/client/{clientId}/latest")]
        public async Task<ActionResult<PerformanceMetricsDto>> GetLatestPerformanceMetrics(int clientId)
        {
            var metrics = await _statisticsRepository.GetLatestPerformanceMetricsAsync(clientId);

            if (metrics == null)
            {
                return NotFound(new { message = $"No performance metrics found for client {clientId}" });
            }

            return Ok(metrics);
        }

        // Financial Metrics
        [HttpPost("financial")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<FinancialMetricsDto>> RecordFinancialMetrics([FromBody] RecordFinancialMetricsDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var metrics = await _statisticsRepository.RecordFinancialMetricsAsync(dto);
            return Ok(metrics);
        }

        [HttpGet("financial/client/{clientId}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<IEnumerable<FinancialMetricsDto>>> GetFinancialMetrics(
            int clientId,
            [FromQuery] int months = 12)
        {
            var metrics = await _statisticsRepository.GetFinancialMetricsAsync(clientId, months);
            return Ok(metrics);
        }

        [HttpGet("financial/client/{clientId}/latest")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<FinancialMetricsDto>> GetLatestFinancialMetrics(int clientId)
        {
            var metrics = await _statisticsRepository.GetLatestFinancialMetricsAsync(clientId);

            if (metrics == null)
            {
                return NotFound(new { message = $"No financial metrics found for client {clientId}" });
            }

            return Ok(metrics);
        }

        // Custom Metrics
        [HttpGet("custom/client/{clientId}")]
        public async Task<ActionResult<IEnumerable<CustomMetricDto>>> GetCustomMetrics(int clientId)
        {
            var metrics = await _statisticsRepository.GetCustomMetricsAsync(clientId);
            return Ok(metrics);
        }

        [HttpPost("custom")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<CustomMetricDto>> CreateCustomMetric([FromBody] CreateCustomMetricDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var metric = await _statisticsRepository.CreateCustomMetricAsync(dto);
            return Ok(metric);
        }

        [HttpPut("custom/{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<CustomMetricDto>> UpdateCustomMetric(int id, [FromBody] UpdateCustomMetricDto dto)
        {
            if (id != dto.CustomMetricId)
            {
                return BadRequest(new { message = "Custom metric ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var metric = await _statisticsRepository.UpdateCustomMetricAsync(dto);

            if (metric == null)
            {
                return NotFound(new { message = $"Custom metric with ID {id} not found" });
            }

            return Ok(metric);
        }

        [HttpDelete("custom/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteCustomMetric(int id)
        {
            var success = await _statisticsRepository.DeleteCustomMetricAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Custom metric with ID {id} not found" });
            }

            return NoContent();
        }
    }
}

// =============================================
// Program.cs Updates
// =============================================

/*
Add this line to Program.cs:

// Register Phase 6 repositories
builder.Services.AddScoped<IStatisticsRepository, StatisticsRepository>();
*/
