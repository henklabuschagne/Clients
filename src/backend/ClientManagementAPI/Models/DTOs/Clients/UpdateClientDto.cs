using System.ComponentModel.DataAnnotations;

namespace ClientManagementAPI.Models.DTOs.Clients;

public class UpdateClientDto : CreateClientDto
{
    [Required]
    public int ClientId { get; set; }
}
