-- =============================================
-- Phase 2: Database Enhancements
-- Add missing columns identified in audit
-- Date: 2026-02-04
-- =============================================

USE ClientManagementDB;
GO

-- =============================================
-- 1. TICKETS TABLE - Add TicketNumber and DueDate
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'TicketNumber')
BEGIN
    ALTER TABLE [dbo].[Tickets]
    ADD TicketNumber NVARCHAR(50) NULL;
    
    PRINT 'Added TicketNumber column to Tickets table';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'DueDate')
BEGIN
    ALTER TABLE [dbo].[Tickets]
    ADD DueDate DATETIME2 NULL;
    
    PRINT 'Added DueDate column to Tickets table';
END
GO

-- Create unique index on TicketNumber
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tickets_TicketNumber' AND object_id = OBJECT_ID('Tickets'))
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX IX_Tickets_TicketNumber
    ON [dbo].[Tickets](TicketNumber)
    WHERE TicketNumber IS NOT NULL;
    
    PRINT 'Created unique index on TicketNumber';
END
GO

-- =============================================
-- 2. SERVERS TABLE - Add Environment
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Servers]') AND name = 'Environment')
BEGIN
    ALTER TABLE [dbo].[Servers]
    ADD Environment NVARCHAR(100) NULL;
    
    PRINT 'Added Environment column to Servers table';
END
GO

-- Add check constraint for valid environments
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Servers_Environment')
BEGIN
    ALTER TABLE [dbo].[Servers]
    ADD CONSTRAINT CK_Servers_Environment
    CHECK (Environment IN ('Production', 'Staging', 'Development', 'Testing', 'QA'));
    
    PRINT 'Added check constraint for Environment';
END
GO

-- =============================================
-- 3. VPN CONFIGURATIONS TABLE - Add Name
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[VPNConfigurations]') AND name = 'Name')
BEGIN
    ALTER TABLE [dbo].[VPNConfigurations]
    ADD Name NVARCHAR(200) NULL;
    
    PRINT 'Added Name column to VPNConfigurations table';
END
GO

-- =============================================
-- 4. UPDATES TABLE - Add Priority
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Updates]') AND name = 'Priority')
BEGIN
    ALTER TABLE [dbo].[Updates]
    ADD Priority NVARCHAR(50) NULL;
    
    PRINT 'Added Priority column to Updates table';
END
GO

-- Add check constraint for valid priorities
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Updates_Priority')
BEGIN
    ALTER TABLE [dbo].[Updates]
    ADD CONSTRAINT CK_Updates_Priority
    CHECK (Priority IN ('critical', 'high', 'medium', 'low'));
    
    PRINT 'Added check constraint for Priority';
END
GO

-- =============================================
-- 5. DATA MIGRATION - Generate TicketNumbers for existing tickets
-- =============================================
-- Generate ticket numbers for existing tickets using pattern: TICK-YYYY-NNNN
DECLARE @Year NVARCHAR(4) = CAST(YEAR(GETDATE()) AS NVARCHAR(4));
DECLARE @MaxTicketId INT;

SELECT @MaxTicketId = ISNULL(MAX(TicketId), 0) FROM Tickets;

IF @MaxTicketId > 0
BEGIN
    UPDATE Tickets
    SET TicketNumber = 'TICK-' + @Year + '-' + RIGHT('0000' + CAST(TicketId AS NVARCHAR), 4)
    WHERE TicketNumber IS NULL;
    
    PRINT 'Generated TicketNumbers for existing tickets';
END
GO

-- =============================================
-- 6. DATA MIGRATION - Set default Environment for existing servers
-- =============================================
UPDATE Servers
SET Environment = CASE 
    WHEN Location LIKE '%prod%' THEN 'Production'
    WHEN Location LIKE '%stag%' THEN 'Staging'
    WHEN Location LIKE '%dev%' THEN 'Development'
    WHEN Location LIKE '%test%' THEN 'Testing'
    ELSE 'Production'  -- Default to Production if unclear
END
WHERE Environment IS NULL;

PRINT 'Set default Environment for existing servers';
GO

-- =============================================
-- 7. DATA MIGRATION - Generate Names for existing VPN configs
-- =============================================
UPDATE VPNConfigurations
SET Name = VPNType + ' - ' + ServerAddress
WHERE Name IS NULL AND ServerAddress IS NOT NULL;

PRINT 'Generated Names for existing VPN configurations';
GO

-- =============================================
-- 8. DATA MIGRATION - Set default Priority for existing updates
-- =============================================
UPDATE Updates
SET Priority = CASE UpdateType
    WHEN 'Security' THEN 'critical'
    WHEN 'Hotfix' THEN 'high'
    WHEN 'Major' THEN 'high'
    WHEN 'Minor' THEN 'medium'
    WHEN 'Patch' THEN 'low'
    ELSE 'medium'
END
WHERE Priority IS NULL;

PRINT 'Set default Priority for existing updates';
GO

-- =============================================
-- 9. VERIFICATION - Check all columns were added
-- =============================================
PRINT '';
PRINT '========================================';
PRINT 'VERIFICATION RESULTS:';
PRINT '========================================';

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'TicketNumber')
    PRINT '✓ Tickets.TicketNumber - ADDED';
ELSE
    PRINT '✗ Tickets.TicketNumber - FAILED';

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'DueDate')
    PRINT '✓ Tickets.DueDate - ADDED';
ELSE
    PRINT '✗ Tickets.DueDate - FAILED';

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Servers]') AND name = 'Environment')
    PRINT '✓ Servers.Environment - ADDED';
ELSE
    PRINT '✗ Servers.Environment - FAILED';

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[VPNConfigurations]') AND name = 'Name')
    PRINT '✓ VPNConfigurations.Name - ADDED';
ELSE
    PRINT '✗ VPNConfigurations.Name - FAILED';

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Updates]') AND name = 'Priority')
    PRINT '✓ Updates.Priority - ADDED';
ELSE
    PRINT '✗ Updates.Priority - FAILED';

PRINT '========================================';
PRINT 'Migration Complete!';
PRINT '========================================';
GO
