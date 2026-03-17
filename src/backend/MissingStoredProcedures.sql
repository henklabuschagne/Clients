-- ===========================
-- Missing Stored Procedures for Complete API Support
-- ===========================

USE ClientManagementDB;
GO

-- ===========================
-- SERVER STORED PROCEDURES
-- ===========================

-- SP: Get Server By ID
CREATE OR ALTER PROCEDURE sp_GetServerById
    @ServerId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Servers WHERE ServerId = @ServerId;
END
GO

-- SP: Update Server
CREATE OR ALTER PROCEDURE sp_UpdateServer
    @ServerId INT,
    @ClientId INT,
    @ServerName NVARCHAR(200),
    @ServerType NVARCHAR(50),
    @IPAddress NVARCHAR(50),
    @Hostname NVARCHAR(255) = NULL,
    @OperatingSystem NVARCHAR(100) = NULL,
    @CPUCores INT = NULL,
    @RAMGB INT = NULL,
    @DiskGB INT = NULL,
    @Location NVARCHAR(200) = NULL,
    @Provider NVARCHAR(100) = NULL,
    @IsActive BIT = 1,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Servers
    SET ClientId = @ClientId,
        ServerName = @ServerName,
        ServerType = @ServerType,
        IPAddress = @IPAddress,
        Hostname = @Hostname,
        OperatingSystem = @OperatingSystem,
        CPUCores = @CPUCores,
        RAMGB = @RAMGB,
        DiskGB = @DiskGB,
        Location = @Location,
        Provider = @Provider,
        IsActive = @IsActive,
        Notes = @Notes,
        UpdatedAt = GETUTCDATE()
    WHERE ServerId = @ServerId;
END
GO

-- SP: Delete Server
CREATE OR ALTER PROCEDURE sp_DeleteServer
    @ServerId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Servers WHERE ServerId = @ServerId;
END
GO

-- ===========================
-- CONTACT STORED PROCEDURES
-- ===========================

-- SP: Get Contact By ID
CREATE OR ALTER PROCEDURE sp_GetContactById
    @ContactId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Contacts WHERE ContactId = @ContactId;
END
GO

-- SP: Update Contact
CREATE OR ALTER PROCEDURE sp_UpdateContact
    @ContactId INT,
    @ClientId INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(255),
    @Phone NVARCHAR(50) = NULL,
    @Mobile NVARCHAR(50) = NULL,
    @Position NVARCHAR(100) = NULL,
    @Department NVARCHAR(100) = NULL,
    @IsPrimary BIT = 0,
    @IsActive BIT = 1,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Contacts
    SET ClientId = @ClientId,
        FirstName = @FirstName,
        LastName = @LastName,
        Email = @Email,
        Phone = @Phone,
        Mobile = @Mobile,
        Position = @Position,
        Department = @Department,
        IsPrimary = @IsPrimary,
        IsActive = @IsActive,
        Notes = @Notes,
        UpdatedAt = GETUTCDATE()
    WHERE ContactId = @ContactId;
END
GO

-- SP: Delete Contact
CREATE OR ALTER PROCEDURE sp_DeleteContact
    @ContactId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Contacts WHERE ContactId = @ContactId;
END
GO

-- ===========================
-- LICENSE STORED PROCEDURES
-- ===========================

-- SP: Get License By ID
CREATE OR ALTER PROCEDURE sp_GetLicenseById
    @LicenseId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Licenses WHERE LicenseId = @LicenseId;
END
GO

-- SP: Create License
CREATE OR ALTER PROCEDURE sp_CreateLicense
    @ClientId INT,
    @SoftwareName NVARCHAR(200),
    @LicenseKey NVARCHAR(500),
    @LicenseType NVARCHAR(50),
    @Quantity INT,
    @PurchaseDate DATE,
    @ExpiryDate DATE = NULL,
    @RenewalDate DATE = NULL,
    @Cost DECIMAL(10,2) = NULL,
    @Currency NVARCHAR(10) = NULL,
    @Vendor NVARCHAR(200) = NULL,
    @IsActive BIT = 1,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Licenses (ClientId, SoftwareName, LicenseKey, LicenseType, Quantity, PurchaseDate,
                         ExpiryDate, RenewalDate, Cost, Currency, Vendor, IsActive, Notes)
    VALUES (@ClientId, @SoftwareName, @LicenseKey, @LicenseType, @Quantity, @PurchaseDate,
            @ExpiryDate, @RenewalDate, @Cost, @Currency, @Vendor, @IsActive, @Notes);
    SELECT SCOPE_IDENTITY() AS LicenseId;
END
GO

-- SP: Update License
CREATE OR ALTER PROCEDURE sp_UpdateLicense
    @LicenseId INT,
    @ClientId INT,
    @SoftwareName NVARCHAR(200),
    @LicenseKey NVARCHAR(500),
    @LicenseType NVARCHAR(50),
    @Quantity INT,
    @PurchaseDate DATE,
    @ExpiryDate DATE = NULL,
    @RenewalDate DATE = NULL,
    @Cost DECIMAL(10,2) = NULL,
    @Currency NVARCHAR(10) = NULL,
    @Vendor NVARCHAR(200) = NULL,
    @IsActive BIT = 1,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Licenses
    SET ClientId = @ClientId,
        SoftwareName = @SoftwareName,
        LicenseKey = @LicenseKey,
        LicenseType = @LicenseType,
        Quantity = @Quantity,
        PurchaseDate = @PurchaseDate,
        ExpiryDate = @ExpiryDate,
        RenewalDate = @RenewalDate,
        Cost = @Cost,
        Currency = @Currency,
        Vendor = @Vendor,
        IsActive = @IsActive,
        Notes = @Notes,
        UpdatedAt = GETUTCDATE()
    WHERE LicenseId = @LicenseId;
