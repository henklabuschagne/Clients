# Phase 1 Implementation Guide

## Overview
Phase 1 implements core authentication and client management functionality with:
- JWT-based authentication
- Role-based access control (Admin, DevOps, Delivery)
- Client CRUD operations
- Search functionality

---

## Backend Setup Instructions

### 1. Create .NET Core Web API Project

```bash
# Create new Web API project
dotnet new webapi -n ClientManagement
cd ClientManagement

# Add required NuGet packages
dotnet add package Dapper
dotnet add package System.Data.SqlClient
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.IdentityModel.Tokens
dotnet add package System.IdentityModel.Tokens.Jwt
```

### 2. Create SQL Server Database

1. Open SQL Server Management Studio (SSMS)
2. Create new database: `ClientManagementDB`
3. Run all SQL scripts from `/docs/Phase1-Backend-Documentation.md` Step 1

### 3. Project Structure

Create the following folder structure in your .NET project:

```
ClientManagement/
├── Controllers/
│   ├── AuthController.cs
│   └── ClientsController.cs
├── Models/
│   └── DTOs/
│       ├── UserLoginDto.cs
│       ├── UserDto.cs
│       ├── AuthResponseDto.cs
│       ├── ClientDto.cs
│       ├── CreateClientDto.cs
│       └── UpdateClientDto.cs
├── Repositories/
│   ├── IAuthRepository.cs
│   ├── AuthRepository.cs
│   ├── IClientRepository.cs
│   └── ClientRepository.cs
├── appsettings.json
└── Program.cs
```

### 4. Copy Code Files

Copy all the code from `/docs/Phase1-Backend-Documentation.md`:
- Step 2: Copy all DTO files to `Models/DTOs/`
- Step 3: Copy all Repository files to `Repositories/`
- Step 4: Copy all Controller files to `Controllers/`
- Step 5: Update your `Program.cs`
- Step 6: Update your `appsettings.json`

### 5. Update Connection String

In `appsettings.json`, update the connection string to match your SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=ClientManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**Common connection string formats:**
- **Windows Authentication**: `Server=localhost;Database=ClientManagementDB;Trusted_Connection=True;TrustServerCertificate=True;`
- **SQL Authentication**: `Server=localhost;Database=ClientManagementDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;`
- **Local SQL Express**: `Server=localhost\\SQLEXPRESS;Database=ClientManagementDB;Trusted_Connection=True;TrustServerCertificate=True;`

### 6. Run Backend

```bash
# Build the project
dotnet build

# Run the project
dotnet run
```

The API should start on:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- **Swagger UI**: `https://localhost:5001/swagger`

---

## Frontend Setup

### 1. Update API Base URL

The frontend is already configured to connect to `http://localhost:5000/api`. If your backend runs on a different port, update `/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:YOUR_PORT/api';
```

### 2. Test Connection Modes

The application supports two modes:

**🔵 Development Mode (Mock Data)**
- Frontend runs independently
- Uses mock data from `/data/mockData.ts`
- No backend required
- Perfect for UI development

**🟢 Production Mode (Backend API)**
- Frontend connects to .NET backend
- Real authentication and data persistence
- Requires backend running
- Login uses actual credentials from database

### 3. Switch Between Modes

To enable **API mode**, the frontend will automatically use the real API when:
1. Backend is running on `http://localhost:5000`
2. User attempts to login (API call is made)
3. If API call succeeds, all subsequent calls use the API
4. If API call fails, app shows error message

---

## Testing Phase 1

### Test Authentication

1. **Start Backend**:
   ```bash
   cd ClientManagement
   dotnet run
   ```

2. **Start Frontend** (in this Figma Make environment):
   - The app is already running
   - Navigate to the login page

3. **Test Login with Default Users**:

   | Username | Password | Role |
   |----------|----------|------|
   | admin | admin123 | admin |
   | devops | devops123 | devops |
   | delivery | delivery123 | delivery |

4. **Verify Authentication**:
   - Enter username and password
   - Click "Login as [Role]"
   - Should see success toast message
   - Should redirect to client list

### Test Client Management

1. **View Clients**:
   - After login, you should see the list of 6 sample clients
   - Try the search functionality

