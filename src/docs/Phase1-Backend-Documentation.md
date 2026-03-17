# Phase 1: Core Authentication & Client Management

## Backend Implementation Guide

### Step 1: Database Tables and Stored Procedures

```sql
-- =============================================
-- Database: ClientManagementDB
-- =============================================

-- Table: Users
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL CHECK (Role IN ('admin', 'devops', 'delivery')),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastLoginDate DATETIME2 NULL,
    CONSTRAINT CHK_Email CHECK (Email LIKE '%@%.%')
);

-- Table: Clients
CREATE TABLE Clients (
    ClientId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255) NOT NULL,
    Company NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Status NVARCHAR(50) NOT NULL CHECK (Status IN ('active', 'inactive', 'pending')),
    Hosted BIT NOT NULL DEFAULT 0,
    InstallLink NVARCHAR(500) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0
);

-- =============================================
-- Stored Procedures
-- =============================================

-- SP: Authenticate User
CREATE PROCEDURE sp_AuthenticateUser
    @Username NVARCHAR(100),
    @PasswordHash NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @UserId INT;
    
    SELECT @UserId = UserId
    FROM Users
    WHERE Username = @Username 
        AND PasswordHash = @PasswordHash 
        AND IsActive = 1;
    
    IF @UserId IS NOT NULL
    BEGIN
        UPDATE Users
        SET LastLoginDate = GETUTCDATE()
        WHERE UserId = @UserId;
        
        SELECT 
            UserId,
            Username,
            Email,
            Role,
            LastLoginDate
        FROM Users
        WHERE UserId = @UserId;
    END
    ELSE
    BEGIN
        SELECT NULL AS UserId;
    END
END
GO

-- SP: Get All Clients
CREATE PROCEDURE sp_GetAllClients
    @SearchQuery NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClientId,
        Name,
        Company,
        Email,
        Status,
        Hosted,
        InstallLink,
        CreatedDate,
        ModifiedDate
    FROM Clients
    WHERE IsDeleted = 0
        AND (
            @SearchQuery IS NULL 
            OR Name LIKE '%' + @SearchQuery + '%'
            OR Company LIKE '%' + @SearchQuery + '%'
            OR Email LIKE '%' + @SearchQuery + '%'
        )
    ORDER BY Name;
END
GO

-- SP: Get Client By ID
CREATE PROCEDURE sp_GetClientById
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClientId,
        Name,
        Company,
        Email,
        Status,
        Hosted,
        InstallLink,
        CreatedDate,
        ModifiedDate
    FROM Clients
    WHERE ClientId = @ClientId 
        AND IsDeleted = 0;
END
GO

-- SP: Create Client
CREATE PROCEDURE sp_CreateClient
    @Name NVARCHAR(255),
    @Company NVARCHAR(255),
    @Email NVARCHAR(255),
    @Status NVARCHAR(50),
    @Hosted BIT,
    @InstallLink NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Clients (Name, Company, Email, Status, Hosted, InstallLink)
    VALUES (@Name, @Company, @Email, @Status, @Hosted, @InstallLink);
    
    SELECT 
        ClientId,
        Name,
        Company,
        Email,
        Status,
        Hosted,
        InstallLink,
        CreatedDate,
        ModifiedDate
    FROM Clients
    WHERE ClientId = SCOPE_IDENTITY();
END
GO

-- SP: Update Client
CREATE PROCEDURE sp_UpdateClient
    @ClientId INT,
    @Name NVARCHAR(255),
    @Company NVARCHAR(255),
    @Email NVARCHAR(255),
    @Status NVARCHAR(50),
    @Hosted BIT,
    @InstallLink NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Clients
    SET 
        Name = @Name,
        Company = @Company,
        Email = @Email,
        Status = @Status,
        Hosted = @Hosted,
        InstallLink = @InstallLink,
        ModifiedDate = GETUTCDATE()
    WHERE ClientId = @ClientId 
        AND IsDeleted = 0;
    
    SELECT 
        ClientId,
        Name,
        Company,
        Email,
        Status,
        Hosted,
        InstallLink,
        CreatedDate,
        ModifiedDate
    FROM Clients
    WHERE ClientId = @ClientId;
END
GO

-- SP: Delete Client (Soft Delete)
CREATE PROCEDURE sp_DeleteClient
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Clients
    SET 
        IsDeleted = 1,
        ModifiedDate = GETUTCDATE()
    WHERE ClientId = @ClientId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- Seed Data
-- =============================================

-- Insert default users (Note: In production, use proper password hashing like BCrypt)
INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES
('admin', 'admin123', 'admin@clientmanagement.com', 'admin'),
('devops', 'devops123', 'devops@clientmanagement.com', 'devops'),
('delivery', 'delivery123', 'delivery@clientmanagement.com', 'delivery');

-- Insert sample clients
INSERT INTO Clients (Name, Company, Email, Status, Hosted, InstallLink) VALUES
('Acme Corporation', 'Acme Corp', 'contact@acme.com', 'active', 1, 'https://install.acme.com/setup'),
('TechStart Inc', 'TechStart', 'admin@techstart.io', 'active', 1, 'https://setup.techstart.io'),
('Global Solutions', 'Global Sol', 'info@globalsolutions.com', 'inactive', 0, 'https://install.globalsol.com'),
('Innovation Labs', 'InnoLabs', 'hello@innolabs.com', 'active', 1, 'https://setup.innolabs.com'),
('Digital Dynamics', 'DigitalDyn', 'support@digitaldynamics.com', 'pending', 0, NULL),
('Cloud Services Ltd', 'CloudServ', 'info@cloudservices.com', 'active', 1, 'https://install.cloudserv.com');
```

