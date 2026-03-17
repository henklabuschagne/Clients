// =============================================
// Phase 3.1: File Upload/Download Service
// =============================================

// File: Services/FileStorageService.cs
using System.IO;

namespace ClientManagement.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(int clientId, int customizationId, IFormFile file, string uploadedBy);
        Task<(byte[] fileBytes, string contentType, string fileName)?> GetFileAsync(string filePath);
        Task<bool> DeleteFileAsync(string filePath);
        Task<long> GetFileSizeAsync(string filePath);
        string GetContentType(string fileName);
    }

    public class FileStorageService : IFileStorageService
    {
        private readonly string _baseUploadPath;
        private readonly ILogger<FileStorageService> _logger;

        public FileStorageService(IConfiguration configuration, ILogger<FileStorageService> logger)
        {
            _baseUploadPath = configuration["FileStorage:BasePath"] ?? Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            _logger = logger;

            // Ensure base upload directory exists
            if (!Directory.Exists(_baseUploadPath))
            {
                Directory.CreateDirectory(_baseUploadPath);
                _logger.LogInformation("Created base upload directory: {Path}", _baseUploadPath);
            }
        }

        public async Task<string> SaveFileAsync(int clientId, int customizationId, IFormFile file, string uploadedBy)
        {
            try
            {
                // Validate file
                if (file == null || file.Length == 0)
                    throw new ArgumentException("File is empty");

                // Create client-specific directory structure
                // uploads/client_{clientId}/customizations/customization_{customizationId}/
                string clientDir = Path.Combine(_baseUploadPath, $"client_{clientId}");
                string customizationDir = Path.Combine(clientDir, "customizations", $"customization_{customizationId}");

                // Ensure directory exists
                if (!Directory.Exists(customizationDir))
                {
                    Directory.CreateDirectory(customizationDir);
                    _logger.LogInformation("Created directory: {Path}", customizationDir);
                }

                // Generate safe filename with timestamp to avoid conflicts
                string safeFileName = SanitizeFileName(file.FileName);
                string timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                string uniqueFileName = $"{timestamp}_{safeFileName}";
                string fullPath = Path.Combine(customizationDir, uniqueFileName);

                // Save file to disk
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                _logger.LogInformation(
                    "File saved successfully: {FileName} by {User} at {Path}",
                    uniqueFileName,
                    uploadedBy,
                    fullPath
                );

                // Return relative path for database storage
                return Path.Combine("client_" + clientId, "customizations", $"customization_{customizationId}", uniqueFileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving file: {FileName}", file?.FileName);
                throw;
            }
        }

        public async Task<(byte[] fileBytes, string contentType, string fileName)?> GetFileAsync(string relativePath)
        {
            try
            {
                string fullPath = Path.Combine(_baseUploadPath, relativePath);

                if (!File.Exists(fullPath))
                {
                    _logger.LogWarning("File not found: {Path}", fullPath);
                    return null;
                }

                byte[] fileBytes = await File.ReadAllBytesAsync(fullPath);
                string fileName = Path.GetFileName(fullPath);
                string contentType = GetContentType(fileName);

                _logger.LogInformation("File retrieved: {FileName}, Size: {Size} bytes", fileName, fileBytes.Length);

                return (fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving file: {Path}", relativePath);
                throw;
            }
        }

        public async Task<bool> DeleteFileAsync(string relativePath)
        {
            try
            {
                string fullPath = Path.Combine(_baseUploadPath, relativePath);

                if (!File.Exists(fullPath))
                {
                    _logger.LogWarning("File not found for deletion: {Path}", fullPath);
                    return false;
                }

                File.Delete(fullPath);
                _logger.LogInformation("File deleted: {Path}", fullPath);

                // Clean up empty directories
                await CleanupEmptyDirectoriesAsync(Path.GetDirectoryName(fullPath));

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file: {Path}", relativePath);
                throw;
            }
        }

        public async Task<long> GetFileSizeAsync(string relativePath)
        {
            try
            {
                string fullPath = Path.Combine(_baseUploadPath, relativePath);

                if (!File.Exists(fullPath))
                    return 0;

                FileInfo fileInfo = new FileInfo(fullPath);
                return fileInfo.Length;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting file size: {Path}", relativePath);
                return 0;
            }
        }

        public string GetContentType(string fileName)
        {
            string extension = Path.GetExtension(fileName).ToLowerInvariant();

            return extension switch
            {
                // Documents
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls" => "application/vnd.ms-excel",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".ppt" => "application/vnd.ms-powerpoint",
                ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                ".txt" => "text/plain",
                ".csv" => "text/csv",
                ".md" => "text/markdown",

                // Code/Scripts
                ".sql" => "application/sql",
                ".json" => "application/json",
                ".xml" => "application/xml",
                ".js" => "application/javascript",
                ".ts" => "application/typescript",
                ".cs" => "text/x-csharp",
                ".py" => "text/x-python",

                // Images
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".bmp" => "image/bmp",
                ".svg" => "image/svg+xml",

                // Archives
                ".zip" => "application/zip",
                ".rar" => "application/x-rar-compressed",
                ".7z" => "application/x-7z-compressed",
                ".tar" => "application/x-tar",
                ".gz" => "application/gzip",

                // Default
                _ => "application/octet-stream"
            };
        }

        private string SanitizeFileName(string fileName)
        {
            // Remove invalid characters
            char[] invalidChars = Path.GetInvalidFileNameChars();
            string safe = string.Join("_", fileName.Split(invalidChars));

            // Remove leading/trailing spaces and dots
            safe = safe.Trim().TrimEnd('.');

            // Limit length (keep extension)
            if (safe.Length > 200)
            {
                string extension = Path.GetExtension(safe);
                string nameWithoutExt = Path.GetFileNameWithoutExtension(safe);
                safe = nameWithoutExt.Substring(0, 200 - extension.Length) + extension;
            }

            return safe;
        }

        private async Task CleanupEmptyDirectoriesAsync(string directoryPath)
        {
            try
            {
                if (string.IsNullOrEmpty(directoryPath) || !Directory.Exists(directoryPath))
                    return;

                // Don't delete base upload path
                if (directoryPath == _baseUploadPath)
                    return;

                // Check if directory is empty
                if (!Directory.EnumerateFileSystemEntries(directoryPath).Any())
                {
                    Directory.Delete(directoryPath);
                    _logger.LogInformation("Deleted empty directory: {Path}", directoryPath);

                    // Recursively clean parent directories
                    await CleanupEmptyDirectoriesAsync(Path.GetDirectoryName(directoryPath));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up directories: {Path}", directoryPath);
            }
        }
    }
}

// =============================================
// UPDATED CONTROLLER with File Upload/Download
// =============================================

// File: Controllers/CustomizationsController.cs (UPDATED)
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;
using ClientManagement.Services;

namespace ClientManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CustomizationsController : ControllerBase
    {
        private readonly ICustomizationRepository _repository;
        private readonly IFileStorageService _fileStorage;
        private readonly ILogger<CustomizationsController> _logger;

        public CustomizationsController(
            ICustomizationRepository repository,
            IFileStorageService fileStorage,
            ILogger<CustomizationsController> logger)
        {
            _repository = repository;
            _fileStorage = fileStorage;
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
                // Get all documents first to delete files
                var documents = await _repository.GetDocumentsAsync(id);
                foreach (var doc in documents)
                {
                    await _fileStorage.DeleteFileAsync(doc.FilePath);
                }

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

        // POST: api/customizations/5/documents/upload
        [HttpPost("{id}/documents/upload")]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<ActionResult<CustomizationDocumentDto>> UploadDocument(
            int id,
            [FromForm] IFormFile file,
            [FromForm] string? documentType = null,
            [FromForm] string? description = null,
            [FromForm] string? uploadedBy = null)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file provided");

                // Validate file size (100 MB max)
                if (file.Length > 100_000_000)
                    return BadRequest("File size exceeds 100 MB limit");

                // Get customization to verify it exists and get clientId
                var customization = await _repository.GetCustomizationByIdAsync(id);
                if (customization == null)
                    return NotFound("Customization not found");

                // Save file to disk
                string relativePath = await _fileStorage.SaveFileAsync(
                    customization.ClientId,
                    id,
                    file,
                    uploadedBy ?? User.Identity?.Name ?? "Unknown"
                );

                // Create document record in database
                var createDto = new CreateCustomizationDocumentDto
                {
                    CustomizationId = id,
                    FileName = file.FileName,
                    FilePath = relativePath,
                    FileSize = file.Length,
                    FileType = file.ContentType,
                    DocumentType = documentType,
                    Description = description,
                    UploadedBy = uploadedBy ?? User.Identity?.Name
                };

                var document = await _repository.CreateDocumentAsync(createDto);
                
                _logger.LogInformation(
                    "Document uploaded: {FileName} for customization {CustomizationId}",
                    file.FileName,
                    id
                );

                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document for customization {CustomizationId}", id);
                return StatusCode(500, "An error occurred while uploading the document");
            }
        }

        // GET: api/customizations/documents/5/download
        [HttpGet("documents/{documentId}/download")]
        public async Task<IActionResult> DownloadDocument(int documentId)
        {
            try
            {
                // Get document from database
                var document = await _repository.GetDocumentByIdAsync(documentId);
                if (document == null)
                    return NotFound("Document not found");

                // Get file from disk
                var fileData = await _fileStorage.GetFileAsync(document.FilePath);
                if (fileData == null)
                    return NotFound("File not found on disk");

                _logger.LogInformation("Document downloaded: {FileName}", document.FileName);

                // Return file
                return File(fileData.Value.fileBytes, fileData.Value.contentType, fileData.Value.fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading document {DocumentId}", documentId);
                return StatusCode(500, "An error occurred while downloading the document");
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
                // Get document to get file path
                var document = await _repository.GetDocumentByIdAsync(id);
                if (document == null)
                    return NotFound("Document not found");

                // Delete file from disk
                await _fileStorage.DeleteFileAsync(document.FilePath);

                // Delete record from database
                await _repository.DeleteDocumentAsync(id);

                _logger.LogInformation("Document deleted: {FileName}", document.FileName);

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
// builder.Services.AddScoped<IFileStorageService, FileStorageService>();

// Optional: Configure file storage path in appsettings.json
// {
//   "FileStorage": {
//     "BasePath": "D:\\ClientManagementFiles\\uploads"
//   }
// }
