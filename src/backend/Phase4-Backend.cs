// =============================================
// Phase 4: Server & Infrastructure Management
// Backend C# Code
// =============================================

// =============================================
// DTOs
// =============================================

// File: Models/DTOs/ServerDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ServerDto
    {
        public int ServerId { get; set; }
        public int ClientId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Environment { get; set; }
        public string? OperatingSystem { get; set; }
        public string? IpAddress { get; set; }
        public string? Hostname { get; set; }
        public string? Location { get; set; }
        public string? Provider { get; set; }
        public string Status { get; set; }
        public string? Notes { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        
        // Specs (from join)
        public int? CpuCores { get; set; }
        public string? CpuModel { get; set; }
        public int? RamGb { get; set; }
        public int? StorageGb { get; set; }
        public string? StorageType { get; set; }
        public string? Bandwidth { get; set; }
    }
}

// File: Models/DTOs/CreateServerDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateServerDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [Required]
        public string Type { get; set; }
        
        [Required]
        public string Environment { get; set; }
        
        [StringLength(100)]
        public string? OperatingSystem { get; set; }
        
        [StringLength(50)]
        public string? IpAddress { get; set; }
        
        [StringLength(255)]
        public string? Hostname { get; set; }
        
        [StringLength(255)]
        public string? Location { get; set; }
        
        [StringLength(100)]
        public string? Provider { get; set; }
        
        public string Status { get; set; } = "active";
        
        public string? Notes { get; set; }
        
        // Specs
        public int? CpuCores { get; set; }
        public string? CpuModel { get; set; }
        public int? RamGb { get; set; }
        public int? StorageGb { get; set; }
        public string? StorageType { get; set; }
        public string? Bandwidth { get; set; }
    }
}

// File: Models/DTOs/UpdateServerDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateServerDto
    {
        [Required]
        public int ServerId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [Required]
        public string Type { get; set; }
        
        [Required]
        public string Environment { get; set; }
        
        [StringLength(100)]
        public string? OperatingSystem { get; set; }
        
        [StringLength(50)]
        public string? IpAddress { get; set; }
        
        [StringLength(255)]
        public string? Hostname { get; set; }
        
        [StringLength(255)]
        public string? Location { get; set; }
        
        [StringLength(100)]
        public string? Provider { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        public string? Notes { get; set; }
        
        // Specs
        public int? CpuCores { get; set; }
        public string? CpuModel { get; set; }
        public int? RamGb { get; set; }
        public int? StorageGb { get; set; }
        public string? StorageType { get; set; }
        public string? Bandwidth { get; set; }
    }
}

// File: Models/DTOs/ServerMetricsDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ServerMetricsDto
    {
        public int MetricId { get; set; }
        public int ServerId { get; set; }
        public decimal? CpuUsage { get; set; }
        public decimal? MemoryUsage { get; set; }
        public decimal? DiskUsage { get; set; }
        public decimal? NetworkIn { get; set; }
        public decimal? NetworkOut { get; set; }
        public int? Uptime { get; set; }
        public DateTime RecordedDate { get; set; }
    }
}

// File: Models/DTOs/RecordServerMetricsDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class RecordServerMetricsDto
    {
        [Required]
        public int ServerId { get; set; }
        
        public decimal? CpuUsage { get; set; }
        public decimal? MemoryUsage { get; set; }
        public decimal? DiskUsage { get; set; }
        public decimal? NetworkIn { get; set; }
        public decimal? NetworkOut { get; set; }
        public int? Uptime { get; set; }
    }
}

