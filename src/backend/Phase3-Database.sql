-- ===========================
-- Phase 3: VPN & Connections Database Script
-- ===========================

USE ClientManagementDB;
GO

-- ===========================
-- 1. VPN Configurations Table
-- ===========================
CREATE TABLE VPNConfigurations (
    VPNId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    VPNType NVARCHAR(50) NOT NULL CHECK (VPNType IN ('openvpn', 'wireguard', 'ipsec', 'l2tp')),
    ServerAddress NVARCHAR(255) NOT NULL,
    Port INT NOT NULL,
    Protocol NVARCHAR(50) NULL,
    Username NVARCHAR(100) NULL,
    Password NVARCHAR(500) NULL, -- Should be encrypted
    CertificatePath NVARCHAR(500) NULL,
    ConfigFile NVARCHAR(MAX) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    LastConnected DATETIME2 NULL,
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_VPNConfigurations_ClientId ON VPNConfigurations(ClientId);
CREATE INDEX IX_VPNConfigurations_IsActive ON VPNConfigurations(IsActive);
GO

-- ===========================
-- 2. Connections Table
-- ===========================
CREATE TABLE Connections (
    ConnectionId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    ConnectionType NVARCHAR(50) NOT NULL CHECK (ConnectionType IN ('database', 'api', 'ftp', 'ssh', 'rdp', 'other')),
    Name NVARCHAR(200) NOT NULL,
    Host NVARCHAR(255) NOT NULL,
    Port INT NOT NULL,
    DatabaseName NVARCHAR(100) NULL,
    Username NVARCHAR(100) NULL,
    Password NVARCHAR(500) NULL, -- Should be encrypted
    ConnectionString NVARCHAR(MAX) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    LastTested DATETIME2 NULL,
    TestStatus NVARCHAR(50) NULL CHECK (TestStatus IN ('success', 'failure', NULL)),
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_Connections_ClientId ON Connections(ClientId);
CREATE INDEX IX_Connections_ConnectionType ON Connections(ConnectionType);
CREATE INDEX IX_Connections_IsActive ON Connections(IsActive);
GO

-- ===========================
-- Stored Procedures: VPN Configurations
-- ===========================

-- SP: Get VPN Configurations By Client
CREATE PROCEDURE sp_GetVPNConfigurationsByClient
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT VPNId, ClientId, VPNType, ServerAddress, Port, Protocol, Username, 
           Password, CertificatePath, ConfigFile, IsActive, LastConnected, 
           Notes, CreatedAt, UpdatedAt
    FROM VPNConfigurations
    WHERE ClientId = @ClientId
    ORDER BY IsActive DESC, CreatedAt DESC;
END
GO

-- SP: Get VPN Configuration By ID
CREATE PROCEDURE sp_GetVPNConfigurationById
    @VPNId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT VPNId, ClientId, VPNType, ServerAddress, Port, Protocol, Username, 
           Password, CertificatePath, ConfigFile, IsActive, LastConnected, 
           Notes, CreatedAt, UpdatedAt
    FROM VPNConfigurations
    WHERE VPNId = @VPNId;
END
GO

-- SP: Create VPN Configuration
CREATE PROCEDURE sp_CreateVPNConfiguration
    @ClientId INT,
    @VPNType NVARCHAR(50),
    @ServerAddress NVARCHAR(255),
    @Port INT,
    @Protocol NVARCHAR(50) = NULL,
    @Username NVARCHAR(100) = NULL,
    @Password NVARCHAR(500) = NULL,
    @CertificatePath NVARCHAR(500) = NULL,
    @ConfigFile NVARCHAR(MAX) = NULL,
    @IsActive BIT = 1,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO VPNConfigurations (ClientId, VPNType, ServerAddress, Port, Protocol, 
                                   Username, Password, CertificatePath, ConfigFile, 
                                   IsActive, Notes)
    VALUES (@ClientId, @VPNType, @ServerAddress, @Port, @Protocol, 
            @Username, @Password, @CertificatePath, @ConfigFile, 
            @IsActive, @Notes);
    
    SELECT SCOPE_IDENTITY() AS VPNId;
END
GO

-- SP: Update VPN Configuration
CREATE PROCEDURE sp_UpdateVPNConfiguration
    @VPNId INT,
    @VPNType NVARCHAR(50),
    @ServerAddress NVARCHAR(255),
    @Port INT,
    @Protocol NVARCHAR(50) = NULL,
    @Username NVARCHAR(100) = NULL,
    @Password NVARCHAR(500) = NULL,
    @CertificatePath NVARCHAR(500) = NULL,
    @ConfigFile NVARCHAR(MAX) = NULL,
    @IsActive BIT = 1,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE VPNConfigurations
    SET VPNType = @VPNType,
        ServerAddress = @ServerAddress,
        Port = @Port,
        Protocol = @Protocol,
        Username = @Username,
        Password = @Password,
        CertificatePath = @CertificatePath,
        ConfigFile = @ConfigFile,
        IsActive = @IsActive,
        Notes = @Notes,
        UpdatedAt = GETUTCDATE()
    WHERE VPNId = @VPNId;
END
GO

-- SP: Delete VPN Configuration
CREATE PROCEDURE sp_DeleteVPNConfiguration
    @VPNId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM VPNConfigurations
    WHERE VPNId = @VPNId;
END
GO

-- SP: Update VPN Last Connected
CREATE PROCEDURE sp_UpdateVPNLastConnected
    @VPNId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE VPNConfigurations
    SET LastConnected = GETUTCDATE()
    WHERE VPNId = @VPNId;
END
GO

-- ===========================
-- Stored Procedures: Connections
-- ===========================

-- SP: Get Connections By Client
CREATE PROCEDURE sp_GetConnectionsByClient
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ConnectionId, ClientId, ConnectionType, Name, Host, Port, DatabaseName, 
           Username, Password, ConnectionString, IsActive, LastTested, TestStatus, 
           Notes, CreatedAt, UpdatedAt
    FROM Connections
    WHERE ClientId = @ClientId
    ORDER BY IsActive DESC, Name;
END
GO

-- SP: Get Connection By ID
CREATE PROCEDURE sp_GetConnectionById
    @ConnectionId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ConnectionId, ClientId, ConnectionType, Name, Host, Port, DatabaseName, 
           Username, Password, ConnectionString, IsActive, LastTested, TestStatus, 
           Notes, CreatedAt, UpdatedAt
    FROM Connections
    WHERE ConnectionId = @ConnectionId;
END
GO

-- SP: Create Connection
CREATE PROCEDURE sp_CreateConnection
    @ClientId INT,
    @ConnectionType NVARCHAR(50),
    @Name NVARCHAR(200),
    @Host NVARCHAR(255),
    @Port INT,
    @DatabaseName NVARCHAR(100) = NULL,
    @Username NVARCHAR(100) = NULL,
    @Password NVARCHAR(500) = NULL,
    @ConnectionString NVARCHAR(MAX) = NULL,
    @IsActive BIT = 1,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Connections (ClientId, ConnectionType, Name, Host, Port, DatabaseName, 
                            Username, Password, ConnectionString, IsActive, Notes)
    VALUES (@ClientId, @ConnectionType, @Name, @Host, @Port, @DatabaseName, 
            @Username, @Password, @ConnectionString, @IsActive, @Notes);
    
    SELECT SCOPE_IDENTITY() AS ConnectionId;
END
GO

-- SP: Update Connection
CREATE PROCEDURE sp_UpdateConnection
    @ConnectionId INT,
    @ConnectionType NVARCHAR(50),
    @Name NVARCHAR(200),
    @Host NVARCHAR(255),
    @Port INT,
    @DatabaseName NVARCHAR(100) = NULL,
    @Username NVARCHAR(100) = NULL,
    @Password NVARCHAR(500) = NULL,
    @ConnectionString NVARCHAR(MAX) = NULL,
    @IsActive BIT = 1,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Connections
    SET ConnectionType = @ConnectionType,
        Name = @Name,
        Host = @Host,
        Port = @Port,
        DatabaseName = @DatabaseName,
        Username = @Username,
        Password = @Password,
        ConnectionString = @ConnectionString,
        IsActive = @IsActive,
        Notes = @Notes,
        UpdatedAt = GETUTCDATE()
    WHERE ConnectionId = @ConnectionId;
END
GO

-- SP: Delete Connection
CREATE PROCEDURE sp_DeleteConnection
    @ConnectionId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Connections
    WHERE ConnectionId = @ConnectionId;
END
GO

-- SP: Update Connection Test Result
CREATE PROCEDURE sp_UpdateConnectionTestResult
    @ConnectionId INT,
    @TestStatus NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Connections
    SET LastTested = GETUTCDATE(),
        TestStatus = @TestStatus
    WHERE ConnectionId = @ConnectionId;
END
GO

-- ===========================
-- Seed Data
-- ===========================

-- Insert sample VPN configurations
INSERT INTO VPNConfigurations (ClientId, VPNType, ServerAddress, Port, Protocol, Username, IsActive, Notes) VALUES
(1, 'openvpn', 'vpn.acmecorp.com', 1194, 'udp', 'admin', 1, 'Main office VPN'),
(2, 'wireguard', '10.0.1.1', 51820, 'udp', NULL, 1, 'WireGuard tunnel'),
(3, 'ipsec', 'vpn.globalsolutions.com', 500, 'ikev2', 'vpnuser', 1, 'IPSec VPN');
GO

-- Insert sample connections
INSERT INTO Connections (ClientId, ConnectionType, Name, Host, Port, DatabaseName, Username, IsActive, Notes) VALUES
(1, 'database', 'Production DB', 'db.acmecorp.com', 1433, 'AcmeDB', 'dbuser', 1, 'SQL Server production database'),
(1, 'api', 'REST API', 'api.acmecorp.com', 443, NULL, NULL, 1, 'Main REST API endpoint'),
(2, 'database', 'PostgreSQL DB', 'db.techstart.io', 5432, 'techstartdb', 'postgres', 1, 'PostgreSQL production database'),
(3, 'ssh', 'Web Server SSH', 'web01.globalsolutions.com', 22, NULL, 'root', 1, 'SSH access to web server'),
(4, 'ftp', 'FTP Server', 'ftp.dataflow.net', 21, NULL, 'ftpuser', 1, 'FTP file transfer');
GO

PRINT 'Phase 3: VPN & Connections - Completed Successfully';
GO
