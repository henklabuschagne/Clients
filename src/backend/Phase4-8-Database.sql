-- ===========================
-- Phases 4-8: Servers, Contacts, Licenses, Statistics, Tickets, Updates
-- ===========================

USE ClientManagementDB;
GO

-- ===========================
-- PHASE 4: SERVERS
-- ===========================

CREATE TABLE Servers (
    ServerId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    ServerName NVARCHAR(200) NOT NULL,
    ServerType NVARCHAR(50) NOT NULL CHECK (ServerType IN ('web', 'database', 'application', 'mail', 'file', 'backup')),
    IPAddress NVARCHAR(50) NOT NULL,
    Hostname NVARCHAR(255) NULL,
    OperatingSystem NVARCHAR(100) NULL,
    CPUCores INT NULL,
    RAMGB INT NULL,
    DiskGB INT NULL,
    Location NVARCHAR(200) NULL,
    Provider NVARCHAR(100) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    LastHealthCheck DATETIME2 NULL,
    HealthStatus NVARCHAR(50) NULL CHECK (HealthStatus IN ('healthy', 'warning', 'critical', NULL)),
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_Servers_ClientId ON Servers(ClientId);
CREATE INDEX IX_Servers_ServerType ON Servers(ServerType);
GO

CREATE TABLE ServerMetrics (
    MetricId INT IDENTITY(1,1) PRIMARY KEY,
    ServerId INT NOT NULL FOREIGN KEY REFERENCES Servers(ServerId) ON DELETE CASCADE,
    CPUUsage DECIMAL(5,2) NULL,
    RAMUsage DECIMAL(5,2) NULL,
    DiskUsage DECIMAL(5,2) NULL,
    NetworkIn BIGINT NULL, -- bytes
    NetworkOut BIGINT NULL, -- bytes
    RecordedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_ServerMetrics_ServerId ON ServerMetrics(ServerId);
CREATE INDEX IX_ServerMetrics_RecordedAt ON ServerMetrics(RecordedAt DESC);
GO

CREATE TABLE SoftwareInstallations (
    InstallationId INT IDENTITY(1,1) PRIMARY KEY,
    ServerId INT NOT NULL FOREIGN KEY REFERENCES Servers(ServerId) ON DELETE CASCADE,
    SoftwareName NVARCHAR(200) NOT NULL,
    Version NVARCHAR(100) NOT NULL,
    InstalledAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LicensePath NVARCHAR(500) NULL,
    Notes NVARCHAR(MAX) NULL
);
GO

CREATE INDEX IX_SoftwareInstallations_ServerId ON SoftwareInstallations(ServerId);
GO

-- ===========================
-- PHASE 5: CONTACTS & LICENSES
-- ===========================

CREATE TABLE Contacts (
    ContactId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(50) NULL,
    Mobile NVARCHAR(50) NULL,
    Position NVARCHAR(100) NULL,
    Department NVARCHAR(100) NULL,
    IsPrimary BIT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_Contacts_ClientId ON Contacts(ClientId);
CREATE INDEX IX_Contacts_Email ON Contacts(Email);
GO

CREATE TABLE Licenses (
    LicenseId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    SoftwareName NVARCHAR(200) NOT NULL,
    LicenseKey NVARCHAR(500) NOT NULL,
    LicenseType NVARCHAR(50) NOT NULL CHECK (LicenseType IN ('perpetual', 'subscription', 'trial')),
    Quantity INT NOT NULL DEFAULT 1,
    PurchaseDate DATE NOT NULL,
    ExpiryDate DATE NULL,
    RenewalDate DATE NULL,
    Cost DECIMAL(10,2) NULL,
    Currency NVARCHAR(10) NULL,
    Vendor NVARCHAR(200) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_Licenses_ClientId ON Licenses(ClientId);
CREATE INDEX IX_Licenses_ExpiryDate ON Licenses(ExpiryDate);
GO

-- ===========================
-- PHASE 6: STATISTICS
-- ===========================

CREATE TABLE Statistics (
    StatisticId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    MetricName NVARCHAR(200) NOT NULL,
    MetricValue DECIMAL(18,4) NOT NULL,
    Unit NVARCHAR(50) NULL,
    Category NVARCHAR(100) NULL,
    RecordedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Notes NVARCHAR(MAX) NULL
);
GO

CREATE INDEX IX_Statistics_ClientId ON Statistics(ClientId);
CREATE INDEX IX_Statistics_RecordedAt ON Statistics(RecordedAt DESC);
GO

CREATE TABLE UsageMetrics (
    UsageId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    ActiveUsers INT NULL,
    TotalRequests BIGINT NULL,
    DataTransferMB BIGINT NULL,
    StorageUsedGB INT NULL,
    RecordedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_UsageMetrics_ClientId ON UsageMetrics(ClientId);
GO

CREATE TABLE PerformanceMetrics (
    PerformanceId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    AvgResponseTime INT NULL, -- milliseconds
    ErrorRate DECIMAL(5,2) NULL, -- percentage
    Uptime DECIMAL(5,2) NULL, -- percentage
    Throughput INT NULL, -- requests per second
    RecordedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_PerformanceMetrics_ClientId ON PerformanceMetrics(ClientId);
GO

CREATE TABLE FinancialMetrics (
    FinancialId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    Revenue DECIMAL(18,2) NULL,
    Cost DECIMAL(18,2) NULL,
    Profit DECIMAL(18,2) NULL,
    Currency NVARCHAR(10) NULL,
    Period NVARCHAR(50) NOT NULL, -- e.g., "2024-Q1", "2024-03"
    RecordedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_FinancialMetrics_ClientId ON FinancialMetrics(ClientId);
GO

-- ===========================
-- PHASE 7: TICKETS
-- ===========================

CREATE TABLE Tickets (
    TicketId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    Title NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Priority NVARCHAR(50) NOT NULL CHECK (Priority IN ('low', 'medium', 'high', 'critical')),
    Status NVARCHAR(50) NOT NULL CHECK (Status IN ('open', 'in_progress', 'resolved', 'closed')),
    Category NVARCHAR(100) NULL,
    AssignedTo INT NULL FOREIGN KEY REFERENCES Users(UserId),
    ReportedBy INT NULL FOREIGN KEY REFERENCES Users(UserId),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ResolvedAt DATETIME2 NULL,
    ClosedAt DATETIME2 NULL
);
GO

CREATE INDEX IX_Tickets_ClientId ON Tickets(ClientId);
CREATE INDEX IX_Tickets_Status ON Tickets(Status);
CREATE INDEX IX_Tickets_Priority ON Tickets(Priority);
GO

CREATE TABLE TicketComments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    TicketId INT NOT NULL FOREIGN KEY REFERENCES Tickets(TicketId) ON DELETE CASCADE,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(UserId),
    Comment NVARCHAR(MAX) NOT NULL,
    IsInternal BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_TicketComments_TicketId ON TicketComments(TicketId);
GO

CREATE TABLE TicketAttachments (
    AttachmentId INT IDENTITY(1,1) PRIMARY KEY,
    TicketId INT NOT NULL FOREIGN KEY REFERENCES Tickets(TicketId) ON DELETE CASCADE,
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    FileSize BIGINT NOT NULL,
    UploadedBy INT NOT NULL FOREIGN KEY REFERENCES Users(UserId),
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_TicketAttachments_TicketId ON TicketAttachments(TicketId);
GO

-- ===========================
-- PHASE 8: UPDATES
-- ===========================

CREATE TABLE Updates (
    UpdateId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    Title NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Version NVARCHAR(100) NOT NULL,
    UpdateType NVARCHAR(50) NOT NULL CHECK (UpdateType IN ('feature', 'bugfix', 'security', 'maintenance')),
    Status NVARCHAR(50) NOT NULL CHECK (Status IN ('scheduled', 'in_progress', 'completed', 'failed', 'cancelled')),
    ScheduledDate DATETIME2 NULL,
    StartedAt DATETIME2 NULL,
    CompletedAt DATETIME2 NULL,
    PerformedBy INT NULL FOREIGN KEY REFERENCES Users(UserId),
    Downtime INT NULL, -- minutes
    RollbackPlan NVARCHAR(MAX) NULL,
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_Updates_ClientId ON Updates(ClientId);
CREATE INDEX IX_Updates_Status ON Updates(Status);
CREATE INDEX IX_Updates_ScheduledDate ON Updates(ScheduledDate);
GO

CREATE TABLE DeploymentSteps (
    StepId INT IDENTITY(1,1) PRIMARY KEY,
    UpdateId INT NOT NULL FOREIGN KEY REFERENCES Updates(UpdateId) ON DELETE CASCADE,
    StepNumber INT NOT NULL,
    Title NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(50) NOT NULL CHECK (Status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
    StartedAt DATETIME2 NULL,
    CompletedAt DATETIME2 NULL,
    Notes NVARCHAR(MAX) NULL
);
GO

CREATE INDEX IX_DeploymentSteps_UpdateId ON DeploymentSteps(UpdateId);
GO

PRINT 'Phases 4-8: Tables Created Successfully';
GO

-- ===========================
-- STORED PROCEDURES - All Phases
-- ===========================
-- (Due to length, showing key procedures - full list would be very long)

-- SERVERS
CREATE PROCEDURE sp_GetServersByClient @ClientId INT
AS SELECT * FROM Servers WHERE ClientId = @ClientId ORDER BY ServerName;
GO

CREATE PROCEDURE sp_CreateServer
    @ClientId INT, @ServerName NVARCHAR(200), @ServerType NVARCHAR(50), @IPAddress NVARCHAR(50),
    @Hostname NVARCHAR(255) = NULL, @OperatingSystem NVARCHAR(100) = NULL, @CPUCores INT = NULL,
    @RAMGB INT = NULL, @DiskGB INT = NULL, @Location NVARCHAR(200) = NULL, @Provider NVARCHAR(100) = NULL,
    @IsActive BIT = 1, @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    INSERT INTO Servers (ClientId, ServerName, ServerType, IPAddress, Hostname, OperatingSystem,
                        CPUCores, RAMGB, DiskGB, Location, Provider, IsActive, Notes)
    VALUES (@ClientId, @ServerName, @ServerType, @IPAddress, @Hostname, @OperatingSystem,
            @CPUCores, @RAMGB, @DiskGB, @Location, @Provider, @IsActive, @Notes);
    SELECT SCOPE_IDENTITY() AS ServerId;
END
GO

CREATE PROCEDURE sp_GetServerMetrics @ServerId INT, @Limit INT = 100
AS SELECT TOP (@Limit) * FROM ServerMetrics WHERE ServerId = @ServerId ORDER BY RecordedAt DESC;
GO

-- CONTACTS
CREATE PROCEDURE sp_GetContactsByClient @ClientId INT
AS SELECT * FROM Contacts WHERE ClientId = @ClientId ORDER BY IsPrimary DESC, LastName, FirstName;
GO

CREATE PROCEDURE sp_CreateContact
    @ClientId INT, @FirstName NVARCHAR(100), @LastName NVARCHAR(100), @Email NVARCHAR(255),
    @Phone NVARCHAR(50) = NULL, @Mobile NVARCHAR(50) = NULL, @Position NVARCHAR(100) = NULL,
    @Department NVARCHAR(100) = NULL, @IsPrimary BIT = 0, @IsActive BIT = 1, @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    INSERT INTO Contacts (ClientId, FirstName, LastName, Email, Phone, Mobile, Position,
                         Department, IsPrimary, IsActive, Notes)
    VALUES (@ClientId, @FirstName, @LastName, @Email, @Phone, @Mobile, @Position,
            @Department, @IsPrimary, @IsActive, @Notes);
    SELECT SCOPE_IDENTITY() AS ContactId;
END
GO

-- LICENSES
CREATE PROCEDURE sp_GetLicensesByClient @ClientId INT
AS SELECT * FROM Licenses WHERE ClientId = @ClientId ORDER BY ExpiryDate;
GO

CREATE PROCEDURE sp_GetExpiringLicenses @Days INT = 30
AS 
BEGIN
    SELECT l.*, c.Name AS ClientName, c.Company
    FROM Licenses l
    INNER JOIN Clients c ON l.ClientId = c.ClientId
    WHERE l.IsActive = 1 
      AND l.ExpiryDate IS NOT NULL
      AND l.ExpiryDate <= DATEADD(DAY, @Days, GETDATE())
    ORDER BY l.ExpiryDate;
END
GO

-- STATISTICS
CREATE PROCEDURE sp_GetStatisticsByClient @ClientId INT
AS SELECT * FROM Statistics WHERE ClientId = @ClientId ORDER BY RecordedAt DESC;
GO

CREATE PROCEDURE sp_GetUsageMetricsByClient @ClientId INT
AS SELECT * FROM UsageMetrics WHERE ClientId = @ClientId ORDER BY RecordedAt DESC;
GO

-- TICKETS
CREATE PROCEDURE sp_GetAllTickets
AS SELECT * FROM Tickets ORDER BY CreatedAt DESC;
GO

CREATE PROCEDURE sp_GetTicketsByClient @ClientId INT
AS SELECT * FROM Tickets WHERE ClientId = @ClientId ORDER BY CreatedAt DESC;
GO

CREATE PROCEDURE sp_GetTicketComments @TicketId INT
AS 
BEGIN
    SELECT tc.*, u.Username
    FROM TicketComments tc
    INNER JOIN Users u ON tc.UserId = u.UserId
    WHERE tc.TicketId = @TicketId
    ORDER BY tc.CreatedAt;
END
GO

CREATE PROCEDURE sp_GetTicketStatistics
AS
BEGIN
    SELECT
        COUNT(*) AS TotalTickets,
        SUM(CASE WHEN Status = 'open' THEN 1 ELSE 0 END) AS OpenTickets,
        SUM(CASE WHEN Status = 'in_progress' THEN 1 ELSE 0 END) AS InProgressTickets,
        SUM(CASE WHEN Status = 'resolved' THEN 1 ELSE 0 END) AS ResolvedTickets,
        SUM(CASE WHEN Status = 'closed' THEN 1 ELSE 0 END) AS ClosedTickets,
        AVG(CASE WHEN ResolvedAt IS NOT NULL 
            THEN DATEDIFF(HOUR, CreatedAt, ResolvedAt) 
            ELSE NULL END) AS AvgResolutionTime
    FROM Tickets;
END
GO

-- UPDATES
CREATE PROCEDURE sp_GetAllUpdates
AS SELECT * FROM Updates ORDER BY ScheduledDate DESC;
GO

CREATE PROCEDURE sp_GetUpdatesByClient @ClientId INT
AS SELECT * FROM Updates WHERE ClientId = @ClientId ORDER BY ScheduledDate DESC;
GO

CREATE PROCEDURE sp_GetUpcomingUpdates @Days INT = 7
AS
BEGIN
    SELECT u.*, c.Name AS ClientName
    FROM Updates u
    INNER JOIN Clients c ON u.ClientId = c.ClientId
    WHERE u.Status IN ('scheduled', 'in_progress')
      AND u.ScheduledDate <= DATEADD(DAY, @Days, GETDATE())
    ORDER BY u.ScheduledDate;
END
GO

CREATE PROCEDURE sp_GetDeploymentSteps @UpdateId INT
AS SELECT * FROM DeploymentSteps WHERE UpdateId = @UpdateId ORDER BY StepNumber;
GO

PRINT 'All Stored Procedures Created Successfully';
GO

-- ===========================
-- SEED DATA FOR ALL PHASES
-- ===========================

-- Servers
INSERT INTO Servers (ClientId, ServerName, ServerType, IPAddress, OperatingSystem, CPUCores, RAMGB, DiskGB, IsActive) VALUES
(1, 'WEB-01', 'web', '10.0.1.10', 'Ubuntu 22.04', 4, 16, 500, 1),
(1, 'DB-01', 'database', '10.0.1.20', 'Ubuntu 22.04', 8, 32, 1000, 1),
(2, 'APP-01', 'application', '10.0.2.10', 'CentOS 8', 4, 16, 500, 1);
GO

-- Contacts
INSERT INTO Contacts (ClientId, FirstName, LastName, Email, Position, IsPrimary, IsActive) VALUES
(1, 'John', 'Doe', 'john.doe@acmecorp.com', 'CTO', 1, 1),
(1, 'Jane', 'Smith', 'jane.smith@acmecorp.com', 'Project Manager', 0, 1),
(2, 'Bob', 'Johnson', 'bob.johnson@techstart.io', 'CEO', 1, 1);
GO

-- Licenses
INSERT INTO Licenses (ClientId, SoftwareName, LicenseKey, LicenseType, Quantity, PurchaseDate, ExpiryDate, Cost, Currency, IsActive) VALUES
(1, 'Microsoft Office 365', 'XXXXX-XXXXX-XXXXX-XXXXX', 'subscription', 50, '2024-01-01', '2025-01-01', 2500.00, 'USD', 1),
(2, 'Adobe Creative Cloud', 'YYYYY-YYYYY-YYYYY-YYYYY', 'subscription', 10, '2024-02-01', '2025-02-01', 600.00, 'USD', 1);
GO

-- Tickets
INSERT INTO Tickets (ClientId, Title, Description, Priority, Status, AssignedTo, ReportedBy) VALUES
(1, 'Database performance issue', 'Queries running slow', 'high', 'open', 1, 1),
(2, 'User login not working', 'Users cannot authenticate', 'critical', 'in_progress', 1, 1);
GO

-- Updates
INSERT INTO Updates (ClientId, Title, Description, Version, UpdateType, Status, ScheduledDate, PerformedBy) VALUES
(1, 'Security Patch Q1 2024', 'Apply latest security patches', '2024.1.0', 'security', 'scheduled', DATEADD(DAY, 7, GETDATE()), 1),
(2, 'Feature Release v2.5', 'Deploy new features', '2.5.0', 'feature', 'scheduled', DATEADD(DAY, 14, GETDATE()), 1);
GO

PRINT 'All Phases 4-8: Completed Successfully!';
GO