2. **Test Role-Based Access**:
   - **Admin**: Can create, update, and delete clients
   - **DevOps**: Can create and update clients (no delete)
   - **Delivery**: Can only view clients (read-only)

3. **Search Clients**:
   - Type in the search box
   - Results filter in real-time
   - Searches name, company, and email

---

## API Endpoints

### Authentication
```
POST /api/auth/login
Body: { "username": "admin", "password": "admin123" }
Response: { "token": "...", "user": {...} }
```

### Clients
```
GET    /api/clients              # Get all clients
GET    /api/clients?search=acme  # Search clients
GET    /api/clients/{id}         # Get client by ID
POST   /api/clients              # Create client (Admin, DevOps only)
PUT    /api/clients/{id}         # Update client (Admin, DevOps only)
DELETE /api/clients/{id}         # Delete client (Admin only)
```

---

## Testing with Swagger

1. Navigate to `https://localhost:5001/swagger`
2. Click "Authorize" button
3. Login to get token:
   - POST `/api/auth/login`
   - Copy the token from response
4. Click "Authorize" again
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"
5. Test protected endpoints

---

## Common Issues & Solutions

### Issue: CORS Error
**Error**: "Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS"

**Solution**: Ensure CORS is configured in `Program.cs`:
```csharp
app.UseCors("AllowReactApp");
```

### Issue: Connection String Error
**Error**: "A network-related or instance-specific error occurred"

**Solution**: 
1. Verify SQL Server is running
2. Check server name in connection string
3. Test connection in SSMS first

### Issue: 401 Unauthorized
**Error**: API returns 401 for protected endpoints

**Solution**:
1. Ensure you're logged in
2. Check token is being sent in headers
3. Verify token hasn't expired (8-hour expiry)

### Issue: Login Shows "Invalid username or password"
**Error**: Login fails even with correct credentials

**Solution**:
1. Check database has user records (run seed data script)
2. Verify stored procedure `sp_AuthenticateUser` exists
3. Check SQL Server connection

---

## Current Implementation Status

### ✅ Completed
- [x] SQL Database schema
- [x] User authentication table
- [x] Client management table
- [x] Stored procedures for all operations
- [x] DTOs for all entities
- [x] Repository pattern implementation
- [x] API Controllers with role-based authorization
- [x] JWT authentication
- [x] Frontend API service layer
- [x] Login component with API integration
- [x] React hooks for auth and clients
- [x] Token management and storage
- [x] Error handling and toast notifications

### 📋 Next Steps (Phase 2)
- [ ] Client status and health monitoring
- [ ] SLA tracking
- [ ] Issues/alerts management
- [ ] Client details page integration with API

---

## Database Schema

### Users Table
```sql
UserId (PK, Identity)
Username (Unique)
PasswordHash
Email
Role (admin, devops, delivery)
IsActive
CreatedDate
LastLoginDate
```

### Clients Table
```sql
ClientId (PK, Identity)
Name
Company
Email
Status (active, inactive, pending)
Hosted (bit)
InstallLink
CreatedDate
ModifiedDate
IsDeleted (for soft delete)
```

---

## Security Notes

⚠️ **IMPORTANT**: This is a development/demo implementation. For production:

1. **Password Hashing**: 
   - Currently using plain text passwords (DEMO ONLY)
   - Use BCrypt or ASP.NET Identity in production
   - Never store plain text passwords

2. **JWT Secret Key**:
   - Use strong, randomly generated keys
   - Store in Azure Key Vault or similar
   - Rotate keys regularly

3. **HTTPS**:
   - Always use HTTPS in production
   - Configure SSL certificates
   - Disable HTTP endpoints

4. **SQL Injection**:
   - Already protected via Dapper parameterized queries
   - Never use string concatenation for SQL

5. **CORS**:
   - Restrict origins to your actual frontend domain
   - Don't use wildcard (*) in production

---

## Support

For issues with:
- **Backend (.NET/SQL)**: Check `/docs/Phase1-Backend-Documentation.md`
- **Frontend (React)**: Check component files in `/components`
- **API Integration**: Check `/services/api.ts`

Ready to proceed with Phase 2? Let me know!
