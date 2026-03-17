using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ClientManagementAPI.Controllers;

// ===========================
// Server Extensions DTOs
// ===========================

public class ServerMetricDto
{
    public int MetricId { get; set; }
    public int ServerId { get; set; }
    public decimal? CPUUsage { get; set; }
    public decimal? RAMUsage { get; set; }
    public decimal? DiskUsage { get; set; }
    public long? NetworkIn { get; set; }
    public long? NetworkOut { get; set; }
    public DateTime RecordedAt { get; set; }
}

public class CreateServerMetricDto
{
    [Required]
    public int ServerId { get; set; }
    public decimal? CPUUsage { get; set; }
    public decimal? RAMUsage { get; set; }
    public decimal? DiskUsage { get; set; }
    public long? NetworkIn { get; set; }
    public long? NetworkOut { get; set; }
}

public class SoftwareInstallationDto
{
    public int InstallationId { get; set; }
    public int ServerId { get; set; }
    public string SoftwareName { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public DateTime InstalledAt { get; set; }
    public string? LicensePath { get; set; }
    public string? Notes { get; set; }
}

public class CreateSoftwareInstallationDto
{
    [Required]
    public int ServerId { get; set; }
    [Required]
    public string SoftwareName { get; set; } = string.Empty;
    [Required]
    public string Version { get; set; } = string.Empty;
    public DateTime? InstalledAt { get; set; }
    public string? LicensePath { get; set; }
    public string? Notes { get; set; }
}

public class TicketAttachmentDto
{
    public int AttachmentId { get; set; }
    public int TicketId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public int UploadedBy { get; set; }
    public DateTime UploadedAt { get; set; }
}

public class DeploymentStepDto
{
    public int StepId { get; set; }
    public int UpdateId { get; set; }
    public int StepNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? Notes { get; set; }
}

public class CreateDeploymentStepDto
{
    [Required]
    public int UpdateId { get; set; }
    [Required]
    public int StepNumber { get; set; }
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Description { get; set; } = string.Empty;
    [Required]
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class UpdateDeploymentStepDto : CreateDeploymentStepDto
{
    [Required]
    public int StepId { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

// ===========================
// Repositories
// ===========================

public interface IServerExtensionsRepository
{
    Task<IEnumerable<ServerMetricDto>> GetMetricsAsync(int serverId, int limit = 100);
    Task<int> CreateMetricAsync(CreateServerMetricDto dto);
    Task<IEnumerable<SoftwareInstallationDto>> GetSoftwareAsync(int serverId);
    Task<int> CreateSoftwareAsync(CreateSoftwareInstallationDto dto);
}

public class ServerExtensionsRepository : IServerExtensionsRepository
{
    private readonly string _connectionString;

    public ServerExtensionsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<ServerMetricDto>> GetMetricsAsync(int serverId, int limit = 100)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<ServerMetricDto>(
            connection,
            "sp_GetServerMetrics",
            new { ServerId = serverId, Limit = limit },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateMetricAsync(CreateServerMetricDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        await Dapper.SqlMapper.ExecuteAsync(
            connection,
            @"INSERT INTO ServerMetrics (ServerId, CPUUsage, RAMUsage, DiskUsage, NetworkIn, NetworkOut)
              VALUES (@ServerId, @CPUUsage, @RAMUsage, @DiskUsage, @NetworkIn, @NetworkOut);
              SELECT CAST(SCOPE_IDENTITY() as int)",
            dto,
            commandType: System.Data.CommandType.Text
        );
        return 1;
    }

    public async Task<IEnumerable<SoftwareInstallationDto>> GetSoftwareAsync(int serverId)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<SoftwareInstallationDto>(
            connection,
            "SELECT * FROM SoftwareInstallations WHERE ServerId = @ServerId ORDER BY InstalledAt DESC",
            new { ServerId = serverId }
        );
    }

    public async Task<int> CreateSoftwareAsync(CreateSoftwareInstallationDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.ExecuteScalarAsync<int>(
            connection,
            @"INSERT INTO SoftwareInstallations (ServerId, SoftwareName, Version, InstalledAt, LicensePath, Notes)
              VALUES (@ServerId, @SoftwareName, @Version, ISNULL(@InstalledAt, GETUTCDATE()), @LicensePath, @Notes);
              SELECT CAST(SCOPE_IDENTITY() as int)",
            dto
        );
    }
}

public interface ITicketExtensionsRepository
{
    Task<IEnumerable<TicketAttachmentDto>> GetAttachmentsAsync(int ticketId);
}

public class TicketExtensionsRepository : ITicketExtensionsRepository
{
    private readonly string _connectionString;

    public TicketExtensionsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<TicketAttachmentDto>> GetAttachmentsAsync(int ticketId)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<TicketAttachmentDto>(
            connection,
            "SELECT * FROM TicketAttachments WHERE TicketId = @TicketId ORDER BY UploadedAt DESC",
            new { TicketId = ticketId }
        );
    }
}

public interface IUpdateExtensionsRepository
{
    Task<IEnumerable<DeploymentStepDto>> GetStepsAsync(int updateId);
    Task<int> CreateStepAsync(CreateDeploymentStepDto dto);
    Task UpdateStepAsync(UpdateDeploymentStepDto dto);
}

public class UpdateExtensionsRepository : IUpdateExtensionsRepository
{
    private readonly string _connectionString;

    public UpdateExtensionsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<DeploymentStepDto>> GetStepsAsync(int updateId)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.QueryAsync<DeploymentStepDto>(
            connection,
            "sp_GetDeploymentSteps",
            new { UpdateId = updateId },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateStepAsync(CreateDeploymentStepDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        return await Dapper.SqlMapper.ExecuteScalarAsync<int>(
            connection,
            @"INSERT INTO DeploymentSteps (UpdateId, StepNumber, Title, Description, Status, Notes)
              VALUES (@UpdateId, @StepNumber, @Title, @Description, @Status, @Notes);
              SELECT CAST(SCOPE_IDENTITY() as int)",
            dto
        );
    }

    public async Task UpdateStepAsync(UpdateDeploymentStepDto dto)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);
        await Dapper.SqlMapper.ExecuteAsync(
            connection,
            @"UPDATE DeploymentSteps 
              SET UpdateId = @UpdateId, StepNumber = @StepNumber, Title = @Title, 
                  Description = @Description, Status = @Status, StartedAt = @StartedAt, 
                  CompletedAt = @CompletedAt, Notes = @Notes
              WHERE StepId = @StepId",
            dto
        );
    }
}

// ===========================
// Controllers
// ===========================

[ApiController]
[Route("api/servers")]
[Authorize(Roles = "admin,devops")]
public class ServerExtensionsController : ControllerBase
{
    private readonly IServerExtensionsRepository _repository;

