-- =============================================
-- Phase 9: Client Customizations Management
-- Date: 2026-02-06
-- =============================================

USE ClientManagementDB;
GO

-- =============================================
-- TABLES
-- =============================================

-- Table: Customizations
CREATE TABLE Customizations (
    CustomizationId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    CustomizationType NVARCHAR(100) NOT NULL CHECK (CustomizationType IN (
        'Custom Application',
        'Stored Procedure',
        'Database Function',
        'API Integration',
        'UI Customization',
        'Report',
        'Workflow',
        'Configuration',
        'Other'
    )),
    Description NVARCHAR(MAX) NULL,
    Version NVARCHAR(50) NULL,
    Developer NVARCHAR(100) NULL,
    ImplementationDate DATETIME2 NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (Status IN ('active', 'deprecated', 'planned', 'testing', 'inactive')),
    TechnicalNotes NVARCHAR(MAX) NULL,
    Dependencies NVARCHAR(MAX) NULL,
    CodeRepository NVARCHAR(500) NULL,
    Tags NVARCHAR(500) NULL,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Customizations_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Customizations_ClientId ON Customizations(ClientId);
CREATE INDEX IX_Customizations_Type ON Customizations(CustomizationType);
CREATE INDEX IX_Customizations_Status ON Customizations(Status);
GO

-- Table: CustomizationDocuments
CREATE TABLE CustomizationDocuments (
    DocumentId INT PRIMARY KEY IDENTITY(1,1),
    CustomizationId INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(1000) NOT NULL,
    FileSize BIGINT NULL,
    FileType NVARCHAR(50) NULL,
    DocumentType NVARCHAR(100) NULL CHECK (DocumentType IN (
        'Technical Specification',
        'User Manual',
        'Code Documentation',
        'SQL Script',
        'Configuration File',
        'Test Cases',
        'Deployment Guide',
        'Architecture Diagram',
        'Other'
    )),
    Description NVARCHAR(MAX) NULL,
    UploadedBy NVARCHAR(100) NULL,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsArchived BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_CustomizationDocuments_Customization FOREIGN KEY (CustomizationId) REFERENCES Customizations(CustomizationId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_CustomizationDocuments_CustomizationId ON CustomizationDocuments(CustomizationId);
GO

-- =============================================
-- STORED PROCEDURES - Customizations
-- =============================================

-- SP: Get Customizations by Client
CREATE PROCEDURE sp_GetCustomizations
    @ClientId INT,
    @IncludeArchived BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.CustomizationId,
        c.ClientId,
        c.Title,
        c.CustomizationType,
        c.Description,
        c.Version,
        c.Developer,
        c.ImplementationDate,
        c.Status,
        c.TechnicalNotes,
        c.Dependencies,
        c.CodeRepository,
        c.Tags,
        c.IsArchived,
        c.CreatedDate,
        c.ModifiedDate,
        -- Count of documents
        (SELECT COUNT(*) FROM CustomizationDocuments WHERE CustomizationId = c.CustomizationId AND IsArchived = 0) AS DocumentCount
    FROM Customizations c
    WHERE c.ClientId = @ClientId
        AND (@IncludeArchived = 1 OR c.IsArchived = 0)
    ORDER BY c.Status, c.ImplementationDate DESC;
END
GO

-- SP: Get Customization by ID
CREATE PROCEDURE sp_GetCustomizationById
    @CustomizationId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.CustomizationId,
        c.ClientId,
        c.Title,
        c.CustomizationType,
        c.Description,
        c.Version,
        c.Developer,
        c.ImplementationDate,
        c.Status,
        c.TechnicalNotes,
        c.Dependencies,
        c.CodeRepository,
        c.Tags,
        c.IsArchived,
        c.CreatedDate,
        c.ModifiedDate,
        (SELECT COUNT(*) FROM CustomizationDocuments WHERE CustomizationId = c.CustomizationId AND IsArchived = 0) AS DocumentCount
    FROM Customizations c
    WHERE c.CustomizationId = @CustomizationId;
END
GO

-- SP: Create Customization
CREATE PROCEDURE sp_CreateCustomization
    @ClientId INT,
    @Title NVARCHAR(255),
    @CustomizationType NVARCHAR(100),
    @Description NVARCHAR(MAX) = NULL,
    @Version NVARCHAR(50) = NULL,
    @Developer NVARCHAR(100) = NULL,
    @ImplementationDate DATETIME2 = NULL,
    @Status NVARCHAR(20) = 'active',
    @TechnicalNotes NVARCHAR(MAX) = NULL,
    @Dependencies NVARCHAR(MAX) = NULL,
    @CodeRepository NVARCHAR(500) = NULL,
    @Tags NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NewCustomizationId INT;
    
    INSERT INTO Customizations (
        ClientId, Title, CustomizationType, Description, Version, 
        Developer, ImplementationDate, Status, TechnicalNotes, 
        Dependencies, CodeRepository, Tags
    )
    VALUES (
        @ClientId, @Title, @CustomizationType, @Description, @Version,
        @Developer, @ImplementationDate, @Status, @TechnicalNotes,
        @Dependencies, @CodeRepository, @Tags
    );
    
    SET @NewCustomizationId = SCOPE_IDENTITY();
    
    -- Return the created customization
    EXEC sp_GetCustomizationById @NewCustomizationId;
END
GO

-- SP: Update Customization
CREATE PROCEDURE sp_UpdateCustomization
    @CustomizationId INT,
    @Title NVARCHAR(255),
    @CustomizationType NVARCHAR(100),
    @Description NVARCHAR(MAX) = NULL,
    @Version NVARCHAR(50) = NULL,
    @Developer NVARCHAR(100) = NULL,
    @ImplementationDate DATETIME2 = NULL,
    @Status NVARCHAR(20),
    @TechnicalNotes NVARCHAR(MAX) = NULL,
    @Dependencies NVARCHAR(MAX) = NULL,
    @CodeRepository NVARCHAR(500) = NULL,
    @Tags NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Customizations
    SET 
        Title = @Title,
        CustomizationType = @CustomizationType,
        Description = @Description,
        Version = @Version,
        Developer = @Developer,
        ImplementationDate = @ImplementationDate,
        Status = @Status,
        TechnicalNotes = @TechnicalNotes,
        Dependencies = @Dependencies,
        CodeRepository = @CodeRepository,
        Tags = @Tags,
        ModifiedDate = GETUTCDATE()
    WHERE CustomizationId = @CustomizationId;
    
    -- Return the updated customization
    EXEC sp_GetCustomizationById @CustomizationId;
END
GO

-- SP: Archive/Unarchive Customization
CREATE PROCEDURE sp_ArchiveCustomization
    @CustomizationId INT,
    @IsArchived BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Customizations
    SET 
        IsArchived = @IsArchived,
        ModifiedDate = GETUTCDATE()
    WHERE CustomizationId = @CustomizationId;
    
    SELECT 1 AS Success;
END
GO

-- SP: Delete Customization
CREATE PROCEDURE sp_DeleteCustomization
    @CustomizationId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Delete all associated documents first
    DELETE FROM CustomizationDocuments WHERE CustomizationId = @CustomizationId;
    
    -- Delete the customization
    DELETE FROM Customizations WHERE CustomizationId = @CustomizationId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- STORED PROCEDURES - Customization Documents
-- =============================================

-- SP: Get Documents by Customization
CREATE PROCEDURE sp_GetCustomizationDocuments
    @CustomizationId INT,
    @IncludeArchived BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        DocumentId,
        CustomizationId,
        FileName,
        FilePath,
        FileSize,
        FileType,
        DocumentType,
        Description,
        UploadedBy,
        UploadedAt,
        IsArchived
    FROM CustomizationDocuments
    WHERE CustomizationId = @CustomizationId
        AND (@IncludeArchived = 1 OR IsArchived = 0)
    ORDER BY UploadedAt DESC;
END
GO

-- SP: Get Document by ID
CREATE PROCEDURE sp_GetCustomizationDocumentById
    @DocumentId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        DocumentId,
        CustomizationId,
        FileName,
        FilePath,
        FileSize,
        FileType,
        DocumentType,
        Description,
        UploadedBy,
        UploadedAt,
        IsArchived
    FROM CustomizationDocuments
    WHERE DocumentId = @DocumentId;
END
GO

-- SP: Create Document
CREATE PROCEDURE sp_CreateCustomizationDocument
    @CustomizationId INT,
    @FileName NVARCHAR(255),
    @FilePath NVARCHAR(1000),
    @FileSize BIGINT = NULL,
    @FileType NVARCHAR(50) = NULL,
    @DocumentType NVARCHAR(100) = NULL,
    @Description NVARCHAR(MAX) = NULL,
    @UploadedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NewDocumentId INT;
    
    INSERT INTO CustomizationDocuments (
        CustomizationId, FileName, FilePath, FileSize, FileType,
        DocumentType, Description, UploadedBy
    )
    VALUES (
        @CustomizationId, @FileName, @FilePath, @FileSize, @FileType,
        @DocumentType, @Description, @UploadedBy
    );
    
    SET @NewDocumentId = SCOPE_IDENTITY();
    
    -- Return the created document
    EXEC sp_GetCustomizationDocumentById @NewDocumentId;
END
GO

-- SP: Update Document
CREATE PROCEDURE sp_UpdateCustomizationDocument
    @DocumentId INT,
    @FileName NVARCHAR(255),
    @DocumentType NVARCHAR(100) = NULL,
    @Description NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE CustomizationDocuments
    SET 
        FileName = @FileName,
        DocumentType = @DocumentType,
        Description = @Description
    WHERE DocumentId = @DocumentId;
    
    -- Return the updated document
    EXEC sp_GetCustomizationDocumentById @DocumentId;
END
GO

-- SP: Archive/Unarchive Document
CREATE PROCEDURE sp_ArchiveCustomizationDocument
    @DocumentId INT,
    @IsArchived BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE CustomizationDocuments
    SET IsArchived = @IsArchived
    WHERE DocumentId = @DocumentId;
    
    SELECT 1 AS Success;
END
GO

-- SP: Delete Document
CREATE PROCEDURE sp_DeleteCustomizationDocument
    @DocumentId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM CustomizationDocuments WHERE DocumentId = @DocumentId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- STATISTICS & REPORTING
-- =============================================

-- SP: Get Customization Summary by Client
CREATE PROCEDURE sp_GetCustomizationSummary
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COUNT(*) AS TotalCustomizations,
        SUM(CASE WHEN Status = 'active' THEN 1 ELSE 0 END) AS ActiveCustomizations,
        SUM(CASE WHEN Status = 'deprecated' THEN 1 ELSE 0 END) AS DeprecatedCustomizations,
        SUM(CASE WHEN Status = 'planned' THEN 1 ELSE 0 END) AS PlannedCustomizations,
        SUM(CASE WHEN Status = 'testing' THEN 1 ELSE 0 END) AS TestingCustomizations,
        (SELECT COUNT(*) FROM CustomizationDocuments cd 
         INNER JOIN Customizations c ON cd.CustomizationId = c.CustomizationId 
         WHERE c.ClientId = @ClientId AND cd.IsArchived = 0) AS TotalDocuments
    FROM Customizations
    WHERE ClientId = @ClientId AND IsArchived = 0;
END
GO

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample customizations for existing clients
-- DECLARE @SampleClientId INT = (SELECT TOP 1 ClientId FROM Clients);

-- IF @SampleClientId IS NOT NULL
-- BEGIN
--     EXEC sp_CreateCustomization 
--         @ClientId = @SampleClientId,
--         @Title = 'Custom Inventory Dashboard',
--         @CustomizationType = 'Custom Application',
--         @Description = 'Real-time inventory tracking dashboard with advanced analytics',
--         @Version = '2.1.0',
--         @Developer = 'John Doe',
--         @ImplementationDate = '2025-08-15',
--         @Status = 'active',
--         @TechnicalNotes = 'Built with React and Chart.js. Uses WebSocket for real-time updates.',
--         @Dependencies = 'Requires SQL Server 2019+, Node.js 18+',
--         @CodeRepository = 'https://github.com/company/inventory-dashboard',
--         @Tags = 'inventory, dashboard, real-time, analytics';
        
--     EXEC sp_CreateCustomization 
--         @ClientId = @SampleClientId,
--         @Title = 'sp_GenerateMonthlyReport',
--         @CustomizationType = 'Stored Procedure',
--         @Description = 'Generates comprehensive monthly sales and performance reports',
--         @Version = '1.5.3',
--         @Developer = 'Jane Smith',
--         @ImplementationDate = '2024-11-20',
--         @Status = 'active',
--         @TechnicalNotes = 'Runs on the 1st of each month. Outputs to ReportingDB.',
--         @Dependencies = 'Requires access to SalesDB and AnalyticsDB',
--         @Tags = 'reporting, automation, monthly';
-- END
-- GO

PRINT '✅ Phase 9: Customizations tables and stored procedures created successfully!';
GO
