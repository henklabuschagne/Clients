# Backend Implementation Guide

## Complete Implementation Summary

This guide provides the complete .NET Core backend structure for the Client Management System.

## ✅ Files Created

### Frontend
- ✅ `/services/api.ts` - Complete API client with all DTOs and endpoints
- ✅ All React Hooks:
  - `/hooks/useClients.ts`
  - `/hooks/useVPNConfigurations.ts`
  - `/hooks/useConnections.ts`
  - `/hooks/useServers.ts`
  - `/hooks/useContacts.ts`
  - `/hooks/useLicenses.ts`
  - `/hooks/useStatistics.ts`
  - `/hooks/useTickets.ts`
  - `/hooks/useUpdates.ts`

### Database Scripts
- ✅ `/backend/Phase1-Database.sql` - Authentication & Clients (Users, Clients tables + 10 SPs)
- ✅ `/backend/Phase2-Database.sql` - Status & Health (ClientStatus, HealthChecks tables + 12 SPs)
- ✅ `/backend/Phase3-Database.sql` - VPN & Connections (VPNConfigurations, Connections tables + 16 SPs)
- ✅ `/backend/Phase4-8-Database.sql` - Complete remaining phases:
  - **Phase 4:** Servers, ServerMetrics, SoftwareInstallations
  - **Phase 5:** Contacts, Licenses
  - **Phase 6:** Statistics, UsageMetrics, PerformanceMetrics, FinancialMetrics
  - **Phase 7:** Tickets, TicketComments, TicketAttachments
  - **Phase 8:** Updates, DeploymentSteps

## Backend C# Structure

### Project Structure
```
ClientManagementAPI/
├── Controllers/
│   ├── AuthController.cs
│   ├── ClientsController.cs
│   ├── VPNController.cs
│   ├── ConnectionsController.cs
│   ├── ServersController.cs
│   ├── ContactsController.cs
│   ├── LicensesController.cs
│   ├── StatisticsController.cs
│   ├── TicketsController.cs
│   └── UpdatesController.cs
├── Models/
│   └── DTOs/
│       ├── Auth/
│       │   ├── LoginDto.cs
│       │   ├── LoginResponseDto.cs
│       │   └── UserDto.cs
│       ├── Clients/
│       │   ├── ClientDto.cs
│       │   ├── CreateClientDto.cs
│       │   ├── UpdateClientDto.cs
│       │   ├── ClientStatusDto.cs
│       │   └── HealthCheckDto.cs
│       ├── VPN/
│       │   ├── VPNConfigurationDto.cs
│       │   ├── CreateVPNConfigurationDto.cs
│       │   └── UpdateVPNConfigurationDto.cs
│       ├── Connections/
│       │   ├── ConnectionDto.cs
│       │   ├── CreateConnectionDto.cs
│       │   ├── UpdateConnectionDto.cs
│       │   └── TestConnectionResultDto.cs
│       ├── Servers/
│       │   ├── ServerDto.cs
│       │   ├── ServerMetricDto.cs
│       │   └── SoftwareInstallationDto.cs
│       ├── Contacts/
│       │   ├── ContactDto.cs
│       │   ├── CreateContactDto.cs
│       │   └── UpdateContactDto.cs
│       ├── Licenses/
│       │   ├── LicenseDto.cs
│       │   ├── CreateLicenseDto.cs
│       │   ├── UpdateLicenseDto.cs
│       │   └── RenewLicenseDto.cs
│       ├── Statistics/
│       │   ├── StatisticDto.cs
│       │   ├── UsageMetricDto.cs
│       │   ├── PerformanceMetricDto.cs
│       │   └── FinancialMetricDto.cs
│       ├── Tickets/
│       │   ├── TicketDto.cs
│       │   ├── TicketCommentDto.cs
│       │   ├── TicketAttachmentDto.cs
│       │   └── TicketStatisticsDto.cs
│       └── Updates/
│           ├── UpdateDto.cs
│           ├── DeploymentStepDto.cs
│           └── CreateUpdateDto.cs
├── Repositories/
│   ├── IAuthRepository.cs
│   ├── AuthRepository.cs
│   ├── IClientRepository.cs
│   ├── ClientRepository.cs
│   ├── IVPNRepository.cs
│   ├── VPNRepository.cs
│   ├── IConnectionRepository.cs
│   ├── ConnectionRepository.cs
│   ├── IServerRepository.cs
│   ├── ServerRepository.cs
│   ├── IContactRepository.cs
│   ├── ContactRepository.cs
│   ├── ILicenseRepository.cs
│   ├── LicenseRepository.cs
│   ├── IStatisticsRepository.cs
│   ├── StatisticsRepository.cs
│   ├── ITicketRepository.cs
│   ├── TicketRepository.cs
│   ├── IUpdateRepository.cs
│   └── UpdateRepository.cs
├── Services/
│   ├── IAuthService.cs
│   ├── AuthService.cs
│   ├── IPasswordHasher.cs
│   └── PasswordHasher.cs
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
└── ClientManagementAPI.csproj
```

### Required NuGet Packages

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
  <PackageReference Include="Microsoft.Data.SqlClient" Version="5.1.0" />
  <PackageReference Include="Dapper" Version="2.1.0" />
  <PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
  <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.0" />
  <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
