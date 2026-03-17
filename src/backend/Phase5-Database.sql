-- =============================================
-- Phase 5: Contact & License Management
-- Database Tables and Stored Procedures
-- =============================================

USE ClientManagementDB;
GO

-- =============================================
-- TABLES
-- =============================================

-- Table: Contacts
CREATE TABLE Contacts (
    ContactId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Role NVARCHAR(100) NULL,
    Email NVARCHAR(255) NULL,
    Phone NVARCHAR(50) NULL,
    Mobile NVARCHAR(50) NULL,
    Department NVARCHAR(100) NULL,
    IsPrimary BIT NOT NULL DEFAULT 0,
    Notes NVARCHAR(MAX) NULL,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Contact_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Contact_ClientId ON Contacts(ClientId);
CREATE INDEX IX_Contact_Email ON Contacts(Email);
GO

-- Table: Licenses
CREATE TABLE Licenses (
    LicenseId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    ProductName NVARCHAR(255) NOT NULL,
    LicenseKey NVARCHAR(500) NULL,
    LicenseType NVARCHAR(50) NULL CHECK (LicenseType IN ('Perpetual', 'Subscription', 'Trial', 'Volume', 'OEM', 'Other') OR LicenseType IS NULL),
    Quantity INT NULL,
    PurchaseDate DATETIME2 NULL,
    ExpiryDate DATETIME2 NULL,
    RenewalDate DATETIME2 NULL,
    Cost DECIMAL(10,2) NULL,
    Vendor NVARCHAR(255) NULL,
    SupportLevel NVARCHAR(100) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (Status IN ('active', 'expired', 'cancelled', 'pending')),
    Notes NVARCHAR(MAX) NULL,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_License_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_License_ClientId ON Licenses(ClientId);
CREATE INDEX IX_License_Status ON Licenses(Status);
CREATE INDEX IX_License_ExpiryDate ON Licenses(ExpiryDate);
GO

-- Table: LicenseHistory
CREATE TABLE LicenseHistory (
    HistoryId INT PRIMARY KEY IDENTITY(1,1),
    LicenseId INT NOT NULL,
    Action NVARCHAR(50) NOT NULL, -- 'created', 'renewed', 'upgraded', 'cancelled', 'modified'
    PreviousExpiryDate DATETIME2 NULL,
    NewExpiryDate DATETIME2 NULL,
    Cost DECIMAL(10,2) NULL,
    Notes NVARCHAR(MAX) NULL,
    PerformedBy NVARCHAR(100) NULL,
    ActionDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_LicenseHistory_License FOREIGN KEY (LicenseId) REFERENCES Licenses(LicenseId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_LicenseHistory_LicenseId ON LicenseHistory(LicenseId);
GO

-- =============================================
-- STORED PROCEDURES - Contacts
-- =============================================

-- SP: Get Contacts by Client
CREATE PROCEDURE sp_GetContacts
    @ClientId INT,
    @IncludeArchived BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ContactId,
        ClientId,
        Name,
        Role,
        Email,
        Phone,
        Mobile,
        Department,
        IsPrimary,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Contacts
    WHERE ClientId = @ClientId
        AND (@IncludeArchived = 1 OR IsArchived = 0)
    ORDER BY IsPrimary DESC, Name;
END
GO

-- SP: Get Contact by ID
CREATE PROCEDURE sp_GetContactById
    @ContactId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ContactId,
        ClientId,
        Name,
        Role,
        Email,
        Phone,
        Mobile,
        Department,
        IsPrimary,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Contacts
    WHERE ContactId = @ContactId;
END
GO

-- SP: Create Contact
CREATE PROCEDURE sp_CreateContact
    @ClientId INT,
    @Name NVARCHAR(255),
    @Role NVARCHAR(100) = NULL,
    @Email NVARCHAR(255) = NULL,
    @Phone NVARCHAR(50) = NULL,
    @Mobile NVARCHAR(50) = NULL,
    @Department NVARCHAR(100) = NULL,
    @IsPrimary BIT = 0,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- If setting as primary, unset other primary contacts for this client
    IF @IsPrimary = 1
    BEGIN
        UPDATE Contacts
        SET IsPrimary = 0
        WHERE ClientId = @ClientId AND IsPrimary = 1;
    END
    
    INSERT INTO Contacts (ClientId, Name, Role, Email, Phone, Mobile, Department, IsPrimary, Notes)
    VALUES (@ClientId, @Name, @Role, @Email, @Phone, @Mobile, @Department, @IsPrimary, @Notes);
    
    SELECT 
        ContactId,
        ClientId,
        Name,
        Role,
        Email,
        Phone,
        Mobile,
        Department,
        IsPrimary,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Contacts
    WHERE ContactId = SCOPE_IDENTITY();
END
GO

-- SP: Update Contact
CREATE PROCEDURE sp_UpdateContact
    @ContactId INT,
    @Name NVARCHAR(255),
    @Role NVARCHAR(100) = NULL,
    @Email NVARCHAR(255) = NULL,
    @Phone NVARCHAR(50) = NULL,
    @Mobile NVARCHAR(50) = NULL,
    @Department NVARCHAR(100) = NULL,
    @IsPrimary BIT,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ClientId INT;
    
    -- Get the client ID for this contact
    SELECT @ClientId = ClientId FROM Contacts WHERE ContactId = @ContactId;
    
    -- If setting as primary, unset other primary contacts for this client
    IF @IsPrimary = 1
    BEGIN
        UPDATE Contacts
        SET IsPrimary = 0
        WHERE ClientId = @ClientId AND ContactId != @ContactId AND IsPrimary = 1;
    END
    
    UPDATE Contacts
    SET 
        Name = @Name,
        Role = @Role,
        Email = @Email,
        Phone = @Phone,
        Mobile = @Mobile,
        Department = @Department,
        IsPrimary = @IsPrimary,
        Notes = @Notes,
        ModifiedDate = GETUTCDATE()
    WHERE ContactId = @ContactId;
    
    SELECT 
        ContactId,
        ClientId,
        Name,
        Role,
        Email,
        Phone,
        Mobile,
        Department,
        IsPrimary,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Contacts
    WHERE ContactId = @ContactId;
END
GO

-- SP: Archive/Unarchive Contact
CREATE PROCEDURE sp_ArchiveContact
    @ContactId INT,
    @IsArchived BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Contacts
    SET 
        IsArchived = @IsArchived,
        ModifiedDate = GETUTCDATE()
    WHERE ContactId = @ContactId;
    
    SELECT 1 AS Success;
END
GO

-- SP: Delete Contact
CREATE PROCEDURE sp_DeleteContact
    @ContactId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Contacts
    WHERE ContactId = @ContactId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- STORED PROCEDURES - Licenses
-- =============================================

-- SP: Get Licenses by Client
CREATE PROCEDURE sp_GetLicenses
    @ClientId INT,
    @IncludeArchived BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        LicenseId,
        ClientId,
        ProductName,
        LicenseKey,
        LicenseType,
        Quantity,
        PurchaseDate,
        ExpiryDate,
        RenewalDate,
        Cost,
        Vendor,
        SupportLevel,
        Status,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Licenses
    WHERE ClientId = @ClientId
        AND (@IncludeArchived = 1 OR IsArchived = 0)
    ORDER BY ExpiryDate, ProductName;
END
GO

-- SP: Get License by ID
CREATE PROCEDURE sp_GetLicenseById
    @LicenseId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        LicenseId,
        ClientId,
        ProductName,
        LicenseKey,
        LicenseType,
        Quantity,
        PurchaseDate,
        ExpiryDate,
        RenewalDate,
        Cost,
        Vendor,
        SupportLevel,
        Status,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Licenses
    WHERE LicenseId = @LicenseId;
END
GO

-- SP: Create License
CREATE PROCEDURE sp_CreateLicense
    @ClientId INT,
    @ProductName NVARCHAR(255),
    @LicenseKey NVARCHAR(500) = NULL,
    @LicenseType NVARCHAR(50) = NULL,
    @Quantity INT = NULL,
    @PurchaseDate DATETIME2 = NULL,
    @ExpiryDate DATETIME2 = NULL,
    @RenewalDate DATETIME2 = NULL,
    @Cost DECIMAL(10,2) = NULL,
    @Vendor NVARCHAR(255) = NULL,
    @SupportLevel NVARCHAR(100) = NULL,
    @Status NVARCHAR(20) = 'active',
    @Notes NVARCHAR(MAX) = NULL,
    @PerformedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NewLicenseId INT;
    
    INSERT INTO Licenses (ClientId, ProductName, LicenseKey, LicenseType, Quantity, PurchaseDate, ExpiryDate, RenewalDate, Cost, Vendor, SupportLevel, Status, Notes)
    VALUES (@ClientId, @ProductName, @LicenseKey, @LicenseType, @Quantity, @PurchaseDate, @ExpiryDate, @RenewalDate, @Cost, @Vendor, @SupportLevel, @Status, @Notes);
    
    SET @NewLicenseId = SCOPE_IDENTITY();
    
    -- Record history
    INSERT INTO LicenseHistory (LicenseId, Action, NewExpiryDate, Cost, Notes, PerformedBy)
    VALUES (@NewLicenseId, 'created', @ExpiryDate, @Cost, 'License created', @PerformedBy);
    
    SELECT 
        LicenseId,
        ClientId,
        ProductName,
        LicenseKey,
        LicenseType,
        Quantity,
        PurchaseDate,
        ExpiryDate,
        RenewalDate,
        Cost,
        Vendor,
        SupportLevel,
        Status,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Licenses
    WHERE LicenseId = @NewLicenseId;
END
GO

-- SP: Update License
CREATE PROCEDURE sp_UpdateLicense
    @LicenseId INT,
    @ProductName NVARCHAR(255),
    @LicenseKey NVARCHAR(500) = NULL,
    @LicenseType NVARCHAR(50) = NULL,
    @Quantity INT = NULL,
    @PurchaseDate DATETIME2 = NULL,
    @ExpiryDate DATETIME2 = NULL,
    @RenewalDate DATETIME2 = NULL,
    @Cost DECIMAL(10,2) = NULL,
    @Vendor NVARCHAR(255) = NULL,
    @SupportLevel NVARCHAR(100) = NULL,
    @Status NVARCHAR(20),
    @Notes NVARCHAR(MAX) = NULL,
    @PerformedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @OldExpiryDate DATETIME2;
    
    -- Get old expiry date for history
    SELECT @OldExpiryDate = ExpiryDate FROM Licenses WHERE LicenseId = @LicenseId;
    
    UPDATE Licenses
    SET 
        ProductName = @ProductName,
        LicenseKey = @LicenseKey,
        LicenseType = @LicenseType,
        Quantity = @Quantity,
        PurchaseDate = @PurchaseDate,
        ExpiryDate = @ExpiryDate,
        RenewalDate = @RenewalDate,
        Cost = @Cost,
        Vendor = @Vendor,
        SupportLevel = @SupportLevel,
        Status = @Status,
        Notes = @Notes,
        ModifiedDate = GETUTCDATE()
    WHERE LicenseId = @LicenseId;
    
    -- Record history if expiry date changed
    IF @OldExpiryDate != @ExpiryDate OR (@OldExpiryDate IS NULL AND @ExpiryDate IS NOT NULL) OR (@OldExpiryDate IS NOT NULL AND @ExpiryDate IS NULL)
    BEGIN
        INSERT INTO LicenseHistory (LicenseId, Action, PreviousExpiryDate, NewExpiryDate, Cost, Notes, PerformedBy)
        VALUES (@LicenseId, 'modified', @OldExpiryDate, @ExpiryDate, @Cost, 'License updated', @PerformedBy);
    END
    
    SELECT 
        LicenseId,
        ClientId,
        ProductName,
        LicenseKey,
        LicenseType,
        Quantity,
        PurchaseDate,
        ExpiryDate,
        RenewalDate,
        Cost,
        Vendor,
        SupportLevel,
        Status,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Licenses
    WHERE LicenseId = @LicenseId;
END
GO

-- SP: Renew License
CREATE PROCEDURE sp_RenewLicense
    @LicenseId INT,
    @NewExpiryDate DATETIME2,
    @Cost DECIMAL(10,2) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @PerformedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @OldExpiryDate DATETIME2;
    
    -- Get old expiry date
    SELECT @OldExpiryDate = ExpiryDate FROM Licenses WHERE LicenseId = @LicenseId;
    
    -- Update license
    UPDATE Licenses
    SET 
        ExpiryDate = @NewExpiryDate,
        RenewalDate = GETUTCDATE(),
        Status = 'active',
        ModifiedDate = GETUTCDATE()
    WHERE LicenseId = @LicenseId;
    
    -- Record history
    INSERT INTO LicenseHistory (LicenseId, Action, PreviousExpiryDate, NewExpiryDate, Cost, Notes, PerformedBy)
    VALUES (@LicenseId, 'renewed', @OldExpiryDate, @NewExpiryDate, @Cost, @Notes, @PerformedBy);
    
    SELECT 
        LicenseId,
        ClientId,
        ProductName,
        LicenseKey,
        LicenseType,
        Quantity,
        PurchaseDate,
        ExpiryDate,
        RenewalDate,
        Cost,
        Vendor,
        SupportLevel,
        Status,
        Notes,
        IsArchived,
        CreatedDate,
        ModifiedDate
    FROM Licenses
    WHERE LicenseId = @LicenseId;
END
GO

-- SP: Get License History
CREATE PROCEDURE sp_GetLicenseHistory
    @LicenseId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        HistoryId,
        LicenseId,
        Action,
        PreviousExpiryDate,
        NewExpiryDate,
        Cost,
        Notes,
        PerformedBy,
        ActionDate
    FROM LicenseHistory
    WHERE LicenseId = @LicenseId
    ORDER BY ActionDate DESC;
END
GO

-- SP: Get Expiring Licenses
CREATE PROCEDURE sp_GetExpiringLicenses
    @Days INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        l.LicenseId,
        l.ClientId,
        c.Name AS ClientName,
        l.ProductName,
        l.LicenseType,
        l.ExpiryDate,
        l.Vendor,
        l.Cost,
        DATEDIFF(DAY, GETUTCDATE(), l.ExpiryDate) AS DaysUntilExpiry
    FROM Licenses l
    INNER JOIN Clients c ON l.ClientId = c.ClientId
    WHERE l.Status = 'active'
        AND l.IsArchived = 0
        AND l.ExpiryDate IS NOT NULL
        AND l.ExpiryDate <= DATEADD(DAY, @Days, GETUTCDATE())
        AND l.ExpiryDate >= GETUTCDATE()
    ORDER BY l.ExpiryDate;
END
GO

-- SP: Archive/Unarchive License
CREATE PROCEDURE sp_ArchiveLicense
    @LicenseId INT,
    @IsArchived BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Licenses
    SET 
        IsArchived = @IsArchived,
        ModifiedDate = GETUTCDATE()
    WHERE LicenseId = @LicenseId;
    
    SELECT 1 AS Success;
END
GO

-- SP: Delete License
CREATE PROCEDURE sp_DeleteLicense
    @LicenseId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Delete history first
    DELETE FROM LicenseHistory
    WHERE LicenseId = @LicenseId;
    
    -- Delete license
    DELETE FROM Licenses
    WHERE LicenseId = @LicenseId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- SEED DATA
-- =============================================

-- Insert sample contacts
INSERT INTO Contacts (ClientId, Name, Role, Email, Phone, Mobile, Department, IsPrimary, Notes)
VALUES
(1, 'John Smith', 'IT Manager', 'john.smith@acme.com', '+1-555-0101', '+1-555-0102', 'IT', 1, 'Primary technical contact'),
(1, 'Sarah Johnson', 'Project Manager', 'sarah.johnson@acme.com', '+1-555-0103', '+1-555-0104', 'Operations', 0, NULL),
(1, 'Michael Brown', 'System Administrator', 'michael.brown@acme.com', '+1-555-0105', NULL, 'IT', 0, 'Handles day-to-day operations'),
(3, 'Emily Davis', 'CTO', 'emily.davis@globalsol.com', '+44-20-1234-5678', '+44-7700-900123', 'Technology', 1, NULL),
(3, 'Robert Wilson', 'Lead Developer', 'robert.wilson@globalsol.com', '+44-20-1234-5679', NULL, 'Development', 0, NULL),
(4, 'Lisa Anderson', 'VP of Engineering', 'lisa.anderson@innolabs.com', '+1-555-0201', '+1-555-0202', 'Engineering', 1, NULL),
(6, 'David Martinez', 'Infrastructure Lead', 'david.martinez@cloudserv.com', '+1-555-0301', NULL, 'Infrastructure', 1, 'Cloud infrastructure specialist');

-- Insert sample licenses
INSERT INTO Licenses (ClientId, ProductName, LicenseKey, LicenseType, Quantity, PurchaseDate, ExpiryDate, RenewalDate, Cost, Vendor, SupportLevel, Status, Notes)
VALUES
(1, 'Microsoft Office 365', 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', 'Subscription', 50, DATEADD(YEAR, -1, GETUTCDATE()), DATEADD(MONTH, 6, GETUTCDATE()), DATEADD(YEAR, -1, GETUTCDATE()), 2500.00, 'Microsoft', 'Business Premium', 'active', 'Annual subscription'),
(1, 'Adobe Creative Cloud', 'XXXXX-XXXXX-XXXXX-XXXXX', 'Subscription', 10, DATEADD(MONTH, -6, GETUTCDATE()), DATEADD(MONTH, 6, GETUTCDATE()), DATEADD(MONTH, -6, GETUTCDATE()), 600.00, 'Adobe', 'Team', 'active', 'Design team licenses'),
(1, 'Atlassian Jira', 'JIRA-XXXXX-XXXXX', 'Subscription', 25, DATEADD(YEAR, -2, GETUTCDATE()), DATEADD(MONTH, 2, GETUTCDATE()), DATEADD(YEAR, -1, GETUTCDATE()), 1250.00, 'Atlassian', 'Standard', 'active', NULL),
(3, 'VMware vSphere', 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', 'Perpetual', 4, DATEADD(YEAR, -3, GETUTCDATE()), DATEADD(MONTH, 3, GETUTCDATE()), DATEADD(YEAR, -1, GETUTCDATE()), 8000.00, 'VMware', 'Production Support', 'active', 'Virtualization platform'),
(3, 'Salesforce Enterprise', 'SF-XXXXX-XXXXX', 'Subscription', 100, DATEADD(MONTH, -8, GETUTCDATE()), DATEADD(MONTH, 4, GETUTCDATE()), DATEADD(MONTH, -8, GETUTCDATE()), 15000.00, 'Salesforce', 'Enterprise', 'active', 'CRM system'),
(4, 'JetBrains All Products Pack', 'JETBRAINS-XXXXX', 'Subscription', 15, DATEADD(MONTH, -3, GETUTCDATE()), DATEADD(MONTH, 9, GETUTCDATE()), DATEADD(MONTH, -3, GETUTCDATE()), 4500.00, 'JetBrains', 'Commercial', 'active', 'Development tools'),
(6, 'AWS Support', 'AWS-BUSINESS-XXXXX', 'Subscription', 1, DATEADD(MONTH, -10, GETUTCDATE()), DATEADD(MONTH, 2, GETUTCDATE()), DATEADD(MONTH, -10, GETUTCDATE()), 3000.00, 'Amazon Web Services', 'Business', 'active', 'Cloud support plan'),
(1, 'Slack Business+', 'SLACK-XXXXX-XXXXX', 'Subscription', 50, DATEADD(MONTH, -2, GETUTCDATE()), DATEADD(MONTH, 10, GETUTCDATE()), DATEADD(MONTH, -2, GETUTCDATE()), 400.00, 'Slack', 'Business+', 'active', NULL);

-- Insert sample license history
INSERT INTO LicenseHistory (LicenseId, Action, PreviousExpiryDate, NewExpiryDate, Cost, Notes, PerformedBy)
VALUES
(1, 'created', NULL, DATEADD(YEAR, 1, DATEADD(YEAR, -1, GETUTCDATE())), 2500.00, 'Initial purchase', 'Admin User'),
(1, 'renewed', DATEADD(YEAR, 1, DATEADD(YEAR, -1, GETUTCDATE())), DATEADD(MONTH, 6, GETUTCDATE()), 2500.00, 'Annual renewal', 'Admin User'),
(3, 'created', NULL, DATEADD(YEAR, 1, DATEADD(YEAR, -2, GETUTCDATE())), 1250.00, 'Initial purchase', 'Admin User'),
(3, 'renewed', DATEADD(YEAR, 1, DATEADD(YEAR, -2, GETUTCDATE())), DATEADD(YEAR, 1, DATEADD(YEAR, -1, GETUTCDATE())), 1250.00, 'First renewal', 'Admin User'),
(3, 'renewed', DATEADD(YEAR, 1, DATEADD(YEAR, -1, GETUTCDATE())), DATEADD(MONTH, 2, GETUTCDATE()), 1250.00, 'Second renewal', 'Admin User');

GO

PRINT 'Phase 5 database setup completed successfully!';
