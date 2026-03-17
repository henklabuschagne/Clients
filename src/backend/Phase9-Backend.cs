// =============================================
// Phase 9: Client Customizations Management
// Backend C# Code
// =============================================

// =============================================
// DTOs
// =============================================

// File: Models/DTOs/CustomizationDto.cs
namespace ClientManagement.Models.DTOs
{
    public class CustomizationDto
    {
        public int CustomizationId { get; set; }
        public int ClientId { get; set; }
        public string Title { get; set; }
        public string CustomizationType { get; set; }
        public string? Description { get; set; }
        public string? Version { get; set; }
        public string? Developer { get; set; }
        public DateTime? ImplementationDate { get; set; }
        public string Status { get; set; }
        public string? TechnicalNotes { get; set; }
        public string? Dependencies { get; set; }
        public string? CodeRepository { get; set; }
        public string? Tags { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DocumentCount { get; set; }
    }
}

// File: Models/DTOs/CreateCustomizationDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateCustomizationDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Title { get; set; }
        
        [Required]
        [StringLength(100)]
        public string CustomizationType { get; set; }
        
        public string? Description { get; set; }
        
        [StringLength(50)]
        public string? Version { get; set; }
        
        [StringLength(100)]
        public string? Developer { get; set; }
        
        public DateTime? ImplementationDate { get; set; }
        
        [StringLength(20)]
        public string Status { get; set; } = "active";
        
        public string? TechnicalNotes { get; set; }
        
        public string? Dependencies { get; set; }
        
        [StringLength(500)]
        public string? CodeRepository { get; set; }
        
        [StringLength(500)]
        public string? Tags { get; set; }
    }
}

// File: Models/DTOs/UpdateCustomizationDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateCustomizationDto
    {
        [Required]
        public int CustomizationId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Title { get; set; }
        
        [Required]
        [StringLength(100)]
        public string CustomizationType { get; set; }
        
        public string? Description { get; set; }
        
        [StringLength(50)]
        public string? Version { get; set; }
        
        [StringLength(100)]
        public string? Developer { get; set; }
        
        public DateTime? ImplementationDate { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; }
        
        public string? TechnicalNotes { get; set; }
        
        public string? Dependencies { get; set; }
        
        [StringLength(500)]
        public string? CodeRepository { get; set; }
        
        [StringLength(500)]
        public string? Tags { get; set; }
    }
}

// File: Models/DTOs/CustomizationDocumentDto.cs
namespace ClientManagement.Models.DTOs
{
    public class CustomizationDocumentDto
    {
        public int DocumentId { get; set; }
        public int CustomizationId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long? FileSize { get; set; }
        public string? FileType { get; set; }
        public string? DocumentType { get; set; }
        public string? Description { get; set; }
        public string? UploadedBy { get; set; }
        public DateTime UploadedAt { get; set; }
        public bool IsArchived { get; set; }
    }
}

// File: Models/DTOs/CreateCustomizationDocumentDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateCustomizationDocumentDto
    {
        [Required]
        public int CustomizationId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string FileName { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string FilePath { get; set; }
        
        public long? FileSize { get; set; }
        
        [StringLength(50)]
        public string? FileType { get; set; }
        
        [StringLength(100)]
        public string? DocumentType { get; set; }
        
        public string? Description { get; set; }
        
        [StringLength(100)]
        public string? UploadedBy { get; set; }
    }
}

// File: Models/DTOs/UpdateCustomizationDocumentDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateCustomizationDocumentDto
    {
        [Required]
        public int DocumentId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string FileName { get; set; }
        
        [StringLength(100)]
        public string? DocumentType { get; set; }
        
        public string? Description { get; set; }
    }
}

// File: Models/DTOs/CustomizationSummaryDto.cs
namespace ClientManagement.Models.DTOs
{
    public class CustomizationSummaryDto
    {
        public int TotalCustomizations { get; set; }
        public int ActiveCustomizations { get; set; }
        public int DeprecatedCustomizations { get; set; }
        public int PlannedCustomizations { get; set; }
        public int TestingCustomizations { get; set; }
        public int TotalDocuments { get; set; }
    }
}

// =============================================
// REPOSITORY
// =============================================

