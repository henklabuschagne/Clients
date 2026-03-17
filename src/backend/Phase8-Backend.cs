// =============================================
// Phase 8: Updates & Release Management
// Backend C# Code
// =============================================

// =============================================
// DTOs
// =============================================

// File: Models/DTOs/UpdateDto.cs
namespace ClientManagement.Models.DTOs
{
    public class UpdateDto
    {
        public int UpdateId { get; set; }
        public int ClientId { get; set; }
        public string Version { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ReleaseType { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public DateTime? StartedDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string? DeployedBy { get; set; }
        public string? ApprovedBy { get; set; }
        public string? RollbackPlan { get; set; }
        public bool DowntimeRequired { get; set; }
        public int? EstimatedDowntimeMinutes { get; set; }
        public int? ActualDowntimeMinutes { get; set; }
        public bool BackupTaken { get; set; }
        public string? BackupLocation { get; set; }
        public string? Notes { get; set; }
        public string? ChangeLog { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/CreateUpdateDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateUpdateDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Version { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Title { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public string ReleaseType { get; set; }
        
        public string Priority { get; set; } = "medium";
        
        public DateTime? ScheduledDate { get; set; }
        
        [StringLength(100)]
        public string? DeployedBy { get; set; }
        
        [StringLength(100)]
        public string? ApprovedBy { get; set; }
        
        public string? RollbackPlan { get; set; }
        
        public bool DowntimeRequired { get; set; } = false;
        
        public int? EstimatedDowntimeMinutes { get; set; }
        
        public bool BackupTaken { get; set; } = false;
        
        [StringLength(500)]
        public string? BackupLocation { get; set; }
        
        public string? Notes { get; set; }
        
        public string? ChangeLog { get; set; }
    }
}

// File: Models/DTOs/UpdateUpdateDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateUpdateDto
    {
        [Required]
        public int UpdateId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Version { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Title { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public string ReleaseType { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        [Required]
        public string Priority { get; set; }
        
        public DateTime? ScheduledDate { get; set; }
        
        [StringLength(100)]
        public string? ApprovedBy { get; set; }
        
        public string? RollbackPlan { get; set; }
        
        [Required]
        public bool DowntimeRequired { get; set; }
        
        public int? EstimatedDowntimeMinutes { get; set; }
        
        public int? ActualDowntimeMinutes { get; set; }
        
        [Required]
        public bool BackupTaken { get; set; }
        
        [StringLength(500)]
        public string? BackupLocation { get; set; }
        
        public string? Notes { get; set; }
        
        public string? ChangeLog { get; set; }
        
        [StringLength(100)]
        public string? ChangedBy { get; set; }
    }
}

// File: Models/DTOs/UpdateStepDto.cs
namespace ClientManagement.Models.DTOs
{
    public class UpdateStepDto
    {
        public int StepId { get; set; }
        public int UpdateId { get; set; }
        public int StepNumber { get; set; }
        public string StepName { get; set; }
        public string? Description { get; set; }
        public string Status { get; set; }
        public DateTime? StartedDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string? ExecutedBy { get; set; }
        public string? Result { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}

// File: Models/DTOs/CreateUpdateStepDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateUpdateStepDto
    {
        [Required]
        public int UpdateId { get; set; }
        
        [Required]
        public int StepNumber { get; set; }
        
        [Required]
        [StringLength(255)]
        public string StepName { get; set; }
        
        public string? Description { get; set; }
    }
}

// File: Models/DTOs/UpdateUpdateStepDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateUpdateStepDto
    {
        [Required]
        public int StepId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string StepName { get; set; }
        
        public string? Description { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        [StringLength(100)]
        public string? ExecutedBy { get; set; }
        
        public string? Result { get; set; }
        
        public string? ErrorMessage { get; set; }
    }
}

// File: Models/DTOs/UpdateHistoryDto.cs
namespace ClientManagement.Models.DTOs
{
    public class UpdateHistoryDto
    {
        public int HistoryId { get; set; }
        public int UpdateId { get; set; }
        public string Action { get; set; }
        public string? FieldChanged { get; set; }
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public string? ChangedBy { get; set; }
        public DateTime ChangeDate { get; set; }
    }
}

// File: Models/DTOs/UpcomingUpdateDto.cs
namespace ClientManagement.Models.DTOs
{
    public class UpcomingUpdateDto
    {
        public int UpdateId { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string Version { get; set; }
        public string Title { get; set; }
        public string ReleaseType { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public bool DowntimeRequired { get; set; }
        public int? EstimatedDowntimeMinutes { get; set; }
        public int DaysUntilUpdate { get; set; }
    }
}

// =============================================
// REPOSITORIES
// =============================================

// File: Repositories/IUpdateRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IUpdateRepository
    {
        // Updates
        Task<IEnumerable<UpdateDto>> GetUpdatesAsync(int? clientId = null, string? status = null, string? releaseType = null, bool includeArchived = false);
        Task<UpdateDto?> GetUpdateByIdAsync(int updateId);
        Task<UpdateDto> CreateUpdateAsync(CreateUpdateDto dto);
        Task<UpdateDto?> UpdateUpdateAsync(UpdateUpdateDto dto);
        Task<bool> ArchiveUpdateAsync(int updateId, bool isArchived, string? changedBy = null);
        Task<bool> DeleteUpdateAsync(int updateId);
        Task<IEnumerable<UpcomingUpdateDto>> GetUpcomingUpdatesAsync(int days = 30);
        
        // Update Steps
        Task<IEnumerable<UpdateStepDto>> GetUpdateStepsAsync(int updateId);
        Task<UpdateStepDto> CreateUpdateStepAsync(CreateUpdateStepDto dto);
        Task<UpdateStepDto?> UpdateUpdateStepAsync(UpdateUpdateStepDto dto);
        Task<bool> DeleteUpdateStepAsync(int stepId);
        
        // History
        Task<IEnumerable<UpdateHistoryDto>> GetUpdateHistoryAsync(int updateId);
    }
}

// File: Repositories/UpdateRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class UpdateRepository : IUpdateRepository
    {
        private readonly string _connectionString;

        public UpdateRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<UpdateDto>> GetUpdatesAsync(int? clientId = null, string? status = null, string? releaseType = null, bool includeArchived = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@Status", status);
                parameters.Add("@ReleaseType", releaseType);
                parameters.Add("@IncludeArchived", includeArchived);

                var updates = await connection.QueryAsync<UpdateDto>(
                    "sp_GetUpdates",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return updates;
            }
        }

        public async Task<UpdateDto?> GetUpdateByIdAsync(int updateId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@UpdateId", updateId);

                var update = await connection.QueryFirstOrDefaultAsync<UpdateDto>(
                    "sp_GetUpdateById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return update;
            }
        }

        public async Task<UpdateDto> CreateUpdateAsync(CreateUpdateDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@Version", dto.Version);
                parameters.Add("@Title", dto.Title);
                parameters.Add("@Description", dto.Description);
                parameters.Add("@ReleaseType", dto.ReleaseType);
                parameters.Add("@Priority", dto.Priority);
                parameters.Add("@ScheduledDate", dto.ScheduledDate);
                parameters.Add("@DeployedBy", dto.DeployedBy);
                parameters.Add("@ApprovedBy", dto.ApprovedBy);
                parameters.Add("@RollbackPlan", dto.RollbackPlan);
                parameters.Add("@DowntimeRequired", dto.DowntimeRequired);
                parameters.Add("@EstimatedDowntimeMinutes", dto.EstimatedDowntimeMinutes);
                parameters.Add("@BackupTaken", dto.BackupTaken);
                parameters.Add("@BackupLocation", dto.BackupLocation);
                parameters.Add("@Notes", dto.Notes);
                parameters.Add("@ChangeLog", dto.ChangeLog);

                var update = await connection.QueryFirstAsync<UpdateDto>(
                    "sp_CreateUpdate",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return update;
            }
        }

        public async Task<UpdateDto?> UpdateUpdateAsync(UpdateUpdateDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@UpdateId", dto.UpdateId);
                parameters.Add("@Version", dto.Version);
                parameters.Add("@Title", dto.Title);
                parameters.Add("@Description", dto.Description);
                parameters.Add("@ReleaseType", dto.ReleaseType);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Priority", dto.Priority);
                parameters.Add("@ScheduledDate", dto.ScheduledDate);
                parameters.Add("@ApprovedBy", dto.ApprovedBy);
                parameters.Add("@RollbackPlan", dto.RollbackPlan);
                parameters.Add("@DowntimeRequired", dto.DowntimeRequired);
                parameters.Add("@EstimatedDowntimeMinutes", dto.EstimatedDowntimeMinutes);
                parameters.Add("@ActualDowntimeMinutes", dto.ActualDowntimeMinutes);
                parameters.Add("@BackupTaken", dto.BackupTaken);
                parameters.Add("@BackupLocation", dto.BackupLocation);
                parameters.Add("@Notes", dto.Notes);
                parameters.Add("@ChangeLog", dto.ChangeLog);
                parameters.Add("@ChangedBy", dto.ChangedBy);

                var update = await connection.QueryFirstOrDefaultAsync<UpdateDto>(
                    "sp_UpdateUpdate",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return update;
            }
        }

        public async Task<bool> ArchiveUpdateAsync(int updateId, bool isArchived, string? changedBy = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@UpdateId", updateId);
                parameters.Add("@IsArchived", isArchived);
                parameters.Add("@ChangedBy", changedBy);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_ArchiveUpdate",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<bool> DeleteUpdateAsync(int updateId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@UpdateId", updateId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteUpdate",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<IEnumerable<UpcomingUpdateDto>> GetUpcomingUpdatesAsync(int days = 30)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Days", days);

                var updates = await connection.QueryAsync<UpcomingUpdateDto>(
                    "sp_GetUpcomingUpdates",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return updates;
            }
        }

        public async Task<IEnumerable<UpdateStepDto>> GetUpdateStepsAsync(int updateId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@UpdateId", updateId);

                var steps = await connection.QueryAsync<UpdateStepDto>(
                    "sp_GetUpdateSteps",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return steps;
            }
        }

        public async Task<UpdateStepDto> CreateUpdateStepAsync(CreateUpdateStepDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@UpdateId", dto.UpdateId);
                parameters.Add("@StepNumber", dto.StepNumber);
                parameters.Add("@StepName", dto.StepName);
                parameters.Add("@Description", dto.Description);

                var step = await connection.QueryFirstAsync<UpdateStepDto>(
                    "sp_CreateUpdateStep",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return step;
            }
        }

        public async Task<UpdateStepDto?> UpdateUpdateStepAsync(UpdateUpdateStepDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StepId", dto.StepId);
                parameters.Add("@StepName", dto.StepName);
                parameters.Add("@Description", dto.Description);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@ExecutedBy", dto.ExecutedBy);
                parameters.Add("@Result", dto.Result);
                parameters.Add("@ErrorMessage", dto.ErrorMessage);

                var step = await connection.QueryFirstOrDefaultAsync<UpdateStepDto>(
                    "sp_UpdateUpdateStep",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return step;
            }
        }

        public async Task<bool> DeleteUpdateStepAsync(int stepId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StepId", stepId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteUpdateStep",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<IEnumerable<UpdateHistoryDto>> GetUpdateHistoryAsync(int updateId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@UpdateId", updateId);

                var history = await connection.QueryAsync<UpdateHistoryDto>(
                    "sp_GetUpdateHistory",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return history;
            }
        }
    }
}

// =============================================
// CONTROLLERS
// =============================================

// File: Controllers/UpdatesController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UpdatesController : ControllerBase
    {
        private readonly IUpdateRepository _updateRepository;

        public UpdatesController(IUpdateRepository updateRepository)
        {
            _updateRepository = updateRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UpdateDto>>> GetUpdates(
            [FromQuery] int? clientId = null,
            [FromQuery] string? status = null,
            [FromQuery] string? releaseType = null,
            [FromQuery] bool includeArchived = false)
        {
            var updates = await _updateRepository.GetUpdatesAsync(clientId, status, releaseType, includeArchived);
            return Ok(updates);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UpdateDto>> GetUpdateById(int id)
        {
            var update = await _updateRepository.GetUpdateByIdAsync(id);

            if (update == null)
            {
                return NotFound(new { message = $"Update with ID {id} not found" });
            }

            return Ok(update);
        }

        [HttpPost]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<UpdateDto>> CreateUpdate([FromBody] CreateUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var update = await _updateRepository.CreateUpdateAsync(dto);
            return CreatedAtAction(nameof(GetUpdateById), new { id = update.UpdateId }, update);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<UpdateDto>> UpdateUpdate(int id, [FromBody] UpdateUpdateDto dto)
        {
            if (id != dto.UpdateId)
            {
                return BadRequest(new { message = "Update ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var update = await _updateRepository.UpdateUpdateAsync(dto);

            if (update == null)
            {
                return NotFound(new { message = $"Update with ID {id} not found" });
            }

            return Ok(update);
        }

        [HttpPatch("{id}/archive")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> ArchiveUpdate(int id, [FromBody] bool isArchived)
        {
            var success = await _updateRepository.ArchiveUpdateAsync(id, isArchived);

            if (!success)
            {
                return NotFound(new { message = $"Update with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteUpdate(int id)
        {
            var success = await _updateRepository.DeleteUpdateAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Update with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<UpcomingUpdateDto>>> GetUpcomingUpdates([FromQuery] int days = 30)
        {
            var updates = await _updateRepository.GetUpcomingUpdatesAsync(days);
            return Ok(updates);
        }

        // Update Steps
        [HttpGet("{id}/steps")]
        public async Task<ActionResult<IEnumerable<UpdateStepDto>>> GetUpdateSteps(int id)
        {
            var steps = await _updateRepository.GetUpdateStepsAsync(id);
            return Ok(steps);
        }

        [HttpPost("steps")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<UpdateStepDto>> CreateUpdateStep([FromBody] CreateUpdateStepDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var step = await _updateRepository.CreateUpdateStepAsync(dto);
            return Ok(step);
        }

        [HttpPut("steps/{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<UpdateStepDto>> UpdateUpdateStep(int id, [FromBody] UpdateUpdateStepDto dto)
        {
            if (id != dto.StepId)
            {
                return BadRequest(new { message = "Step ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var step = await _updateRepository.UpdateUpdateStepAsync(dto);

            if (step == null)
            {
                return NotFound(new { message = $"Update step with ID {id} not found" });
            }

            return Ok(step);
        }

        [HttpDelete("steps/{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> DeleteUpdateStep(int id)
        {
            var success = await _updateRepository.DeleteUpdateStepAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Update step with ID {id} not found" });
            }

            return NoContent();
        }

        // History
        [HttpGet("{id}/history")]
        public async Task<ActionResult<IEnumerable<UpdateHistoryDto>>> GetUpdateHistory(int id)
        {
            var history = await _updateRepository.GetUpdateHistoryAsync(id);
            return Ok(history);
        }
    }
}

// =============================================
// Program.cs Updates
// =============================================

/*
Add this line to Program.cs:

// Register Phase 8 repositories
builder.Services.AddScoped<IUpdateRepository, UpdateRepository>();
*/
