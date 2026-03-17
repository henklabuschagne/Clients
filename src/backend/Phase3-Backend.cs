// =============================================
// Phase 3: VPN & Connection Management
// Backend C# Code
// =============================================

// =============================================
// DTOs - Models/DTOs/
// =============================================

// File: Models/DTOs/VPNConfigurationDto.cs
namespace ClientManagement.Models.DTOs
{
    public class VPNConfigurationDto
    {
        public int VpnId { get; set; }
        public int ClientId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Server { get; set; }
        public int Port { get; set; }
        public string? Protocol { get; set; }
        public string? Username { get; set; }
        public string? ConfigPath { get; set; }
        public string Status { get; set; }
        public string? Notes { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/CreateVPNConfigurationDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateVPNConfigurationDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [Required]
        public string Type { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Server { get; set; }
        
        [Required]
        public int Port { get; set; }
        
        [StringLength(20)]
        public string? Protocol { get; set; }
        
        [StringLength(255)]
        public string? Username { get; set; }
        
        [StringLength(500)]
        public string? ConfigPath { get; set; }
        
        public string Status { get; set; } = "active";
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/UpdateVPNConfigurationDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateVPNConfigurationDto
    {
        [Required]
        public int VpnId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [Required]
        public string Type { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Server { get; set; }
        
        [Required]
        public int Port { get; set; }
        
        [StringLength(20)]
        public string? Protocol { get; set; }
        
        [StringLength(255)]
        public string? Username { get; set; }
        
        [StringLength(500)]
        public string? ConfigPath { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/ConnectionDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ConnectionDto
    {
        public int ConnectionId { get; set; }
        public int ClientId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Host { get; set; }
        public int? Port { get; set; }
        public string? Database { get; set; }
        public string? Username { get; set; }
        public string? AuthMethod { get; set; }
        public string? ConnectionString { get; set; }
        public string Status { get; set; }
        public DateTime? LastTested { get; set; }
        public string? TestResult { get; set; }
        public string? Notes { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/CreateConnectionDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateConnectionDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [Required]
        public string Type { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Host { get; set; }
        
        public int? Port { get; set; }
        
        [StringLength(255)]
        public string? Database { get; set; }
        
        [StringLength(255)]
        public string? Username { get; set; }
        
        [StringLength(50)]
        public string? AuthMethod { get; set; }
        
        public string? ConnectionString { get; set; }
        
        public string Status { get; set; } = "active";
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/UpdateConnectionDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateConnectionDto
    {
        [Required]
        public int ConnectionId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [Required]
        public string Type { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Host { get; set; }
        
        public int? Port { get; set; }
        
        [StringLength(255)]
        public string? Database { get; set; }
        
        [StringLength(255)]
        public string? Username { get; set; }
        
        [StringLength(50)]
        public string? AuthMethod { get; set; }
        
        public string? ConnectionString { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/TestConnectionDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class TestConnectionDto
    {
        [Required]
        public int ConnectionId { get; set; }
        
        [Required]
        public string Result { get; set; } // success, failed, pending
        
        public int? ResponseTime { get; set; }
        
        [StringLength(500)]
        public string? ErrorMessage { get; set; }
        
        [StringLength(100)]
        public string? TestedBy { get; set; }
    }
}

// File: Models/DTOs/ConnectionTestHistoryDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ConnectionTestHistoryDto
    {
        public int TestId { get; set; }
        public int ConnectionId { get; set; }
        public DateTime TestDate { get; set; }
        public string Result { get; set; }
        public int? ResponseTime { get; set; }
        public string? ErrorMessage { get; set; }
        public string? TestedBy { get; set; }
    }
}

// =============================================
// REPOSITORIES
// =============================================

// File: Repositories/IVPNRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IVPNRepository
    {
        Task<IEnumerable<VPNConfigurationDto>> GetVPNConfigurationsAsync(int clientId, bool includeArchived = false);
        Task<VPNConfigurationDto?> GetVPNConfigurationByIdAsync(int vpnId);
        Task<VPNConfigurationDto> CreateVPNConfigurationAsync(CreateVPNConfigurationDto dto);
        Task<VPNConfigurationDto?> UpdateVPNConfigurationAsync(UpdateVPNConfigurationDto dto);
        Task<bool> ArchiveVPNConfigurationAsync(int vpnId, bool isArchived);
        Task<bool> DeleteVPNConfigurationAsync(int vpnId);
    }
}

// File: Repositories/VPNRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class VPNRepository : IVPNRepository
    {
        private readonly string _connectionString;

        public VPNRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<VPNConfigurationDto>> GetVPNConfigurationsAsync(int clientId, bool includeArchived = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@IncludeArchived", includeArchived);

                var vpns = await connection.QueryAsync<VPNConfigurationDto>(
                    "sp_GetVPNConfigurations",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return vpns;
            }
        }

        public async Task<VPNConfigurationDto?> GetVPNConfigurationByIdAsync(int vpnId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@VpnId", vpnId);

                var vpn = await connection.QueryFirstOrDefaultAsync<VPNConfigurationDto>(
                    "sp_GetVPNConfigurationById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return vpn;
            }
        }

        public async Task<VPNConfigurationDto> CreateVPNConfigurationAsync(CreateVPNConfigurationDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Type", dto.Type);
                parameters.Add("@Server", dto.Server);
                parameters.Add("@Port", dto.Port);
                parameters.Add("@Protocol", dto.Protocol);
                parameters.Add("@Username", dto.Username);
                parameters.Add("@ConfigPath", dto.ConfigPath);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Notes", dto.Notes);

                var vpn = await connection.QueryFirstAsync<VPNConfigurationDto>(
                    "sp_CreateVPNConfiguration",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return vpn;
            }
        }

        public async Task<VPNConfigurationDto?> UpdateVPNConfigurationAsync(UpdateVPNConfigurationDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@VpnId", dto.VpnId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Type", dto.Type);
                parameters.Add("@Server", dto.Server);
                parameters.Add("@Port", dto.Port);
                parameters.Add("@Protocol", dto.Protocol);
                parameters.Add("@Username", dto.Username);
                parameters.Add("@ConfigPath", dto.ConfigPath);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Notes", dto.Notes);

                var vpn = await connection.QueryFirstOrDefaultAsync<VPNConfigurationDto>(
                    "sp_UpdateVPNConfiguration",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return vpn;
            }
        }

        public async Task<bool> ArchiveVPNConfigurationAsync(int vpnId, bool isArchived)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@VpnId", vpnId);
                parameters.Add("@IsArchived", isArchived);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_ArchiveVPNConfiguration",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<bool> DeleteVPNConfigurationAsync(int vpnId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@VpnId", vpnId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteVPNConfiguration",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }
    }
}

// File: Repositories/IConnectionRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IConnectionRepository
    {
        Task<IEnumerable<ConnectionDto>> GetConnectionsAsync(int clientId, bool includeArchived = false);
        Task<ConnectionDto?> GetConnectionByIdAsync(int connectionId);
        Task<ConnectionDto> CreateConnectionAsync(CreateConnectionDto dto);
        Task<ConnectionDto?> UpdateConnectionAsync(UpdateConnectionDto dto);
        Task<bool> TestConnectionAsync(TestConnectionDto dto);
        Task<IEnumerable<ConnectionTestHistoryDto>> GetConnectionTestHistoryAsync(int connectionId, int limit = 20);
        Task<bool> ArchiveConnectionAsync(int connectionId, bool isArchived);
        Task<bool> DeleteConnectionAsync(int connectionId);
    }
}

// File: Repositories/ConnectionRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class ConnectionRepository : IConnectionRepository
    {
        private readonly string _connectionString;

        public ConnectionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<ConnectionDto>> GetConnectionsAsync(int clientId, bool includeArchived = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@IncludeArchived", includeArchived);

                var connections = await connection.QueryAsync<ConnectionDto>(
                    "sp_GetConnections",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return connections;
            }
        }

        public async Task<ConnectionDto?> GetConnectionByIdAsync(int connectionId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ConnectionId", connectionId);

                var conn = await connection.QueryFirstOrDefaultAsync<ConnectionDto>(
                    "sp_GetConnectionById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return conn;
            }
        }

        public async Task<ConnectionDto> CreateConnectionAsync(CreateConnectionDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Type", dto.Type);
                parameters.Add("@Host", dto.Host);
                parameters.Add("@Port", dto.Port);
                parameters.Add("@Database", dto.Database);
                parameters.Add("@Username", dto.Username);
                parameters.Add("@AuthMethod", dto.AuthMethod);
                parameters.Add("@ConnectionString", dto.ConnectionString);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Notes", dto.Notes);

                var conn = await connection.QueryFirstAsync<ConnectionDto>(
                    "sp_CreateConnection",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return conn;
            }
        }

        public async Task<ConnectionDto?> UpdateConnectionAsync(UpdateConnectionDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ConnectionId", dto.ConnectionId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Type", dto.Type);
                parameters.Add("@Host", dto.Host);
                parameters.Add("@Port", dto.Port);
                parameters.Add("@Database", dto.Database);
                parameters.Add("@Username", dto.Username);
                parameters.Add("@AuthMethod", dto.AuthMethod);
                parameters.Add("@ConnectionString", dto.ConnectionString);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Notes", dto.Notes);

                var conn = await connection.QueryFirstOrDefaultAsync<ConnectionDto>(
                    "sp_UpdateConnection",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return conn;
            }
        }

        public async Task<bool> TestConnectionAsync(TestConnectionDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ConnectionId", dto.ConnectionId);
                parameters.Add("@Result", dto.Result);
                parameters.Add("@ResponseTime", dto.ResponseTime);
                parameters.Add("@ErrorMessage", dto.ErrorMessage);
                parameters.Add("@TestedBy", dto.TestedBy);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_TestConnection",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<IEnumerable<ConnectionTestHistoryDto>> GetConnectionTestHistoryAsync(int connectionId, int limit = 20)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ConnectionId", connectionId);
                parameters.Add("@Limit", limit);

                var history = await connection.QueryAsync<ConnectionTestHistoryDto>(
                    "sp_GetConnectionTestHistory",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return history;
            }
        }

        public async Task<bool> ArchiveConnectionAsync(int connectionId, bool isArchived)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ConnectionId", connectionId);
                parameters.Add("@IsArchived", isArchived);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_ArchiveConnection",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<bool> DeleteConnectionAsync(int connectionId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ConnectionId", connectionId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteConnection",
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

// File: Controllers/VPNController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VPNController : ControllerBase
    {
        private readonly IVPNRepository _vpnRepository;

        public VPNController(IVPNRepository vpnRepository)
        {
            _vpnRepository = vpnRepository;
        }

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<VPNConfigurationDto>>> GetVPNConfigurations(
            int clientId,
            [FromQuery] bool includeArchived = false)
        {
            var vpns = await _vpnRepository.GetVPNConfigurationsAsync(clientId, includeArchived);
            return Ok(vpns);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VPNConfigurationDto>> GetVPNConfigurationById(int id)
        {
            var vpn = await _vpnRepository.GetVPNConfigurationByIdAsync(id);

            if (vpn == null)
            {
                return NotFound(new { message = $"VPN configuration with ID {id} not found" });
            }

            return Ok(vpn);
        }

        [HttpPost]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<VPNConfigurationDto>> CreateVPNConfiguration([FromBody] CreateVPNConfigurationDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vpn = await _vpnRepository.CreateVPNConfigurationAsync(dto);
            return CreatedAtAction(nameof(GetVPNConfigurationById), new { id = vpn.VpnId }, vpn);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<VPNConfigurationDto>> UpdateVPNConfiguration(int id, [FromBody] UpdateVPNConfigurationDto dto)
        {
            if (id != dto.VpnId)
            {
                return BadRequest(new { message = "VPN ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vpn = await _vpnRepository.UpdateVPNConfigurationAsync(dto);

            if (vpn == null)
            {
                return NotFound(new { message = $"VPN configuration with ID {id} not found" });
            }

            return Ok(vpn);
        }

        [HttpPatch("{id}/archive")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> ArchiveVPNConfiguration(int id, [FromBody] bool isArchived)
        {
            var success = await _vpnRepository.ArchiveVPNConfigurationAsync(id, isArchived);

            if (!success)
            {
                return NotFound(new { message = $"VPN configuration with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteVPNConfiguration(int id)
        {
            var success = await _vpnRepository.DeleteVPNConfigurationAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"VPN configuration with ID {id} not found" });
            }

            return NoContent();
        }
    }
}

// File: Controllers/ConnectionsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConnectionsController : ControllerBase
    {
        private readonly IConnectionRepository _connectionRepository;

        public ConnectionsController(IConnectionRepository connectionRepository)
        {
            _connectionRepository = connectionRepository;
        }

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<ConnectionDto>>> GetConnections(
            int clientId,
            [FromQuery] bool includeArchived = false)
        {
            var connections = await _connectionRepository.GetConnectionsAsync(clientId, includeArchived);
            return Ok(connections);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConnectionDto>> GetConnectionById(int id)
        {
            var connection = await _connectionRepository.GetConnectionByIdAsync(id);

            if (connection == null)
            {
                return NotFound(new { message = $"Connection with ID {id} not found" });
            }

            return Ok(connection);
        }

        [HttpPost]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ConnectionDto>> CreateConnection([FromBody] CreateConnectionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var connection = await _connectionRepository.CreateConnectionAsync(dto);
            return CreatedAtAction(nameof(GetConnectionById), new { id = connection.ConnectionId }, connection);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ConnectionDto>> UpdateConnection(int id, [FromBody] UpdateConnectionDto dto)
        {
            if (id != dto.ConnectionId)
            {
                return BadRequest(new { message = "Connection ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var connection = await _connectionRepository.UpdateConnectionAsync(dto);

            if (connection == null)
            {
                return NotFound(new { message = $"Connection with ID {id} not found" });
            }

            return Ok(connection);
        }

        [HttpPost("test")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> TestConnection([FromBody] TestConnectionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _connectionRepository.TestConnectionAsync(dto);

            if (!success)
            {
                return BadRequest(new { message = "Failed to record connection test" });
            }

            return Ok(new { message = "Connection test recorded successfully" });
        }

        [HttpGet("{id}/history")]
        public async Task<ActionResult<IEnumerable<ConnectionTestHistoryDto>>> GetConnectionTestHistory(
            int id,
            [FromQuery] int limit = 20)
        {
            var history = await _connectionRepository.GetConnectionTestHistoryAsync(id, limit);
            return Ok(history);
        }

        [HttpPatch("{id}/archive")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> ArchiveConnection(int id, [FromBody] bool isArchived)
        {
            var success = await _connectionRepository.ArchiveConnectionAsync(id, isArchived);

            if (!success)
            {
                return NotFound(new { message = $"Connection with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteConnection(int id)
        {
            var success = await _connectionRepository.DeleteConnectionAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Connection with ID {id} not found" });
            }

            return NoContent();
        }
    }
}

// =============================================
// Program.cs Updates
// =============================================

/*
Add these lines to Program.cs:

// Register Phase 3 repositories
builder.Services.AddScoped<IVPNRepository, VPNRepository>();
builder.Services.AddScoped<IConnectionRepository, ConnectionRepository>();
*/