---

### Step 2: DTOs

Create these C# files in your .NET project under `Models/DTOs/`:

**UserLoginDto.cs**
```csharp
namespace ClientManagement.Models.DTOs
{
    public class UserLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
```

**UserDto.cs**
```csharp
namespace ClientManagement.Models.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
```

**AuthResponseDto.cs**
```csharp
namespace ClientManagement.Models.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
    }
}
```

**ClientDto.cs**
```csharp
namespace ClientManagement.Models.DTOs
{
    public class ClientDto
    {
        public int ClientId { get; set; }
        public string Name { get; set; }
        public string Company { get; set; }
        public string Email { get; set; }
        public string Status { get; set; }
        public bool Hosted { get; set; }
        public string? InstallLink { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
```

**CreateClientDto.cs**
```csharp
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class CreateClientDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Company { get; set; }
        
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        public bool Hosted { get; set; }
        
        [StringLength(500)]
        public string? InstallLink { get; set; }
    }
}
```

**UpdateClientDto.cs**
```csharp
using System.ComponentModel.DataAnnotations;

namespace ClientManagement.Models.DTOs
{
    public class UpdateClientDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Company { get; set; }
        
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        public bool Hosted { get; set; }
        
        [StringLength(500)]
        public string? InstallLink { get; set; }
    }
}
```

---

### Step 3: Repository

Create these files in `Repositories/`:

**IAuthRepository.cs**
```csharp
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IAuthRepository
    {
        Task<UserDto?> AuthenticateAsync(string username, string passwordHash);
    }
}
```

**AuthRepository.cs**
```csharp
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly string _connectionString;

        public AuthRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<UserDto?> AuthenticateAsync(string username, string passwordHash)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Username", username);
                parameters.Add("@PasswordHash", passwordHash);

                var user = await connection.QueryFirstOrDefaultAsync<UserDto>(
                    "sp_AuthenticateUser",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return user;
            }
        }
    }
}
```

**IClientRepository.cs**
```csharp
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public interface IClientRepository
    {
        Task<IEnumerable<ClientDto>> GetAllClientsAsync(string? searchQuery = null);
        Task<ClientDto?> GetClientByIdAsync(int clientId);
        Task<ClientDto> CreateClientAsync(CreateClientDto dto);
        Task<ClientDto?> UpdateClientAsync(UpdateClientDto dto);
        Task<bool> DeleteClientAsync(int clientId);
    }
}
```

