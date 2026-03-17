using ClientManagementAPI.Models.DTOs;
using ClientManagementAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClientManagementAPI.Controllers;

// ===========================
// VPN Controller
// ===========================

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VPNController : ControllerBase
{
    private readonly IVPNRepository _vpnRepository;

    public VPNController(IVPNRepository vpnRepository)
    {
        _vpnRepository = vpnRepository;
    }

    [HttpGet("client/{clientId}")]
    public async Task<ActionResult<IEnumerable<VPNConfigurationDto>>> GetByClient(int clientId)
    {
        var vpns = await _vpnRepository.GetByClientAsync(clientId);
        return Ok(vpns);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VPNConfigurationDto>> GetById(int id)
    {
        var vpn = await _vpnRepository.GetByIdAsync(id);
        if (vpn == null) return NotFound();
        return Ok(vpn);
    }

    [HttpPost]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult<VPNConfigurationDto>> Create([FromBody] CreateVPNConfigurationDto dto)
    {
        var vpnId = await _vpnRepository.CreateAsync(dto);
        var vpn = await _vpnRepository.GetByIdAsync(vpnId);
        return CreatedAtAction(nameof(GetById), new { id = vpnId }, vpn);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateVPNConfigurationDto dto)
    {
        if (id != dto.VPNId) return BadRequest();
        await _vpnRepository.UpdateAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Delete(int id)
    {
        await _vpnRepository.DeleteAsync(id);
        return NoContent();
    }
}

// ===========================
// Connections Controller
// ===========================

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConnectionsController : ControllerBase
{
    private readonly IConnectionRepository _connectionRepository;

    public ConnectionsController(IConnectionRepository connectionRepository)
    {
        _connectionRepository = connectionRepository;
    }

    [HttpGet("client/{clientId}")]
    public async Task<ActionResult<IEnumerable<ConnectionDto>>> GetByClient(int clientId)
    {
        var connections = await _connectionRepository.GetByClientAsync(clientId);
        return Ok(connections);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ConnectionDto>> GetById(int id)
    {
        var connection = await _connectionRepository.GetByIdAsync(id);
        if (connection == null) return NotFound();
        return Ok(connection);
    }

    [HttpPost]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult<ConnectionDto>> Create([FromBody] CreateConnectionDto dto)
    {
        var connectionId = await _connectionRepository.CreateAsync(dto);
        var connection = await _connectionRepository.GetByIdAsync(connectionId);
        return CreatedAtAction(nameof(GetById), new { id = connectionId }, connection);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateConnectionDto dto)
    {
        if (id != dto.ConnectionId) return BadRequest();
        await _connectionRepository.UpdateAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Delete(int id)
    {
        await _connectionRepository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("test")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult<TestConnectionResultDto>> Test([FromBody] TestConnectionDto dto)
    {
        // Simple mock test - replace with actual connection testing logic
        return Ok(new TestConnectionResultDto
        {
            Success = true,
            Message = "Connection test successful",
            ResponseTime = 125
        });
    }
}

public class TestConnectionDto
{
    public int ConnectionId { get; set; }
}

// ===========================
// Servers Controller
// ===========================

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin,devops")]
public class ServersController : ControllerBase
{
    private readonly IServerRepository _serverRepository;

    public ServersController(IServerRepository serverRepository)
    {
        _serverRepository = serverRepository;
    }

    [HttpGet("client/{clientId}")]
    public async Task<ActionResult<IEnumerable<ServerDto>>> GetByClient(int clientId)
    {
        var servers = await _serverRepository.GetByClientAsync(clientId);
        return Ok(servers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServerDto>> GetById(int id)
    {
        var server = await _serverRepository.GetByIdAsync(id);
        if (server == null) return NotFound();
        return Ok(server);
    }

    [HttpPost]
    public async Task<ActionResult<ServerDto>> Create([FromBody] CreateServerDto dto)
    {
        var serverId = await _serverRepository.CreateAsync(dto);
        var server = await _serverRepository.GetByIdAsync(serverId);
        return CreatedAtAction(nameof(GetById), new { id = serverId }, server);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateServerDto dto)
    {
        if (id != dto.ServerId) return BadRequest();
        await _serverRepository.UpdateAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _serverRepository.DeleteAsync(id);
        return NoContent();
    }
}

// ===========================
// Contacts Controller
// ===========================

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
    public async Task<ActionResult<IEnumerable<ContactDto>>> GetByClient(int clientId)
    {
        var contacts = await _contactRepository.GetByClientAsync(clientId);
        return Ok(contacts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContactDto>> GetById(int id)
    {
        var contact = await _contactRepository.GetByIdAsync(id);
        if (contact == null) return NotFound();
        return Ok(contact);
    }

    [HttpPost]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult<ContactDto>> Create([FromBody] CreateContactDto dto)
    {
        var contactId = await _contactRepository.CreateAsync(dto);
        var contact = await _contactRepository.GetByIdAsync(contactId);
        return CreatedAtAction(nameof(GetById), new { id = contactId }, contact);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateContactDto dto)
    {
        if (id != dto.ContactId) return BadRequest();
        await _contactRepository.UpdateAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Delete(int id)
    {
        await _contactRepository.DeleteAsync(id);
        return NoContent();
    }
}

// ===========================
// Licenses Controller
// ===========================

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
    public async Task<ActionResult<IEnumerable<LicenseDto>>> GetByClient(int clientId)
    {
        var licenses = await _licenseRepository.GetByClientAsync(clientId);
        return Ok(licenses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LicenseDto>> GetById(int id)
    {
        var license = await _licenseRepository.GetByIdAsync(id);
        if (license == null) return NotFound();
        return Ok(license);
    }

    [HttpGet("expiring")]
    public async Task<ActionResult<IEnumerable<LicenseDto>>> GetExpiring([FromQuery] int days = 30)
    {
        var licenses = await _licenseRepository.GetExpiringAsync(days);
        return Ok(licenses);
    }

    [HttpPost]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult<LicenseDto>> Create([FromBody] CreateLicenseDto dto)
    {
        var licenseId = await _licenseRepository.CreateAsync(dto);
        var license = await _licenseRepository.GetByIdAsync(licenseId);
        return CreatedAtAction(nameof(GetById), new { id = licenseId }, license);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateLicenseDto dto)
    {
        if (id != dto.LicenseId) return BadRequest();
        await _licenseRepository.UpdateAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Delete(int id)
    {
        await _licenseRepository.DeleteAsync(id);
        return NoContent();
    }
}

// ===========================
// Tickets Controller
// ===========================

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
    public async Task<ActionResult<IEnumerable<TicketDto>>> GetAll()
    {
        var tickets = await _ticketRepository.GetAllAsync();
        return Ok(tickets);
    }

    [HttpGet("client/{clientId}")]
    public async Task<ActionResult<IEnumerable<TicketDto>>> GetByClient(int clientId)
    {
        var tickets = await _ticketRepository.GetByClientAsync(clientId);
        return Ok(tickets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketDto>> GetById(int id)
    {
        var ticket = await _ticketRepository.GetByIdAsync(id);
        if (ticket == null) return NotFound();
        return Ok(ticket);
    }

    [HttpGet("{id}/comments")]
    public async Task<ActionResult<IEnumerable<TicketCommentDto>>> GetComments(int id)
    {
        var comments = await _ticketRepository.GetCommentsAsync(id);
        return Ok(comments);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<TicketStatisticsDto>> GetStatistics()
    {
        var stats = await _ticketRepository.GetStatisticsAsync();
        return Ok(stats);
    }

    [HttpPost]
    public async Task<ActionResult<TicketDto>> Create([FromBody] CreateTicketDto dto)
    {
        var ticketId = await _ticketRepository.CreateAsync(dto);
        var ticket = await _ticketRepository.GetByIdAsync(ticketId);
        return CreatedAtAction(nameof(GetById), new { id = ticketId }, ticket);
    }

    [HttpPost("comments")]
    public async Task<ActionResult> CreateComment([FromBody] CreateTicketCommentDto dto)
    {
        await _ticketRepository.CreateCommentAsync(dto);
        return Ok();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateTicketDto dto)
    {
        if (id != dto.TicketId) return BadRequest();
        await _ticketRepository.UpdateAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> Delete(int id)
    {
        await _ticketRepository.DeleteAsync(id);
        return NoContent();
    }
}

// ===========================
// Updates Controller
// ===========================

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
    public async Task<ActionResult<IEnumerable<UpdateDto>>> GetAll()
    {
        var updates = await _updateRepository.GetAllAsync();
        return Ok(updates);
    }

    [HttpGet("client/{clientId}")]
    public async Task<ActionResult<IEnumerable<UpdateDto>>> GetByClient(int clientId)
    {
        var updates = await _updateRepository.GetByClientAsync(clientId);
        return Ok(updates);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UpdateDto>> GetById(int id)
    {
        var update = await _updateRepository.GetByIdAsync(id);
        if (update == null) return NotFound();
        return Ok(update);
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<IEnumerable<UpdateDto>>> GetUpcoming([FromQuery] int days = 7)
    {
        var updates = await _updateRepository.GetUpcomingAsync(days);
        return Ok(updates);
    }

    [HttpPost]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult<UpdateDto>> Create([FromBody] CreateUpdateDto dto)
    {
        var updateId = await _updateRepository.CreateAsync(dto);
        var update = await _updateRepository.GetByIdAsync(updateId);
        return CreatedAtAction(nameof(GetById), new { id = updateId }, update);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateUpdateDto dto)
    {
        if (id != dto.UpdateId) return BadRequest();
        await _updateRepository.UpdateAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> Delete(int id)
    {
        await _updateRepository.DeleteAsync(id);
        return NoContent();
    }
}
