-- ===========================
-- Phase 1: Authentication & Clients Database Script
-- ===========================

USE master;
GO

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ClientManagementDB')
BEGIN
    CREATE DATABASE ClientManagementDB;
END
GO

USE ClientManagementDB;
GO

-- ===========================
-- 1. Users Table
-- ===========================
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    Role NVARCHAR(50) NOT NULL CHECK (Role IN ('admin', 'devops', 'delivery')),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastLogin DATETIME2 NULL
);
GO

CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_Email ON Users(Email);
GO

-- ===========================
-- 2. Clients Table
-- ===========================
CREATE TABLE Clients (
    ClientId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Company NVARCHAR(200) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(50) NULL,
    Address NVARCHAR(500) NULL,
    City NVARCHAR(100) NULL,
    Country NVARCHAR(100) NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'active' CHECK (Status IN ('active', 'inactive', 'pending')),
    Hosted BIT NOT NULL DEFAULT 0,
    InstallLink NVARCHAR(500) NULL,
    OnboardingDate DATETIME2 NULL,
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_Clients_Status ON Clients(Status);
CREATE INDEX IX_Clients_Company ON Clients(Company);
GO

-- ===========================
-- Stored Procedures: Authentication
-- ===========================

-- SP: Get User By Username
CREATE PROCEDURE sp_GetUserByUsername
    @Username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT UserId, Username, Email, PasswordHash, Role, IsActive, CreatedAt, LastLogin
    FROM Users
    WHERE Username = @Username AND IsActive = 1;
END
GO

-- SP: Update Last Login
CREATE PROCEDURE sp_UpdateLastLogin
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Users
    SET LastLogin = GETUTCDATE()
    WHERE UserId = @UserId;
END
GO

-- SP: Create User
CREATE PROCEDURE sp_CreateUser
    @Username NVARCHAR(100),
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(500),
    @Role NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Users (Username, Email, PasswordHash, Role)
    VALUES (@Username, @Email, @PasswordHash, @Role);
    
    SELECT SCOPE_IDENTITY() AS UserId;
END
GO

-- SP: Get All Users
CREATE PROCEDURE sp_GetAllUsers
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT UserId, Username, Email, Role, IsActive, CreatedAt, LastLogin
    FROM Users
    ORDER BY Username;
END
GO

-- ===========================
-- Stored Procedures: Clients
-- ===========================

-- SP: Get All Clients
CREATE PROCEDURE sp_GetAllClients
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ClientId, Name, Company, Email, Phone, Address, City, Country, 
           Status, Hosted, InstallLink, OnboardingDate, Notes, CreatedAt, UpdatedAt
    FROM Clients
    ORDER BY Name;
END
GO

-- SP: Get Client By ID
CREATE PROCEDURE sp_GetClientById
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ClientId, Name, Company, Email, Phone, Address, City, Country, 
           Status, Hosted, InstallLink, OnboardingDate, Notes, CreatedAt, UpdatedAt
    FROM Clients
    WHERE ClientId = @ClientId;
END
GO

-- SP: Create Client
CREATE PROCEDURE sp_CreateClient
    @Name NVARCHAR(200),
    @Company NVARCHAR(200),
    @Email NVARCHAR(255),
    @Phone NVARCHAR(50) = NULL,
    @Address NVARCHAR(500) = NULL,
    @City NVARCHAR(100) = NULL,
    @Country NVARCHAR(100) = NULL,
    @Status NVARCHAR(50),
    @Hosted BIT,
    @InstallLink NVARCHAR(500) = NULL,
    @OnboardingDate DATETIME2 = NULL,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Clients (Name, Company, Email, Phone, Address, City, Country, Status, 
                        Hosted, InstallLink, OnboardingDate, Notes)
    VALUES (@Name, @Company, @Email, @Phone, @Address, @City, @Country, @Status, 
            @Hosted, @InstallLink, @OnboardingDate, @Notes);
    
    SELECT SCOPE_IDENTITY() AS ClientId;
END
GO

-- SP: Update Client
CREATE PROCEDURE sp_UpdateClient
    @ClientId INT,
    @Name NVARCHAR(200),
    @Company NVARCHAR(200),
    @Email NVARCHAR(255),
    @Phone NVARCHAR(50) = NULL,
    @Address NVARCHAR(500) = NULL,
    @City NVARCHAR(100) = NULL,
    @Country NVARCHAR(100) = NULL,
    @Status NVARCHAR(50),
    @Hosted BIT,
    @InstallLink NVARCHAR(500) = NULL,
    @OnboardingDate DATETIME2 = NULL,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Clients
    SET Name = @Name,
        Company = @Company,
        Email = @Email,
        Phone = @Phone,
        Address = @Address,
        City = @City,
        Country = @Country,
        Status = @Status,
        Hosted = @Hosted,
        InstallLink = @InstallLink,
        OnboardingDate = @OnboardingDate,
        Notes = @Notes,
        UpdatedAt = GETUTCDATE()
    WHERE ClientId = @ClientId;
END
GO

-- SP: Delete Client
CREATE PROCEDURE sp_DeleteClient
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Clients
    WHERE ClientId = @ClientId;
END
GO

-- ===========================
-- Seed Data
-- ===========================

-- Insert Test Users (passwords are all "password123" hashed with BCrypt)
INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES
('admin', 'admin@example.com', '$2a$11$ZxGvB8tT.VHNx7VxjKL3HOKmHwGWE5QoXZKlh9z8YmVXqLqxLmXbG', 'admin'),
('delivery1', 'delivery@example.com', '$2a$11$ZxGvB8tT.VHNx7VxjKL3HOKmHwGWE5QoXZKlh9z8YmVXqLqxLmXbG', 'delivery'),
('devops1', 'devops@example.com', '$2a$11$ZxGvB8tT.VHNx7VxjKL3HOKmHwGWE5QoXZKlh9z8YmVXqLqxLmXbG', 'devops');
GO

-- Insert Test Clients
INSERT INTO Clients (Name, Company, Email, Phone, Status, Hosted, InstallLink, OnboardingDate) VALUES
('Acme Corp System', 'Acme Corporation', 'contact@acmecorp.com', '+1-555-0100', 'active', 1, 'https://install.finnivo.com/acme', '2024-01-15'),
('TechStart Platform', 'TechStart Inc', 'info@techstart.io', '+1-555-0101', 'active', 0, 'https://install.finnivo.com/techstart', '2024-02-20'),
('Global Solutions', 'Global Solutions Ltd', 'hello@globalsolutions.com', '+44-20-7946-0958', 'active', 1, 'https://install.finnivo.com/global', '2024-03-10'),
('DataFlow Systems', 'DataFlow Technologies', 'support@dataflow.net', '+1-555-0102', 'pending', 0, 'https://install.finnivo.com/dataflow', '2024-04-05'),
('CloudWorks', 'CloudWorks GmbH', 'contact@cloudworks.de', '+49-30-12345678', 'inactive', 1, NULL, '2023-11-20');
GO

PRINT 'Phase 1: Authentication & Clients - Completed Successfully';
GO
