import { useEffect, useState, useCallback } from 'react';
import { useStatisticsForSection } from '../../hooks/useStatistics';
import { SectionContainer } from './SectionContainer';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { StatisticsDashboard } from '../StatisticsDashboard';

interface StatisticsSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
}

export function StatisticsSection({ clientId, isPinned, onTogglePin }: StatisticsSectionProps) {
  const [showDashboard, setShowDashboard] = useState(true);
  const [expandTrigger, setExpandTrigger] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { 
    latestUsageMetrics, 
    latestPerformanceMetrics,
    fetchLatestUsageMetrics,
    fetchLatestPerformanceMetrics,
  } = useStatisticsForSection();

  const fetchAll = useCallback(async () => {
    setFetchError(null);
    try {
      await Promise.all([
        fetchLatestUsageMetrics(clientId),
        fetchLatestPerformanceMetrics(clientId),
      ]);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load statistics');
    }
  }, [clientId, fetchLatestUsageMetrics, fetchLatestPerformanceMetrics]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleToggleView = () => {
    setShowDashboard(!showDashboard);
    setExpandTrigger(prev => prev + 1);
  };

  return (
    <SectionContainer
      title="Statistics"
      isPinned={isPinned}
      onTogglePin={onTogglePin}
      error={fetchError}
      onRetry={fetchAll}
      expandTrigger={expandTrigger}
      actions={
        <button
          onClick={handleToggleView}
          className="text-sm text-brand-primary hover:text-brand-primary/80 flex items-center gap-1"
        >
          <BarChart3 className="h-4 w-4" />
          {showDashboard ? 'Show Summary' : 'Show Dashboard'}
        </button>
      }
    >
      {showDashboard ? (
        <StatisticsDashboard clientId={clientId} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Usage Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Usage Metrics
          </h3>
          {latestUsageMetrics ? (
            <div className="space-y-2 text-sm">
              {latestUsageMetrics.activeUsers !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users:</span>
                  <span className="font-medium">{latestUsageMetrics.activeUsers.toLocaleString()}</span>
                </div>
              )}
              {latestUsageMetrics.totalRequests !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Requests:</span>
                  <span className="font-medium">{latestUsageMetrics.totalRequests.toLocaleString()}</span>
                </div>
              )}
              {latestUsageMetrics.dataTransferMb !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Transfer:</span>
                  <span className="font-medium">{(latestUsageMetrics.dataTransferMb / 1024).toFixed(2)} GB</span>
                </div>
              )}
              {latestUsageMetrics.storageUsedGb !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Used:</span>
                  <span className="font-medium">{latestUsageMetrics.storageUsedGb.toFixed(2)} GB</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No usage data available</div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </h3>
          {latestPerformanceMetrics ? (
            <div className="space-y-2 text-sm">
              {latestPerformanceMetrics.uptime !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-medium text-green-600">
                    {latestPerformanceMetrics.uptime.toFixed(2)}%
                  </span>
                </div>
              )}
              {latestPerformanceMetrics.errorRate !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium">
                    {(100 - latestPerformanceMetrics.errorRate).toFixed(2)}%
                  </span>
                </div>
              )}
              {latestPerformanceMetrics.avgResponseTime !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response Time:</span>
                  <span className="font-medium">{latestPerformanceMetrics.avgResponseTime}ms</span>
                </div>
              )}
              {latestPerformanceMetrics.throughput !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Throughput:</span>
                  <span className="font-medium">{latestPerformanceMetrics.throughput.toLocaleString()}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No performance data available</div>
          )}
        </div>
      </div>
      )}
    </SectionContainer>
  );
}