    public ServerExtensionsController(IServerExtensionsRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("{serverId}/metrics")]
    public async Task<ActionResult<IEnumerable<ServerMetricDto>>> GetMetrics(int serverId, [FromQuery] int limit = 100)
    {
        var metrics = await _repository.GetMetricsAsync(serverId, limit);
        return Ok(metrics);
    }

    [HttpPost("metrics")]
    public async Task<ActionResult> CreateMetric([FromBody] CreateServerMetricDto dto)
    {
        var id = await _repository.CreateMetricAsync(dto);
        return Ok(new { metricId = id });
    }

    [HttpGet("{serverId}/software")]
    public async Task<ActionResult<IEnumerable<SoftwareInstallationDto>>> GetSoftware(int serverId)
    {
        var software = await _repository.GetSoftwareAsync(serverId);
        return Ok(software);
    }

    [HttpPost("software")]
    public async Task<ActionResult> CreateSoftware([FromBody] CreateSoftwareInstallationDto dto)
    {
        var id = await _repository.CreateSoftwareAsync(dto);
        return Ok(new { installationId = id });
    }
}

[ApiController]
[Route("api/tickets")]
[Authorize]
public class TicketExtensionsController : ControllerBase
{
    private readonly ITicketExtensionsRepository _repository;

    public TicketExtensionsController(ITicketExtensionsRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("{ticketId}/attachments")]
    public async Task<ActionResult<IEnumerable<TicketAttachmentDto>>> GetAttachments(int ticketId)
    {
        var attachments = await _repository.GetAttachmentsAsync(ticketId);
        return Ok(attachments);
    }
}

[ApiController]
[Route("api/updates")]
[Authorize]
public class UpdateExtensionsController : ControllerBase
{
    private readonly IUpdateExtensionsRepository _repository;

    public UpdateExtensionsController(IUpdateExtensionsRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("{updateId}/steps")]
    public async Task<ActionResult<IEnumerable<DeploymentStepDto>>> GetSteps(int updateId)
    {
        var steps = await _repository.GetStepsAsync(updateId);
        return Ok(steps);
    }

    [HttpPost("steps")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> CreateStep([FromBody] CreateDeploymentStepDto dto)
    {
        var id = await _repository.CreateStepAsync(dto);
        return Ok(new { stepId = id });
    }

    [HttpPut("steps/{stepId}")]
    [Authorize(Roles = "admin,devops")]
    public async Task<ActionResult> UpdateStep(int stepId, [FromBody] UpdateDeploymentStepDto dto)
    {
        if (stepId != dto.StepId) return BadRequest();
        await _repository.UpdateStepAsync(dto);
        return NoContent();
    }
}
