-- ===========================
-- Phase 2: Status & Health Checks Database Script
-- ===========================

USE ClientManagementDB;
GO

-- ===========================
-- 1. Client Status Table
-- ===========================
CREATE TABLE ClientStatus (
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    StatusType NVARCHAR(50) NOT NULL CHECK (StatusType IN ('operational', 'degraded', 'down', 'maintenance')),
    Message NVARCHAR(500) NULL,
    AffectedServices NVARCHAR(500) NULL,
    ReportedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ResolvedAt DATETIME2 NULL,
    CreatedBy INT NOT NULL FOREIGN KEY REFERENCES Users(UserId)
);
GO

CREATE INDEX IX_ClientStatus_ClientId ON ClientStatus(ClientId);
CREATE INDEX IX_ClientStatus_ReportedAt ON ClientStatus(ReportedAt DESC);
GO

-- ===========================
-- 2. Health Checks Table
-- ===========================
CREATE TABLE HealthChecks (
    HealthCheckId INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(ClientId) ON DELETE CASCADE,
    CheckType NVARCHAR(50) NOT NULL CHECK (CheckType IN ('ping', 'http', 'database', 'service')),
    Endpoint NVARCHAR(500) NULL,
    Status NVARCHAR(50) NOT NULL CHECK (Status IN ('success', 'failure', 'timeout')),
    ResponseTime INT NULL, -- in milliseconds
    ErrorMessage NVARCHAR(1000) NULL,
    CheckedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX IX_HealthChecks_ClientId ON HealthChecks(ClientId);
CREATE INDEX IX_HealthChecks_CheckedAt ON HealthChecks(CheckedAt DESC);
GO

-- ===========================
-- Stored Procedures: Client Status
-- ===========================

-- SP: Get Client Statuses
CREATE PROCEDURE sp_GetClientStatuses
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT StatusId, ClientId, StatusType, Message, AffectedServices, 
           ReportedAt, ResolvedAt, CreatedBy
    FROM ClientStatus
    WHERE ClientId = @ClientId
    ORDER BY ReportedAt DESC;
END
GO

-- SP: Get Latest Client Status
CREATE PROCEDURE sp_GetLatestClientStatus
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1 StatusId, ClientId, StatusType, Message, AffectedServices, 
           ReportedAt, ResolvedAt, CreatedBy
    FROM ClientStatus
    WHERE ClientId = @ClientId
    ORDER BY ReportedAt DESC;
END
GO

-- SP: Create Client Status
CREATE PROCEDURE sp_CreateClientStatus
    @ClientId INT,
    @StatusType NVARCHAR(50),
    @Message NVARCHAR(500) = NULL,
    @AffectedServices NVARCHAR(500) = NULL,
    @ReportedAt DATETIME2 = NULL,
    @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @ReportedAt IS NULL
        SET @ReportedAt = GETUTCDATE();
    
    INSERT INTO ClientStatus (ClientId, StatusType, Message, AffectedServices, ReportedAt, CreatedBy)
    VALUES (@ClientId, @StatusType, @Message, @AffectedServices, @ReportedAt, @CreatedBy);
    
    SELECT SCOPE_IDENTITY() AS StatusId;
END
GO

-- SP: Resolve Client Status
CREATE PROCEDURE sp_ResolveClientStatus
    @StatusId INT,
    @ResolvedAt DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @ResolvedAt IS NULL
        SET @ResolvedAt = GETUTCDATE();
    
    UPDATE ClientStatus
    SET ResolvedAt = @ResolvedAt
    WHERE StatusId = @StatusId;
END
GO

-- SP: Get Unresolved Client Statuses
CREATE PROCEDURE sp_GetUnresolvedClientStatuses
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT cs.StatusId, cs.ClientId, c.Name AS ClientName, cs.StatusType, 
           cs.Message, cs.AffectedServices, cs.ReportedAt, cs.CreatedBy
    FROM ClientStatus cs
    INNER JOIN Clients c ON cs.ClientId = c.ClientId
    WHERE cs.ResolvedAt IS NULL
    ORDER BY cs.ReportedAt DESC;
END
GO

-- ===========================
-- Stored Procedures: Health Checks
-- ===========================

-- SP: Get Client Health Checks
CREATE PROCEDURE sp_GetClientHealthChecks
    @ClientId INT,
    @Limit INT = 100
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@Limit) HealthCheckId, ClientId, CheckType, Endpoint, 
           Status, ResponseTime, ErrorMessage, CheckedAt
    FROM HealthChecks
    WHERE ClientId = @ClientId
    ORDER BY CheckedAt DESC;
