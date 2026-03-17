-- ===========================
-- Additional Stored Procedures for Complete Coverage
-- ===========================

USE ClientManagementDB;
GO

-- ===========================
-- STATISTICS STORED PROCEDURES
-- ===========================

-- SP: Create Statistic
CREATE OR ALTER PROCEDURE sp_CreateStatistic
    @ClientId INT,
    @MetricName NVARCHAR(200),
    @MetricValue DECIMAL(18,4),
    @Unit NVARCHAR(50) = NULL,
    @Category NVARCHAR(100) = NULL,
    @RecordedAt DATETIME2 = NULL,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @RecordedAt IS NULL
        SET @RecordedAt = GETUTCDATE();
    
    INSERT INTO Statistics (ClientId, MetricName, MetricValue, Unit, Category, RecordedAt, Notes)
    VALUES (@ClientId, @MetricName, @MetricValue, @Unit, @Category, @RecordedAt, @Notes);
    
    SELECT SCOPE_IDENTITY() AS StatisticId;
END
GO

-- SP: Get Performance Metrics By Client
CREATE OR ALTER PROCEDURE sp_GetPerformanceMetricsByClient
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT PerformanceId, ClientId, AvgResponseTime, ErrorRate, Uptime, Throughput, RecordedAt
    FROM PerformanceMetrics
    WHERE ClientId = @ClientId
    ORDER BY RecordedAt DESC;
END
GO

-- SP: Create Performance Metric
CREATE OR ALTER PROCEDURE sp_CreatePerformanceMetric
    @ClientId INT,
    @AvgResponseTime INT = NULL,
    @ErrorRate DECIMAL(5,2) = NULL,
    @Uptime DECIMAL(5,2) = NULL,
    @Throughput INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO PerformanceMetrics (ClientId, AvgResponseTime, ErrorRate, Uptime, Throughput)
    VALUES (@ClientId, @AvgResponseTime, @ErrorRate, @Uptime, @Throughput);
    
    SELECT SCOPE_IDENTITY() AS PerformanceId;
END
GO

-- SP: Get Financial Metrics By Client
CREATE OR ALTER PROCEDURE sp_GetFinancialMetricsByClient
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT FinancialId, ClientId, Revenue, Cost, Profit, Currency, Period, RecordedAt
    FROM FinancialMetrics
    WHERE ClientId = @ClientId
    ORDER BY RecordedAt DESC;
END
GO

-- SP: Create Financial Metric
CREATE OR ALTER PROCEDURE sp_CreateFinancialMetric
    @ClientId INT,
    @Revenue DECIMAL(18,2) = NULL,
    @Cost DECIMAL(18,2) = NULL,
    @Profit DECIMAL(18,2) = NULL,
    @Currency NVARCHAR(10) = NULL,
    @Period NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO FinancialMetrics (ClientId, Revenue, Cost, Profit, Currency, Period)
    VALUES (@ClientId, @Revenue, @Cost, @Profit, @Currency, @Period);
    
    SELECT SCOPE_IDENTITY() AS FinancialId;
END
GO

-- SP: Create Usage Metric
CREATE OR ALTER PROCEDURE sp_CreateUsageMetric
    @ClientId INT,
    @ActiveUsers INT = NULL,
    @TotalRequests BIGINT = NULL,
    @DataTransferMB BIGINT = NULL,
    @StorageUsedGB INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO UsageMetrics (ClientId, ActiveUsers, TotalRequests, DataTransferMB, StorageUsedGB)
    VALUES (@ClientId, @ActiveUsers, @TotalRequests, @DataTransferMB, @StorageUsedGB);
    
    SELECT SCOPE_IDENTITY() AS UsageId;
END
GO

PRINT 'Additional Statistics Stored Procedures Created Successfully!';
GO
