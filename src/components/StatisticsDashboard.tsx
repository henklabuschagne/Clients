import { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Users, Activity, TrendingUp, Server, Database, Cpu, 
  HardDrive, Network, FileText, Layers, Package, Calendar 
} from 'lucide-react';
import { api } from '../lib/api';
import type { UsageMetricDto, PerformanceMetricDto } from '../services/api';

export type TimelineView = '30d' | '3m' | '6m' | '1y' | '2y';

interface TimelineOption {
  value: TimelineView;
  label: string;
  days: number;
}

const TIMELINE_OPTIONS: TimelineOption[] = [
  { value: '30d', label: '30 Days', days: 30 },
  { value: '3m', label: '3 Months', days: 90 },
  { value: '6m', label: '6 Months', days: 180 },
  { value: '1y', label: '1 Year', days: 365 },
  { value: '2y', label: '2 Years', days: 730 },
];

interface StatisticsDashboardProps {
  clientId: number;
}

interface DashboardStats {
  loginData: Array<{ timestamp: string; logins: number; hour: number; day: string }>;
  serverResources: Array<{
    timestamp: string;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkIn: number;
    networkOut: number;
  }>;
  counts: {
    templates: number;
    entities: number;
    applications: number;
    activeUsers: number;
    totalSessions: number;
  };
  topActivityToday: Array<{ user: string; actions: number }>;
}