**ClientRepository.cs**
```csharp
using System.Data;
using System.Data.SqlClient;
using Dapper;
using ClientManagement.Models.DTOs;

namespace ClientManagement.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly string _connectionString;

        public ClientRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<ClientDto>> GetAllClientsAsync(string? searchQuery = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@SearchQuery", searchQuery);

                var clients = await connection.QueryAsync<ClientDto>(
                    "sp_GetAllClients",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return clients;
            }
        }

        public async Task<ClientDto?> GetClientByIdAsync(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);

                var client = await connection.QueryFirstOrDefaultAsync<ClientDto>(
                    "sp_GetClientById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return client;
            }
        }

        public async Task<ClientDto> CreateClientAsync(CreateClientDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Company", dto.Company);
                parameters.Add("@Email", dto.Email);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Hosted", dto.Hosted);
                parameters.Add("@InstallLink", dto.InstallLink);

                var client = await connection.QueryFirstAsync<ClientDto>(
                    "sp_CreateClient",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return client;
            }
        }

        public async Task<ClientDto?> UpdateClientAsync(UpdateClientDto dto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", dto.ClientId);
                parameters.Add("@Name", dto.Name);
                parameters.Add("@Company", dto.Company);
                parameters.Add("@Email", dto.Email);
                parameters.Add("@Status", dto.Status);
                parameters.Add("@Hosted", dto.Hosted);
                parameters.Add("@InstallLink", dto.InstallLink);

                var client = await connection.QueryFirstOrDefaultAsync<ClientDto>(
                    "sp_UpdateClient",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return client;
            }
        }

        public async Task<bool> DeleteClientAsync(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ClientId", clientId);

                var result = await connection.ExecuteScalarAsync<int>(
                    "sp_DeleteClient",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result == 1;
            }
        }
    }
}
```

---

### Step 4: Controllers

Create these files in `Controllers/`:

**AuthController.cs**
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] UserLoginDto loginDto)
        {
            // Note: In production, hash the password before comparing
            // For demo purposes, we're using plain text
            var user = await _authRepository.AuthenticateAsync(loginDto.Username, loginDto.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var token = GenerateJwtToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = user
            });
        }

        private string GenerateJwtToken(UserDto user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
```

**ClientsController.cs**
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClientManagement.Models.DTOs;
using ClientManagement.Repositories;

namespace ClientManagement.Controllers
{
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
        public async Task<ActionResult<IEnumerable<ClientDto>>> GetAllClients([FromQuery] string? search = null)
        {
            var clients = await _clientRepository.GetAllClientsAsync(search);
            return Ok(clients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClientDto>> GetClientById(int id)
        {
            var client = await _clientRepository.GetClientByIdAsync(id);
            
            if (client == null)
            {
                return NotFound(new { message = $"Client with ID {id} not found" });
            }

            return Ok(client);
        }

        [HttpPost]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ClientDto>> CreateClient([FromBody] CreateClientDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var client = await _clientRepository.CreateClientAsync(dto);
            return CreatedAtAction(nameof(GetClientById), new { id = client.ClientId }, client);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,devops")]
        public async Task<ActionResult<ClientDto>> UpdateClient(int id, [FromBody] UpdateClientDto dto)
        {
            if (id != dto.ClientId)
            {
                return BadRequest(new { message = "Client ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var client = await _clientRepository.UpdateClientAsync(dto);
            
            if (client == null)
            {
                return NotFound(new { message = $"Client with ID {id} not found" });
            }

            return Ok(client);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteClient(int id)
        {
            var success = await _clientRepository.DeleteClientAsync(id);
            
            if (!success)
            {
                return NotFound(new { message = $"Client with ID {id} not found" });
            }

            return NoContent();
        }
    }
}
```

---

### Step 5: Update Program.cs

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ClientManagement.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register repositories
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Vite and CRA default ports
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

---

### Step 6: appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ClientManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "ClientManagementAPI",
    "Audience": "ClientManagementApp"
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

---

### Step 7: Required NuGet Packages

Run these commands in your .NET project:

```bash
dotnet add package Dapper
dotnet add package System.Data.SqlClient
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.IdentityModel.Tokens
dotnet add package System.IdentityModel.Tokens.Jwt
```

---

## Testing Your Backend

1. **Create the database**: Run the SQL scripts in SQL Server Management Studio
2. **Build and run**: `dotnet run`
3. **Test with Swagger**: Navigate to `https://localhost:5001/swagger`
4. **Test login**: POST to `/api/auth/login` with:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
5. **Use the token**: Copy the token and use it in subsequent requests with header:
   ```
   Authorization: Bearer {your-token-here}
   ```