END
GO

-- SP: Delete License
CREATE OR ALTER PROCEDURE sp_DeleteLicense
    @LicenseId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Licenses WHERE LicenseId = @LicenseId;
END
GO

-- ===========================
-- TICKET STORED PROCEDURES
-- ===========================

-- SP: Get Ticket By ID
CREATE OR ALTER PROCEDURE sp_GetTicketById
    @TicketId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Tickets WHERE TicketId = @TicketId;
END
GO

-- SP: Create Ticket
CREATE OR ALTER PROCEDURE sp_CreateTicket
    @ClientId INT,
    @Title NVARCHAR(500),
    @Description NVARCHAR(MAX),
    @Priority NVARCHAR(50),
    @Status NVARCHAR(50),
    @Category NVARCHAR(100) = NULL,
    @AssignedTo INT = NULL,
    @ReportedBy INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Tickets (ClientId, Title, Description, Priority, Status, Category, AssignedTo, ReportedBy)
    VALUES (@ClientId, @Title, @Description, @Priority, @Status, @Category, @AssignedTo, @ReportedBy);
    SELECT SCOPE_IDENTITY() AS TicketId;
END
GO

-- SP: Update Ticket
CREATE OR ALTER PROCEDURE sp_UpdateTicket
    @TicketId INT,
    @ClientId INT,
    @Title NVARCHAR(500),
    @Description NVARCHAR(MAX),
    @Priority NVARCHAR(50),
    @Status NVARCHAR(50),
    @Category NVARCHAR(100) = NULL,
    @AssignedTo INT = NULL,
    @ReportedBy INT = NULL,
    @ResolvedAt DATETIME2 = NULL,
    @ClosedAt DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Tickets
    SET ClientId = @ClientId,
        Title = @Title,
        Description = @Description,
        Priority = @Priority,
        Status = @Status,
        Category = @Category,
        AssignedTo = @AssignedTo,
        ReportedBy = @ReportedBy,
        ResolvedAt = @ResolvedAt,
        ClosedAt = @ClosedAt,
        UpdatedAt = GETUTCDATE()
    WHERE TicketId = @TicketId;
END
GO

-- SP: Delete Ticket
CREATE OR ALTER PROCEDURE sp_DeleteTicket
    @TicketId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Tickets WHERE TicketId = @TicketId;
END
GO

-- SP: Create Ticket Comment
CREATE OR ALTER PROCEDURE sp_CreateTicketComment
    @TicketId INT,
    @UserId INT,
    @Comment NVARCHAR(MAX),
    @IsInternal BIT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO TicketComments (TicketId, UserId, Comment, IsInternal)
    VALUES (@TicketId, @UserId, @Comment, @IsInternal);
    SELECT SCOPE_IDENTITY() AS CommentId;
END
GO

-- ===========================
-- UPDATE STORED PROCEDURES
-- ===========================

-- SP: Get Update By ID
CREATE OR ALTER PROCEDURE sp_GetUpdateById
    @UpdateId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Updates WHERE UpdateId = @UpdateId;
END
GO

-- SP: Create Update
CREATE OR ALTER PROCEDURE sp_CreateUpdate
    @ClientId INT,
    @Title NVARCHAR(500),
    @Description NVARCHAR(MAX),
    @Version NVARCHAR(100),
    @UpdateType NVARCHAR(50),
    @Status NVARCHAR(50),
    @ScheduledDate DATETIME2 = NULL,
    @StartedAt DATETIME2 = NULL,
    @CompletedAt DATETIME2 = NULL,
    @PerformedBy INT = NULL,
    @Downtime INT = NULL,
    @RollbackPlan NVARCHAR(MAX) = NULL,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Updates (ClientId, Title, Description, Version, UpdateType, Status, ScheduledDate,
                        StartedAt, CompletedAt, PerformedBy, Downtime, RollbackPlan, Notes)
    VALUES (@ClientId, @Title, @Description, @Version, @UpdateType, @Status, @ScheduledDate,
            @StartedAt, @CompletedAt, @PerformedBy, @Downtime, @RollbackPlan, @Notes);
    SELECT SCOPE_IDENTITY() AS UpdateId;
END
GO

-- SP: Update Update
CREATE OR ALTER PROCEDURE sp_UpdateUpdate
    @UpdateId INT,
    @ClientId INT,
    @Title NVARCHAR(500),
    @Description NVARCHAR(MAX),
    @Version NVARCHAR(100),
    @UpdateType NVARCHAR(50),
    @Status NVARCHAR(50),
    @ScheduledDate DATETIME2 = NULL,
    @StartedAt DATETIME2 = NULL,
    @CompletedAt DATETIME2 = NULL,
    @PerformedBy INT = NULL,
    @Downtime INT = NULL,
    @RollbackPlan NVARCHAR(MAX) = NULL,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Updates
    SET ClientId = @ClientId,
        Title = @Title,
        Description = @Description,
        Version = @Version,
        UpdateType = @UpdateType,
        Status = @Status,
        ScheduledDate = @ScheduledDate,
        StartedAt = @StartedAt,
        CompletedAt = @CompletedAt,
        PerformedBy = @PerformedBy,
        Downtime = @Downtime,
        RollbackPlan = @RollbackPlan,
        Notes = @Notes,
        UpdatedAt = GETUTCDATE()
    WHERE UpdateId = @UpdateId;
END
GO

-- SP: Delete Update
CREATE OR ALTER PROCEDURE sp_DeleteUpdate
    @UpdateId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Updates WHERE UpdateId = @UpdateId;
END
GO

PRINT 'All missing stored procedures created successfully!';
GO
