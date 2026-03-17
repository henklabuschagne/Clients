-- =============================================
-- Phase 4: Server & Infrastructure Management
-- Database Tables and Stored Procedures
-- =============================================

USE ClientManagementDB;
GO

-- =============================================
-- TABLES
-- =============================================

-- Table: Servers
CREATE TABLE Servers (
    ServerId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Type NVARCHAR(50) NOT NULL CHECK (Type IN ('Web', 'Database', 'Application', 'File', 'Mail', 'DNS', 'Backup', 'Load Balancer', 'Other')),
    Environment NVARCHAR(50) NOT NULL CHECK (Environment IN ('Production', 'Staging', 'Development', 'Testing', 'DR')),
    OperatingSystem NVARCHAR(100) NULL,
    IpAddress NVARCHAR(50) NULL,
    Hostname NVARCHAR(255) NULL,
    Location NVARCHAR(255) NULL,
    Provider NVARCHAR(100) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (Status IN ('active', 'inactive', 'maintenance', 'decommissioned')),
    Notes NVARCHAR(MAX) NULL,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Server_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Server_ClientId ON Servers(ClientId);
CREATE INDEX IX_Server_Type ON Servers(Type);
CREATE INDEX IX_Server_Environment ON Servers(Environment);
GO

-- Table: ServerSpecs
CREATE TABLE ServerSpecs (
    SpecId INT PRIMARY KEY IDENTITY(1,1),
    ServerId INT NOT NULL,
    CpuCores INT NULL,
    CpuModel NVARCHAR(255) NULL,
    RamGb INT NULL,
    StorageGb INT NULL,
    StorageType NVARCHAR(50) NULL,
    Bandwidth NVARCHAR(50) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_ServerSpecs_Server FOREIGN KEY (ServerId) REFERENCES Servers(ServerId) ON DELETE CASCADE,
    CONSTRAINT UQ_ServerSpecs_ServerId UNIQUE (ServerId)
);
GO

-- Table: ServerMetrics
CREATE TABLE ServerMetrics (
    MetricId INT PRIMARY KEY IDENTITY(1,1),
    ServerId INT NOT NULL,
    CpuUsage DECIMAL(5,2) NULL,
    MemoryUsage DECIMAL(5,2) NULL,
    DiskUsage DECIMAL(5,2) NULL,
    NetworkIn DECIMAL(10,2) NULL,
    NetworkOut DECIMAL(10,2) NULL,
    Uptime INT NULL, -- in seconds
    RecordedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_ServerMetrics_Server FOREIGN KEY (ServerId) REFERENCES Servers(ServerId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_ServerMetrics_ServerId ON ServerMetrics(ServerId);
CREATE INDEX IX_ServerMetrics_RecordedDate ON ServerMetrics(RecordedDate DESC);
GO

-- Table: ServerSoftware
CREATE TABLE ServerSoftware (
    SoftwareId INT PRIMARY KEY IDENTITY(1,1),
    ServerId INT NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Version NVARCHAR(100) NULL,
    Type NVARCHAR(50) NULL CHECK (Type IN ('Web Server', 'Database', 'Runtime', 'Framework', 'Security', 'Monitoring', 'Other') OR Type IS NULL),
    InstallDate DATETIME2 NULL,
    LicenseKey NVARCHAR(500) NULL,
    Notes NVARCHAR(MAX) NULL,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_ServerSoftware_Server FOREIGN KEY (ServerId) REFERENCES Servers(ServerId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_ServerSoftware_ServerId ON ServerSoftware(ServerId);
GO

-- =============================================
-- STORED PROCEDURES - Servers
-- =============================================

-- SP: Get Servers by Client
CREATE PROCEDURE sp_GetServers
    @ClientId INT,
    @IncludeArchived BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        s.ServerId,
        s.ClientId,
        s.Name,
        s.Type,
        s.Environment,
        s.OperatingSystem,
        s.IpAddress,
        s.Hostname,
        s.Location,
        s.Provider,
        s.Status,
        s.Notes,
        s.IsArchived,
        s.CreatedDate,
        s.ModifiedDate,
        sp.CpuCores,
        sp.CpuModel,
        sp.RamGb,
        sp.StorageGb,
        sp.StorageType,
        sp.Bandwidth
    FROM Servers s
    LEFT JOIN ServerSpecs sp ON s.ServerId = sp.ServerId
    WHERE s.ClientId = @ClientId
        AND (@IncludeArchived = 1 OR s.IsArchived = 0)
    ORDER BY s.Name;
END
GO

-- SP: Get Server by ID
CREATE PROCEDURE sp_GetServerById
    @ServerId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        s.ServerId,
        s.ClientId,
        s.Name,
        s.Type,
        s.Environment,
        s.OperatingSystem,
        s.IpAddress,
        s.Hostname,
        s.Location,
        s.Provider,
        s.Status,
        s.Notes,
        s.IsArchived,
        s.CreatedDate,
        s.ModifiedDate,
        sp.CpuCores,
        sp.CpuModel,
        sp.RamGb,
        sp.StorageGb,
        sp.StorageType,
        sp.Bandwidth
    FROM Servers s
    LEFT JOIN ServerSpecs sp ON s.ServerId = sp.ServerId
    WHERE s.ServerId = @ServerId;
END
GO

-- SP: Create Server
CREATE PROCEDURE sp_CreateServer
    @ClientId INT,
    @Name NVARCHAR(255),
    @Type NVARCHAR(50),
    @Environment NVARCHAR(50),
    @OperatingSystem NVARCHAR(100) = NULL,
    @IpAddress NVARCHAR(50) = NULL,
    @Hostname NVARCHAR(255) = NULL,
    @Location NVARCHAR(255) = NULL,
    @Provider NVARCHAR(100) = NULL,
    @Status NVARCHAR(20) = 'active',
    @Notes NVARCHAR(MAX) = NULL,
    @CpuCores INT = NULL,
    @CpuModel NVARCHAR(255) = NULL,
    @RamGb INT = NULL,
    @StorageGb INT = NULL,
    @StorageType NVARCHAR(50) = NULL,
    @Bandwidth NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NewServerId INT;
    
    -- Insert server
    INSERT INTO Servers (ClientId, Name, Type, Environment, OperatingSystem, IpAddress, Hostname, Location, Provider, Status, Notes)
    VALUES (@ClientId, @Name, @Type, @Environment, @OperatingSystem, @IpAddress, @Hostname, @Location, @Provider, @Status, @Notes);
    
    SET @NewServerId = SCOPE_IDENTITY();
    
    -- Insert specs if provided
    IF @CpuCores IS NOT NULL OR @RamGb IS NOT NULL OR @StorageGb IS NOT NULL
    BEGIN
        INSERT INTO ServerSpecs (ServerId, CpuCores, CpuModel, RamGb, StorageGb, StorageType, Bandwidth)
        VALUES (@NewServerId, @CpuCores, @CpuModel, @RamGb, @StorageGb, @StorageType, @Bandwidth);
    END
    
    -- Return the created server
    EXEC sp_GetServerById @NewServerId;
END
GO

-- SP: Update Server
CREATE PROCEDURE sp_UpdateServer
    @ServerId INT,
    @Name NVARCHAR(255),
    @Type NVARCHAR(50),
    @Environment NVARCHAR(50),
    @OperatingSystem NVARCHAR(100) = NULL,
    @IpAddress NVARCHAR(50) = NULL,
    @Hostname NVARCHAR(255) = NULL,
    @Location NVARCHAR(255) = NULL,
    @Provider NVARCHAR(100) = NULL,
    @Status NVARCHAR(20),
    @Notes NVARCHAR(MAX) = NULL,
    @CpuCores INT = NULL,
    @CpuModel NVARCHAR(255) = NULL,
    @RamGb INT = NULL,
    @StorageGb INT = NULL,
    @StorageType NVARCHAR(50) = NULL,
    @Bandwidth NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update server
    UPDATE Servers
    SET 
        Name = @Name,
        Type = @Type,
        Environment = @Environment,
        OperatingSystem = @OperatingSystem,
        IpAddress = @IpAddress,
        Hostname = @Hostname,
        Location = @Location,
        Provider = @Provider,
        Status = @Status,
        Notes = @Notes,
        ModifiedDate = GETUTCDATE()
    WHERE ServerId = @ServerId;
    
    -- Update or insert specs
    IF EXISTS (SELECT 1 FROM ServerSpecs WHERE ServerId = @ServerId)
    BEGIN
        UPDATE ServerSpecs
        SET 
            CpuCores = @CpuCores,
            CpuModel = @CpuModel,
            RamGb = @RamGb,
            StorageGb = @StorageGb,
            StorageType = @StorageType,
            Bandwidth = @Bandwidth,
            ModifiedDate = GETUTCDATE()
        WHERE ServerId = @ServerId;
    END
    ELSE IF @CpuCores IS NOT NULL OR @RamGb IS NOT NULL OR @StorageGb IS NOT NULL
    BEGIN
        INSERT INTO ServerSpecs (ServerId, CpuCores, CpuModel, RamGb, StorageGb, StorageType, Bandwidth)
        VALUES (@ServerId, @CpuCores, @CpuModel, @RamGb, @StorageGb, @StorageType, @Bandwidth);
    END
    
    -- Return the updated server
    EXEC sp_GetServerById @ServerId;
END
GO

-- SP: Archive/Unarchive Server
CREATE PROCEDURE sp_ArchiveServer
    @ServerId INT,
    @IsArchived BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Servers
    SET 
        IsArchived = @IsArchived,
        ModifiedDate = GETUTCDATE()
    WHERE ServerId = @ServerId;
    
    SELECT 1 AS Success;
END
GO

-- SP: Delete Server
CREATE PROCEDURE sp_DeleteServer
    @ServerId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Cascade deletes will handle ServerSpecs, ServerMetrics, ServerSoftware
    DELETE FROM Servers
    WHERE ServerId = @ServerId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- STORED PROCEDURES - Server Metrics
-- =============================================

-- SP: Get Server Metrics
CREATE PROCEDURE sp_GetServerMetrics
    @ServerId INT,
    @Hours INT = 24
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        MetricId,
        ServerId,
        CpuUsage,
        MemoryUsage,
        DiskUsage,
        NetworkIn,
        NetworkOut,
        Uptime,
        RecordedDate
    FROM ServerMetrics
    WHERE ServerId = @ServerId
        AND RecordedDate >= DATEADD(HOUR, -@Hours, GETUTCDATE())
    ORDER BY RecordedDate DESC;
END
GO

-- SP: Record Server Metrics
CREATE PROCEDURE sp_RecordServerMetrics
    @ServerId INT,
    @CpuUsage DECIMAL(5,2) = NULL,
    @MemoryUsage DECIMAL(5,2) = NULL,
    @DiskUsage DECIMAL(5,2) = NULL,
    @NetworkIn DECIMAL(10,2) = NULL,
    @NetworkOut DECIMAL(10,2) = NULL,
    @Uptime INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO ServerMetrics (ServerId, CpuUsage, MemoryUsage, DiskUsage, NetworkIn, NetworkOut, Uptime)
    VALUES (@ServerId, @CpuUsage, @MemoryUsage, @DiskUsage, @NetworkIn, @NetworkOut, @Uptime);
    
    SELECT 1 AS Success;
END
GO

-- SP: Get Latest Server Metrics
CREATE PROCEDURE sp_GetLatestServerMetrics
    @ServerId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1
        MetricId,
        ServerId,
        CpuUsage,
        MemoryUsage,
        DiskUsage,
        NetworkIn,
        NetworkOut,
        Uptime,
        RecordedDate
    FROM ServerMetrics
    WHERE ServerId = @ServerId
    ORDER BY RecordedDate DESC;
END
GO

-- =============================================
-- STORED PROCEDURES - Server Software
-- =============================================

-- SP: Get Server Software
CREATE PROCEDURE sp_GetServerSoftware
    @ServerId INT,
    @IncludeArchived BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        SoftwareId,
        ServerId,
        Name,
        Version,
        Type,
        InstallDate,
        LicenseKey,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM ServerSoftware
    WHERE ServerId = @ServerId
        AND (@IncludeArchived = 1 OR IsArchived = 0)
    ORDER BY Name;
END
GO

-- SP: Create Server Software
CREATE PROCEDURE sp_CreateServerSoftware
    @ServerId INT,
    @Name NVARCHAR(255),
    @Version NVARCHAR(100) = NULL,
    @Type NVARCHAR(50) = NULL,
    @InstallDate DATETIME2 = NULL,
    @LicenseKey NVARCHAR(500) = NULL,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO ServerSoftware (ServerId, Name, Version, Type, InstallDate, LicenseKey, Notes)
    VALUES (@ServerId, @Name, @Version, @Type, @InstallDate, @LicenseKey, @Notes);
    
    SELECT 
        SoftwareId,
        ServerId,
        Name,
        Version,
        Type,
        InstallDate,
        LicenseKey,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM ServerSoftware
    WHERE SoftwareId = SCOPE_IDENTITY();
END
GO

-- SP: Update Server Software
CREATE PROCEDURE sp_UpdateServerSoftware
    @SoftwareId INT,
    @Name NVARCHAR(255),
    @Version NVARCHAR(100) = NULL,
    @Type NVARCHAR(50) = NULL,
    @InstallDate DATETIME2 = NULL,
    @LicenseKey NVARCHAR(500) = NULL,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE ServerSoftware
    SET 
        Name = @Name,
        Version = @Version,
        Type = @Type,
        InstallDate = @InstallDate,
        LicenseKey = @LicenseKey,
        Notes = @Notes,
        ModifiedDate = GETUTCDATE()
    WHERE SoftwareId = @SoftwareId;
    
    SELECT 
        SoftwareId,
        ServerId,
        Name,
        Version,
        Type,
        InstallDate,
        LicenseKey,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM ServerSoftware
    WHERE SoftwareId = @SoftwareId;
END
GO

-- SP: Archive Server Software
CREATE PROCEDURE sp_ArchiveServerSoftware
    @SoftwareId INT,
    @IsArchived BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE ServerSoftware
    SET 
        IsArchived = @IsArchived,
        ModifiedDate = GETUTCDATE()
    WHERE SoftwareId = @SoftwareId;
    
    SELECT 1 AS Success;
END
GO

-- SP: Delete Server Software
CREATE PROCEDURE sp_DeleteServerSoftware
    @SoftwareId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM ServerSoftware
    WHERE SoftwareId = @SoftwareId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- SEED DATA
-- =============================================

-- Insert sample servers
DECLARE @Server1 INT, @Server2 INT, @Server3 INT, @Server4 INT;

INSERT INTO Servers (ClientId, Name, Type, Environment, OperatingSystem, IpAddress, Hostname, Location, Provider, Status, Notes)
VALUES
(1, 'Web Server 1', 'Web', 'Production', 'Ubuntu 22.04 LTS', '192.168.1.10', 'web-prod-01.acme.com', 'US-East', 'AWS', 'active', 'Primary web server'),
(1, 'Database Server', 'Database', 'Production', 'PostgreSQL on Ubuntu 20.04', '192.168.1.20', 'db-prod-01.acme.com', 'US-East', 'AWS', 'active', 'PostgreSQL master database'),
(1, 'App Server Dev', 'Application', 'Development', 'CentOS 8', '192.168.2.10', 'app-dev-01.acme.com', 'US-West', 'DigitalOcean', 'active', NULL),
(3, 'Load Balancer', 'Load Balancer', 'Production', 'NGINX on Debian 11', '10.0.1.5', 'lb-prod-01.globalsol.com', 'EU-West', 'Azure', 'active', 'Primary load balancer'),
(4, 'File Server', 'File', 'Production', 'Windows Server 2019', '172.16.0.50', 'file-prod-01.innolabs.com', 'On-Premise', 'Internal', 'active', 'Document storage server'),
(6, 'Backup Server', 'Backup', 'Production', 'Ubuntu 20.04 LTS', '10.10.10.100', 'backup-prod-01.cloudserv.com', 'US-Central', 'GCP', 'active', 'Automated backup server');

SET @Server1 = 1;
SET @Server2 = 2;
SET @Server3 = 3;
SET @Server4 = 4;

-- Insert server specs
INSERT INTO ServerSpecs (ServerId, CpuCores, CpuModel, RamGb, StorageGb, StorageType, Bandwidth)
VALUES
(1, 8, 'Intel Xeon E5-2686 v4', 16, 500, 'SSD', '1 Gbps'),
(2, 16, 'AMD EPYC 7R32', 64, 2000, 'NVMe SSD', '10 Gbps'),
(3, 4, 'Intel Core i7', 8, 250, 'SSD', '100 Mbps'),
(4, 12, 'Intel Xeon Platinum 8272CL', 32, 1000, 'SSD', '5 Gbps'),
(5, 8, 'Intel Xeon E5-2630 v4', 32, 4000, 'HDD RAID 5', '1 Gbps'),
(6, 8, 'Intel Xeon E5-2680 v4', 32, 10000, 'HDD', '1 Gbps');

-- Insert sample metrics
INSERT INTO ServerMetrics (ServerId, CpuUsage, MemoryUsage, DiskUsage, NetworkIn, NetworkOut, Uptime, RecordedDate)
VALUES
(1, 45.2, 62.5, 38.7, 1250.5, 980.3, 1555200, GETUTCDATE()),
(1, 42.8, 60.1, 38.7, 1180.2, 920.8, 1551600, DATEADD(HOUR, -1, GETUTCDATE())),
(2, 78.5, 85.2, 65.3, 2500.8, 1800.5, 2592000, GETUTCDATE()),
(3, 15.3, 25.8, 22.1, 50.2, 45.8, 86400, GETUTCDATE()),
(4, 68.9, 72.3, 55.8, 3200.5, 2800.9, 5184000, GETUTCDATE()),
(5, 25.5, 45.6, 78.9, 450.2, 380.5, 7776000, GETUTCDATE()),
(6, 12.8, 18.5, 82.3, 8500.5, 150.2, 10368000, GETUTCDATE());

-- Insert sample server software
INSERT INTO ServerSoftware (ServerId, Name, Version, Type, InstallDate, Notes)
VALUES
(1, 'NGINX', '1.24.0', 'Web Server', DATEADD(MONTH, -6, GETUTCDATE()), 'Web server'),
(1, 'Node.js', '18.17.0', 'Runtime', DATEADD(MONTH, -6, GETUTCDATE()), 'Application runtime'),
(1, 'PM2', '5.3.0', 'Other', DATEADD(MONTH, -6, GETUTCDATE()), 'Process manager'),
(2, 'PostgreSQL', '15.3', 'Database', DATEADD(MONTH, -12, GETUTCDATE()), 'Primary database'),
(2, 'pgAdmin', '7.4', 'Database', DATEADD(MONTH, -12, GETUTCDATE()), 'Database management tool'),
(3, 'Apache', '2.4.57', 'Web Server', DATEADD(MONTH, -3, GETUTCDATE()), 'Development web server'),
(3, 'PHP', '8.2.8', 'Runtime', DATEADD(MONTH, -3, GETUTCDATE()), 'PHP runtime'),
(4, 'NGINX', '1.24.0', 'Web Server', DATEADD(MONTH, -8, GETUTCDATE()), 'Load balancer'),
(5, 'Windows Server', '2019', 'Other', DATEADD(YEAR, -2, GETUTCDATE()), 'Operating system'),
(6, 'Bacula', '13.0.1', 'Other', DATEADD(MONTH, -10, GETUTCDATE()), 'Backup software');

GO

PRINT 'Phase 4 database setup completed successfully!';
