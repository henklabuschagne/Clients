// =============================================
// Phase 7: Tickets & Support Management
// Backend C# Code
// =============================================

// =============================================
// DTOs
// =============================================

// File: Models/DTOs/TicketDto.cs
namespace ClientManagement.Models.DTOs
{
    public class TicketDto
    {
        public int TicketId { get; set; }
        public int ClientId { get; set; }
        public string TicketNumber { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string? Category { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public string? AssignedTo { get; set; }
        public string? ReportedBy { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public decimal? EstimatedHours { get; set; }
        public decimal? ActualHours { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ResolvedDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public string? Resolution { get; set; }
        public string? Tags { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/CreateTicketDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateTicketDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string TicketNumber { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Subject { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [StringLength(100)]
        public string? Category { get; set; }
        
        public string Priority { get; set; } = "medium";
        
        [StringLength(100)]
        public string? AssignedTo { get; set; }
        
        [StringLength(100)]
        public string? ReportedBy { get; set; }
        
        [EmailAddress]
        [StringLength(255)]
        public string? ContactEmail { get; set; }
        
        [StringLength(50)]
        public string? ContactPhone { get; set; }
        
        public decimal? EstimatedHours { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        [StringLength(500)]
        public string? Tags { get; set; }
    }
}

// File: Models/DTOs/UpdateTicketDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateTicketDto
    {
        [Required]
        public int TicketId { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Subject { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [StringLength(100)]
        public string? Category { get; set; }
        
        [Required]
        public string Priority { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        [StringLength(100)]
        public string? AssignedTo { get; set; }
        
        [EmailAddress]
        [StringLength(255)]
        public string? ContactEmail { get; set; }
        
        [StringLength(50)]
        public string? ContactPhone { get; set; }
        
        public decimal? EstimatedHours { get; set; }
        
        public decimal? ActualHours { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public string? Resolution { get; set; }
        
        [StringLength(500)]
        public string? Tags { get; set; }
        
        [StringLength(100)]
        public string? ChangedBy { get; set; }
    }
}

// File: Models/DTOs/TicketCommentDto.cs
namespace ClientManagement.Models.DTOs
{
    public class TicketCommentDto
    {
        public int CommentId { get; set; }
        public int TicketId { get; set; }
        public string Comment { get; set; }
        public string CommentType { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsCustomerVisible { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}

// File: Models/DTOs/CreateTicketCommentDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateTicketCommentDto
    {
        [Required]
        public int TicketId { get; set; }
        
        [Required]
        public string Comment { get; set; }
        
        public string CommentType { get; set; } = "public";
        
        [StringLength(100)]
        public string? CreatedBy { get; set; }
        
        public bool IsCustomerVisible { get; set; } = true;
    }
}

// File: Models/DTOs/TicketAttachmentDto.cs
namespace ClientManagement.Models.DTOs
{
    public class TicketAttachmentDto
    {
        public int AttachmentId { get; set; }
        public int TicketId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long? FileSize { get; set; }
        public string? ContentType { get; set; }
        public string? UploadedBy { get; set; }
        public DateTime UploadedDate { get; set; }
    }
}

// File: Models/DTOs/CreateTicketAttachmentDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateTicketAttachmentDto
    {
        [Required]
        public int TicketId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string FileName { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string FilePath { get; set; }
        
        public long? FileSize { get; set; }
        
        [StringLength(100)]
        public string? ContentType { get; set; }
        
        [StringLength(100)]
        public string? UploadedBy { get; set; }
    }
}

// File: Models/DTOs/TicketHistoryDto.cs
namespace ClientManagement.Models.DTOs
{
    public class TicketHistoryDto
    {
        public int HistoryId { get; set; }
        public int TicketId { get; set; }
        public string Action { get; set; }
        public string? FieldChanged { get; set; }
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public string? ChangedBy { get; set; }
        public DateTime ChangeDate { get; set; }
    }
}

// File: Models/DTOs/TicketStatisticsDto.cs
namespace ClientManagement.Models.DTOs
{
    public class TicketStatisticsDto
    {
        public int TotalTickets { get; set; }
        public int OpenTickets { get; set; }
        public int InProgressTickets { get; set; }
        public int WaitingTickets { get; set; }
        public int ResolvedTickets { get; set; }
        public int ClosedTickets { get; set; }
        public int UrgentTickets { get; set; }
        public int HighPriorityTickets { get; set; }
        public decimal? AverageHours { get; set; }
        public int OverdueTickets { get; set; }
    }
}

// =============================================
// REPOSITORIES
// =============================================

// File: Repositories/ITicketRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface ITicketRepository
    {
        // Tickets
        Task<IEnumerable<TicketDto>> GetTicketsAsync(int? clientId = null, string? status = null, string? priority = null, string? assignedTo = null, string? category = null, bool includeArchived = false);
        Task<TicketDto?> GetTicketByIdAsync(int ticketId);
        Task<TicketDto?> GetTicketByNumberAsync(string ticketNumber);
        Task<TicketDto> CreateTicketAsync(CreateTicketDto dto);
        Task<TicketDto?> UpdateTicketAsync(UpdateTicketDto dto);
        Task<bool> ArchiveTicketAsync(int ticketId, bool isArchived, string? changedBy = null);
        Task<bool> DeleteTicketAsync(int ticketId);
        Task<TicketStatisticsDto?> GetTicketStatisticsAsync(int? clientId = null);
        
        // Comments
        Task<IEnumerable<TicketCommentDto>> GetTicketCommentsAsync(int ticketId, bool includeInternal = false);
        Task<TicketCommentDto> CreateTicketCommentAsync(CreateTicketCommentDto dto);
        Task<bool> DeleteTicketCommentAsync(int commentId);
        
        // Attachments
        Task<IEnumerable<TicketAttachmentDto>> GetTicketAttachmentsAsync(int ticketId);
        Task<TicketAttachmentDto> CreateTicketAttachmentAsync(CreateTicketAttachmentDto dto);
        Task<bool> DeleteTicketAttachmentAsync(int attachmentId);
        
        // History
        Task<IEnumerable<TicketHistoryDto>> GetTicketHistoryAsync(int ticketId);
    }
}

// File: Repositories/TicketRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly string _connectionString;

        public TicketRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<TicketDto>> GetTicketsAsync(int? clientId = null, string? status = null, string? priority = null, string? assignedTo = null, string? category = null, bool includeArchived = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@Status", status);
                parameters.Add("@Priority", priority);
                parameters.Add("@AssignedTo", assignedTo);
                parameters.Add("@Category", category);
                parameters.Add("@IncludeArchived", includeArchived);

                var tickets = await connection.QueryAsync<TicketDto>(
                    "sp_GetTickets",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return tickets;
            }
        }

        public async Task<TicketDto?> GetTicketByIdAsync(int ticketId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketId", ticketId);

                var ticket = await connection.QueryFirstOrDefaultAsync<TicketDto>(
                    "sp_GetTicketById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return ticket;
            }
        }

        public async Task<TicketDto?> GetTicketByNumberAsync(string ticketNumber)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketNumber", ticketNumber);

                var ticket = await connection.QueryFirstOrDefaultAsync<TicketDto>(
                    "sp_GetTicketByNumber",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return ticket;
            }
        }

        public async Task<TicketDto> CreateTicketAsync(CreateTicketDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@TicketNumber", dto.TicketNumber);
                parameters.Add("@Subject", dto.Subject);
                parameters.Add("@Description", dto.Description);
                parameters.Add("@Category", dto.Category);
                parameters.Add("@Priority", dto.Priority);
                parameters.Add("@AssignedTo", dto.AssignedTo);
                parameters.Add("@ReportedBy", dto.ReportedBy);
                parameters.Add("@ContactEmail", dto.ContactEmail);
                parameters.Add("@ContactPhone", dto.ContactPhone);
                parameters.Add("@EstimatedHours", dto.EstimatedHours);
                parameters.Add("@DueDate", dto.DueDate);
                parameters.Add("@Tags", dto.Tags);

                var ticket = await connection.QueryFirstAsync<TicketDto>(
                    "sp_CreateTicket",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return ticket;
            }
        }

        public async Task<TicketDto?> UpdateTicketAsync(UpdateTicketDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketId", dto.TicketId);
                parameters.Add("@Subject", dto.Subject);
                parameters.Add("@Description", dto.Description);
                parameters.Add("@Category", dto.Category);
                parameters.Add("@Priority", dto.Priority);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@AssignedTo", dto.AssignedTo);
                parameters.Add("@ContactEmail", dto.ContactEmail);
                parameters.Add("@ContactPhone", dto.ContactPhone);
                parameters.Add("@EstimatedHours", dto.EstimatedHours);
                parameters.Add("@ActualHours", dto.ActualHours);
                parameters.Add("@DueDate", dto.DueDate);
                parameters.Add("@Resolution", dto.Resolution);
                parameters.Add("@Tags", dto.Tags);
                parameters.Add("@ChangedBy", dto.ChangedBy);

                var ticket = await connection.QueryFirstOrDefaultAsync<TicketDto>(
                    "sp_UpdateTicket",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return ticket;
            }
        }

        public async Task<bool> ArchiveTicketAsync(int ticketId, bool isArchived, string? changedBy = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketId", ticketId);
                parameters.Add("@IsArchived", isArchived);
                parameters.Add("@ChangedBy", changedBy);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_ArchiveTicket",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<bool> DeleteTicketAsync(int ticketId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketId", ticketId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteTicket",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<TicketStatisticsDto?> GetTicketStatisticsAsync(int? clientId = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);

                var statistics = await connection.QueryFirstOrDefaultAsync<TicketStatisticsDto>(
                    "sp_GetTicketStatistics",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return statistics;
            }
        }

        public async Task<IEnumerable<TicketCommentDto>> GetTicketCommentsAsync(int ticketId, bool includeInternal = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketId", ticketId);
                parameters.Add("@IncludeInternal", includeInternal);

                var comments = await connection.QueryAsync<TicketCommentDto>(
                    "sp_GetTicketComments",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return comments;
            }
        }

        public async Task<TicketCommentDto> CreateTicketCommentAsync(CreateTicketCommentDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketId", dto.TicketId);
                parameters.Add("@Comment", dto.Comment);
                parameters.Add("@CommentType", dto.CommentType);
                parameters.Add("@CreatedBy", dto.CreatedBy);
                parameters.Add("@IsCustomerVisible", dto.IsCustomerVisible);

                var comment = await connection.QueryFirstAsync<TicketCommentDto>(
                    "sp_CreateTicketComment",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return comment;
            }
        }

        public async Task<bool> DeleteTicketCommentAsync(int commentId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@CommentId", commentId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteTicketComment",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<IEnumerable<TicketAttachmentDto>> GetTicketAttachmentsAsync(int ticketId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketId", ticketId);

                var attachments = await connection.QueryAsync<TicketAttachmentDto>(
                    "sp_GetTicketAttachments",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return attachments;
            }
        }

        public async Task<TicketAttachmentDto> CreateTicketAttachmentAsync(CreateTicketAttachmentDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketId", dto.TicketId);
                parameters.Add("@FileName", dto.FileName);
                parameters.Add("@FilePath", dto.FilePath);
                parameters.Add("@FileSize", dto.FileSize);
                parameters.Add("@ContentType", dto.ContentType);
                parameters.Add("@UploadedBy", dto.UploadedBy);

                var attachment = await connection.QueryFirstAsync<TicketAttachmentDto>(
                    "sp_CreateTicketAttachment",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return attachment;
            }
        }

        public async Task<bool> DeleteTicketAttachmentAsync(int attachmentId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@AttachmentId", attachmentId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteTicketAttachment",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<IEnumerable<TicketHistoryDto>> GetTicketHistoryAsync(int ticketId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TicketId", ticketId);

                var history = await connection.QueryAsync<TicketHistoryDto>(
                    "sp_GetTicketHistory",
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

// File: Controllers/TicketsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketRepository _ticketRepository;

        public TicketsController(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetTickets(
            [FromQuery] int? clientId = null,
            [FromQuery] string? status = null,
            [FromQuery] string? priority = null,
            [FromQuery] string? assignedTo = null,
            [FromQuery] string? category = null,
            [FromQuery] bool includeArchived = false)
        {
            var tickets = await _ticketRepository.GetTicketsAsync(clientId, status, priority, assignedTo, category, includeArchived);
            return Ok(tickets);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDto>> GetTicketById(int id)
        {
            var ticket = await _ticketRepository.GetTicketByIdAsync(id);

            if (ticket == null)
            {
                return NotFound(new { message = $"Ticket with ID {id} not found" });
            }

            return Ok(ticket);
        }

        [HttpGet("number/{ticketNumber}")]
        public async Task<ActionResult<TicketDto>> GetTicketByNumber(string ticketNumber)
        {
            var ticket = await _ticketRepository.GetTicketByNumberAsync(ticketNumber);

            if (ticket == null)
            {
                return NotFound(new { message = $"Ticket {ticketNumber} not found" });
            }

            return Ok(ticket);
        }

        [HttpPost]
        public async Task<ActionResult<TicketDto>> CreateTicket([FromBody] CreateTicketDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ticket = await _ticketRepository.CreateTicketAsync(dto);
            return CreatedAtAction(nameof(GetTicketById), new { id = ticket.TicketId }, ticket);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TicketDto>> UpdateTicket(int id, [FromBody] UpdateTicketDto dto)
        {
            if (id != dto.TicketId)
            {
                return BadRequest(new { message = "Ticket ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ticket = await _ticketRepository.UpdateTicketAsync(dto);

            if (ticket == null)
            {
                return NotFound(new { message = $"Ticket with ID {id} not found" });
            }

            return Ok(ticket);
        }

        [HttpPatch("{id}/archive")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> ArchiveTicket(int id, [FromBody] bool isArchived)
        {
            var success = await _ticketRepository.ArchiveTicketAsync(id, isArchived);

            if (!success)
            {
                return NotFound(new { message = $"Ticket with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteTicket(int id)
        {
            var success = await _ticketRepository.DeleteTicketAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Ticket with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<TicketStatisticsDto>> GetTicketStatistics([FromQuery] int? clientId = null)
        {
            var statistics = await _ticketRepository.GetTicketStatisticsAsync(clientId);

            if (statistics == null)
            {
                return NotFound(new { message = "No statistics available" });
            }

            return Ok(statistics);
        }

        // Comments
        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<TicketCommentDto>>> GetTicketComments(
            int id,
            [FromQuery] bool includeInternal = false)
        {
            var comments = await _ticketRepository.GetTicketCommentsAsync(id, includeInternal);
            return Ok(comments);
        }

        [HttpPost("comments")]
        public async Task<ActionResult<TicketCommentDto>> CreateTicketComment([FromBody] CreateTicketCommentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var comment = await _ticketRepository.CreateTicketCommentAsync(dto);
            return Ok(comment);
        }

        [HttpDelete("comments/{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> DeleteTicketComment(int id)
        {
            var success = await _ticketRepository.DeleteTicketCommentAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Comment with ID {id} not found" });
            }

            return NoContent();
        }

        // Attachments
        [HttpGet("{id}/attachments")]
        public async Task<ActionResult<IEnumerable<TicketAttachmentDto>>> GetTicketAttachments(int id)
        {
            var attachments = await _ticketRepository.GetTicketAttachmentsAsync(id);
            return Ok(attachments);
        }

        [HttpPost("attachments")]
        public async Task<ActionResult<TicketAttachmentDto>> CreateTicketAttachment([FromBody] CreateTicketAttachmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var attachment = await _ticketRepository.CreateTicketAttachmentAsync(dto);
            return Ok(attachment);
        }

        [HttpDelete("attachments/{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> DeleteTicketAttachment(int id)
        {
            var success = await _ticketRepository.DeleteTicketAttachmentAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Attachment with ID {id} not found" });
            }

            return NoContent();
        }

        // History
        [HttpGet("{id}/history")]
        public async Task<ActionResult<IEnumerable<TicketHistoryDto>>> GetTicketHistory(int id)
        {
            var history = await _ticketRepository.GetTicketHistoryAsync(id);
            return Ok(history);
        }
    }
}

// =============================================
// Program.cs Updates
// =============================================

/*
Add this line to Program.cs:

// Register Phase 7 repositories
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
*/
