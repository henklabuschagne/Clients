-- =============================================
-- Phase 7: Tickets & Support Management
-- Database Tables and Stored Procedures
-- =============================================

USE ClientManagementDB;
GO

-- =============================================
-- TABLES
-- =============================================

-- Table: Tickets
CREATE TABLE Tickets (
    TicketId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    TicketNumber NVARCHAR(50) NOT NULL UNIQUE,
    Subject NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(100) NULL, -- 'Technical', 'Billing', 'Feature Request', 'Bug', 'Question', 'Other'
    Priority NVARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (Priority IN ('low', 'medium', 'high', 'urgent')),
    Status NVARCHAR(20) NOT NULL DEFAULT 'open' CHECK (Status IN ('open', 'in-progress', 'waiting-customer', 'waiting-internal', 'resolved', 'closed', 'cancelled')),
    AssignedTo NVARCHAR(100) NULL,
    ReportedBy NVARCHAR(100) NULL,
    ContactEmail NVARCHAR(255) NULL,
    ContactPhone NVARCHAR(50) NULL,
    EstimatedHours DECIMAL(5,2) NULL,
    ActualHours DECIMAL(5,2) NULL,
    DueDate DATETIME2 NULL,
    ResolvedDate DATETIME2 NULL,
    ClosedDate DATETIME2 NULL,
    Resolution NVARCHAR(MAX) NULL,
    Tags NVARCHAR(500) NULL,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Ticket_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Ticket_ClientId ON Tickets(ClientId);
CREATE INDEX IX_Ticket_Status ON Tickets(Status);
CREATE INDEX IX_Ticket_Priority ON Tickets(Priority);
CREATE INDEX IX_Ticket_AssignedTo ON Tickets(AssignedTo);
CREATE INDEX IX_Ticket_Category ON Tickets(Category);
CREATE INDEX IX_Ticket_CreatedDate ON Tickets(CreatedDate DESC);
GO

-- Table: TicketComments
CREATE TABLE TicketComments (
    CommentId INT PRIMARY KEY IDENTITY(1,1),
    TicketId INT NOT NULL,
    Comment NVARCHAR(MAX) NOT NULL,
    CommentType NVARCHAR(20) NOT NULL DEFAULT 'public' CHECK (CommentType IN ('public', 'internal', 'system')),
    CreatedBy NVARCHAR(100) NULL,
    IsCustomerVisible BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_TicketComment_Ticket FOREIGN KEY (TicketId) REFERENCES Tickets(TicketId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_TicketComment_TicketId ON TicketComments(TicketId);
CREATE INDEX IX_TicketComment_CreatedDate ON TicketComments(CreatedDate DESC);
GO

-- Table: TicketAttachments
CREATE TABLE TicketAttachments (
    AttachmentId INT PRIMARY KEY IDENTITY(1,1),
    TicketId INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(1000) NOT NULL,
    FileSize BIGINT NULL,
    ContentType NVARCHAR(100) NULL,
    UploadedBy NVARCHAR(100) NULL,
    UploadedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_TicketAttachment_Ticket FOREIGN KEY (TicketId) REFERENCES Tickets(TicketId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_TicketAttachment_TicketId ON TicketAttachments(TicketId);
GO

-- Table: TicketHistory
CREATE TABLE TicketHistory (
    HistoryId INT PRIMARY KEY IDENTITY(1,1),
    TicketId INT NOT NULL,
    Action NVARCHAR(100) NOT NULL,
    FieldChanged NVARCHAR(100) NULL,
    OldValue NVARCHAR(MAX) NULL,
    NewValue NVARCHAR(MAX) NULL,
    ChangedBy NVARCHAR(100) NULL,
    ChangeDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_TicketHistory_Ticket FOREIGN KEY (TicketId) REFERENCES Tickets(TicketId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_TicketHistory_TicketId ON TicketHistory(TicketId);
CREATE INDEX IX_TicketHistory_ChangeDate ON TicketHistory(ChangeDate DESC);
GO

-- Table: TicketRelationships
CREATE TABLE TicketRelationships (
    RelationshipId INT PRIMARY KEY IDENTITY(1,1),
    TicketId INT NOT NULL,
    RelatedTicketId INT NOT NULL,
    RelationType NVARCHAR(50) NOT NULL, -- 'blocks', 'blocked-by', 'duplicates', 'relates-to', 'parent-of', 'child-of'
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_TicketRelationship_Ticket FOREIGN KEY (TicketId) REFERENCES Tickets(TicketId),
    CONSTRAINT FK_TicketRelationship_RelatedTicket FOREIGN KEY (RelatedTicketId) REFERENCES Tickets(TicketId)
);
GO

CREATE INDEX IX_TicketRelationship_TicketId ON TicketRelationships(TicketId);
CREATE INDEX IX_TicketRelationship_RelatedTicketId ON TicketRelationships(RelatedTicketId);
GO

-- =============================================
-- STORED PROCEDURES - Tickets
-- =============================================

-- SP: Get Tickets
CREATE PROCEDURE sp_GetTickets
    @ClientId INT = NULL,
    @Status NVARCHAR(20) = NULL,
    @Priority NVARCHAR(20) = NULL,
    @AssignedTo NVARCHAR(100) = NULL,
    @Category NVARCHAR(100) = NULL,
    @IncludeArchived BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        TicketId,
        ClientId,
        TicketNumber,
        Subject,
        Description,
        Category,
        Priority,
        Status,
        AssignedTo,
        ReportedBy,
        ContactEmail,
        ContactPhone,
        EstimatedHours,
        ActualHours,
        DueDate,
        ResolvedDate,
        ClosedDate,
        Resolution,
        Tags,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Tickets
    WHERE (@ClientId IS NULL OR ClientId = @ClientId)
        AND (@Status IS NULL OR Status = @Status)
        AND (@Priority IS NULL OR Priority = @Priority)
        AND (@AssignedTo IS NULL OR AssignedTo = @AssignedTo)
        AND (@Category IS NULL OR Category = @Category)
        AND (@IncludeArchived = 1 OR IsArchived = 0)
    ORDER BY 
        CASE Priority 
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'low' THEN 4
        END,
        CreatedDate DESC;
END
GO

-- SP: Get Ticket by ID
CREATE PROCEDURE sp_GetTicketById
    @TicketId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        TicketId,
        ClientId,
        TicketNumber,
        Subject,
        Description,
        Category,
        Priority,
        Status,
        AssignedTo,
        ReportedBy,
        ContactEmail,
        ContactPhone,
        EstimatedHours,
        ActualHours,
        DueDate,
        ResolvedDate,
        ClosedDate,
        Resolution,
        Tags,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Tickets
    WHERE TicketId = @TicketId;
END
GO

-- SP: Get Ticket by Number
CREATE PROCEDURE sp_GetTicketByNumber
    @TicketNumber NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        TicketId,
        ClientId,
        TicketNumber,
        Subject,
        Description,
        Category,
        Priority,
        Status,
        AssignedTo,
        ReportedBy,
        ContactEmail,
        ContactPhone,
        EstimatedHours,
        ActualHours,
        DueDate,
        ResolvedDate,
        ClosedDate,
        Resolution,
        Tags,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Tickets
    WHERE TicketNumber = @TicketNumber;
END
GO

-- SP: Create Ticket
CREATE PROCEDURE sp_CreateTicket
    @ClientId INT,
    @TicketNumber NVARCHAR(50),
    @Subject NVARCHAR(500),
    @Description NVARCHAR(MAX),
    @Category NVARCHAR(100) = NULL,
    @Priority NVARCHAR(20) = 'medium',
    @AssignedTo NVARCHAR(100) = NULL,
    @ReportedBy NVARCHAR(100) = NULL,
    @ContactEmail NVARCHAR(255) = NULL,
    @ContactPhone NVARCHAR(50) = NULL,
    @EstimatedHours DECIMAL(5,2) = NULL,
    @DueDate DATETIME2 = NULL,
    @Tags NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Tickets (ClientId, TicketNumber, Subject, Description, Category, Priority, AssignedTo, ReportedBy, ContactEmail, ContactPhone, EstimatedHours, DueDate, Tags)
    VALUES (@ClientId, @TicketNumber, @Subject, @Description, @Category, @Priority, @AssignedTo, @ReportedBy, @ContactEmail, @ContactPhone, @EstimatedHours, @DueDate, @Tags);
    
    DECLARE @NewTicketId INT = SCOPE_IDENTITY();
    
    -- Record history
    INSERT INTO TicketHistory (TicketId, Action, ChangedBy)
    VALUES (@NewTicketId, 'Ticket Created', @ReportedBy);
    
    -- Return the created ticket
    EXEC sp_GetTicketById @NewTicketId;
END
GO

-- SP: Update Ticket
CREATE PROCEDURE sp_UpdateTicket
    @TicketId INT,
    @Subject NVARCHAR(500),
    @Description NVARCHAR(MAX),
    @Category NVARCHAR(100) = NULL,
    @Priority NVARCHAR(20),
    @Status NVARCHAR(20),
    @AssignedTo NVARCHAR(100) = NULL,
    @ContactEmail NVARCHAR(255) = NULL,
    @ContactPhone NVARCHAR(50) = NULL,
    @EstimatedHours DECIMAL(5,2) = NULL,
    @ActualHours DECIMAL(5,2) = NULL,
    @DueDate DATETIME2 = NULL,
    @Resolution NVARCHAR(MAX) = NULL,
    @Tags NVARCHAR(500) = NULL,
    @ChangedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @OldStatus NVARCHAR(20), @OldPriority NVARCHAR(20), @OldAssignedTo NVARCHAR(100);
    
    -- Get old values for history
    SELECT @OldStatus = Status, @OldPriority = Priority, @OldAssignedTo = AssignedTo
    FROM Tickets
    WHERE TicketId = @TicketId;
    
    -- Update resolved/closed dates based on status
    DECLARE @ResolvedDate DATETIME2 = NULL;
    DECLARE @ClosedDate DATETIME2 = NULL;
    
    IF @Status = 'resolved' AND @OldStatus != 'resolved'
        SET @ResolvedDate = GETUTCDATE();
    
    IF @Status = 'closed' AND @OldStatus != 'closed'
        SET @ClosedDate = GETUTCDATE();
    
    UPDATE Tickets
    SET 
        Subject = @Subject,
        Description = @Description,
        Category = @Category,
        Priority = @Priority,
        Status = @Status,
        AssignedTo = @AssignedTo,
        ContactEmail = @ContactEmail,
        ContactPhone = @ContactPhone,
        EstimatedHours = @EstimatedHours,
        ActualHours = @ActualHours,
        DueDate = @DueDate,
        ResolvedDate = COALESCE(@ResolvedDate, ResolvedDate),
        ClosedDate = COALESCE(@ClosedDate, ClosedDate),
        Resolution = @Resolution,
        Tags = @Tags,
        ModifiedDate = GETUTCDATE()
    WHERE TicketId = @TicketId;
    
    -- Record history for changes
    IF @OldStatus != @Status
    BEGIN
        INSERT INTO TicketHistory (TicketId, Action, FieldChanged, OldValue, NewValue, ChangedBy)
        VALUES (@TicketId, 'Status Changed', 'Status', @OldStatus, @Status, @ChangedBy);
    END
    
    IF @OldPriority != @Priority
    BEGIN
        INSERT INTO TicketHistory (TicketId, Action, FieldChanged, OldValue, NewValue, ChangedBy)
        VALUES (@TicketId, 'Priority Changed', 'Priority', @OldPriority, @Priority, @ChangedBy);
    END
    
    IF @OldAssignedTo != @AssignedTo OR (@OldAssignedTo IS NULL AND @AssignedTo IS NOT NULL) OR (@OldAssignedTo IS NOT NULL AND @AssignedTo IS NULL)
    BEGIN
        INSERT INTO TicketHistory (TicketId, Action, FieldChanged, OldValue, NewValue, ChangedBy)
        VALUES (@TicketId, 'Assignment Changed', 'AssignedTo', @OldAssignedTo, @AssignedTo, @ChangedBy);
    END
    
    -- Return the updated ticket
    EXEC sp_GetTicketById @TicketId;
END
GO

-- SP: Archive/Unarchive Ticket
CREATE PROCEDURE sp_ArchiveTicket
    @TicketId INT,
    @IsArchived BIT,
    @ChangedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Tickets
    SET 
        IsArchived = @IsArchived,
        ModifiedDate = GETUTCDATE()
    WHERE TicketId = @TicketId;
    
    -- Record history
    DECLARE @Action NVARCHAR(100) = CASE WHEN @IsArchived = 1 THEN 'Ticket Archived' ELSE 'Ticket Unarchived' END;
    INSERT INTO TicketHistory (TicketId, Action, ChangedBy)
    VALUES (@TicketId, @Action, @ChangedBy);
    
    SELECT 1 AS Success;
END
GO

-- SP: Delete Ticket
CREATE PROCEDURE sp_DeleteTicket
    @TicketId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Delete relationships
    DELETE FROM TicketRelationships WHERE TicketId = @TicketId OR RelatedTicketId = @TicketId;
    
    -- Cascade deletes will handle comments, attachments, history
    DELETE FROM Tickets WHERE TicketId = @TicketId;
    
    SELECT 1 AS Success;
END
GO

-- SP: Get Ticket Statistics
CREATE PROCEDURE sp_GetTicketStatistics
    @ClientId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COUNT(*) AS TotalTickets,
        SUM(CASE WHEN Status = 'open' THEN 1 ELSE 0 END) AS OpenTickets,
        SUM(CASE WHEN Status = 'in-progress' THEN 1 ELSE 0 END) AS InProgressTickets,
        SUM(CASE WHEN Status IN ('waiting-customer', 'waiting-internal') THEN 1 ELSE 0 END) AS WaitingTickets,
        SUM(CASE WHEN Status = 'resolved' THEN 1 ELSE 0 END) AS ResolvedTickets,
        SUM(CASE WHEN Status = 'closed' THEN 1 ELSE 0 END) AS ClosedTickets,
        SUM(CASE WHEN Priority = 'urgent' THEN 1 ELSE 0 END) AS UrgentTickets,
        SUM(CASE WHEN Priority = 'high' THEN 1 ELSE 0 END) AS HighPriorityTickets,
        AVG(CASE WHEN ActualHours IS NOT NULL THEN ActualHours ELSE NULL END) AS AverageHours,
        SUM(CASE WHEN DueDate < GETUTCDATE() AND Status NOT IN ('resolved', 'closed', 'cancelled') THEN 1 ELSE 0 END) AS OverdueTickets
    FROM Tickets
    WHERE (@ClientId IS NULL OR ClientId = @ClientId)
        AND IsArchived = 0;
END
GO

-- =============================================
-- STORED PROCEDURES - Ticket Comments
-- =============================================

-- SP: Get Ticket Comments
CREATE PROCEDURE sp_GetTicketComments
    @TicketId INT,
    @IncludeInternal BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        CommentId,
        TicketId,
        Comment,
        CommentType,
        CreatedBy,
        IsCustomerVisible,
        CreatedDate
    FROM TicketComments
    WHERE TicketId = @TicketId
        AND (@IncludeInternal = 1 OR CommentType != 'internal')
    ORDER BY CreatedDate ASC;
END
GO

-- SP: Create Ticket Comment
CREATE PROCEDURE sp_CreateTicketComment
    @TicketId INT,
    @Comment NVARCHAR(MAX),
    @CommentType NVARCHAR(20) = 'public',
    @CreatedBy NVARCHAR(100) = NULL,
    @IsCustomerVisible BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO TicketComments (TicketId, Comment, CommentType, CreatedBy, IsCustomerVisible)
    VALUES (@TicketId, @Comment, @CommentType, @CreatedBy, @IsCustomerVisible);
    
    -- Record history
    INSERT INTO TicketHistory (TicketId, Action, ChangedBy)
    VALUES (@TicketId, 'Comment Added', @CreatedBy);
    
    SELECT 
        CommentId,
        TicketId,
        Comment,
        CommentType,
        CreatedBy,
        IsCustomerVisible,
        CreatedDate
    FROM TicketComments
    WHERE CommentId = SCOPE_IDENTITY();
END
GO

-- SP: Delete Ticket Comment
CREATE PROCEDURE sp_DeleteTicketComment
    @CommentId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM TicketComments
    WHERE CommentId = @CommentId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- STORED PROCEDURES - Ticket Attachments
-- =============================================

-- SP: Get Ticket Attachments
CREATE PROCEDURE sp_GetTicketAttachments
    @TicketId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        AttachmentId,
        TicketId,
        FileName,
        FilePath,
        FileSize,
        ContentType,
        UploadedBy,
        UploadedDate
    FROM TicketAttachments
    WHERE TicketId = @TicketId
    ORDER BY UploadedDate DESC;
END
GO

-- SP: Create Ticket Attachment
CREATE PROCEDURE sp_CreateTicketAttachment
    @TicketId INT,
    @FileName NVARCHAR(255),
    @FilePath NVARCHAR(1000),
    @FileSize BIGINT = NULL,
    @ContentType NVARCHAR(100) = NULL,
    @UploadedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO TicketAttachments (TicketId, FileName, FilePath, FileSize, ContentType, UploadedBy)
    VALUES (@TicketId, @FileName, @FilePath, @FileSize, @ContentType, @UploadedBy);
    
    -- Record history
    INSERT INTO TicketHistory (TicketId, Action, ChangedBy)
    VALUES (@TicketId, 'Attachment Added', @UploadedBy);
    
    SELECT 
        AttachmentId,
        TicketId,
        FileName,
        FilePath,
        FileSize,
        ContentType,
        UploadedBy,
        UploadedDate
    FROM TicketAttachments
    WHERE AttachmentId = SCOPE_IDENTITY();
END
GO

-- SP: Delete Ticket Attachment
CREATE PROCEDURE sp_DeleteTicketAttachment
    @AttachmentId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM TicketAttachments
    WHERE AttachmentId = @AttachmentId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- STORED PROCEDURES - Ticket History
-- =============================================

-- SP: Get Ticket History
CREATE PROCEDURE sp_GetTicketHistory
    @TicketId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        HistoryId,
        TicketId,
        Action,
        FieldChanged,
        OldValue,
        NewValue,
        ChangedBy,
        ChangeDate
    FROM TicketHistory
    WHERE TicketId = @TicketId
    ORDER BY ChangeDate DESC;
END
GO

-- =============================================
-- SEED DATA
-- =============================================

-- Insert sample tickets
DECLARE @Ticket1 INT, @Ticket2 INT, @Ticket3 INT, @Ticket4 INT, @Ticket5 INT;

INSERT INTO Tickets (ClientId, TicketNumber, Subject, Description, Category, Priority, Status, AssignedTo, ReportedBy, ContactEmail, EstimatedHours, DueDate, CreatedDate)
VALUES
(1, 'TCK-2024-0001', 'Database connection timeout', 'Users are experiencing timeout errors when connecting to the main database server during peak hours.', 'Technical', 'high', 'in-progress', 'john.tech@support.com', 'John Smith', 'john.smith@acme.com', 8.0, DATEADD(DAY, 2, GETUTCDATE()), DATEADD(DAY, -3, GETUTCDATE())),
(1, 'TCK-2024-0002', 'Request for custom reporting feature', 'Need ability to generate custom reports with date range filters and export to Excel.', 'Feature Request', 'medium', 'open', 'sarah.dev@support.com', 'Sarah Johnson', 'sarah.johnson@acme.com', 20.0, DATEADD(DAY, 14, GETUTCDATE()), DATEADD(DAY, -1, GETUTCDATE())),
(3, 'TCK-2024-0003', 'SSL certificate expiring soon', 'Main domain SSL certificate will expire in 15 days. Need renewal urgently.', 'Technical', 'urgent', 'open', 'mike.ops@support.com', 'Emily Davis', 'emily.davis@globalsol.com', 2.0, DATEADD(DAY, 1, GETUTCDATE()), GETUTCDATE()),
(4, 'TCK-2024-0004', 'Billing inquiry for last month', 'Question about additional charges on last months invoice.', 'Billing', 'low', 'waiting-customer', 'billing@support.com', 'Lisa Anderson', 'lisa.anderson@innolabs.com', 1.0, DATEADD(DAY, 7, GETUTCDATE()), DATEADD(DAY, -5, GETUTCDATE())),
(6, 'TCK-2024-0005', 'API rate limit exceeded', 'Getting 429 errors frequently. Need to increase rate limit for our integration.', 'Technical', 'high', 'resolved', 'api.team@support.com', 'David Martinez', 'david.martinez@cloudserv.com', 3.0, NULL, DATEADD(DAY, -10, GETUTCDATE()));

SET @Ticket1 = 1;
SET @Ticket2 = 2;
SET @Ticket3 = 3;
SET @Ticket4 = 4;
SET @Ticket5 = 5;

UPDATE Tickets SET ResolvedDate = DATEADD(DAY, -2, GETUTCDATE()), Resolution = 'Rate limit increased to 10,000 requests per hour. Monitoring shows no more 429 errors.' WHERE TicketId = @Ticket5;
UPDATE Tickets SET ActualHours = 2.5 WHERE TicketId = @Ticket5;

-- Insert sample ticket comments
INSERT INTO TicketComments (TicketId, Comment, CommentType, CreatedBy, CreatedDate)
VALUES
(1, 'Investigating the issue. Initial analysis shows high CPU usage on the database server.', 'internal', 'john.tech@support.com', DATEADD(DAY, -2, GETUTCDATE())),
(1, 'We have identified the root cause. Working on optimization.', 'public', 'john.tech@support.com', DATEADD(DAY, -1, GETUTCDATE())),
(3, 'SSL certificate renewal process initiated. Should be completed within 24 hours.', 'public', 'mike.ops@support.com', DATEADD(HOUR, -2, GETUTCDATE())),
(4, 'The additional charges are for the extra storage used last month. Please confirm if you want to proceed.', 'public', 'billing@support.com', DATEADD(DAY, -3, GETUTCDATE())),
(5, 'Rate limit has been increased as requested. Please test and confirm.', 'public', 'api.team@support.com', DATEADD(DAY, -3, GETUTCDATE())),
(5, 'Tested and working perfectly. Thank you!', 'public', 'David Martinez', DATEADD(DAY, -2, GETUTCDATE()));

-- Insert sample ticket history
INSERT INTO TicketHistory (TicketId, Action, FieldChanged, OldValue, NewValue, ChangedBy, ChangeDate)
VALUES
(1, 'Ticket Created', NULL, NULL, NULL, 'John Smith', DATEADD(DAY, -3, GETUTCDATE())),
(1, 'Status Changed', 'Status', 'open', 'in-progress', 'john.tech@support.com', DATEADD(DAY, -2, GETUTCDATE())),
(2, 'Ticket Created', NULL, NULL, NULL, 'Sarah Johnson', DATEADD(DAY, -1, GETUTCDATE())),
(3, 'Ticket Created', NULL, NULL, NULL, 'Emily Davis', GETUTCDATE()),
(3, 'Priority Changed', 'Priority', 'high', 'urgent', 'mike.ops@support.com', GETUTCDATE()),
(4, 'Ticket Created', NULL, NULL, NULL, 'Lisa Anderson', DATEADD(DAY, -5, GETUTCDATE())),
(4, 'Status Changed', 'Status', 'open', 'waiting-customer', 'billing@support.com', DATEADD(DAY, -3, GETUTCDATE())),
(5, 'Ticket Created', NULL, NULL, NULL, 'David Martinez', DATEADD(DAY, -10, GETUTCDATE())),
(5, 'Status Changed', 'Status', 'open', 'in-progress', 'api.team@support.com', DATEADD(DAY, -8, GETUTCDATE())),
(5, 'Status Changed', 'Status', 'in-progress', 'resolved', 'api.team@support.com', DATEADD(DAY, -2, GETUTCDATE()));

GO

PRINT 'Phase 7 database setup completed successfully!';
