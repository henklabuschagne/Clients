using System.ComponentModel.DataAnnotations;

namespace ClientManagementAPI.Models.DTOs;

// ===========================
// VPN DTOs
// ===========================

public class VPNConfigurationDto
{
    public int VPNId { get; set; }
    public int ClientId { get; set; }
    public string VPNType { get; set; } = string.Empty;
    public string ServerAddress { get; set; } = string.Empty;
    public int Port { get; set; }
    public string? Protocol { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? CertificatePath { get; set; }
    public string? ConfigFile { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastConnected { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateVPNConfigurationDto
{
    [Required]
    public int ClientId { get; set; }
    [Required]
    public string VPNType { get; set; } = string.Empty;
    [Required]
    public string ServerAddress { get; set; } = string.Empty;
    [Required]
    public int Port { get; set; }
    public string? Protocol { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? CertificatePath { get; set; }
    public string? ConfigFile { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }
}

public class UpdateVPNConfigurationDto : CreateVPNConfigurationDto
{
    [Required]
    public int VPNId { get; set; }
}

// ===========================
// Connection DTOs
// ===========================

public class ConnectionDto
{
    public int ConnectionId { get; set; }
    public int ClientId { get; set; }
    public string ConnectionType { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; }
    public string? DatabaseName { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? ConnectionString { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastTested { get; set; }
    public string? TestStatus { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateConnectionDto
{
    [Required]
    public int ClientId { get; set; }
    [Required]
    public string ConnectionType { get; set; } = string.Empty;
    [Required]
    public string Name { get; set; } = string.Empty;
    [Required]
    public string Host { get; set; } = string.Empty;
    [Required]
    public int Port { get; set; }
    public string? DatabaseName { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? ConnectionString { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }
}

public class UpdateConnectionDto : CreateConnectionDto
{
    [Required]
    public int ConnectionId { get; set; }
}

public class TestConnectionResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int? ResponseTime { get; set; }
}

// ===========================
// Server DTOs
// ===========================

public class ServerDto
{
    public int ServerId { get; set; }
    public int ClientId { get; set; }
    public string ServerName { get; set; } = string.Empty;
    public string ServerType { get; set; } = string.Empty;
    public string IPAddress { get; set; } = string.Empty;
    public string? Hostname { get; set; }
    public string? OperatingSystem { get; set; }
    public int? CPUCores { get; set; }
    public int? RAMGB { get; set; }
    public int? DiskGB { get; set; }
    public string? Location { get; set; }
    public string? Provider { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastHealthCheck { get; set; }
    public string? HealthStatus { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateServerDto
{
    [Required]
    public int ClientId { get; set; }
    [Required]
    public string ServerName { get; set; } = string.Empty;
    [Required]
    public string ServerType { get; set; } = string.Empty;
    [Required]
    public string IPAddress { get; set; } = string.Empty;
    public string? Hostname { get; set; }
    public string? OperatingSystem { get; set; }
    public int? CPUCores { get; set; }
    public int? RAMGB { get; set; }
    public int? DiskGB { get; set; }
    public string? Location { get; set; }
    public string? Provider { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }
}

public class UpdateServerDto : CreateServerDto
{
    [Required]
    public int ServerId { get; set; }
}

// ===========================
// Contact DTOs
// ===========================

public class ContactDto
{
    public int ContactId { get; set; }
    public int ClientId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Mobile { get; set; }
    public string? Position { get; set; }
    public string? Department { get; set; }
    public bool IsPrimary { get; set; }
    public bool IsActive { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateContactDto
{
    [Required]
    public int ClientId { get; set; }
    [Required]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    public string LastName { get; set; } = string.Empty;
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Mobile { get; set; }
    public string? Position { get; set; }
    public string? Department { get; set; }
    public bool IsPrimary { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }
}

public class UpdateContactDto : CreateContactDto
{
    [Required]
    public int ContactId { get; set; }
}

// ===========================
// License DTOs
// ===========================

public class LicenseDto
{
    public int LicenseId { get; set; }
    public int ClientId { get; set; }
    public string SoftwareName { get; set; } = string.Empty;
    public string LicenseKey { get; set; } = string.Empty;
    public string LicenseType { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime PurchaseDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime? RenewalDate { get; set; }
    public decimal? Cost { get; set; }
    public string? Currency { get; set; }
    public string? Vendor { get; set; }
    public bool IsActive { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateLicenseDto
{
    [Required]
    public int ClientId { get; set; }
    [Required]
    public string SoftwareName { get; set; } = string.Empty;
    [Required]
    public string LicenseKey { get; set; } = string.Empty;
    [Required]
    public string LicenseType { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    [Required]
    public DateTime PurchaseDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime? RenewalDate { get; set; }
    public decimal? Cost { get; set; }
    public string? Currency { get; set; }
    public string? Vendor { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }
}

public class UpdateLicenseDto : CreateLicenseDto
{
    [Required]
    public int LicenseId { get; set; }
}

// ===========================
// Ticket DTOs
// ===========================

public class TicketDto
{
    public int TicketId { get; set; }
    public int ClientId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int? AssignedTo { get; set; }
    public int? ReportedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
}

public class CreateTicketDto
{
    [Required]
    public int ClientId { get; set; }
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Description { get; set; } = string.Empty;
    [Required]
    public string Priority { get; set; } = string.Empty;
    [Required]
    public string Status { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int? AssignedTo { get; set; }
    public int? ReportedBy { get; set; }
}

public class UpdateTicketDto : CreateTicketDto
{
    [Required]
    public int TicketId { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
}

public class TicketCommentDto
{
    public int CommentId { get; set; }
    public int TicketId { get; set; }
    public int UserId { get; set; }
    public string? Username { get; set; }
    public string Comment { get; set; } = string.Empty;
    public bool IsInternal { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTicketCommentDto
{
    [Required]
    public int TicketId { get; set; }
    [Required]
    public int UserId { get; set; }
    [Required]
    public string Comment { get; set; } = string.Empty;
    public bool IsInternal { get; set; }
}

public class TicketStatisticsDto
{
    public int TotalTickets { get; set; }
    public int OpenTickets { get; set; }
    public int InProgressTickets { get; set; }
    public int ResolvedTickets { get; set; }
    public int ClosedTickets { get; set; }
    public double? AvgResolutionTime { get; set; }
}

// ===========================
// Update DTOs
// ===========================

public class UpdateDto
{
    public int UpdateId { get; set; }
    public int ClientId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string UpdateType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? ScheduledDate { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int? PerformedBy { get; set; }
    public int? Downtime { get; set; }
    public string? RollbackPlan { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateUpdateDto
{
    [Required]
    public int ClientId { get; set; }
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Description { get; set; } = string.Empty;
    [Required]
    public string Version { get; set; } = string.Empty;
    [Required]
    public string UpdateType { get; set; } = string.Empty;
    [Required]
    public string Status { get; set; } = string.Empty;
    public DateTime? ScheduledDate { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int? PerformedBy { get; set; }
    public int? Downtime { get; set; }
    public string? RollbackPlan { get; set; }
    public string? Notes { get; set; }
}

public class UpdateUpdateDto : CreateUpdateDto
{
    [Required]
    public int UpdateId { get; set; }
}
