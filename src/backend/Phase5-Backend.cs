// =============================================
// Phase 5: Contact & License Management
// Backend C# Code
// =============================================

// =============================================
// DTOs
// =============================================

// File: Models/DTOs/ContactDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ContactDto
    {
        public int ContactId { get; set; }
        public int ClientId { get; set; }
        public string Name { get; set; }
        public string? Role { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        public string? Department { get; set; }
        public bool IsPrimary { get; set; }
        public string? Notes { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/CreateContactDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateContactDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [StringLength(100)]
        public string? Role { get; set; }
        
        [EmailAddress]
        [StringLength(255)]
        public string? Email { get; set; }
        
        [StringLength(50)]
        public string? Phone { get; set; }
        
        [StringLength(50)]
        public string? Mobile { get; set; }
        
        [StringLength(100)]
        public string? Department { get; set; }
        
        public bool IsPrimary { get; set; } = false;
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/UpdateContactDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateContactDto
    {
        [Required]
        public int ContactId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [StringLength(100)]
        public string? Role { get; set; }
        
        [EmailAddress]
        [StringLength(255)]
        public string? Email { get; set; }
        
        [StringLength(50)]
        public string? Phone { get; set; }
        
        [StringLength(50)]
        public string? Mobile { get; set; }
        
        [StringLength(100)]
        public string? Department { get; set; }
        
        [Required]
        public bool IsPrimary { get; set; }
        
        public string? Notes { get; set; }
    }
}

// File: Models/DTOs/LicenseDto.cs
namespace ClientManagement.Models.DTOs
{
    public class LicenseDto
    {
        public int LicenseId { get; set; }
        public int ClientId { get; set; }
        public string ProductName { get; set; }
        public string? LicenseKey { get; set; }
        public string? LicenseType { get; set; }
        public int? Quantity { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime? RenewalDate { get; set; }
        public decimal? Cost { get; set; }
        public string? Vendor { get; set; }
        public string? SupportLevel { get; set; }
        public string Status { get; set; }
        public string? Notes { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

// File: Models/DTOs/CreateLicenseDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateLicenseDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string ProductName { get; set; }
        
        [StringLength(500)]
        public string? LicenseKey { get; set; }
        
        public string? LicenseType { get; set; }
        
        public int? Quantity { get; set; }
        
        public DateTime? PurchaseDate { get; set; }
        
        public DateTime? ExpiryDate { get; set; }
        
        public DateTime? RenewalDate { get; set; }
        
        public decimal? Cost { get; set; }
        
        [StringLength(255)]
        public string? Vendor { get; set; }
        
        [StringLength(100)]
        public string? SupportLevel { get; set; }
        
        public string Status { get; set; } = "active";
        
        public string? Notes { get; set; }
        
        [StringLength(100)]
        public string? PerformedBy { get; set; }
    }
}

// File: Models/DTOs/UpdateLicenseDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateLicenseDto
    {
        [Required]
        public int LicenseId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string ProductName { get; set; }
        
        [StringLength(500)]
        public string? LicenseKey { get; set; }
        
        public string? LicenseType { get; set; }
        
        public int? Quantity { get; set; }
        
        public DateTime? PurchaseDate { get; set; }
        
        public DateTime? ExpiryDate { get; set; }
        
        public DateTime? RenewalDate { get; set; }
        
        public decimal? Cost { get; set; }
        
        [StringLength(255)]
        public string? Vendor { get; set; }
        
        [StringLength(100)]
        public string? SupportLevel { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        public string? Notes { get; set; }
        
        [StringLength(100)]
        public string? PerformedBy { get; set; }
    }
}

// File: Models/DTOs/RenewLicenseDto.cs
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class RenewLicenseDto
    {
        [Required]
        public int LicenseId { get; set; }
        
        [Required]
        public DateTime NewExpiryDate { get; set; }
        
        public decimal? Cost { get; set; }
        
        public string? Notes { get; set; }
        
        [StringLength(100)]
        public string? PerformedBy { get; set; }
    }
}

// File: Models/DTOs/LicenseHistoryDto.cs
namespace ClientManagement.Models.DTOs
{
    public class LicenseHistoryDto
    {
        public int HistoryId { get; set; }
        public int LicenseId { get; set; }
        public string Action { get; set; }
        public DateTime? PreviousExpiryDate { get; set; }
        public DateTime? NewExpiryDate { get; set; }
        public decimal? Cost { get; set; }
        public string? Notes { get; set; }
        public string? PerformedBy { get; set; }
        public DateTime ActionDate { get; set; }
    }
}

// File: Models/DTOs/ExpiringLicenseDto.cs
namespace ClientManagement.Models.DTOs
{
    public class ExpiringLicenseDto
    {
        public int LicenseId { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string ProductName { get; set; }
        public string? LicenseType { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? Vendor { get; set; }
        public decimal? Cost { get; set; }
        public int DaysUntilExpiry { get; set; }
    }
}

// =============================================
// REPOSITORIES
// =============================================

// File: Repositories/IContactRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IContactRepository
    {
        Task<IEnumerable<ContactDto>> GetContactsAsync(int clientId, bool includeArchived = false);
        Task<ContactDto?> GetContactByIdAsync(int contactId);
        Task<ContactDto> CreateContactAsync(CreateContactDto dto);
        Task<ContactDto?> UpdateContactAsync(UpdateContactDto dto);
        Task<bool> ArchiveContactAsync(int contactId, bool isArchived);
        Task<bool> DeleteContactAsync(int contactId);
    }
}

// File: Repositories/ContactRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class ContactRepository : IContactRepository
    {
        private readonly string _connectionString;

        public ContactRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<ContactDto>> GetContactsAsync(int clientId, bool includeArchived = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@IncludeArchived", includeArchived);

                var contacts = await connection.QueryAsync<ContactDto>(
                    "sp_GetContacts",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return contacts;
            }
        }

        public async Task<ContactDto?> GetContactByIdAsync(int contactId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ContactId", contactId);

                var contact = await connection.QueryFirstOrDefaultAsync<ContactDto>(
                    "sp_GetContactById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return contact;
            }
        }

        public async Task<ContactDto> CreateContactAsync(CreateContactDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Role", dto.Role);
                parameters.Add("@Email", dto.Email);
                parameters.Add("@Phone", dto.Phone);
                parameters.Add("@Mobile", dto.Mobile);
                parameters.Add("@Department", dto.Department);
                parameters.Add("@IsPrimary", dto.IsPrimary);
                parameters.Add("@Notes", dto.Notes);

                var contact = await connection.QueryFirstAsync<ContactDto>(
                    "sp_CreateContact",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return contact;
            }
        }

        public async Task<ContactDto?> UpdateContactAsync(UpdateContactDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ContactId", dto.ContactId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Role", dto.Role);
                parameters.Add("@Email", dto.Email);
                parameters.Add("@Phone", dto.Phone);
                parameters.Add("@Mobile", dto.Mobile);
                parameters.Add("@Department", dto.Department);
                parameters.Add("@IsPrimary", dto.IsPrimary);
                parameters.Add("@Notes", dto.Notes);

                var contact = await connection.QueryFirstOrDefaultAsync<ContactDto>(
                    "sp_UpdateContact",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return contact;
            }
        }

        public async Task<bool> ArchiveContactAsync(int contactId, bool isArchived)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ContactId", contactId);
                parameters.Add("@IsArchived", isArchived);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_ArchiveContact",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<bool> DeleteContactAsync(int contactId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ContactId", contactId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteContact",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }
    }
}

// File: Repositories/ILicenseRepository.cs
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface ILicenseRepository
    {
        Task<IEnumerable<LicenseDto>> GetLicensesAsync(int clientId, bool includeArchived = false);
        Task<LicenseDto?> GetLicenseByIdAsync(int licenseId);
        Task<LicenseDto> CreateLicenseAsync(CreateLicenseDto dto);
        Task<LicenseDto?> UpdateLicenseAsync(UpdateLicenseDto dto);
        Task<LicenseDto?> RenewLicenseAsync(RenewLicenseDto dto);
        Task<IEnumerable<LicenseHistoryDto>> GetLicenseHistoryAsync(int licenseId);
        Task<IEnumerable<ExpiringLicenseDto>> GetExpiringLicensesAsync(int days = 30);
        Task<bool> ArchiveLicenseAsync(int licenseId, bool isArchived);
        Task<bool> DeleteLicenseAsync(int licenseId);
    }
}

// File: Repositories/LicenseRepository.cs
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class LicenseRepository : ILicenseRepository
    {
        private readonly string _connectionString;

        public LicenseRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<LicenseDto>> GetLicensesAsync(int clientId, bool includeArchived = false)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);
                parameters.Add("@IncludeArchived", includeArchived);

                var licenses = await connection.QueryAsync<LicenseDto>(
                    "sp_GetLicenses",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return licenses;
            }
        }

        public async Task<LicenseDto?> GetLicenseByIdAsync(int licenseId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@LicenseId", licenseId);

                var license = await connection.QueryFirstOrDefaultAsync<LicenseDto>(
                    "sp_GetLicenseById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return license;
            }
        }

        public async Task<LicenseDto> CreateLicenseAsync(CreateLicenseDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@ProductName", dto.ProductName);
                parameters.Add("@LicenseKey", dto.LicenseKey);
                parameters.Add("@LicenseType", dto.LicenseType);
                parameters.Add("@Quantity", dto.Quantity);
                parameters.Add("@PurchaseDate", dto.PurchaseDate);
                parameters.Add("@ExpiryDate", dto.ExpiryDate);
                parameters.Add("@RenewalDate", dto.RenewalDate);
                parameters.Add("@Cost", dto.Cost);
                parameters.Add("@Vendor", dto.Vendor);
                parameters.Add("@SupportLevel", dto.SupportLevel);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Notes", dto.Notes);
                parameters.Add("@PerformedBy", dto.PerformedBy);

                var license = await connection.QueryFirstAsync<LicenseDto>(
                    "sp_CreateLicense",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return license;
            }
        }

        public async Task<LicenseDto?> UpdateLicenseAsync(UpdateLicenseDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@LicenseId", dto.LicenseId);
                parameters.Add("@ProductName", dto.ProductName);
                parameters.Add("@LicenseKey", dto.LicenseKey);
                parameters.Add("@LicenseType", dto.LicenseType);
                parameters.Add("@Quantity", dto.Quantity);
                parameters.Add("@PurchaseDate", dto.PurchaseDate);
                parameters.Add("@ExpiryDate", dto.ExpiryDate);
                parameters.Add("@RenewalDate", dto.RenewalDate);
                parameters.Add("@Cost", dto.Cost);
                parameters.Add("@Vendor", dto.Vendor);
                parameters.Add("@SupportLevel", dto.SupportLevel);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Notes", dto.Notes);
                parameters.Add("@PerformedBy", dto.PerformedBy);

                var license = await connection.QueryFirstOrDefaultAsync<LicenseDto>(
                    "sp_UpdateLicense",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return license;
            }
        }

        public async Task<LicenseDto?> RenewLicenseAsync(RenewLicenseDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@LicenseId", dto.LicenseId);
                parameters.Add("@NewExpiryDate", dto.NewExpiryDate);
                parameters.Add("@Cost", dto.Cost);
                parameters.Add("@Notes", dto.Notes);
                parameters.Add("@PerformedBy", dto.PerformedBy);

                var license = await connection.QueryFirstOrDefaultAsync<LicenseDto>(
                    "sp_RenewLicense",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return license;
            }
        }

        public async Task<IEnumerable<LicenseHistoryDto>> GetLicenseHistoryAsync(int licenseId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@LicenseId", licenseId);

                var history = await connection.QueryAsync<LicenseHistoryDto>(
                    "sp_GetLicenseHistory",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return history;
            }
        }

        public async Task<IEnumerable<ExpiringLicenseDto>> GetExpiringLicensesAsync(int days = 30)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Days", days);

                var licenses = await connection.QueryAsync<ExpiringLicenseDto>(
                    "sp_GetExpiringLicenses",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return licenses;
            }
        }

        public async Task<bool> ArchiveLicenseAsync(int licenseId, bool isArchived)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@LicenseId", licenseId);
                parameters.Add("@IsArchived", isArchived);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_ArchiveLicense",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }

        public async Task<bool> DeleteLicenseAsync(int licenseId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@LicenseId", licenseId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteLicense",
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

// File: Controllers/ContactsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContactsController : ControllerBase
    {
        private readonly IContactRepository _contactRepository;

        public ContactsController(IContactRepository contactRepository)
        {
            _contactRepository = contactRepository;
        }

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<ContactDto>>> GetContacts(
            int clientId,
            [FromQuery] bool includeArchived = false)
        {
            var contacts = await _contactRepository.GetContactsAsync(clientId, includeArchived);
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDto>> GetContactById(int id)
        {
            var contact = await _contactRepository.GetContactByIdAsync(id);

            if (contact == null)
            {
                return NotFound(new { message = $"Contact with ID {id} not found" });
            }

            return Ok(contact);
        }

        [HttpPost]
        [Authorize(Roles = "admin,devops,delivery")]
        public async Task<ActionResult<ContactDto>> CreateContact([FromBody] CreateContactDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contact = await _contactRepository.CreateContactAsync(dto);
            return CreatedAtAction(nameof(GetContactById), new { id = contact.ContactId }, contact);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,devops,delivery")]
        public async Task<ActionResult<ContactDto>> UpdateContact(int id, [FromBody] UpdateContactDto dto)
        {
            if (id != dto.ContactId)
            {
                return BadRequest(new { message = "Contact ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contact = await _contactRepository.UpdateContactAsync(dto);

            if (contact == null)
            {
                return NotFound(new { message = $"Contact with ID {id} not found" });
            }

            return Ok(contact);
        }

        [HttpPatch("{id}/archive")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> ArchiveContact(int id, [FromBody] bool isArchived)
        {
            var success = await _contactRepository.ArchiveContactAsync(id, isArchived);

            if (!success)
            {
                return NotFound(new { message = $"Contact with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteContact(int id)
        {
            var success = await _contactRepository.DeleteContactAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"Contact with ID {id} not found" });
            }

            return NoContent();
        }
    }
}

// File: Controllers/LicensesController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LicensesController : ControllerBase
    {
        private readonly ILicenseRepository _licenseRepository;

        public LicensesController(ILicenseRepository licenseRepository)
        {
            _licenseRepository = licenseRepository;
        }

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<LicenseDto>>> GetLicenses(
            int clientId,
            [FromQuery] bool includeArchived = false)
        {
            var licenses = await _licenseRepository.GetLicensesAsync(clientId, includeArchived);
            return Ok(licenses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LicenseDto>> GetLicenseById(int id)
        {
            var license = await _licenseRepository.GetLicenseByIdAsync(id);

            if (license == null)
            {
                return NotFound(new { message = $"License with ID {id} not found" });
            }

            return Ok(license);
        }

        [HttpPost]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<LicenseDto>> CreateLicense([FromBody] CreateLicenseDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var license = await _licenseRepository.CreateLicenseAsync(dto);
            return CreatedAtAction(nameof(GetLicenseById), new { id = license.LicenseId }, license);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<LicenseDto>> UpdateLicense(int id, [FromBody] UpdateLicenseDto dto)
        {
            if (id != dto.LicenseId)
            {
                return BadRequest(new { message = "License ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var license = await _licenseRepository.UpdateLicenseAsync(dto);

            if (license == null)
            {
                return NotFound(new { message = $"License with ID {id} not found" });
            }

            return Ok(license);
        }

        [HttpPost("{id}/renew")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<LicenseDto>> RenewLicense(int id, [FromBody] RenewLicenseDto dto)
        {
            if (id != dto.LicenseId)
            {
                return BadRequest(new { message = "License ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var license = await _licenseRepository.RenewLicenseAsync(dto);

            if (license == null)
            {
                return NotFound(new { message = $"License with ID {id} not found" });
            }

            return Ok(license);
        }

        [HttpGet("{id}/history")]
        public async Task<ActionResult<IEnumerable<LicenseHistoryDto>>> GetLicenseHistory(int id)
        {
            var history = await _licenseRepository.GetLicenseHistoryAsync(id);
            return Ok(history);
        }

        [HttpGet("expiring")]
        public async Task<ActionResult<IEnumerable<ExpiringLicenseDto>>> GetExpiringLicenses([FromQuery] int days = 30)
        {
            var licenses = await _licenseRepository.GetExpiringLicensesAsync(days);
            return Ok(licenses);
        }

        [HttpPatch("{id}/archive")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult> ArchiveLicense(int id, [FromBody] bool isArchived)
        {
            var success = await _licenseRepository.ArchiveLicenseAsync(id, isArchived);

            if (!success)
            {
                return NotFound(new { message = $"License with ID {id} not found" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteLicense(int id)
        {
            var success = await _licenseRepository.DeleteLicenseAsync(id);

            if (!success)
            {
                return NotFound(new { message = $"License with ID {id} not found" });
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

// Register Phase 5 repositories
builder.Services.AddScoped<IContactRepository, ContactRepository>();
builder.Services.AddScoped<ILicenseRepository, LicenseRepository>();
*/
