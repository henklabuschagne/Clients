import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { UsageMetricDto, PerformanceMetricDto, FinancialMetricDto } from '../../services/api';

// Statistics are generated dynamically (not stored in appStore) since they're time-series data

const timelineMap: Record<string, number> = {
  '30d': 30, '3m': 90, '6m': 180, '1y': 365, '2y': 730,
};

const timelineMonthsMap: Record<string, number> = {
  '30d': 1, '3m': 3, '6m': 6, '1y': 12, '2y': 24,
};

export async function getUsage(clientId: number, timeline?: string): Promise<ApiResult<UsageMetricDto[]>> {
  return mockApiCall(() => {
    const days = timeline ? (timelineMap[timeline] || 30) : 30;
    const metrics: UsageMetricDto[] = [];
    const now = new Date();
    const interval = days > 180 ? Math.ceil(days / 60) : days > 90 ? Math.ceil(days / 45) : 1;

    for (let i = days - 1; i >= 0; i -= interval) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const baseUsers = 120 + Math.floor(Math.random() * 60);
      const weekendFactor = [0, 6].includes(date.getDay()) ? 0.6 : 1;

      metrics.push({
        usageId: (days - i),
        clientId,
        activeUsers: Math.floor(baseUsers * weekendFactor),
        totalRequests: Math.floor((40000 + Math.random() * 20000) * weekendFactor),
        dataTransferMb: Math.floor((2000 + Math.random() * 1500) * weekendFactor),
        storageUsedGb: 120 + (days - i) * 0.5,
        recordedAt: date.toISOString(),
      });
    }
    return metrics;
  });
}

export async function getPerformance(clientId: number, timeline?: string): Promise<ApiResult<PerformanceMetricDto[]>> {
  return mockApiCall(() => {
    const days = timeline ? (timelineMap[timeline] || 30) : 30;
    const metrics: PerformanceMetricDto[] = [];
    const now = new Date();
    const interval = days > 180 ? Math.ceil(days / 60) : days > 90 ? Math.ceil(days / 45) : 1;

    for (let i = days - 1; i >= 0; i -= interval) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const spike = Math.random() > 0.9;

      metrics.push({
        performanceId: (days - i),
        clientId,
        avgResponseTime: spike ? 250 + Math.random() * 200 : 80 + Math.random() * 80,
        errorRate: spike ? 1.5 + Math.random() * 2 : 0.1 + Math.random() * 0.8,
        uptime: spike ? 98.5 + Math.random() * 1 : 99.5 + Math.random() * 0.5,
        throughput: Math.floor(1200 + Math.random() * 600),
        recordedAt: date.toISOString(),
      });
    }
    return metrics;
  });
}

export async function getFinancial(clientId: number, timeline?: string): Promise<ApiResult<FinancialMetricDto[]>> {
  return mockApiCall(() => {
    const months = timeline ? (timelineMonthsMap[timeline] || 12) : 12;
    const metrics: FinancialMetricDto[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const revenue = 50000 + Math.random() * 20000;
      const cost = 25000 + Math.random() * 10000;

      metrics.push({
        financialId: (months - i),
        clientId,
        revenue: Math.floor(revenue),
        cost: Math.floor(cost),
        profit: Math.floor(revenue - cost),
        period: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        recordedAt: date.toISOString(),
      });
    }
    return metrics;
  });
}

export async function getDashboardStats(clientId: number, timeline?: string): Promise<ApiResult<any>> {
  return mockApiCall(() => {
    const days = timeline ? (timelineMap[timeline] || 30) : 30;
    const now = new Date();
    const loginData: any[] = [];
    const serverResourceData: any[] = [];

    if (days <= 30) {
      for (let day = Math.min(days - 1, 6); day >= 0; day--) {
        for (let hour = 0; hour < 24; hour++) {
          const date = new Date(now);
          date.setDate(date.getDate() - day);
          date.setHours(hour, 0, 0, 0);
          const isPeak = hour >= 8 && hour <= 18;
          const baseLogins = isPeak ? 20 : 5;
          loginData.push({
            timestamp: date.toISOString(),
            logins: Math.floor(baseLogins + Math.random() * (isPeak ? 15 : 5)),
            hour,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          });
        }
      }
    } else {
      const loginInterval = days > 180 ? Math.ceil(days / 60) : days > 90 ? Math.ceil(days / 45) : 1;
      for (let i = days - 1; i >= 0; i -= loginInterval) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const isWeekend = [0, 6].includes(date.getDay());
        const baseLogins = isWeekend ? 150 : 350;
        loginData.push({
          timestamp: date.toISOString(),
          logins: Math.floor(baseLogins + Math.random() * (isWeekend ? 100 : 200)),
          hour: 0,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        });
      }
    }

    const resourceInterval = days > 180 ? Math.ceil(days / 60) : days > 90 ? Math.ceil(days / 45) : 1;
    for (let i = days - 1; i >= 0; i -= resourceInterval) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      serverResourceData.push({
        timestamp: date.toISOString(),
        cpuUsage: 30 + Math.random() * 40,
        memoryUsage: 50 + Math.random() * 30,
        diskUsage: 60 + (days - i) * 0.015,
        networkIn: Math.floor(100 + Math.random() * 200),
        networkOut: Math.floor(80 + Math.random() * 150),
      });
    }

    return {
      loginData: loginData.slice(-168),
      serverResources: serverResourceData,
      counts: {
        templates: Math.floor(45 + Math.random() * 15),
        entities: Math.floor(320 + Math.random() * 80),
        applications: Math.floor(12 + Math.random() * 6),
        activeUsers: Math.floor(150 + Math.random() * 50),
        totalSessions: Math.floor(8500 + Math.random() * 2000),
      },
      topActivityToday: [
        { user: 'john.doe@example.com', actions: Math.floor(120 + Math.random() * 80) },
        { user: 'jane.smith@example.com', actions: Math.floor(100 + Math.random() * 70) },
        { user: 'bob.wilson@example.com', actions: Math.floor(80 + Math.random() * 60) },
        { user: 'alice.brown@example.com', actions: Math.floor(70 + Math.random() * 50) },
        { user: 'charlie.davis@example.com', actions: Math.floor(60 + Math.random() * 40) },
      ],
    };
  });
}
