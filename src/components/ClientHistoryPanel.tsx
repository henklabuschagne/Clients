import { useState, useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import {
  History, Search, Filter, X, ChevronDown,
  Plus, Pencil, Trash2,
  Shield, Globe, Server, Users, Key, BarChart3,
  Ticket, RefreshCw, FileText, UserCheck, Settings, FileBox,
  Calendar,
} from 'lucide-react';
import type { AuditLogEntryDto, AuditEntityType, AuditAction } from '../services/api';

interface ClientHistoryPanelProps {
  clientId: number;
  clientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const entityConfig: Record<AuditEntityType, { label: string; icon: typeof Shield; color: string }> = {
  client:            { label: 'Client',        icon: Settings,  color: 'bg-brand-primary text-white' },
  vpn:               { label: 'VPN',           icon: Shield,    color: 'bg-indigo-100 text-indigo-700' },
  connection:        { label: 'Connection',    icon: Globe,     color: 'bg-cyan-100 text-cyan-700' },
  server:            { label: 'Server',        icon: Server,    color: 'bg-purple-100 text-purple-700' },
  contact:           { label: 'Contact',       icon: Users,     color: 'bg-blue-100 text-blue-700' },
  license:           { label: 'License',       icon: Key,       color: 'bg-amber-100 text-amber-700' },
  ticket:            { label: 'Ticket',        icon: Ticket,    color: 'bg-orange-100 text-orange-700' },
  update:            { label: 'Update',        icon: RefreshCw, color: 'bg-green-100 text-green-700' },
  note:              { label: 'Note',          icon: FileText,  color: 'bg-yellow-100 text-yellow-700' },
  responsiblePerson: { label: 'Resp. Person',  icon: UserCheck, color: 'bg-pink-100 text-pink-700' },
  customization:     { label: 'Customization', icon: Settings,  color: 'bg-teal-100 text-teal-700' },
  document:          { label: 'Document',      icon: FileBox,   color: 'bg-gray-100 text-gray-700' },
};

const actionConfig: Record<AuditAction, { label: string; icon: typeof Plus; badgeVariant: 'default' | 'secondary' | 'destructive' }> = {
  created: { label: 'Created', icon: Plus,    badgeVariant: 'default' },
  updated: { label: 'Updated', icon: Pencil,  badgeVariant: 'secondary' },
  deleted: { label: 'Deleted', icon: Trash2,  badgeVariant: 'destructive' },
};

type TimeFilter = 'all' | '7d' | '30d' | '90d' | '1y';

const timeFilters: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: '7d',  label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y',  label: '1 Year' },
];

function getTimeFilterDate(filter: TimeFilter): Date | null {
  if (filter === 'all') return null;
  const now = new Date();
  switch (filter) {
    case '7d':  return new Date(now.getTime() - 7 * 86400000);
    case '30d': return new Date(now.getTime() - 30 * 86400000);
    case '90d': return new Date(now.getTime() - 90 * 86400000);
    case '1y':  return new Date(now.getTime() - 365 * 86400000);
  }
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

function formatDateHeading(ts: string): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function groupByDate(entries: AuditLogEntryDto[]): [string, AuditLogEntryDto[]][] {
  const map = new Map<string, AuditLogEntryDto[]>();
  for (const entry of entries) {
    const dateKey = new Date(entry.timestamp).toDateString();
    const existing = map.get(dateKey) || [];
    existing.push(entry);
    map.set(dateKey, existing);
  }
  return Array.from(map.entries());
}

export function ClientHistoryPanel({ clientId, clientName, open, onOpenChange }: ClientHistoryPanelProps) {
  const { reads } = useAppStore('auditLog');
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<AuditEntityType | 'all'>('all');
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const allEntries = reads.getAuditLogByClient(clientId);

  const filteredEntries = useMemo(() => {
    let entries = allEntries;

    // Time filter
    const cutoff = getTimeFilterDate(timeFilter);
    if (cutoff) {
      entries = entries.filter(e => new Date(e.timestamp) >= cutoff);
    }

    // Entity filter
    if (entityFilter !== 'all') {
      entries = entries.filter(e => e.entityType === entityFilter);
    }

    // Action filter
    if (actionFilter !== 'all') {
      entries = entries.filter(e => e.action === actionFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(e =>
        e.summary.toLowerCase().includes(q) ||
        (e.details && e.details.toLowerCase().includes(q)) ||
        e.username.toLowerCase().includes(q)
      );
    }

    return entries;
  }, [allEntries, timeFilter, entityFilter, actionFilter, searchQuery]);

  const groupedEntries = useMemo(() => groupByDate(filteredEntries), [filteredEntries]);

  // Summary stats
  const stats = useMemo(() => {
    const entityCounts = new Map<AuditEntityType, number>();
    const actionCounts = new Map<AuditAction, number>();
    for (const e of allEntries) {
      entityCounts.set(e.entityType, (entityCounts.get(e.entityType) || 0) + 1);
      actionCounts.set(e.action, (actionCounts.get(e.action) || 0) + 1);
    }
    return { entityCounts, actionCounts, total: allEntries.length };
  }, [allEntries]);

  // Active entity types for filter options
  const activeEntityTypes = useMemo(() => {
    const types = new Set(allEntries.map(e => e.entityType));
    return Array.from(types).sort();
  }, [allEntries]);

  const clearFilters = () => {
    setSearchQuery('');
    setEntityFilter('all');
    setActionFilter('all');
    setTimeFilter('all');
  };

  const hasActiveFilters = searchQuery || entityFilter !== 'all' || actionFilter !== 'all' || timeFilter !== 'all';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[92vw] h-[90vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-primary/10">
                <History className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <DialogTitle className="text-foreground">Client History</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-0.5">{clientName} — {stats.total} total events</DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Summary Stats Bar */}
        <div className="px-6 py-3 border-b border-border bg-muted/30 shrink-0">
          <div className="flex gap-4 overflow-x-auto">
            <SummaryPill label="Total" count={stats.total} />
            {stats.actionCounts.has('created') && <SummaryPill label="Created" count={stats.actionCounts.get('created')!} color="text-brand-success" />}
            {stats.actionCounts.has('updated') && <SummaryPill label="Updated" count={stats.actionCounts.get('updated')!} color="text-brand-primary" />}
            {stats.actionCounts.has('deleted') && <SummaryPill label="Deleted" count={stats.actionCounts.get('deleted')!} color="text-brand-error" />}
            <div className="border-l border-border mx-1" />
            {activeEntityTypes.slice(0, 6).map(type => (
              <SummaryPill
                key={type}
                label={entityConfig[type].label}
                count={stats.entityCounts.get(type) || 0}
                onClick={() => setEntityFilter(entityFilter === type ? 'all' : type)}
                active={entityFilter === type}
              />
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="px-6 py-3 border-b border-border shrink-0 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary text-white text-xs">
                  !
                </span>
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0 text-muted-foreground">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Time filter */}
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mr-1">Period:</span>
                {timeFilters.map(tf => (
                  <Button
                    key={tf.value}
                    variant={timeFilter === tf.value ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => setTimeFilter(tf.value)}
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>

              <div className="border-l border-border h-5 mx-1" />

              {/* Action filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1">Action:</span>
                <Button
                  variant={actionFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setActionFilter('all')}
                >
                  All
                </Button>
                {(['created', 'updated', 'deleted'] as AuditAction[]).map(action => (
                  <Button
                    key={action}
                    variant={actionFilter === action ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => setActionFilter(action)}
                  >
                    {actionConfig[action].label}
                  </Button>
                ))}
              </div>

              <div className="border-l border-border h-5 mx-1" />

              {/* Entity type filter */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-xs text-muted-foreground mr-1">Type:</span>
                <Button
                  variant={entityFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setEntityFilter('all')}
                >
                  All
                </Button>
                {activeEntityTypes.map(type => {
                  const cfg = entityConfig[type];
                  const Icon = cfg.icon;
                  return (
                    <Button
                      key={type}
                      variant={entityFilter === type ? 'default' : 'outline'}
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => setEntityFilter(type)}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {cfg.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="px-6 py-2 text-xs text-muted-foreground shrink-0 border-b border-border">
          Showing {filteredEntries.length} of {allEntries.length} events
          {hasActiveFilters && ' (filtered)'}
        </div>

        {/* Timeline */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-16">
                <History className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  {hasActiveFilters ? 'No events match your filters.' : 'No history recorded yet.'}
                </p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={clearFilters} className="mt-2 text-brand-primary">
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {groupedEntries.map(([dateKey, entries]) => (
                  <div key={dateKey}>
                    {/* Date heading */}
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-2 mb-3">
                      <h3 className="text-xs text-muted-foreground tracking-wide uppercase">
                        {formatDateHeading(entries[0].timestamp)}
                      </h3>
                      <div className="h-px bg-border mt-1.5" />
                    </div>

                    {/* Events for this date */}
                    <div className="relative ml-4 pl-6 border-l-2 border-border space-y-1">
                      {entries.map(entry => (
                        <TimelineEntry key={entry.auditId} entry={entry} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function TimelineEntry({ entry }: { entry: AuditLogEntryDto }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = entityConfig[entry.entityType];
  const actCfg = actionConfig[entry.action];
  const Icon = cfg.icon;
  const ActionIcon = actCfg.icon;

  return (
    <div
      className="relative group -ml-[31px] flex gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Timeline dot */}
      <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${cfg.color} ring-4 ring-background`}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start gap-2">
          <p className="text-sm text-foreground flex-1 min-w-0">
            {entry.summary}
          </p>
          <Badge variant={actCfg.badgeVariant} className="shrink-0 text-xs gap-1">
            <ActionIcon className="h-3 w-3" />
            {actCfg.label}
          </Badge>
        </div>

        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{formatTimestamp(entry.timestamp)}</span>
          <span>•</span>
          <span>by <span className="text-foreground/70">{entry.username}</span></span>
          {entry.details && (
            <>
              <span>•</span>
              <button
                className="flex items-center gap-0.5 text-brand-primary hover:underline"
                onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
              >
                Details
                <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </>
          )}
        </div>

        {/* Expanded details */}
        {expanded && (entry.details || entry.changedFields) && (
          <div className="mt-2 p-3 bg-muted/60 rounded-md border border-border text-xs space-y-1.5">
            {entry.details && (
              <p className="text-muted-foreground">{entry.details}</p>
            )}
            {entry.changedFields && entry.changedFields.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-muted-foreground">Changed:</span>
                {entry.changedFields.map(field => (
                  <Badge key={field} variant="outline" className="text-xs h-5">
                    {field}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  count,
  color,
  onClick,
  active,
}: {
  label: string;
  count: number;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const baseClass = `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
    onClick ? 'cursor-pointer hover:bg-muted' : ''
  } ${active ? 'bg-brand-primary/10 ring-1 ring-brand-primary/30' : ''}`;

  return (
    <button className={baseClass} onClick={onClick} disabled={!onClick}>
      <span className={`tabular-nums ${color || 'text-foreground'}`}>{count}</span>
      <span className="text-muted-foreground">{label}</span>
    </button>
  );
}