// File: Repositories/CustomizationRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface ICustomizationRepository
    {
        Task<IEnumerable<CustomizationDto>> GetCustomizationsAsync(int clientId, bool includeArchived = false);
        Task<CustomizationDto?> GetCustomizationByIdAsync(int customizationId);
        Task<CustomizationDto> CreateCustomizationAsync(CreateCustomizationDto dto);
        Task<CustomizationDto> UpdateCustomizationAsync(UpdateCustomizationDto dto);
        Task<bool> ArchiveCustomizationAsync(int customizationId, bool isArchived);
        Task<bool> DeleteCustomizationAsync(int customizationId);
        Task<IEnumerable<CustomizationDocumentDto>> GetDocumentsAsync(int customizationId, bool includeArchived = false);
        Task<CustomizationDocumentDto?> GetDocumentByIdAsync(int documentId);
        Task<CustomizationDocumentDto> CreateDocumentAsync(CreateCustomizationDocumentDto dto);
        Task<CustomizationDocumentDto> UpdateDocumentAsync(UpdateCustomizationDocumentDto dto);
        Task<bool> ArchiveDocumentAsync(int documentId, bool isArchived);
        Task<bool> DeleteDocumentAsync(int documentId);
        Task<CustomizationSummaryDto> GetSummaryAsync(int clientId);
    }

    public class CustomizationRepository : ICustomizationRepository
    {
        private readonly string _connectionString;

        public CustomizationRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<CustomizationDto>> GetCustomizationsAsync(int clientId, bool includeArchived = false)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<CustomizationDto>(
                "sp_GetCustomizations",
                new { ClientId = clientId, IncludeArchived = includeArchived },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<CustomizationDto?> GetCustomizationByIdAsync(int customizationId)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<CustomizationDto>(
                "sp_GetCustomizationById",
                new { CustomizationId = customizationId },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<CustomizationDto> CreateCustomizationAsync(CreateCustomizationDto dto)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstAsync<CustomizationDto>(
                "sp_CreateCustomization",
                dto,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<CustomizationDto> UpdateCustomizationAsync(UpdateCustomizationDto dto)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstAsync<CustomizationDto>(
                "sp_UpdateCustomization",
                dto,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<bool> ArchiveCustomizationAsync(int customizationId, bool isArchived)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.QueryFirstAsync<int>(
                "sp_ArchiveCustomization",
                new { CustomizationId = customizationId, IsArchived = isArchived },
                commandType: CommandType.StoredProcedure
            );
            return result == 1;
        }

        public async Task<bool> DeleteCustomizationAsync(int customizationId)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.QueryFirstAsync<int>(
                "sp_DeleteCustomization",
                new { CustomizationId = customizationId },
                commandType: CommandType.StoredProcedure
            );
            return result == 1;
        }

        public async Task<IEnumerable<CustomizationDocumentDto>> GetDocumentsAsync(int customizationId, bool includeArchived = false)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<CustomizationDocumentDto>(
                "sp_GetCustomizationDocuments",
                new { CustomizationId = customizationId, IncludeArchived = includeArchived },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<CustomizationDocumentDto?> GetDocumentByIdAsync(int documentId)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<CustomizationDocumentDto>(
                "sp_GetCustomizationDocumentById",
                new { DocumentId = documentId },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<CustomizationDocumentDto> CreateDocumentAsync(CreateCustomizationDocumentDto dto)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstAsync<CustomizationDocumentDto>(
                "sp_CreateCustomizationDocument",
                dto,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<CustomizationDocumentDto> UpdateDocumentAsync(UpdateCustomizationDocumentDto dto)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstAsync<CustomizationDocumentDto>(
                "sp_UpdateCustomizationDocument",
                dto,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<bool> ArchiveDocumentAsync(int documentId, bool isArchived)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.QueryFirstAsync<int>(
                "sp_ArchiveCustomizationDocument",
                new { DocumentId = documentId, IsArchived = isArchived },
                commandType: CommandType.StoredProcedure
            );
            return result == 1;
        }

        public async Task<bool> DeleteDocumentAsync(int documentId)
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.QueryFirstAsync<int>(
                "sp_DeleteCustomizationDocument",
                new { DocumentId = documentId },
                commandType: CommandType.StoredProcedure
            );
            return result == 1;
        }

        public async Task<CustomizationSummaryDto> GetSummaryAsync(int clientId)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstAsync<CustomizationSummaryDto>(
                "sp_GetCustomizationSummary",
                new { ClientId = clientId },
                commandType: CommandType.StoredProcedure
            );
        }
    }
}

// =============================================
// CONTROLLER
// =============================================

// File: Controllers/CustomizationsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CustomizationsController : ControllerBase
    {
        private readonly ICustomizationRepository _repository;
        private readonly ILogger<CustomizationsController> _logger;

        public CustomizationsController(
            ICustomizationRepository repository,
            ILogger<CustomizationsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        // GET: api/customizations?clientId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomizationDto>>> GetCustomizations(
            [FromQuery] int clientId,
            [FromQuery] bool includeArchived = false)
        {
            try
            {
                var customizations = await _repository.GetCustomizationsAsync(clientId, includeArchived);
                return Ok(customizations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching customizations for client {ClientId}", clientId);
                return StatusCode(500, "An error occurred while fetching customizations");
            }
        }

        // GET: api/customizations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomizationDto>> GetCustomization(int id)
        {
            try
            {
                var customization = await _repository.GetCustomizationByIdAsync(id);
                if (customization == null)
                    return NotFound();

                return Ok(customization);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching customization {CustomizationId}", id);
                return StatusCode(500, "An error occurred while fetching the customization");
            }
        }

        // POST: api/customizations
        [HttpPost]
        public async Task<ActionResult<CustomizationDto>> CreateCustomization([FromBody] CreateCustomizationDto dto)
        {
            try
            {
                var customization = await _repository.CreateCustomizationAsync(dto);
                return CreatedAtAction(nameof(GetCustomization), new { id = customization.CustomizationId }, customization);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating customization");
                return StatusCode(500, "An error occurred while creating the customization");
            }
        }

        // PUT: api/customizations/5
        [HttpPut("{id}")]
        public async Task<ActionResult<CustomizationDto>> UpdateCustomization(int id, [FromBody] UpdateCustomizationDto dto)
        {
            if (id != dto.CustomizationId)
                return BadRequest("ID mismatch");

            try
            {
                var customization = await _repository.UpdateCustomizationAsync(dto);
                return Ok(customization);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating customization {CustomizationId}", id);
                return StatusCode(500, "An error occurred while updating the customization");
            }
        }

        // PATCH: api/customizations/5/archive
        [HttpPatch("{id}/archive")]
        public async Task<IActionResult> ArchiveCustomization(int id, [FromBody] bool isArchived)
        {
            try
            {
                await _repository.ArchiveCustomizationAsync(id, isArchived);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error archiving customization {CustomizationId}", id);
                return StatusCode(500, "An error occurred while archiving the customization");
            }
        }

        // DELETE: api/customizations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomization(int id)
        {
            try
            {
                await _repository.DeleteCustomizationAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting customization {CustomizationId}", id);
                return StatusCode(500, "An error occurred while deleting the customization");
            }
        }

        // GET: api/customizations/5/documents
        [HttpGet("{id}/documents")]
        public async Task<ActionResult<IEnumerable<CustomizationDocumentDto>>> GetDocuments(
            int id,
            [FromQuery] bool includeArchived = false)
        {
            try
            {
                var documents = await _repository.GetDocumentsAsync(id, includeArchived);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching documents for customization {CustomizationId}", id);
                return StatusCode(500, "An error occurred while fetching documents");
            }
        }

        // POST: api/customizations/documents
        [HttpPost("documents")]
        public async Task<ActionResult<CustomizationDocumentDto>> CreateDocument([FromBody] CreateCustomizationDocumentDto dto)
        {
            try
            {
                var document = await _repository.CreateDocumentAsync(dto);
                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating document");
                return StatusCode(500, "An error occurred while creating the document");
            }
        }

        // PUT: api/customizations/documents/5
        [HttpPut("documents/{id}")]
        public async Task<ActionResult<CustomizationDocumentDto>> UpdateDocument(int id, [FromBody] UpdateCustomizationDocumentDto dto)
        {
            if (id != dto.DocumentId)
                return BadRequest("ID mismatch");

            try
            {
                var document = await _repository.UpdateDocumentAsync(dto);
                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating document {DocumentId}", id);
                return StatusCode(500, "An error occurred while updating the document");
            }
        }

        // DELETE: api/customizations/documents/5
        [HttpDelete("documents/{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            try
            {
                await _repository.DeleteDocumentAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting document {DocumentId}", id);
                return StatusCode(500, "An error occurred while deleting the document");
            }
        }

        // GET: api/customizations/summary?clientId=1
        [HttpGet("summary")]
        public async Task<ActionResult<CustomizationSummaryDto>> GetSummary([FromQuery] int clientId)
        {
            try
            {
                var summary = await _repository.GetSummaryAsync(clientId);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching customization summary for client {ClientId}", clientId);
                return StatusCode(500, "An error occurred while fetching the summary");
            }
        }
    }
}

// =============================================
// PROGRAM.CS REGISTRATION
// =============================================

// Add to Program.cs:
// builder.Services.AddScoped<ICustomizationRepository, CustomizationRepository>();
