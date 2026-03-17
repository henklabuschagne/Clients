-- =============================================
-- Phase 6: Statistics & Analytics Management
-- Database Tables and Stored Procedures
-- =============================================

USE ClientManagementDB;
GO

-- =============================================
-- TABLES
-- =============================================

-- Table: ClientStatistics
CREATE TABLE ClientStatistics (
    StatId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    MetricName NVARCHAR(100) NOT NULL,
    MetricValue DECIMAL(18,4) NOT NULL,
    MetricUnit NVARCHAR(50) NULL,
    Category NVARCHAR(50) NULL, -- 'Performance', 'Usage', 'Financial', 'Technical', 'Custom'
    RecordedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Notes NVARCHAR(MAX) NULL,
    CONSTRAINT FK_ClientStatistics_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_ClientStatistics_ClientId ON ClientStatistics(ClientId);
CREATE INDEX IX_ClientStatistics_MetricName ON ClientStatistics(MetricName);
CREATE INDEX IX_ClientStatistics_RecordedDate ON ClientStatistics(RecordedDate DESC);
CREATE INDEX IX_ClientStatistics_Category ON ClientStatistics(Category);
GO

-- Table: UsageMetrics
CREATE TABLE UsageMetrics (
    UsageId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    ActiveUsers INT NULL,
    TotalRequests BIGINT NULL,
    DataTransferGB DECIMAL(10,2) NULL,
    StorageUsedGB DECIMAL(10,2) NULL,
    ApiCalls BIGINT NULL,
    ErrorRate DECIMAL(5,2) NULL,
    AverageResponseTime INT NULL, -- in milliseconds
    PeakConcurrentUsers INT NULL,
    RecordedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_UsageMetrics_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_UsageMetrics_ClientId ON UsageMetrics(ClientId);
CREATE INDEX IX_UsageMetrics_RecordedDate ON UsageMetrics(RecordedDate DESC);
GO

-- Table: PerformanceMetrics
CREATE TABLE PerformanceMetrics (
    PerformanceId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    AvailabilityPercent DECIMAL(5,2) NULL,
    UptimeMinutes INT NULL,
    DowntimeMinutes INT NULL,
    MeanTimeToRepair INT NULL, -- in minutes
    IncidentCount INT NULL,
    SuccessRate DECIMAL(5,2) NULL,
    PageLoadTime INT NULL, -- in milliseconds
    RecordedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_PerformanceMetrics_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_PerformanceMetrics_ClientId ON PerformanceMetrics(ClientId);
CREATE INDEX IX_PerformanceMetrics_RecordedDate ON PerformanceMetrics(RecordedDate DESC);
GO

-- Table: FinancialMetrics
CREATE TABLE FinancialMetrics (
    FinancialId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    MonthlyRevenue DECIMAL(10,2) NULL,
    YearlyRevenue DECIMAL(10,2) NULL,
    ContractValue DECIMAL(10,2) NULL,
    OutstandingBalance DECIMAL(10,2) NULL,
    SupportCosts DECIMAL(10,2) NULL,
    InfrastructureCosts DECIMAL(10,2) NULL,
    ProfitMargin DECIMAL(5,2) NULL,
    RecordedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FiscalPeriod NVARCHAR(20) NULL, -- e.g., '2024-Q1', '2024-01'
    CONSTRAINT FK_FinancialMetrics_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_FinancialMetrics_ClientId ON FinancialMetrics(ClientId);
CREATE INDEX IX_FinancialMetrics_RecordedDate ON FinancialMetrics(RecordedDate DESC);
CREATE INDEX IX_FinancialMetrics_FiscalPeriod ON FinancialMetrics(FiscalPeriod);
GO

-- Table: CustomMetrics
CREATE TABLE CustomMetrics (
    CustomMetricId INT PRIMARY KEY IDENTITY(1,1),
    ClientId INT NOT NULL,
    MetricName NVARCHAR(255) NOT NULL,
    MetricValue NVARCHAR(MAX) NOT NULL,
    DataType NVARCHAR(20) NOT NULL CHECK (DataType IN ('number', 'text', 'boolean', 'date', 'json')),
    DisplayOrder INT NULL,
    IsVisible BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_CustomMetrics_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_CustomMetrics_ClientId ON CustomMetrics(ClientId);
GO

-- =============================================
-- STORED PROCEDURES - Client Statistics
-- =============================================

-- SP: Record Client Statistic
CREATE PROCEDURE sp_RecordClientStatistic
    @ClientId INT,
    @MetricName NVARCHAR(100),
    @MetricValue DECIMAL(18,4),
    @MetricUnit NVARCHAR(50) = NULL,
    @Category NVARCHAR(50) = NULL,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO ClientStatistics (ClientId, MetricName, MetricValue, MetricUnit, Category, Notes)
    VALUES (@ClientId, @MetricName, @MetricValue, @MetricUnit, @Category, @Notes);
    
    SELECT 
        StatId,
        ClientId,
        MetricName,
        MetricValue,
        MetricUnit,
        Category,
        RecordedDate,
        Notes
    FROM ClientStatistics
    WHERE StatId = SCOPE_IDENTITY();
END
GO

-- SP: Get Client Statistics
CREATE PROCEDURE sp_GetClientStatistics
    @ClientId INT,
    @MetricName NVARCHAR(100) = NULL,
    @Category NVARCHAR(50) = NULL,
    @Days INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        StatId,
        ClientId,
        MetricName,
        MetricValue,
        MetricUnit,
        Category,
        RecordedDate,
        Notes
    FROM ClientStatistics
    WHERE ClientId = @ClientId
        AND (@MetricName IS NULL OR MetricName = @MetricName)
        AND (@Category IS NULL OR Category = @Category)
        AND RecordedDate >= DATEADD(DAY, -@Days, GETUTCDATE())
    ORDER BY RecordedDate DESC;
END
GO

-- SP: Get Statistics Summary
CREATE PROCEDURE sp_GetStatisticsSummary
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        MetricName,
        Category,
        AVG(MetricValue) AS AverageValue,
        MIN(MetricValue) AS MinValue,
        MAX(MetricValue) AS MaxValue,
        COUNT(*) AS RecordCount,
        MAX(RecordedDate) AS LastRecorded
    FROM ClientStatistics
    WHERE ClientId = @ClientId
        AND RecordedDate >= DATEADD(DAY, -30, GETUTCDATE())
    GROUP BY MetricName, Category
    ORDER BY Category, MetricName;
END
GO

-- SP: Delete Old Statistics
CREATE PROCEDURE sp_DeleteOldStatistics
    @DaysToKeep INT = 365
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM ClientStatistics
    WHERE RecordedDate < DATEADD(DAY, -@DaysToKeep, GETUTCDATE());
    
    SELECT @@ROWCOUNT AS DeletedRows;
END
GO

-- =============================================
-- STORED PROCEDURES - Usage Metrics
-- =============================================

-- SP: Record Usage Metrics
CREATE PROCEDURE sp_RecordUsageMetrics
    @ClientId INT,
    @ActiveUsers INT = NULL,
    @TotalRequests BIGINT = NULL,
    @DataTransferGB DECIMAL(10,2) = NULL,
    @StorageUsedGB DECIMAL(10,2) = NULL,
    @ApiCalls BIGINT = NULL,
    @ErrorRate DECIMAL(5,2) = NULL,
    @AverageResponseTime INT = NULL,
    @PeakConcurrentUsers INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO UsageMetrics (ClientId, ActiveUsers, TotalRequests, DataTransferGB, StorageUsedGB, ApiCalls, ErrorRate, AverageResponseTime, PeakConcurrentUsers)
    VALUES (@ClientId, @ActiveUsers, @TotalRequests, @DataTransferGB, @StorageUsedGB, @ApiCalls, @ErrorRate, @AverageResponseTime, @PeakConcurrentUsers);
    
    SELECT 
        UsageId,
        ClientId,
        ActiveUsers,
        TotalRequests,
        DataTransferGB,
        StorageUsedGB,
        ApiCalls,
        ErrorRate,
        AverageResponseTime,
        PeakConcurrentUsers,
        RecordedDate
    FROM UsageMetrics
    WHERE UsageId = SCOPE_IDENTITY();
END
GO

-- SP: Get Usage Metrics
CREATE PROCEDURE sp_GetUsageMetrics
    @ClientId INT,
    @Days INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        UsageId,
        ClientId,
        ActiveUsers,
        TotalRequests,
        DataTransferGB,
        StorageUsedGB,
        ApiCalls,
        ErrorRate,
        AverageResponseTime,
        PeakConcurrentUsers,
        RecordedDate
    FROM UsageMetrics
    WHERE ClientId = @ClientId
        AND RecordedDate >= DATEADD(DAY, -@Days, GETUTCDATE())
    ORDER BY RecordedDate DESC;
END
GO

-- SP: Get Latest Usage Metrics
CREATE PROCEDURE sp_GetLatestUsageMetrics
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1
        UsageId,
        ClientId,
        ActiveUsers,
        TotalRequests,
        DataTransferGB,
        StorageUsedGB,
        ApiCalls,
        ErrorRate,
        AverageResponseTime,
        PeakConcurrentUsers,
        RecordedDate
    FROM UsageMetrics
    WHERE ClientId = @ClientId
    ORDER BY RecordedDate DESC;
END
GO

-- =============================================
-- STORED PROCEDURES - Performance Metrics
-- =============================================

-- SP: Record Performance Metrics
CREATE PROCEDURE sp_RecordPerformanceMetrics
    @ClientId INT,
    @AvailabilityPercent DECIMAL(5,2) = NULL,
    @UptimeMinutes INT = NULL,
    @DowntimeMinutes INT = NULL,
    @MeanTimeToRepair INT = NULL,
    @IncidentCount INT = NULL,
    @SuccessRate DECIMAL(5,2) = NULL,
    @PageLoadTime INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO PerformanceMetrics (ClientId, AvailabilityPercent, UptimeMinutes, DowntimeMinutes, MeanTimeToRepair, IncidentCount, SuccessRate, PageLoadTime)
    VALUES (@ClientId, @AvailabilityPercent, @UptimeMinutes, @DowntimeMinutes, @MeanTimeToRepair, @IncidentCount, @SuccessRate, @PageLoadTime);
    
    SELECT 
        PerformanceId,
        ClientId,
        AvailabilityPercent,
        UptimeMinutes,
        DowntimeMinutes,
        MeanTimeToRepair,
        IncidentCount,
        SuccessRate,
        PageLoadTime,
        RecordedDate
    FROM PerformanceMetrics
    WHERE PerformanceId = SCOPE_IDENTITY();
END
GO

-- SP: Get Performance Metrics
CREATE PROCEDURE sp_GetPerformanceMetrics
    @ClientId INT,
    @Days INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        PerformanceId,
        ClientId,
        AvailabilityPercent,
        UptimeMinutes,
        DowntimeMinutes,
        MeanTimeToRepair,
        IncidentCount,
        SuccessRate,
        PageLoadTime,
        RecordedDate
    FROM PerformanceMetrics
    WHERE ClientId = @ClientId
        AND RecordedDate >= DATEADD(DAY, -@Days, GETUTCDATE())
    ORDER BY RecordedDate DESC;
END
GO

-- SP: Get Latest Performance Metrics
CREATE PROCEDURE sp_GetLatestPerformanceMetrics
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1
        PerformanceId,
        ClientId,
        AvailabilityPercent,
        UptimeMinutes,
        DowntimeMinutes,
        MeanTimeToRepair,
        IncidentCount,
        SuccessRate,
        PageLoadTime,
        RecordedDate
    FROM PerformanceMetrics
    WHERE ClientId = @ClientId
    ORDER BY RecordedDate DESC;
END
GO

-- =============================================
-- STORED PROCEDURES - Financial Metrics
-- =============================================

-- SP: Record Financial Metrics
CREATE PROCEDURE sp_RecordFinancialMetrics
    @ClientId INT,
    @MonthlyRevenue DECIMAL(10,2) = NULL,
    @YearlyRevenue DECIMAL(10,2) = NULL,
    @ContractValue DECIMAL(10,2) = NULL,
    @OutstandingBalance DECIMAL(10,2) = NULL,
    @SupportCosts DECIMAL(10,2) = NULL,
    @InfrastructureCosts DECIMAL(10,2) = NULL,
    @ProfitMargin DECIMAL(5,2) = NULL,
    @FiscalPeriod NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO FinancialMetrics (ClientId, MonthlyRevenue, YearlyRevenue, ContractValue, OutstandingBalance, SupportCosts, InfrastructureCosts, ProfitMargin, FiscalPeriod)
    VALUES (@ClientId, @MonthlyRevenue, @YearlyRevenue, @ContractValue, @OutstandingBalance, @SupportCosts, @InfrastructureCosts, @ProfitMargin, @FiscalPeriod);
    
    SELECT 
        FinancialId,
        ClientId,
        MonthlyRevenue,
        YearlyRevenue,
        ContractValue,
        OutstandingBalance,
        SupportCosts,
        InfrastructureCosts,
        ProfitMargin,
        RecordedDate,
        FiscalPeriod
    FROM FinancialMetrics
    WHERE FinancialId = SCOPE_IDENTITY();
END
GO

-- SP: Get Financial Metrics
CREATE PROCEDURE sp_GetFinancialMetrics
    @ClientId INT,
    @Months INT = 12
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        FinancialId,
        ClientId,
        MonthlyRevenue,
        YearlyRevenue,
        ContractValue,
        OutstandingBalance,
        SupportCosts,
        InfrastructureCosts,
        ProfitMargin,
        RecordedDate,
        FiscalPeriod
    FROM FinancialMetrics
    WHERE ClientId = @ClientId
        AND RecordedDate >= DATEADD(MONTH, -@Months, GETUTCDATE())
    ORDER BY RecordedDate DESC;
END
GO

-- SP: Get Latest Financial Metrics
CREATE PROCEDURE sp_GetLatestFinancialMetrics
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1
        FinancialId,
        ClientId,
        MonthlyRevenue,
        YearlyRevenue,
        ContractValue,
        OutstandingBalance,
        SupportCosts,
        InfrastructureCosts,
        ProfitMargin,
        RecordedDate,
        FiscalPeriod
    FROM FinancialMetrics
    WHERE ClientId = @ClientId
    ORDER BY RecordedDate DESC;
END
GO

-- =============================================
-- STORED PROCEDURES - Custom Metrics
-- =============================================

-- SP: Get Custom Metrics
CREATE PROCEDURE sp_GetCustomMetrics
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        CustomMetricId,
        ClientId,
        MetricName,
        MetricValue,
        DataType,
        DisplayOrder,
        IsVisible,
        CreatedDate,
        ModifiedDate
    FROM CustomMetrics
    WHERE ClientId = @ClientId
        AND IsVisible = 1
    ORDER BY DisplayOrder, MetricName;
END
GO

-- SP: Create Custom Metric
CREATE PROCEDURE sp_CreateCustomMetric
    @ClientId INT,
    @MetricName NVARCHAR(255),
    @MetricValue NVARCHAR(MAX),
    @DataType NVARCHAR(20),
    @DisplayOrder INT = NULL,
    @IsVisible BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO CustomMetrics (ClientId, MetricName, MetricValue, DataType, DisplayOrder, IsVisible)
    VALUES (@ClientId, @MetricName, @MetricValue, @DataType, @DisplayOrder, @IsVisible);
    
    SELECT 
        CustomMetricId,
        ClientId,
        MetricName,
        MetricValue,
        DataType,
        DisplayOrder,
        IsVisible,
        CreatedDate,
        ModifiedDate
    FROM CustomMetrics
    WHERE CustomMetricId = SCOPE_IDENTITY();
END
GO

-- SP: Update Custom Metric
CREATE PROCEDURE sp_UpdateCustomMetric
    @CustomMetricId INT,
    @MetricName NVARCHAR(255),
    @MetricValue NVARCHAR(MAX),
    @DataType NVARCHAR(20),
    @DisplayOrder INT = NULL,
    @IsVisible BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE CustomMetrics
    SET 
        MetricName = @MetricName,
        MetricValue = @MetricValue,
        DataType = @DataType,
        DisplayOrder = @DisplayOrder,
        IsVisible = @IsVisible,
        ModifiedDate = GETUTCDATE()
    WHERE CustomMetricId = @CustomMetricId;
    
    SELECT 
        CustomMetricId,
        ClientId,
        MetricName,
        MetricValue,
        DataType,
        DisplayOrder,
        IsVisible,
        CreatedDate,
        ModifiedDate
    FROM CustomMetrics
    WHERE CustomMetricId = @CustomMetricId;
END
GO

-- SP: Delete Custom Metric
CREATE PROCEDURE sp_DeleteCustomMetric
    @CustomMetricId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM CustomMetrics
    WHERE CustomMetricId = @CustomMetricId;
    
    SELECT 1 AS Success;
END
GO

-- =============================================
-- SEED DATA
-- =============================================

-- Insert sample usage metrics
INSERT INTO UsageMetrics (ClientId, ActiveUsers, TotalRequests, DataTransferGB, StorageUsedGB, ApiCalls, ErrorRate, AverageResponseTime, PeakConcurrentUsers, RecordedDate)
VALUES
(1, 145, 2500000, 450.50, 120.30, 500000, 0.02, 120, 180, GETUTCDATE()),
(1, 138, 2300000, 420.30, 118.50, 480000, 0.03, 125, 175, DATEADD(DAY, -1, GETUTCDATE())),
(3, 520, 8500000, 1200.80, 580.20, 2000000, 0.01, 95, 650, GETUTCDATE()),
(4, 85, 950000, 180.40, 95.60, 200000, 0.04, 150, 110, GETUTCDATE()),
(6, 1200, 15000000, 3500.50, 2100.80, 5000000, 0.01, 80, 1500, GETUTCDATE());

-- Insert sample performance metrics
INSERT INTO PerformanceMetrics (ClientId, AvailabilityPercent, UptimeMinutes, DowntimeMinutes, MeanTimeToRepair, IncidentCount, SuccessRate, PageLoadTime, RecordedDate)
VALUES
(1, 99.95, 43190, 22, 15, 2, 99.98, 850, GETUTCDATE()),
(1, 99.92, 43170, 30, 20, 3, 99.96, 880, DATEADD(DAY, -1, GETUTCDATE())),
(3, 99.99, 43198, 2, 10, 1, 99.99, 450, GETUTCDATE()),
(4, 99.85, 43130, 70, 25, 5, 99.92, 1200, GETUTCDATE()),
(6, 99.98, 43195, 5, 12, 1, 99.99, 320, GETUTCDATE());

-- Insert sample financial metrics
INSERT INTO FinancialMetrics (ClientId, MonthlyRevenue, YearlyRevenue, ContractValue, OutstandingBalance, SupportCosts, InfrastructureCosts, ProfitMargin, FiscalPeriod, RecordedDate)
VALUES
(1, 12500.00, 150000.00, 180000.00, 2500.00, 3500.00, 4200.00, 35.50, '2024-12', GETUTCDATE()),
(3, 45000.00, 540000.00, 600000.00, 0.00, 12000.00, 18000.00, 42.30, '2024-12', GETUTCDATE()),
(4, 8500.00, 102000.00, 120000.00, 1200.00, 2500.00, 3800.00, 28.75, '2024-12', GETUTCDATE()),
(6, 95000.00, 1140000.00, 1200000.00, 0.00, 28000.00, 45000.00, 38.20, '2024-12', GETUTCDATE());

-- Insert sample custom metrics
INSERT INTO CustomMetrics (ClientId, MetricName, MetricValue, DataType, DisplayOrder, IsVisible)
VALUES
(1, 'Customer Satisfaction Score', '4.5', 'number', 1, 1),
(1, 'Last Security Audit', '2024-11-15', 'date', 2, 1),
(1, 'Compliance Status', 'Compliant', 'text', 3, 1),
(3, 'Net Promoter Score', '72', 'number', 1, 1),
(3, 'Disaster Recovery Tested', 'true', 'boolean', 2, 1),
(4, 'Innovation Index', '3.8', 'number', 1, 1),
(6, 'Cloud Maturity Level', 'Advanced', 'text', 1, 1);

-- Insert sample client statistics
INSERT INTO ClientStatistics (ClientId, MetricName, MetricValue, MetricUnit, Category, Notes, RecordedDate)
VALUES
(1, 'Average Session Duration', 420.50, 'seconds', 'Usage', NULL, GETUTCDATE()),
(1, 'Conversion Rate', 3.25, 'percent', 'Performance', NULL, GETUTCDATE()),
(1, 'CPU Utilization', 65.30, 'percent', 'Technical', NULL, GETUTCDATE()),
(3, 'Customer Churn Rate', 1.20, 'percent', 'Performance', NULL, GETUTCDATE()),
(3, 'Feature Adoption Rate', 78.50, 'percent', 'Usage', NULL, GETUTCDATE()),
(4, 'Time to First Byte', 180, 'milliseconds', 'Performance', NULL, GETUTCDATE()),
(6, 'Infrastructure Cost per User', 12.50, 'USD', 'Financial', NULL, GETUTCDATE());

GO

PRINT 'Phase 6 database setup completed successfully!';
