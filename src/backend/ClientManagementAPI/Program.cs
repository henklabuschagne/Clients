using ClientManagementAPI.Repositories;
using ClientManagementAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger with JWT support
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Client Management API",
        Version = "v1",
        Description = "API for managing clients, servers, licenses, tickets, and updates"
    });

    // Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure JWT Authentication
var jwtSecret = builder.Configuration["JwtSettings:Secret"] 
    ?? throw new InvalidOperationException("JWT Secret not configured");
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in production
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
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<IUpdateRepository, UpdateRepository>();

// Register Extension Repositories (Phase 2, 4, 6, 7, 8)
builder.Services.AddScoped<ClientManagementAPI.Controllers.IStatusRepository, ClientManagementAPI.Controllers.StatusRepository>();
builder.Services.AddScoped<ClientManagementAPI.Controllers.IStatisticsRepository, ClientManagementAPI.Controllers.StatisticsRepository>();
builder.Services.AddScoped<ClientManagementAPI.Controllers.IServerExtensionsRepository, ClientManagementAPI.Controllers.ServerExtensionsRepository>();
builder.Services.AddScoped<ClientManagementAPI.Controllers.ITicketExtensionsRepository, ClientManagementAPI.Controllers.TicketExtensionsRepository>();
builder.Services.AddScoped<ClientManagementAPI.Controllers.IUpdateExtensionsRepository, ClientManagementAPI.Controllers.UpdateExtensionsRepository>();

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Client Management API v1");
        options.RoutePrefix = string.Empty; // Swagger UI at root
    });
}

app.UseCors("AllowAll");

// Allow iframe embedding - do not send X-Frame-Options header
app.Use(async (context, next) =>
{
    // Remove X-Frame-Options if it exists (allows iframe embedding)
    context.Response.Headers.Remove("X-Frame-Options");
    
    // Allow embedding from any origin
    // Note: In production, you may want to restrict this to specific origins
    // context.Response.Headers.Add("Content-Security-Policy", "frame-ancestors 'self' https://your-parent-app.com");
    
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Welcome endpoint
app.MapGet("/api", () => new
{
    message = "Client Management API",
    version = "1.0.0",
    endpoints = new
    {
        swagger = "/swagger",
        auth = "/api/auth/login",
        clients = "/api/clients",
        vpn = "/api/vpn",
        connections = "/api/connections",
        servers = "/api/servers",
        contacts = "/api/contacts",
        licenses = "/api/licenses",
        tickets = "/api/tickets",
        updates = "/api/updates"
    }
});

Console.WriteLine("==================================================");
Console.WriteLine("  Client Management API");
Console.WriteLine("==================================================");
Console.WriteLine($"  Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"  Swagger UI: http://localhost:5000");
Console.WriteLine($"  API Docs: http://localhost:5000/swagger");
Console.WriteLine("==================================================");
Console.WriteLine("\n  Test Users:");
Console.WriteLine("  - admin / password123 (Full Access)");
Console.WriteLine("  - devops1 / password123 (DevOps Access)");
Console.WriteLine("  - delivery1 / password123 (Delivery Access)");
Console.WriteLine("==================================================\n");

app.Run();