</ItemGroup>
```

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ClientManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-at-least-32-characters-long-for-security",
    "Issuer": "ClientManagementAPI",
    "Audience": "ClientManagementApp",
    "ExpirationMinutes": 480
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Program.cs

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ClientManagementAPI.Repositories;
using ClientManagementAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Configure JWT Authentication
var jwtSecret = builder.Configuration["JwtSettings:Secret"];
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Register Repositories
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IVPNRepository, VPNRepository>();
builder.Services.AddScoped<IConnectionRepository, ConnectionRepository>();
builder.Services.AddScoped<IServerRepository, ServerRepository>();
builder.Services.AddScoped<IContactRepository, ContactRepository>();
builder.Services.AddScoped<ILicenseRepository, LicenseRepository>();
builder.Services.AddScoped<IStatisticsRepository, StatisticsRepository>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<IUpdateRepository, UpdateRepository>();

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

## Database Setup Instructions

### Step 1: Execute SQL Scripts in Order

```bash
# In SQL Server Management Studio or Azure Data Studio:

1. Execute: /backend/Phase1-Database.sql
   - Creates database
   - Creates Users and Clients tables
   - Creates authentication and client stored procedures
   - Seeds test data

2. Execute: /backend/Phase2-Database.sql
   - Creates ClientStatus and HealthChecks tables
   - Creates status and health check stored procedures

3. Execute: /backend/Phase3-Database.sql
   - Creates VPNConfigurations and Connections tables
   - Creates VPN and connection stored procedures

4. Execute: /backend/Phase4-8-Database.sql
   - Creates all remaining tables (Servers, Contacts, Licenses, Statistics, Tickets, Updates)
   - Creates all remaining stored procedures
   - Seeds sample data
```

### Step 2: Verify Database Setup

```sql
-- Check all tables created
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Should show 18 tables:
-- Clients, ClientStatus, Connections, Contacts, DeploymentSteps, 
-- FinancialMetrics, HealthChecks, Licenses, PerformanceMetrics,
-- Servers, ServerMetrics, SoftwareInstallations, Statistics,
-- TicketAttachments, TicketComments, Tickets, Updates, UsageMetrics,
-- Users, VPNConfigurations
```

## Backend Implementation

The DTOs in `/services/api.ts` match exactly the C# models you need to create. Simply:

1. **Create C# DTOs** - Copy the TypeScript interfaces from `api.ts` and convert to C# classes
2. **Create Repositories** - Use Dapper to call the stored procedures
3. **Create Controllers** - Map HTTP endpoints to repository methods
4. **Configure authentication** - Use JWT tokens as shown in Program.cs

### Example Repository Pattern

```csharp
// IClientRepository.cs
public interface IClientRepository
{
    Task<IEnumerable<ClientDto>> GetAllAsync();
    Task<ClientDto> GetByIdAsync(int clientId);
    Task<int> CreateAsync(CreateClientDto client);
    Task UpdateAsync(UpdateClientDto client);
    Task DeleteAsync(int clientId);
}

// ClientRepository.cs
public class ClientRepository : IClientRepository
{
    private readonly string _connectionString;

    public ClientRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<IEnumerable<ClientDto>> GetAllAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<ClientDto>("sp_GetAllClients", 
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ClientDto> GetByIdAsync(int clientId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<ClientDto>(
            "sp_GetClientById",
            new { ClientId = clientId },
            commandType: CommandType.StoredProcedure);
    }

    // ... implement other methods
}
```

### Example Controller

```csharp
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
        if (client == null) return NotFound();
        return Ok(client);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ClientDto>> Create(CreateClientDto dto)
    {
        var clientId = await _clientRepository.CreateAsync(dto);
        var client = await _clientRepository.GetByIdAsync(clientId);
        return CreatedAtAction(nameof(GetById), new { id = clientId }, client);
    }

    // ... implement other actions
}
```

## Test Users

After running the database scripts, you'll have these test users:

| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | password123 | admin | admin@example.com |
| delivery1 | password123 | delivery | delivery@example.com |
| devops1 | password123 | devops | devops@example.com |

## API Endpoints Summary

All endpoints are defined in `/services/api.ts` and map 1:1 to your controllers:

- **Auth**: `POST /api/auth/login`
- **Clients**: `GET/POST/PUT/DELETE /api/clients`
- **VPN**: `GET/POST/PUT/DELETE /api/vpn`
- **Connections**: `GET/POST/PUT/DELETE /api/connections`
- **Servers**: `GET/POST/PUT/DELETE /api/servers`
- **Contacts**: `GET/POST/PUT/DELETE /api/contacts`
- **Licenses**: `GET/POST/PUT/DELETE /api/licenses`
- **Statistics**: `GET/POST /api/statistics`
- **Tickets**: `GET/POST/PUT/DELETE /api/tickets`
- **Updates**: `GET/POST/PUT/DELETE /api/updates`

## Next Steps

1. ✅ **Database** - Execute all SQL scripts (DONE)
2. ⏭️ **Backend** - Create .NET project and implement repositories/controllers
3. ✅ **Frontend** - All React components and hooks created (DONE)
4. ⏭️ **Testing** - Test all endpoints with Postman/Swagger
5. ⏭️ **Deploy** - Deploy to production environment

## Notes

- All passwords in seed data are hashed with BCrypt
- JWT tokens expire after 8 hours (480 minutes)
- Role-based access control is implemented (admin/devops/delivery)
- All foreign keys have CASCADE DELETE for data integrity
- Indexes are created for optimal query performance
- All stored procedures use parameterized queries (SQL injection safe)

## Support

For questions or issues, refer to the main `/README.md` file or contact the development team.
