# Client Management API - .NET Core Backend

Complete .NET Core 8.0 Web API for the Client Management System.

## 🚀 Quick Start

### Prerequisites
- .NET 8.0 SDK
- SQL Server 2019+ or Azure SQL Database
- Visual Studio 2022 or VS Code with C# extension

### 1. Database Setup

Execute the SQL scripts in order:

```bash
# In SQL Server Management Studio or Azure Data Studio:
1. Run: /backend/Phase1-Database.sql
2. Run: /backend/Phase2-Database.sql
3. Run: /backend/Phase3-Database.sql
4. Run: /backend/Phase4-8-Database.sql
5. Run: /backend/MissingStoredProcedures.sql
```

### 2. Update Connection String

Edit `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=ClientManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

For SQL Authentication:
```json
"DefaultConnection": "Server=YOUR_SERVER;Database=ClientManagementDB;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
```

### 3. Build and Run

```bash
# Navigate to API directory
cd backend/ClientManagementAPI

# Restore packages
dotnet restore

# Build project
dotnet build

# Run API
dotnet run
```

The API will start on **http://localhost:5000**

### 4. Test API

Open browser: **http://localhost:5000**

You'll see the Swagger UI with all endpoints documented.

## 🔐 Authentication

### Login to Get JWT Token

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "expiresAt": "2024-12-04T08:00:00Z"
}
```

### Test Users

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | password123 | admin | Full access including delete |
| devops1 | password123 | devops | All sections including servers |
| delivery1 | password123 | delivery | All except servers section |

### Using JWT Token

Add to request headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

In Swagger UI:
1. Click "Authorize" button
2. Enter: `Bearer YOUR_JWT_TOKEN`
3. Click "Authorize"

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/{id}` - Get client by ID
- `POST /api/clients` - Create client (Admin only)
- `PUT /api/clients/{id}` - Update client (Admin, DevOps)
- `DELETE /api/clients/{id}` - Delete client (Admin only)

### VPN
- `GET /api/vpn/client/{clientId}` - Get VPN configs by client
- `GET /api/vpn/{id}` - Get VPN config by ID
- `POST /api/vpn` - Create VPN config (Admin, DevOps)
- `PUT /api/vpn/{id}` - Update VPN config (Admin, DevOps)
- `DELETE /api/vpn/{id}` - Delete VPN config (Admin, DevOps)

### Connections
- `GET /api/connections/client/{clientId}` - Get connections by client
- `GET /api/connections/{id}` - Get connection by ID
- `POST /api/connections` - Create connection (Admin, DevOps)
- `PUT /api/connections/{id}` - Update connection (Admin, DevOps)
- `DELETE /api/connections/{id}` - Delete connection (Admin, DevOps)
- `POST /api/connections/test` - Test connection (Admin, DevOps)

### Servers
- `GET /api/servers/client/{clientId}` - Get servers by client (Admin, DevOps)
- `GET /api/servers/{id}` - Get server by ID (Admin, DevOps)
- `POST /api/servers` - Create server (Admin, DevOps)
- `PUT /api/servers/{id}` - Update server (Admin, DevOps)
- `DELETE /api/servers/{id}` - Delete server (Admin, DevOps)

### Contacts
- `GET /api/contacts/client/{clientId}` - Get contacts by client
- `GET /api/contacts/{id}` - Get contact by ID
- `POST /api/contacts` - Create contact (Admin, DevOps)
- `PUT /api/contacts/{id}` - Update contact (Admin, DevOps)
- `DELETE /api/contacts/{id}` - Delete contact (Admin, DevOps)

### Licenses
- `GET /api/licenses/client/{clientId}` - Get licenses by client
- `GET /api/licenses/{id}` - Get license by ID
- `GET /api/licenses/expiring?days=30` - Get expiring licenses
- `POST /api/licenses` - Create license (Admin, DevOps)
- `PUT /api/licenses/{id}` - Update license (Admin, DevOps)
- `DELETE /api/licenses/{id}` - Delete license (Admin, DevOps)

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/client/{clientId}` - Get tickets by client
- `GET /api/tickets/{id}` - Get ticket by ID
- `GET /api/tickets/{id}/comments` - Get ticket comments
- `GET /api/tickets/statistics` - Get ticket statistics
- `POST /api/tickets` - Create ticket
- `POST /api/tickets/comments` - Add comment to ticket
- `PUT /api/tickets/{id}` - Update ticket (Admin, DevOps)
- `DELETE /api/tickets/{id}` - Delete ticket (Admin only)

### Updates
- `GET /api/updates` - Get all updates
- `GET /api/updates/client/{clientId}` - Get updates by client
- `GET /api/updates/{id}` - Get update by ID
- `GET /api/updates/upcoming?days=7` - Get upcoming updates
- `POST /api/updates` - Create update (Admin, DevOps)
- `PUT /api/updates/{id}` - Update update (Admin, DevOps)
- `DELETE /api/updates/{id}` - Delete update (Admin only)

## 🏗️ Project Structure

