-- =============================================
-- Phase 8: Updates & Release Management
-- Database Tables and Stored Procedures
-- =============================================

USE ClientManagementDB;
GO

-- =============================================
-- TABLES
-- =============================================

-- Table: Updates
CREATE TABLE Updates (
    UpdateId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    Version NVARCHAR(50) NOT NULL,
    Title NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    ReleaseType NVARCHAR(50) NOT NULL CHECK (ReleaseType IN ('Major', 'Minor', 'Patch', 'Hotfix', 'Security')),
    Status NVARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (Status IN ('scheduled', 'in-progress', 'completed', 'failed', 'rolled-back', 'cancelled')),
    Priority NVARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (Priority IN ('low', 'medium', 'high', 'critical')),
    ScheduledDate DATETIME2 NULL,
    StartedDate DATETIME2 NULL,
    CompletedDate DATETIME2 NULL,
    DeployedBy NVARCHAR(100) NULL,
    ApprovedBy NVARCHAR(100) NULL,
    RollbackPlan NVARCHAR(MAX) NULL,
    DowntimeRequired BIT NOT NULL DEFAULT 0,
    EstimatedDowntimeMinutes INT NULL,
    ActualDowntimeMinutes INT NULL,
    BackupTaken BIT NOT NULL DEFAULT 0,
    BackupLocation NVARCHAR(500) NULL,
    Notes NVARCHAR(MAX) NULL,
    ChangeLog NVARCHAR(MAX) NULL,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Update_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Update_ClientId ON Updates(ClientId);
CREATE INDEX IX_Update_Status ON Updates(Status);
CREATE INDEX IX_Update_ScheduledDate ON Updates(ScheduledDate);
CREATE INDEX IX_Update_Version ON Updates(Version);
GO

-- Table: UpdateSteps
CREATE TABLE UpdateSteps (
    StepId INT PRIMARY KEY IDENTITY(1,1),
    UpdateId INT NOT NULL,
    StepNumber INT NOT NULL,
    StepName NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (Status IN ('pending', 'in-progress', 'completed', 'failed', 'skipped')),
    StartedDate DATETIME2 NULL,
    CompletedDate DATETIME2 NULL,
    ExecutedBy NVARCHAR(100) NULL,
    Result NVARCHAR(MAX) NULL,
    ErrorMessage NVARCHAR(MAX) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_UpdateStep_Update FOREIGN KEY (UpdateId) REFERENCES Updates(UpdateId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_UpdateStep_UpdateId ON UpdateSteps(UpdateId);
CREATE INDEX IX_UpdateStep_StepNumber ON UpdateSteps(StepNumber);
GO

-- Table: UpdateDependencies
CREATE TABLE UpdateDependencies (
    DependencyId INT PRIMARY KEY IDENTITY(1,1),
    UpdateId INT NOT NULL,
    DependsOnUpdateId INT NOT NULL,
    DependencyType NVARCHAR(50) NOT NULL DEFAULT 'required', -- 'required', 'recommended', 'conflicts-with'
    Notes NVARCHAR(MAX) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_UpdateDependency_Update FOREIGN KEY (UpdateId) REFERENCES Updates(UpdateId),
    CONSTRAINT FK_UpdateDependency_DependsOnUpdate FOREIGN KEY (DependsOnUpdateId) REFERENCES Updates(UpdateId)
);
GO

CREATE INDEX IX_UpdateDependency_UpdateId ON UpdateDependencies(UpdateId);
CREATE INDEX IX_UpdateDependency_DependsOnUpdateId ON UpdateDependencies(DependsOnUpdateId);
GO

-- Table: UpdateNotifications
CREATE TABLE UpdateNotifications (
    NotificationId INT PRIMARY KEY IDENTITY(1,1),
    UpdateId INT NOT NULL,
    RecipientEmail NVARCHAR(255) NOT NULL,
    RecipientName NVARCHAR(255) NULL,
    NotificationType NVARCHAR(50) NOT NULL, -- 'scheduled', 'started', 'completed', 'failed', 'reminder'
    SentDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Subject NVARCHAR(500) NULL,
    MessageBody NVARCHAR(MAX) NULL,
    IsSent BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_UpdateNotification_Update FOREIGN KEY (UpdateId) REFERENCES Updates(UpdateId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_UpdateNotification_UpdateId ON UpdateNotifications(UpdateId);
CREATE INDEX IX_UpdateNotification_SentDate ON UpdateNotifications(SentDate DESC);
GO

-- Table: UpdateHistory
CREATE TABLE UpdateHistory (
    HistoryId INT PRIMARY KEY IDENTITY(1,1),
    UpdateId INT NOT NULL,
    Action NVARCHAR(100) NOT NULL,
    FieldChanged NVARCHAR(100) NULL,
    OldValue NVARCHAR(MAX) NULL,
    NewValue NVARCHAR(MAX) NULL,
    ChangedBy NVARCHAR(100) NULL,
    ChangeDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_UpdateHistory_Update FOREIGN KEY (UpdateId) REFERENCES Updates(UpdateId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_UpdateHistory_UpdateId ON UpdateHistory(UpdateId);
CREATE INDEX IX_UpdateHistory_ChangeDate ON UpdateHistory(ChangeDate DESC);
GO

-- =============================================
-- STORED PROCEDURES - Updates
-- =============================================

-- SP: Get Updates
CREATE PROCEDURE sp_GetUpdates
    @ClientId INT = NULL,
    @Status NVARCHAR(20) = NULL,
    @ReleaseType NVARCHAR(50) = NULL,
    @IncludeArchived BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        UpdateId,
        ClientId,
        Version,
        Title,
        Description,
        ReleaseType,
        Status,
        Priority,
        ScheduledDate,
        StartedDate,
        CompletedDate,
        DeployedBy,
        ApprovedBy,
        RollbackPlan,
        DowntimeRequired,
        EstimatedDowntimeMinutes,
        ActualDowntimeMinutes,
        BackupTaken,
        BackupLocation,
        Notes,
        ChangeLog,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Updates
    WHERE (@ClientId IS NULL OR ClientId = @ClientId)
        AND (@Status IS NULL OR Status = @Status)
        AND (@ReleaseType IS NULL OR ReleaseType = @ReleaseType)
        AND (@IncludeArchived = 1 OR IsArchived = 0)
    ORDER BY ScheduledDate DESC, CreatedDate DESC;
END
GO

-- SP: Get Update by ID
CREATE PROCEDURE sp_GetUpdateById
    @UpdateId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        UpdateId,
        ClientId,
        Version,
        Title,
        Description,
        ReleaseType,
        Status,
        Priority,
        ScheduledDate,
        StartedDate,
        CompletedDate,
        DeployedBy,
        ApprovedBy,
        RollbackPlan,
        DowntimeRequired,
        EstimatedDowntimeMinutes,
        ActualDowntimeMinutes,
        BackupTaken,
        BackupLocation,
        Notes,
        ChangeLog,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Updates
    WHERE UpdateId = @UpdateId;
END
GO

-- SP: Create Update
CREATE PROCEDURE sp_CreateUpdate
    @ClientId INT,
    @Version NVARCHAR(50),
    @Title NVARCHAR(500),
    @Description NVARCHAR(MAX),
    @ReleaseType NVARCHAR(50),
    @Priority NVARCHAR(20) = 'medium',
    @ScheduledDate DATETIME2 = NULL,
    @DeployedBy NVARCHAR(100) = NULL,
    @ApprovedBy NVARCHAR(100) = NULL,
    @RollbackPlan NVARCHAR(MAX) = NULL,
    @DowntimeRequired BIT = 0,
    @EstimatedDowntimeMinutes INT = NULL,
    @BackupTaken BIT = 0,
    @BackupLocation NVARCHAR(500) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @ChangeLog NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Updates (ClientId, Version, Title, Description, ReleaseType, Priority, ScheduledDate, DeployedBy, ApprovedBy, RollbackPlan, DowntimeRequired, EstimatedDowntimeMinutes, BackupTaken, BackupLocation, Notes, ChangeLog)
    VALUES (@ClientId, @Version, @Title, @Description, @ReleaseType, @Priority, @ScheduledDate, @DeployedBy, @ApprovedBy, @RollbackPlan, @DowntimeRequired, @EstimatedDowntimeMinutes, @BackupTaken, @BackupLocation, @Notes, @ChangeLog);
    
    DECLARE @NewUpdateId INT = SCOPE_IDENTITY();
    
    -- Record history
    INSERT INTO UpdateHistory (UpdateId, Action, ChangedBy)
    VALUES (@NewUpdateId, 'Update Created', @DeployedBy);
    
    -- Return the created update
    EXEC sp_GetUpdateById @NewUpdateId;
END
GO

-- SP: Update Update
CREATE PROCEDURE sp_UpdateUpdate
    @UpdateId INT,
    @Version NVARCHAR(50),
    @Title NVARCHAR(500),
    @Description NVARCHAR(MAX),
    @ReleaseType NVARCHAR(50),
    @Status NVARCHAR(20),
    @Priority NVARCHAR(20),
    @ScheduledDate DATETIME2 = NULL,
    @ApprovedBy NVARCHAR(100) = NULL,
    @RollbackPlan NVARCHAR(MAX) = NULL,
    @DowntimeRequired BIT,
    @EstimatedDowntimeMinutes INT = NULL,
    @ActualDowntimeMinutes INT = NULL,
    @BackupTaken BIT,
    @BackupLocation NVARCHAR(500) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @ChangeLog NVARCHAR(MAX) = NULL,
    @ChangedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @OldStatus NVARCHAR(20);
    
    -- Get old status for history
    SELECT @OldStatus = Status FROM Updates WHERE UpdateId = @UpdateId;
    
    -- Update started/completed dates based on status changes
    DECLARE @StartedDate DATETIME2 = NULL;
    DECLARE @CompletedDate DATETIME2 = NULL;
    
    IF @Status = 'in-progress' AND @OldStatus != 'in-progress'
        SET @StartedDate = GETUTCDATE();
    
    IF @Status IN ('completed', 'failed', 'rolled-back') AND @OldStatus NOT IN ('completed', 'failed', 'rolled-back')
        SET @CompletedDate = GETUTCDATE();
    
    UPDATE Updates
    SET 
        Version = @Version,
        Title = @Title,
        Description = @Description,
        ReleaseType = @ReleaseType,
        Status = @Status,
        Priority = @Priority,
        ScheduledDate = @ScheduledDate,
        StartedDate = COALESCE(@StartedDate, StartedDate),
        CompletedDate = COALESCE(@CompletedDate, CompletedDate),
        ApprovedBy = @ApprovedBy,
        RollbackPlan = @RollbackPlan,
        DowntimeRequired = @DowntimeRequired,
        EstimatedDowntimeMinutes = @EstimatedDowntimeMinutes,
        ActualDowntimeMinutes = @ActualDowntimeMinutes,
        BackupTaken = @BackupTaken,
        BackupLocation = @BackupLocation,
        Notes = @Notes,
        ChangeLog = @ChangeLog,
        ModifiedDate = GETUTCDATE()
    WHERE UpdateId = @UpdateId;
    
    -- Record history for status change
    IF @OldStatus != @Status
    BEGIN
        INSERT INTO UpdateHistory (UpdateId, Action, FieldChanged, OldValue, NewValue, ChangedBy)
        VALUES (@UpdateId, 'Status Changed', 'Status', @OldStatus, @Status, @ChangedBy);
    END
    
    -- Return the updated update
    EXEC sp_GetUpdateById @UpdateId;
END
GO

-- SP: Archive/Unarchive Update
CREATE PROCEDURE sp_ArchiveUpdate
    @UpdateId INT,
    @IsArchived BIT,
    @ChangedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Updates
    SET 
        IsArchived = @IsArchived,
        ModifiedDate = GETUTCDATE()
    WHERE UpdateId = @UpdateId;
    
    -- Record history
    DECLARE @Action NVARCHAR(100) = CASE WHEN @IsArchived = 1 THEN 'Update Archived' ELSE 'Update Unarchived' END;
    INSERT INTO UpdateHistory (UpdateId, Action, ChangedBy)
    VALUES (@UpdateId, @Action, @ChangedBy);
    
    SELECT 1 AS Success;
END
GO

-- SP: Delete Update
CREATE PROCEDURE sp_DeleteUpdate
    @UpdateId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Cascade deletes will handle steps, dependencies, notifications, history
    DELETE FROM Updates WHERE UpdateId = @UpdateId;
    
    SELECT 1 AS Success;
END
GO

-- SP: Get Upcoming Updates
CREATE PROCEDURE sp_GetUpcomingUpdates
    @Days INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.UpdateId,
        u.ClientId,
        c.Name AS ClientName,
        u.Version,
        u.Title,
        u.ReleaseType,
        u.Status,
        u.Priority,
        u.ScheduledDate,
        u.DowntimeRequired,
        u.EstimatedDowntimeMinutes,
        DATEDIFF(DAY, GETUTCDATE(), u.ScheduledDate) AS DaysUntilUpdate
    FROM Updates u
    INNER JOIN Clients c ON u.ClientId = c.ClientId
    WHERE u.Status IN ('scheduled', 'in-progress')
        AND u.IsArchived = 0
        AND u.ScheduledDate IS NOT NULL
        AND u.ScheduledDate >= GETUTCDATE()
        AND u.ScheduledDate <= DATEADD(DAY, @Days, GETUTCDATE())
    ORDER BY u.ScheduledDate ASC;
END
GO

-- =============================================
-- STORED PROCEDURES - Update Steps
-- =============================================

-- SP: Get Update Steps
CREATE PROCEDURE sp_GetUpdateSteps
    @UpdateId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        StepId,
        UpdateId,
        StepNumber,
        StepName,
        Description,
        Status,
        StartedDate,
        CompletedDate,
        ExecutedBy,
        Result,
        ErrorMessage,
        CreatedDate
    FROM UpdateSteps
    WHERE UpdateId = @UpdateId
    ORDER BY StepNumber ASC;
END
GO

-- SP: Create Update Step
CREATE PROCEDURE sp_CreateUpdateStep
    @UpdateId INT,
    @StepNumber INT,
    @StepName NVARCHAR(255),
    @Description NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO UpdateSteps (UpdateId, StepNumber, StepName, Description)
    VALUES (@UpdateId, @StepNumber, @StepName, @Description);
    
    SELECT 
        StepId,
        UpdateId,
        StepNumber,
        StepName,
        Description,
        Status,
        StartedDate,
        CompletedDate,
        ExecutedBy,
        Result,
        ErrorMessage,
        CreatedDate
    FROM UpdateSteps
    WHERE StepId = SCOPE_IDENTITY();
END
GO

-- SP: Update Update Step
CREATE PROCEDURE sp_UpdateUpdateStep
    @StepId INT,
    @StepName NVARCHAR(255),
    @Description NVARCHAR(MAX) = NULL,
    @Status NVARCHAR(20),
    @ExecutedBy NVARCHAR(100) = NULL,
    @Result NVARCHAR(MAX) = NULL,
    @ErrorMessage NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @OldStatus NVARCHAR(20);
    SELECT @OldStatus = Status FROM UpdateSteps WHERE StepId = @StepId;
    
    -- Update started/completed dates based on status changes
    DECLARE @StartedDate DATETIME2 = NULL;
    DECLARE @CompletedDate DATETIME2 = NULL;
    
    IF @Status = 'in-progress' AND @OldStatus != 'in-progress'
        SET @StartedDate = GETUTCDATE();
    
    IF @Status IN ('completed', 'failed', 'skipped') AND @OldStatus NOT IN ('completed', 'failed', 'skipped')
        SET @CompletedDate = GETUTCDATE();
    
    UPDATE UpdateSteps
    SET 
        StepName = @StepName,
        Description = @Description,
        Status = @Status,
        StartedDate = COALESCE(@StartedDate, StartedDate),
        CompletedDate = COALESCE(@CompletedDate, CompletedDate),
        ExecutedBy = @ExecutedBy,
        Result = @Result,
        ErrorMessage = @ErrorMessage
    WHERE StepId = @StepId;
    
    SELECT 
        StepId,
        UpdateId,
        StepNumber,
        StepName,
        Description,
        Status,
        StartedDate,
        CompletedDate,
        ExecutedBy,
        Result,
        ErrorMessage,
        CreatedDate
    FROM UpdateSteps
    WHERE StepId = @StepId;
END
GO

-- SP: Delete Update Step
CREATE PROCEDURE sp_DeleteUpdateStep
    @StepId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM UpdateSteps WHERE StepId = @StepId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- STORED PROCEDURES - Update History
-- =============================================

-- SP: Get Update History
CREATE PROCEDURE sp_GetUpdateHistory
    @UpdateId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        HistoryId,
        UpdateId,
        Action,
        FieldChanged,
        OldValue,
        NewValue,
        ChangedBy,
        ChangeDate
    FROM UpdateHistory
    WHERE UpdateId = @UpdateId
    ORDER BY ChangeDate DESC;
END
GO

-- =============================================
-- SEED DATA
-- =============================================

-- Insert sample updates
DECLARE @Update1 INT, @Update2 INT, @Update3 INT, @Update4 INT;

INSERT INTO Updates (ClientId, Version, Title, Description, ReleaseType, Status, Priority, ScheduledDate, DeployedBy, ApprovedBy, DowntimeRequired, EstimatedDowntimeMinutes, BackupTaken, BackupLocation, ChangeLog, CreatedDate)
VALUES
(1, 'v2.5.0', 'Q1 2025 Feature Release', 'Major feature update including new dashboard, enhanced reporting, and performance improvements.', 'Minor', 'scheduled', 'high', DATEADD(DAY, 7, GETUTCDATE()), 'deploy@support.com', 'manager@acme.com', 1, 30, 1, '/backups/acme/v2.5.0', '- New analytics dashboard\n- Custom report builder\n- Performance optimization\n- Bug fixes', DATEADD(DAY, -14, GETUTCDATE())),
(1, 'v2.4.3', 'Security Patch December 2024', 'Critical security update to address CVE-2024-XXXX vulnerability.', 'Security', 'completed', 'critical', DATEADD(DAY, -5, GETUTCDATE()), 'deploy@support.com', 'security@acme.com', 1, 15, 1, '/backups/acme/v2.4.3', '- Security patch for authentication\n- Updated dependencies', DATEADD(DAY, -10, GETUTCDATE())),
(3, 'v3.1.0', 'API Enhancement Release', 'Enhanced API with new endpoints and improved documentation.', 'Minor', 'in-progress', 'medium', DATEADD(DAY, -1, GETUTCDATE()), 'api.team@support.com', 'emily.davis@globalsol.com', 0, 0, 1, '/backups/globalsol/v3.1.0', '- New REST endpoints\n- GraphQL support\n- Updated API docs', DATEADD(DAY, -20, GETUTCDATE())),
(4, 'v1.8.2', 'Hotfix - Database Connection Pool', 'Urgent hotfix to resolve database connection pool exhaustion issue.', 'Hotfix', 'completed', 'critical', DATEADD(DAY, -3, GETUTCDATE()), 'john.tech@support.com', 'lisa.anderson@innolabs.com', 1, 10, 1, '/backups/innolabs/v1.8.2', '- Fixed connection pool leak\n- Increased pool size\n- Added monitoring', DATEADD(DAY, -4, GETUTCDATE())),
(6, 'v4.0.0', 'Major Platform Upgrade', 'Complete platform upgrade with new architecture and cloud-native features.', 'Major', 'scheduled', 'high', DATEADD(DAY, 30, GETUTCDATE()), 'platform.team@support.com', 'david.martinez@cloudserv.com', 1, 120, 0, NULL, '- Microservices architecture\n- Kubernetes deployment\n- Redis caching\n- Elasticsearch integration', DATEADD(DAY, -30, GETUTCDATE()));

SET @Update1 = 1;
SET @Update2 = 2;
SET @Update3 = 3;
SET @Update4 = 4;

-- Update completed updates with dates
UPDATE Updates SET StartedDate = DATEADD(HOUR, -2, DATEADD(DAY, -5, GETUTCDATE())), CompletedDate = DATEADD(DAY, -5, GETUTCDATE()), ActualDowntimeMinutes = 12 WHERE UpdateId = @Update2;
UPDATE Updates SET StartedDate = DATEADD(HOUR, -1, DATEADD(DAY, -3, GETUTCDATE())), CompletedDate = DATEADD(DAY, -3, GETUTCDATE()), ActualDowntimeMinutes = 8 WHERE UpdateId = @Update4;
UPDATE Updates SET StartedDate = DATEADD(DAY, -1, GETUTCDATE()) WHERE UpdateId = @Update3;

-- Insert sample update steps
INSERT INTO UpdateSteps (UpdateId, StepNumber, StepName, Description, Status, CompletedDate, ExecutedBy, Result)
VALUES
(1, 1, 'Backup Database', 'Create full database backup before deployment', 'pending', NULL, NULL, NULL),
(1, 2, 'Stop Application Services', 'Gracefully shutdown application services', 'pending', NULL, NULL, NULL),
(1, 3, 'Deploy Database Migrations', 'Run database schema updates', 'pending', NULL, NULL, NULL),
(1, 4, 'Deploy Application Code', 'Deploy new application version', 'pending', NULL, NULL, NULL),
(1, 5, 'Start Application Services', 'Start application services with new version', 'pending', NULL, NULL, NULL),
(1, 6, 'Verify Deployment', 'Run smoke tests and verify functionality', 'pending', NULL, NULL, NULL),
(2, 1, 'Backup Database', 'Create full database backup', 'completed', DATEADD(HOUR, -2, DATEADD(DAY, -5, GETUTCDATE())), 'deploy@support.com', 'Backup completed successfully'),
(2, 2, 'Apply Security Patch', 'Deploy security updates', 'completed', DATEADD(HOUR, -1, DATEADD(DAY, -5, GETUTCDATE())), 'deploy@support.com', 'Patch applied successfully'),
(2, 3, 'Restart Services', 'Restart application services', 'completed', DATEADD(DAY, -5, GETUTCDATE()), 'deploy@support.com', 'Services restarted'),
(2, 4, 'Verify Security Fix', 'Confirm vulnerability is resolved', 'completed', DATEADD(DAY, -5, GETUTCDATE()), 'security@acme.com', 'Vulnerability confirmed fixed'),
(3, 1, 'Deploy API Changes', 'Deploy new API endpoints', 'completed', DATEADD(HOUR, -12, GETUTCDATE()), 'api.team@support.com', 'API deployed'),
(3, 2, 'Update Documentation', 'Update API documentation', 'in-progress', NULL, 'api.team@support.com', NULL),
(3, 3, 'Notify Integration Partners', 'Send notifications about API changes', 'pending', NULL, NULL, NULL);

-- Insert sample update history
INSERT INTO UpdateHistory (UpdateId, Action, FieldChanged, OldValue, NewValue, ChangedBy, ChangeDate)
VALUES
(1, 'Update Created', NULL, NULL, NULL, 'deploy@support.com', DATEADD(DAY, -14, GETUTCDATE())),
(1, 'Scheduled Date Set', 'ScheduledDate', NULL, CONVERT(NVARCHAR, DATEADD(DAY, 7, GETUTCDATE()), 120), 'manager@acme.com', DATEADD(DAY, -10, GETUTCDATE())),
(2, 'Update Created', NULL, NULL, NULL, 'deploy@support.com', DATEADD(DAY, -10, GETUTCDATE())),
(2, 'Priority Changed', 'Priority', 'high', 'critical', 'security@acme.com', DATEADD(DAY, -8, GETUTCDATE())),
(2, 'Status Changed', 'Status', 'scheduled', 'in-progress', 'deploy@support.com', DATEADD(HOUR, -2, DATEADD(DAY, -5, GETUTCDATE()))),
(2, 'Status Changed', 'Status', 'in-progress', 'completed', 'deploy@support.com', DATEADD(DAY, -5, GETUTCDATE())),
(3, 'Update Created', NULL, NULL, NULL, 'api.team@support.com', DATEADD(DAY, -20, GETUTCDATE())),
(3, 'Status Changed', 'Status', 'scheduled', 'in-progress', 'api.team@support.com', DATEADD(DAY, -1, GETUTCDATE())),
(4, 'Update Created', NULL, NULL, NULL, 'john.tech@support.com', DATEADD(DAY, -4, GETUTCDATE())),
(4, 'Status Changed', 'Status', 'scheduled', 'in-progress', 'john.tech@support.com', DATEADD(HOUR, -1, DATEADD(DAY, -3, GETUTCDATE()))),
(4, 'Status Changed', 'Status', 'in-progress', 'completed', 'john.tech@support.com', DATEADD(DAY, -3, GETUTCDATE()));

GO

PRINT 'Phase 8 database setup completed successfully!';
