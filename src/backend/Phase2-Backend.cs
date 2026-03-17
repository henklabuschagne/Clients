// =============================================
// Phase 2: Client Status & Health Monitoring
// Backend C# Code
// =============================================

// Copy these files to your .NET project as indicated

// =============================================
// STEP 2: DTOs
// =============================================

// File: Models/DTOs/ClientStatusDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ClientStatusDto
    {
        public int StatusId { get; set; }
        public int ClientId { get; set; }
        public string Health { get; set; } // "healthy", "warning", "critical"
        public decimal SlaUptime { get; set; }
        public decimal SlaTarget { get; set; }
        public string SlaStatus { get; set; } // "meeting", "at-risk", "breach"
        public DateTime LastChecked { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/UpsertClientStatusDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpsertClientStatusDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        public string Health { get; set; }
        
        [Required]
        [Range(0, 100)]
        public decimal SlaUptime { get; set; }
        
        [Required]
        [Range(0, 100)]
        public decimal SlaTarget { get; set; }
        
        [Required]
        public string SlaStatus { get; set; }
    }
}

// File: Models/DTOs/ClientIssueDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ClientIssueDto
    {
        public int IssueId { get; set; }
        public int ClientId { get; set; }
        public string Severity { get; set; } // "low", "medium", "high", "critical"
        public string Description { get; set; }
        public string Status { get; set; } // "open", "in-progress", "resolved", "closed"
        public DateTime ReportedDate { get; set; }
        public DateTime? ResolvedDate { get; set; }
        public string? ReportedBy { get; set; }
        public string? AssignedTo { get; set; }
        public string? Notes { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/CreateClientIssueDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateClientIssueDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        public string Severity { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; }
        
        [StringLength(100)]
        public string? ReportedBy { get; set; }
        
        [StringLength(100)]
        public string? AssignedTo { get; set; }
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/UpdateClientIssueDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateClientIssueDto
    {
        [Required]
        public int IssueId { get; set; }
        
        [Required]
        public string Severity { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        [StringLength(100)]
        public string? AssignedTo { get; set; }
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/StatusHistoryDto.cs
namespace ClientManagement.Models.DTOs
{
    public class StatusHistoryDto
    {
        public int HistoryId { get; set; }
        public int ClientId { get; set; }
        public string Health { get; set; }
        public decimal SlaUptime { get; set; }
        public DateTime RecordedDate { get; set; }
    }
}

// File: Models/DTOs/ClientStatusSummaryDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ClientStatusSummaryDto
    {
        public int StatusId { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string Health { get; set; }
        public decimal SlaUptime { get; set; }
        public decimal SlaTarget { get; set; }
        public string SlaStatus { get; set; }
        public DateTime LastChecked { get; set; }
        public int OpenIssuesCount { get; set; }
    }
}

// =============================================
// STEP 3: REPOSITORIES
// =============================================

// File: Repositories/IClientStatusRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IClientStatusRepository
    {
        Task<ClientStatusDto?> GetClientStatusAsync(int clientId);
        Task<ClientStatusDto> UpsertClientStatusAsync(UpsertClientStatusDto dto);
        Task<IEnumerable<ClientStatusSummaryDto>> GetAllClientStatusesAsync();
        Task<IEnumerable<StatusHistoryDto>> GetStatusHistoryAsync(int clientId, int days = 30);
    }
}

// File: Repositories/ClientStatusRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class ClientStatusRepository : IClientStatusRepository
    {
        private readonly string _connectionString;

        public ClientStatusRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<ClientStatusDto?> GetClientStatusAsync(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);

                var status = await connection.QueryFirstOrDefaultAsync<ClientStatusDto>(
                    "sp_GetClientStatus",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return status;
            }
        }

        public async Task<ClientStatusDto> UpsertClientStatusAsync(UpsertClientStatusDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@Health", dto.Health);
                parameters.Add("@SlaUptime", dto.SlaUptime);
                parameters.Add("@SlaTarget", dto.SlaTarget);
                parameters.Add("@SlaStatus", dto.SlaStatus);

                var status = await connection.QueryFirstAsync<ClientStatusDto>(
                    "sp_UpsertClientStatus",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return status;
            }
        }

        public async Task<IEnumerable<ClientStatusSummaryDto>> GetAllClientStatusesAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var statuses = await connection.QueryAsync<ClientStatusSummaryDto>(
                    "sp_GetAllClientStatuses",
                    commandType: CommandType.StoredProcedure
                );

                return statuses;
            }
        }

        public async Task<IEnumerable<StatusHistoryDto>> GetStatusHistoryAsync(int clientId, int days = 30)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@Days", days);

                var history = await connection.QueryAsync<StatusHistoryDto>(
                    "sp_GetStatusHistory",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return history;
            }
        }
    }
}

// File: Repositories/IClientIssueRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IClientIssueRepository
    {
        Task<IEnumerable<ClientIssueDto>> GetClientIssuesAsync(int clientId, bool includeArchived = false);
        Task<ClientIssueDto> CreateClientIssueAsync(CreateClientIssueDto dto);
        Task<ClientIssueDto?> UpdateClientIssueAsync(UpdateClientIssueDto dto);
        Task<bool> ArchiveClientIssueAsync(int issueId, bool isArchived);
        Task<bool> DeleteClientIssueAsync(int issueId);
    }
}

