using ClientManagementAPI.Models.DTOs.Clients;
using ClientManagementAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClientManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly IClientRepository _clientRepository;

    public ClientsController(IClientRepository clientRepository)
    {
        _clientRepository = clientRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientDto>>> GetAll()
    {
        var clients = await _clientRepository.GetAllAsync();
        return Ok(clients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClientDto>> GetById(int id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
        {
            return NotFound(new { message = $"Client with ID {id} not found" });
        }
        return Ok(client);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ClientDto>> Create([FromBody] CreateClientDto dto)
    {
        var clientId = await _clientRepository.CreateAsync(dto);
        var client = await _clientRepository.GetByIdAsync(clientId);
        return CreatedAtAction(nameof(GetById), new { id = clientId }, client);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateClientDto dto)
    {
        if (id != dto.ClientId)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        var existing = await _clientRepository.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound(new { message = $"Client with ID {id} not found" });
        }

        await _clientRepository.UpdateAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> Delete(int id)
    {
        var existing = await _clientRepository.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound(new { message = $"Client with ID {id} not found" });
        }

        await _clientRepository.DeleteAsync(id);
        return NoContent();
    }
}