END
GO

-- SP: Create Health Check
CREATE PROCEDURE sp_CreateHealthCheck
    @ClientId INT,
    @CheckType NVARCHAR(50),
    @Endpoint NVARCHAR(500) = NULL,
    @Status NVARCHAR(50),
    @ResponseTime INT = NULL,
    @ErrorMessage NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO HealthChecks (ClientId, CheckType, Endpoint, Status, ResponseTime, ErrorMessage)
    VALUES (@ClientId, @CheckType, @Endpoint, @Status, @ResponseTime, @ErrorMessage);
    
    SELECT SCOPE_IDENTITY() AS HealthCheckId;
END
GO

-- SP: Get Latest Health Check By Type
CREATE PROCEDURE sp_GetLatestHealthCheckByType
    @ClientId INT,
    @CheckType NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1 HealthCheckId, ClientId, CheckType, Endpoint, 
           Status, ResponseTime, ErrorMessage, CheckedAt
    FROM HealthChecks
    WHERE ClientId = @ClientId AND CheckType = @CheckType
    ORDER BY CheckedAt DESC;
END
GO

-- SP: Get Health Check Statistics
CREATE PROCEDURE sp_GetHealthCheckStatistics
    @ClientId INT,
    @Hours INT = 24
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @StartDate DATETIME2 = DATEADD(HOUR, -@Hours, GETUTCDATE());
    
    SELECT 
        CheckType,
        COUNT(*) AS TotalChecks,
        SUM(CASE WHEN Status = 'success' THEN 1 ELSE 0 END) AS SuccessCount,
        SUM(CASE WHEN Status = 'failure' THEN 1 ELSE 0 END) AS FailureCount,
        SUM(CASE WHEN Status = 'timeout' THEN 1 ELSE 0 END) AS TimeoutCount,
        AVG(CAST(ResponseTime AS FLOAT)) AS AvgResponseTime,
        MAX(ResponseTime) AS MaxResponseTime,
        MIN(ResponseTime) AS MinResponseTime
    FROM HealthChecks
    WHERE ClientId = @ClientId AND CheckedAt >= @StartDate
    GROUP BY CheckType;
END
GO

-- SP: Clean Old Health Checks
CREATE PROCEDURE sp_CleanOldHealthChecks
    @DaysToKeep INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CutoffDate DATETIME2 = DATEADD(DAY, -@DaysToKeep, GETUTCDATE());
    
    DELETE FROM HealthChecks
    WHERE CheckedAt < @CutoffDate;
    
    SELECT @@ROWCOUNT AS DeletedRows;
END
GO

-- ===========================
-- Seed Data
-- ===========================

-- Insert sample client statuses
INSERT INTO ClientStatus (ClientId, StatusType, Message, CreatedBy) VALUES
(1, 'operational', 'All systems running normally', 1),
(2, 'operational', 'Platform is fully operational', 1),
(3, 'degraded', 'Experiencing slow response times', 1),
(4, 'maintenance', 'Scheduled maintenance in progress', 1),
(5, 'down', 'Server is currently offline', 1);
GO

-- Insert sample health checks
DECLARE @Now DATETIME2 = GETUTCDATE();

INSERT INTO HealthChecks (ClientId, CheckType, Endpoint, Status, ResponseTime, CheckedAt) VALUES
(1, 'http', 'https://acmecorp.com/health', 'success', 125, DATEADD(MINUTE, -5, @Now)),
(1, 'database', 'Server=db1;Database=acme', 'success', 45, DATEADD(MINUTE, -5, @Now)),
(2, 'http', 'https://techstart.io/api/health', 'success', 89, DATEADD(MINUTE, -3, @Now)),
(3, 'http', 'https://globalsolutions.com/status', 'success', 256, DATEADD(MINUTE, -2, @Now)),
(4, 'http', 'https://dataflow.net/health', 'timeout', NULL, DATEADD(MINUTE, -1, @Now)),
(5, 'http', 'https://cloudworks.de/status', 'failure', NULL, @Now);
GO

PRINT 'Phase 2: Status & Health Checks - Completed Successfully';
GO