// File: Repositories/ClientIssueRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class ClientIssueRepository : IClientIssueRepository
    {
        private readonly string _connectionString;

        public ClientIssueRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<ClientIssueDto>> GetClientIssuesAsync(int clientId, bool includeArchived = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@IncludeArchived", includeArchived);

                var issues = await connection.QueryAsync<ClientIssueDto>(
                    "sp_GetClientIssues",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return issues;
            }
        }

        public async Task<ClientIssueDto> CreateClientIssueAsync(CreateClientIssueDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@Severity", dto.Severity);
                parameters.Add("@Description", dto.Description);
                parameters.Add("@ReportedBy", dto.ReportedBy);
                parameters.Add("@AssignedTo", dto.AssignedTo);
                parameters.Add("@Notes", dto.Notes);

                var issue = await connection.QueryFirstAsync<ClientIssueDto>(
                    "sp_CreateClientIssue",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return issue;
            }
        }

        public async Task<ClientIssueDto?> UpdateClientIssueAsync(UpdateClientIssueDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@IssueId", dto.IssueId);
                parameters.Add("@Severity", dto.Severity);
                parameters.Add("@Description", dto.Description);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@AssignedTo", dto.AssignedTo);
                parameters.Add("@Notes", dto.Notes);

                var issue = await connection.QueryFirstOrDefaultAsync<ClientIssueDto>(
                    "sp_UpdateClientIssue",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return issue;
            }
        }

        public async Task<bool> ArchiveClientIssueAsync(int issueId, bool isArchived)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@IssueId", issueId);
                parameters.Add("@IsArchived", isArchived);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_ArchiveClientIssue",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<bool> DeleteClientIssueAsync(int issueId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@IssueId", issueId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteClientIssue",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }
    }
}

// =============================================
// STEP 4: CONTROLLERS
// =============================================

// File: Controllers/ClientStatusController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientStatusController : ControllerBase
    {
        private readonly IClientStatusRepository _statusRepository;

        public ClientStatusController(IClientStatusRepository statusRepository)
        {
            _statusRepository = statusRepository;
        }

        [HttpGet("{clientId}")]
        public async Task<ActionResult<ClientStatusDto>> GetClientStatus(int clientId)
        {
            var status = await _statusRepository.GetClientStatusAsync(clientId);
            
            if (status == null)
            {
                return NotFound(new { message = $"Status for client {clientId} not found" });
            }

            return Ok(status);
        }

        [HttpPost]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ClientStatusDto>> UpsertClientStatus([FromBody] UpsertClientStatusDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var status = await _statusRepository.UpsertClientStatusAsync(dto);
            return Ok(status);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientStatusSummaryDto>>> GetAllClientStatuses()
        {
            var statuses = await _statusRepository.GetAllClientStatusesAsync();
            return Ok(statuses);
        }

        [HttpGet("{clientId}/history")]
        public async Task<ActionResult<IEnumerable<StatusHistoryDto>>> GetStatusHistory(int clientId, [FromQuery] int days = 30)
        {
            var history = await _statusRepository.GetStatusHistoryAsync(clientId, days);
            return Ok(history);
        }
    }
}

// File: Controllers/ClientIssuesController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientIssuesController : ControllerBase
    {
        private readonly IClientIssueRepository _issueRepository;

        public ClientIssuesController(IClientIssueRepository issueRepository)
        {
            _issueRepository = issueRepository;
        }

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<ClientIssueDto>>> GetClientIssues(
            int clientId, 
            [FromQuery] bool includeArchived = false)
        {
            var issues = await _issueRepository.GetClientIssuesAsync(clientId, includeArchived);
            return Ok(issues);
        }

        [HttpPost]
        [Authorize(Roles = "admin,devops,delivery")]
        public async Task<ActionResult<ClientIssueDto>> CreateClientIssue([FromBody] CreateClientIssueDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var issue = await _issueRepository.CreateClientIssueAsync(dto);
            return CreatedAtAction(nameof(GetClientIssues), new { clientId = issue.ClientId }, issue);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,devops,delivery")]
        public async Task<ActionResult<ClientIssueDto>> UpdateClientIssue(int id, [FromBody] UpdateClientIssueDto dto)
        {
            if (id != dto.IssueId)
            {
                return BadRequest(new { message = "Issue ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var issue = await _issueRepository.UpdateClientIssueAsync(dto);
            
            if (issue == null)
            {
                return NotFound(new { message = $"Issue with ID {id} not found" });
            }

            return Ok(issue);
        }

        [HttpPatch("{id}/archive")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> ArchiveClientIssue(int id, [FromBody] bool isArchived)
        {
            var success = await _issueRepository.ArchiveClientIssueAsync(id, isArchived);
            
            if (!success)
            {
                return NotFound(new { message = $"Issue with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteClientIssue(int id)
        {
            var success = await _issueRepository.DeleteClientIssueAsync(id);
            
            if (!success)
            {
                return NotFound(new { message = $"Issue with ID {id} not found" });
            }

            return NoContent();
        }
    }
}

// =============================================
// STEP 5: UPDATE Program.cs
// =============================================

/*
Add these lines to your Program.cs in the service registration section:

// Register Phase 2 repositories
builder.Services.AddScoped<IClientStatusRepository, ClientStatusRepository>();
builder.Services.AddScoped<IClientIssueRepository, ClientIssueRepository>();

*/