```
ClientManagementAPI/
├── Controllers/
│   ├── AuthController.cs
│   ├── ClientsController.cs
│   └── AllControllers.cs (VPN, Connections, Servers, etc.)
├── Models/
│   └── DTOs/
│       ├── Auth/
│       │   ├── LoginDto.cs
│       │   ├── LoginResponseDto.cs
│       │   └── UserDto.cs
│       ├── Clients/
│       │   ├── ClientDto.cs
│       │   ├── CreateClientDto.cs
│       │   └── UpdateClientDto.cs
│       └── AllDTOs.cs (All other DTOs)
├── Repositories/
│   ├── IAuthRepository.cs
│   ├── AuthRepository.cs
│   ├── ClientRepository.cs
│   └── AllRepositories.cs (All other repositories)
├── Services/
│   ├── IAuthService.cs
│   ├── AuthService.cs
│   ├── IPasswordHasher.cs
│   └── PasswordHasher.cs
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
└── ClientManagementAPI.csproj
```

## 🔧 Configuration

### JWT Settings

In `appsettings.json`:

```json
{
  "JwtSettings": {
    "Secret": "your-secret-key-at-least-32-characters",
    "Issuer": "ClientManagementAPI",
    "Audience": "ClientManagementApp",
    "ExpirationMinutes": 480
  }
}
```

**⚠️ IMPORTANT:** Change the secret in production!

### CORS Configuration

Currently set to allow all origins (development mode):

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

For production, restrict to your frontend domain:

```csharp
policy.WithOrigins("https://your-frontend-domain.com")
      .AllowAnyMethod()
      .AllowAnyHeader();
```

## 🧪 Testing

### Using Swagger UI

1. Navigate to: http://localhost:5000
2. Click "Authorize"
3. Login via `/api/auth/login` to get token
4. Enter token in Authorization dialog
5. Test any endpoint

### Using Postman

1. **Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Body: { "username": "admin", "password": "password123" }
   ```

2. **Copy the token from response**

3. **Use token in subsequent requests:**
   ```
   Headers:
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Get clients (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer TOKEN"
```

## 🛠️ Development

### Add New Endpoint

1. **Create DTO** in `Models/DTOs/`
2. **Create Repository Interface and Implementation**
3. **Register in Program.cs:**
   ```csharp
   builder.Services.AddScoped<IYourRepository, YourRepository>();
   ```
4. **Create Controller** and inject repository
5. **Add stored procedure** in database

### Enable HTTPS

1. Generate development certificate:
   ```bash
   dotnet dev-certs https --trust
   ```

2. Update `Program.cs`:
   ```csharp
   app.UseHttpsRedirection();
   ```

3. Update frontend API URL to use `https`

## 📦 Deployment

### Publish for Production

```bash
# Publish for Windows
dotnet publish -c Release -r win-x64 --self-contained

# Publish for Linux
dotnet publish -c Release -r linux-x64 --self-contained

# Publish for Docker
dotnet publish -c Release
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ClientManagementAPI.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ClientManagementAPI.dll"]
```

Build and run:
```bash
docker build -t client-management-api .
docker run -p 5000:80 client-management-api
```

### Azure Deployment

1. Create Azure SQL Database
2. Run all SQL scripts
3. Create App Service
4. Deploy via Visual Studio or Azure CLI

### Environment Variables

For production, use environment variables:

```bash
export ConnectionStrings__DefaultConnection="Server=..."
export JwtSettings__Secret="your-production-secret"
```

## 🔒 Security Best Practices

1. **Always use HTTPS in production**
2. **Change JWT Secret** to a strong random value
3. **Restrict CORS** to your frontend domain
4. **Use Azure Key Vault** for secrets in production
5. **Enable rate limiting** for authentication endpoints
6. **Implement password policies** (complexity, expiry)
7. **Add request logging** and monitoring
8. **Use connection string encryption**

## 📊 Performance

### Connection Pooling

Already enabled by default with SQL Server.

### Add Caching

Install package:
```bash
dotnet add package Microsoft.Extensions.Caching.Memory
```

Configure in `Program.cs`:
```csharp
builder.Services.AddMemoryCache();
```

### Add Response Compression

```csharp
builder.Services.AddResponseCompression();
app.UseResponseCompression();
```

## 🐛 Troubleshooting

### Cannot connect to database

1. Check connection string in `appsettings.json`
2. Verify SQL Server is running
3. Check firewall settings
4. Test connection with SSMS

### JWT token invalid

1. Verify secret matches in `appsettings.json`
2. Check token hasn't expired (8 hours default)
3. Ensure clock sync between client and server

### CORS errors

1. Check CORS policy in `Program.cs`
2. Verify frontend origin is allowed
3. Ensure `UseCors()` is before `UseAuthorization()`

## 📚 Additional Resources

- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [Dapper Documentation](https://github.com/DapperLib/Dapper)
- [JWT Documentation](https://jwt.io/)
- [Swagger/OpenAPI](https://swagger.io/)

## ✅ Checklist

- [x] Database tables created
- [x] Stored procedures created
- [x] DTOs implemented
- [x] Repositories implemented
- [x] Controllers implemented
- [x] Authentication configured
- [x] Authorization configured
- [x] Swagger UI configured
- [x] CORS configured
- [ ] Deploy to production
- [ ] Configure monitoring
- [ ] Set up CI/CD

## 🎉 Success!

Your API is now ready! Visit http://localhost:5000 to see Swagger documentation.

Default credentials:
- **Username:** admin
- **Password:** password123