// File: Models/DTOs/ServerSoftwareDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ServerSoftwareDto
    {
        public int SoftwareId { get; set; }
        public int ServerId { get; set; }
        public string Name { get; set; }
        public string? Version { get; set; }
        public string? Type { get; set; }
        public DateTime? InstallDate { get; set; }
        public string? LicenseKey { get; set; }
        public string? Notes { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/CreateServerSoftwareDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateServerSoftwareDto
    {
        [Required]
        public int ServerId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [StringLength(100)]
        public string? Version { get; set; }
        
        public string? Type { get; set; }
        
        public DateTime? InstallDate { get; set; }
        
        [StringLength(500)]
        public string? LicenseKey { get; set; }
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/UpdateServerSoftwareDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateServerSoftwareDto
    {
        [Required]
        public int SoftwareId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [StringLength(100)]
        public string? Version { get; set; }
        
        public string? Type { get; set; }
        
        public DateTime? InstallDate { get; set; }
        
        [StringLength(500)]
        public string? LicenseKey { get; set; }
        
        public string? Notes { get; set; }
    }
}

// =============================================
// REPOSITORIES
// =============================================

// File: Repositories/IServerRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IServerRepository
    {
        Task<IEnumerable<ServerDto>> GetServersAsync(int clientId, bool includeArchived = false);
        Task<ServerDto?> GetServerByIdAsync(int serverId);
        Task<ServerDto> CreateServerAsync(CreateServerDto dto);
        Task<ServerDto?> UpdateServerAsync(UpdateServerDto dto);
        Task<bool> ArchiveServerAsync(int serverId, bool isArchived);
        Task<bool> DeleteServerAsync(int serverId);
        
        // Metrics
        Task<IEnumerable<ServerMetricsDto>> GetServerMetricsAsync(int serverId, int hours = 24);
        Task<ServerMetricsDto?> GetLatestServerMetricsAsync(int serverId);
        Task<bool> RecordServerMetricsAsync(RecordServerMetricsDto dto);
        
        // Software
        Task<IEnumerable<ServerSoftwareDto>> GetServerSoftwareAsync(int serverId, bool includeArchived = false);
        Task<ServerSoftwareDto> CreateServerSoftwareAsync(CreateServerSoftwareDto dto);
        Task<ServerSoftwareDto?> UpdateServerSoftwareAsync(UpdateServerSoftwareDto dto);
        Task<bool> ArchiveServerSoftwareAsync(int softwareId, bool isArchived);
        Task<bool> DeleteServerSoftwareAsync(int softwareId);
    }
}

// File: Repositories/ServerRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class ServerRepository : IServerRepository
    {
        private readonly string _connectionString;

        public ServerRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<ServerDto>> GetServersAsync(int clientId, bool includeArchived = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@IncludeArchived", includeArchived);

                var servers = await connection.QueryAsync<ServerDto>(
                    "sp_GetServers",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return servers;
            }
        }

        public async Task<ServerDto?> GetServerByIdAsync(int serverId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ServerId", serverId);

                var server = await connection.QueryFirstOrDefaultAsync<ServerDto>(
                    "sp_GetServerById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return server;
            }
        }

        public async Task<ServerDto> CreateServerAsync(CreateServerDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Type", dto.Type);
                parameters.Add("@Environment", dto.Environment);
                parameters.Add("@OperatingSystem", dto.OperatingSystem);
                parameters.Add("@IpAddress", dto.IpAddress);
                parameters.Add("@Hostname", dto.Hostname);
                parameters.Add("@Location", dto.Location);
                parameters.Add("@Provider", dto.Provider);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Notes", dto.Notes);
                parameters.Add("@CpuCores", dto.CpuCores);
                parameters.Add("@CpuModel", dto.CpuModel);
                parameters.Add("@RamGb", dto.RamGb);
                parameters.Add("@StorageGb", dto.StorageGb);
                parameters.Add("@StorageType", dto.StorageType);
                parameters.Add("@Bandwidth", dto.Bandwidth);

                var server = await connection.QueryFirstAsync<ServerDto>(
                    "sp_CreateServer",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return server;
            }
        }

        public async Task<ServerDto?> UpdateServerAsync(UpdateServerDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ServerId", dto.ServerId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Type", dto.Type);
                parameters.Add("@Environment", dto.Environment);
                parameters.Add("@OperatingSystem", dto.OperatingSystem);
                parameters.Add("@IpAddress", dto.IpAddress);
                parameters.Add("@Hostname", dto.Hostname);
                parameters.Add("@Location", dto.Location);
                parameters.Add("@Provider", dto.Provider);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Notes", dto.Notes);
                parameters.Add("@CpuCores", dto.CpuCores);
                parameters.Add("@CpuModel", dto.CpuModel);
                parameters.Add("@RamGb", dto.RamGb);
                parameters.Add("@StorageGb", dto.StorageGb);
                parameters.Add("@StorageType", dto.StorageType);
                parameters.Add("@Bandwidth", dto.Bandwidth);

                var server = await connection.QueryFirstOrDefaultAsync<ServerDto>(
                    "sp_UpdateServer",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return server;
            }
        }

        public async Task<bool> ArchiveServerAsync(int serverId, bool isArchived)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ServerId", serverId);
                parameters.Add("@IsArchived", isArchived);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_ArchiveServer",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<bool> DeleteServerAsync(int serverId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ServerId", serverId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteServer",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<IEnumerable<ServerMetricsDto>> GetServerMetricsAsync(int serverId, int hours = 24)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ServerId", serverId);
                parameters.Add("@Hours", hours);

                var metrics = await connection.QueryAsync<ServerMetricsDto>(
                    "sp_GetServerMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        public async Task<ServerMetricsDto?> GetLatestServerMetricsAsync(int serverId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ServerId", serverId);

                var metrics = await connection.QueryFirstOrDefaultAsync<ServerMetricsDto>(
                    "sp_GetLatestServerMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return metrics;
            }
        }

        public async Task<bool> RecordServerMetricsAsync(RecordServerMetricsDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ServerId", dto.ServerId);
                parameters.Add("@CpuUsage", dto.CpuUsage);
                parameters.Add("@MemoryUsage", dto.MemoryUsage);
                parameters.Add("@DiskUsage", dto.DiskUsage);
                parameters.Add("@NetworkIn", dto.NetworkIn);
                parameters.Add("@NetworkOut", dto.NetworkOut);
                parameters.Add("@Uptime", dto.Uptime);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_RecordServerMetrics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<IEnumerable<ServerSoftwareDto>> GetServerSoftwareAsync(int serverId, bool includeArchived = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ServerId", serverId);
                parameters.Add("@IncludeArchived", includeArchived);

                var software = await connection.QueryAsync<ServerSoftwareDto>(
                    "sp_GetServerSoftware",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return software;
            }
        }

        public async Task<ServerSoftwareDto> CreateServerSoftwareAsync(CreateServerSoftwareDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ServerId", dto.ServerId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Version", dto.Version);
                parameters.Add("@Type", dto.Type);
                parameters.Add("@InstallDate", dto.InstallDate);
                parameters.Add("@LicenseKey", dto.LicenseKey);
                parameters.Add("@Notes", dto.Notes);

                var software = await connection.QueryFirstAsync<ServerSoftwareDto>(
                    "sp_CreateServerSoftware",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return software;
            }
        }

        public async Task<ServerSoftwareDto?> UpdateServerSoftwareAsync(UpdateServerSoftwareDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@SoftwareId", dto.SoftwareId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Version", dto.Version);
                parameters.Add("@Type", dto.Type);
                parameters.Add("@InstallDate", dto.InstallDate);
                parameters.Add("@LicenseKey", dto.LicenseKey);
                parameters.Add("@Notes", dto.Notes);

                var software = await connection.QueryFirstOrDefaultAsync<ServerSoftwareDto>(
                    "sp_UpdateServerSoftware",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return software;
            }
        }

        public async Task<bool> ArchiveServerSoftwareAsync(int softwareId, bool isArchived)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@SoftwareId", softwareId);
                parameters.Add("@IsArchived", isArchived);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_ArchiveServerSoftware",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<bool> DeleteServerSoftwareAsync(int softwareId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@SoftwareId", softwareId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteServerSoftware",
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

