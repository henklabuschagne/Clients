using System.ComponentModel.DataAnnotations;

namespace ClientManagementAPI.Models.DTOs.Clients;

public class CreateClientDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Company { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }

    [Required]
    public string Status { get; set; } = "active";

    public bool Hosted { get; set; }
    public string? InstallLink { get; set; }
    public DateTime? OnboardingDate { get; set; }
    public string? Notes { get; set; }
}
