import { useState, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker } from './useApi';
import type { UsageMetricDto, PerformanceMetricDto, FinancialMetricDto } from '../services/api';

export function useStatistics(clientId: number) {
  const { actions } = useAppStore();

  return {
    statistics: [],
    isLoading: false,
    error: null,
    refetch: () => {},
    createStatistic: async () => {},
  };
}

export function useUsageMetrics(clientId: number) {
  const [metrics, setMetrics] = useState<UsageMetricDto[]>([]);
  const { actions } = useAppStore();
  const { loading, error, track } = useAsyncTracker();

  const fetchMetrics = useCallback(async () => {
    if (!clientId) return;
    const result = await track(() => actions.getUsage(clientId));
    if (result.success) setMetrics(result.data);
  }, [clientId, actions, track]);

  return { metrics, isLoading: loading, error, refetch: fetchMetrics };
}

export function usePerformanceMetrics(clientId: number) {
  const [metrics, setMetrics] = useState<PerformanceMetricDto[]>([]);
  const { actions } = useAppStore();
  const { loading, error, track } = useAsyncTracker();

  const fetchMetrics = useCallback(async () => {
    if (!clientId) return;
    const result = await track(() => actions.getPerformance(clientId));
    if (result.success) setMetrics(result.data);
  }, [clientId, actions, track]);

  return { metrics, isLoading: loading, error, refetch: fetchMetrics };
}

export function useFinancialMetrics(clientId: number) {
  const [metrics, setMetrics] = useState<FinancialMetricDto[]>([]);
  const { actions } = useAppStore();
  const { loading, error, track } = useAsyncTracker();

  const fetchMetrics = useCallback(async () => {
    if (!clientId) return;
    const result = await track(() => actions.getFinancial(clientId));
    if (result.success) setMetrics(result.data);
  }, [clientId, actions, track]);

  return { metrics, isLoading: loading, error, refetch: fetchMetrics };
}

// Combined hook for statistics section that fetches latest metrics
export function useStatisticsForSection() {
  const [latestUsageMetrics, setLatestUsageMetrics] = useState<UsageMetricDto | null>(null);
  const [latestPerformanceMetrics, setLatestPerformanceMetrics] = useState<PerformanceMetricDto | null>(null);
  const [latestFinancialMetrics, setLatestFinancialMetrics] = useState<FinancialMetricDto | null>(null);
  const { actions } = useAppStore();

  const fetchLatestUsageMetrics = useCallback(async (clientId: number) => {
    if (!clientId) return;
    const result = await actions.getUsage(clientId);
    if (result.success && result.data.length > 0) {
      setLatestUsageMetrics(result.data[0]);
    }
  }, [actions]);

  const fetchLatestPerformanceMetrics = useCallback(async (clientId: number) => {
    if (!clientId) return;
    const result = await actions.getPerformance(clientId);
    if (result.success && result.data.length > 0) {
      setLatestPerformanceMetrics(result.data[0]);
    }
  }, [actions]);

  const fetchLatestFinancialMetrics = useCallback(async (clientId: number) => {
    if (!clientId) return;
    const result = await actions.getFinancial(clientId);
    if (result.success && result.data.length > 0) {
      setLatestFinancialMetrics(result.data[0]);
    }
  }, [actions]);

  return {
    latestUsageMetrics,
    latestPerformanceMetrics,
    latestFinancialMetrics,
    fetchLatestUsageMetrics,
    fetchLatestPerformanceMetrics,
    fetchLatestFinancialMetrics,
  };
}