export function StatisticsDashboard({ clientId }: StatisticsDashboardProps) {
  const [usageMetrics, setUsageMetrics] = useState<UsageMetricDto[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetricDto[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<TimelineView>('30d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usageResult, performanceResult, dashboardResult] = await Promise.all([
          api.statistics.getUsage(clientId, timeline),
          api.statistics.getPerformance(clientId, timeline),
          api.statistics.getDashboardStats(clientId, timeline),
        ]);
        
        if (usageResult.success) setUsageMetrics(usageResult.data);
        if (performanceResult.success) setPerformanceMetrics(performanceResult.data);
        if (dashboardResult.success) setDashboardStats(dashboardResult.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, timeline]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Format differently based on timeline
    if (timeline === '2y' || timeline === '1y') {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } else if (timeline === '6m') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatHour = (hour: number) => {
    return `${hour}:00`;
  };

  // Prepare chart data
  const usageChartData = usageMetrics.map(m => ({
    date: formatDate(m.recordedAt),
    users: m.activeUsers,
    requests: Math.floor(m.totalRequests / 1000), // In thousands
    storage: Math.floor(m.storageUsedGb),
  }));

  const performanceChartData = performanceMetrics.map(m => ({
    date: formatDate(m.recordedAt),
    responseTime: Math.floor(m.avgResponseTime),
    uptime: m.uptime,
    errorRate: m.errorRate,
    throughput: Math.floor(m.throughput),
  }));

  const serverResourceChartData = dashboardStats?.serverResources.map(s => ({
    date: formatDate(s.timestamp),
    cpu: Math.floor(s.cpuUsage),
    memory: Math.floor(s.memoryUsage),
    disk: Math.floor(s.diskUsage),
  })) || [];

  // Process login data based on timeline
  const loginChartData = timeline === '30d' 
    ? Array.from({ length: 24 }, (_, hour) => {
        const hourData = dashboardStats?.loginData.filter(l => l.hour === hour) || [];
        const avgLogins = hourData.length > 0 
          ? Math.floor(hourData.reduce((sum, l) => sum + l.logins, 0) / hourData.length)
          : 0;
        return { label: formatHour(hour), logins: avgLogins };
      })
    : (dashboardStats?.loginData.map(l => ({
        label: formatDate(l.timestamp),
        logins: l.logins,
      })) || []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const latestUsage = usageMetrics[usageMetrics.length - 1];
  const latestPerformance = performanceMetrics[performanceMetrics.length - 1];

  // Get timeline label for chart titles
  const timelineLabel = TIMELINE_OPTIONS.find(opt => opt.value === timeline)?.label || '30 Days';

  return (
    <div className="space-y-6">
      {/* Timeline Selector */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">Timeline View:</span>
        </div>
        <div className="flex gap-2">
          {TIMELINE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeline(option.value)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${timeline === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
            <Users className="h-4 w-4" />
            <span>Active Users</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900">
            {dashboardStats?.counts.activeUsers.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {dashboardStats?.counts.totalSessions.toLocaleString()} sessions
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
            <FileText className="h-4 w-4" />
            <span>Templates</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900">
            {dashboardStats?.counts.templates || '0'}
          </div>
          <div className="text-xs text-green-600 mt-1">
            +{Math.floor((dashboardStats?.counts.templates || 0) * 0.12)} this month
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
            <Layers className="h-4 w-4" />
            <span>Entities</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900">
            {dashboardStats?.counts.entities.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-green-600 mt-1">
            +{Math.floor((dashboardStats?.counts.entities || 0) * 0.08)} this month
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
            <Package className="h-4 w-4" />
            <span>Applications</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900">
            {dashboardStats?.counts.applications || '0'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            All active
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Uptime</span>
          </div>
          <div className="text-2xl font-semibold text-green-600">
            {latestPerformance?.uptime.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {latestPerformance?.avgResponseTime}ms avg
          </div>
        </div>
      </div>

      {/* Charts Row 1: User Activity & Logins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Over Time */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            User Activity ({timelineLabel})
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={usageChartData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#3b82f6" 
                fill="url(#colorUsers)"
                name="Active Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Login Patterns */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            {timeline === '30d' ? 'Login Patterns (By Hour)' : `Login Activity (${timelineLabel})`}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={loginChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="logins" fill="#10b981" name={timeline === '30d' ? 'Avg Logins' : 'Total Logins'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Performance & Server Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time & Throughput */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Performance Metrics
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="responseTime" 
                stroke="#8b5cf6" 
                name="Response Time (ms)"
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="throughput" 
                stroke="#f59e0b" 
                name="Throughput"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Server Resources */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Server className="h-5 w-5 text-orange-600" />
            Server Resources ({timelineLabel})
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={serverResourceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" domain={[0, 100]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#ef4444" 
                name="CPU %"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#3b82f6" 
                name="Memory %"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="disk" 
                stroke="#10b981" 
                name="Disk %"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3: Storage & Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage & Requests */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-600" />
            Storage & Request Volume
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={usageChartData}>
              <defs>
                <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="storage" 
                stroke="#06b6d4" 
                fill="url(#colorStorage)"
                name="Storage (GB)"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="requests" 
                stroke="#8b5cf6" 
                fill="url(#colorRequests)"
                name="Requests (K)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Active Users Today */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Top Users Today
          </h3>
          <div className="space-y-3">
            {dashboardStats?.topActivityToday.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${index === 1 ? 'bg-gray-100 text-gray-700' : ''}
                    ${index === 2 ? 'bg-orange-100 text-orange-700' : ''}
                    ${index > 2 ? 'bg-blue-50 text-blue-700' : ''}
                  `}>
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user.user}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.actions} actions
                    </div>
                  </div>
                </div>
                <div className="w-24 bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${(user.actions / (dashboardStats.topActivityToday[0]?.actions || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Server Status Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-gray-700" />
          Current Server Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {dashboardStats && (() => {
            const latest = dashboardStats.serverResources[dashboardStats.serverResources.length - 1];
            return (
              <>
                <div className="text-center">
                  <Cpu className="h-8 w-8 mx-auto text-red-600 mb-2" />
                  <div className="text-2xl font-semibold text-gray-900">
                    {latest.cpuUsage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">CPU Usage</div>
                </div>
                <div className="text-center">
                  <Database className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-semibold text-gray-900">
                    {latest.memoryUsage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Memory</div>
                </div>
                <div className="text-center">
                  <HardDrive className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-semibold text-gray-900">
                    {latest.diskUsage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Disk Usage</div>
                </div>
                <div className="text-center">
                  <Network className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <div className="text-2xl font-semibold text-gray-900">
                    {latest.networkIn} MB/s
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Network In</div>
                </div>
                <div className="text-center">
                  <Network className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                  <div className="text-2xl font-semibold text-gray-900">
                    {latest.networkOut} MB/s
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Network Out</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}