// File: Controllers/ServersController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServersController : ControllerBase
    {
        private readonly IServerRepository _serverRepository;

        public ServersController(IServerRepository serverRepository)
        {
            _serverRepository = serverRepository;
        }

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<ServerDto>>> GetServers(
            int clientId,
            [FromQuery] bool includeArchived = false)
        {
            var servers = await _serverRepository.GetServersAsync(clientId, includeArchived);
            return Ok(servers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServerDto>> GetServerById(int id)
        {
            var server = await _serverRepository.GetServerByIdAsync(id);

            if (server == null)
            {
                return NotFound(new { message = $"Server with ID {id} not found" });
            }

            return Ok(server);
        }

        [HttpPost]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ServerDto>> CreateServer([FromBody] CreateServerDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var server = await _serverRepository.CreateServerAsync(dto);
            return CreatedAtAction(nameof(GetServerById), new { id = server.ServerId }, server);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ServerDto>> UpdateServer(int id, [FromBody] UpdateServerDto dto)
        {
            if (id != dto.ServerId)
            {
                return BadRequest(new { message = "Server ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var server = await _serverRepository.UpdateServerAsync(dto);

            if (server == null)
            {
                return NotFound(new { message = $"Server with ID {id} not found" });
            }

            return Ok(server);
        }

        [HttpPatch("{id}/archive")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> ArchiveServer(int id, [FromBody] bool isArchived)
        {
            var success = await _serverRepository.ArchiveServerAsync(id, isArchived);

            if (!success)
            {
                return NotFound(new { message = $"Server with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteServer(int id)
        {
            var success = await _serverRepository.DeleteServerAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Server with ID {id} not found" });
            }

            return NoContent();
        }

        // Metrics endpoints
        [HttpGet("{id}/metrics")]
        public async Task<ActionResult<IEnumerable<ServerMetricsDto>>> GetServerMetrics(
            int id,
            [FromQuery] int hours = 24)
        {
            var metrics = await _serverRepository.GetServerMetricsAsync(id, hours);
            return Ok(metrics);
        }

        [HttpGet("{id}/metrics/latest")]
        public async Task<ActionResult<ServerMetricsDto>> GetLatestServerMetrics(int id)
        {
            var metrics = await _serverRepository.GetLatestServerMetricsAsync(id);

            if (metrics == null)
            {
                return NotFound(new { message = $"No metrics found for server {id}" });
            }

            return Ok(metrics);
        }

        [HttpPost("metrics")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> RecordServerMetrics([FromBody] RecordServerMetricsDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _serverRepository.RecordServerMetricsAsync(dto);

            if (!success)
            {
                return BadRequest(new { message = "Failed to record server metrics" });
            }

            return Ok(new { message = "Server metrics recorded successfully" });
        }

        // Software endpoints
        [HttpGet("{id}/software")]
        public async Task<ActionResult<IEnumerable<ServerSoftwareDto>>> GetServerSoftware(
            int id,
            [FromQuery] bool includeArchived = false)
        {
            var software = await _serverRepository.GetServerSoftwareAsync(id, includeArchived);
            return Ok(software);
        }

        [HttpPost("software")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ServerSoftwareDto>> CreateServerSoftware([FromBody] CreateServerSoftwareDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var software = await _serverRepository.CreateServerSoftwareAsync(dto);
            return Ok(software);
        }

        [HttpPut("software/{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ServerSoftwareDto>> UpdateServerSoftware(int id, [FromBody] UpdateServerSoftwareDto dto)
        {
            if (id != dto.SoftwareId)
            {
                return BadRequest(new { message = "Software ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var software = await _serverRepository.UpdateServerSoftwareAsync(dto);

            if (software == null)
            {
                return NotFound(new { message = $"Software with ID {id} not found" });
            }

            return Ok(software);
        }

        [HttpPatch("software/{id}/archive")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> ArchiveServerSoftware(int id, [FromBody] bool isArchived)
        {
            var success = await _serverRepository.ArchiveServerSoftwareAsync(id, isArchived);

            if (!success)
            {
                return NotFound(new { message = $"Software with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpDelete("software/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteServerSoftware(int id)
        {
            var success = await _serverRepository.DeleteServerSoftwareAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Software with ID {id} not found" });
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

// Register Phase 4 repositories
builder.Services.AddScoped<IServerRepository, ServerRepository>();
*/
