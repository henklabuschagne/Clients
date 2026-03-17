import { useState, useMemo } from 'react';
import { useServers } from '../../hooks/useServers';
import { SectionContainer } from './SectionContainer';
import { ConfirmDialog } from './ConfirmDialog';
import { InlineField, InlineSelectField, InlineCheckboxField } from './InlineField';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Edit, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { validateIPAddress } from '../../lib/validation';
import type { ServerDto } from '../../services/api';

interface ServerSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
  readOnly?: boolean;
}

type ServerFormState = {
  serverName: string;
  serverType: string;
  environment: string;
  ipAddress: string;
  hostname: string;
  operatingSystem: string;
  cpuCores: string;
  ramGb: string;
  diskGb: string;
  location: string;
  provider: string;
  isActive: boolean;
  notes: string;
};

function serverToForm(s: ServerDto): ServerFormState {
  return {
    serverName: s.serverName,
    serverType: s.serverType,
    environment: s.environment || '',
    ipAddress: s.ipAddress,
    hostname: s.hostname || '',
    operatingSystem: s.operatingSystem || '',
    cpuCores: s.cpuCores ? String(s.cpuCores) : '',
    ramGb: s.ramGb ? String(s.ramGb) : '',
    diskGb: s.diskGb ? String(s.diskGb) : '',
    location: s.location || '',
    provider: s.provider || '',
    isActive: s.isActive,
    notes: s.notes || '',
  };
}

function emptyServerForm(): ServerFormState {
  return {
    serverName: '',
    serverType: 'web',
    environment: 'Production',
    ipAddress: '',
    hostname: '',
    operatingSystem: '',
    cpuCores: '',
    ramGb: '',
    diskGb: '',
    location: '',
    provider: '',
    isActive: true,
    notes: '',
  };
}

const SERVER_TYPES = [
  { value: 'web', label: 'Web' },
  { value: 'database', label: 'Database' },
  { value: 'application', label: 'Application' },
  { value: 'mail', label: 'Mail' },
  { value: 'file', label: 'File' },
  { value: 'backup', label: 'Backup' },
];

const ENVIRONMENTS = [
  { value: '', label: 'None' },
  { value: 'Production', label: 'Production' },
  { value: 'Staging', label: 'Staging' },
  { value: 'Development', label: 'Development' },
  { value: 'Testing', label: 'Testing' },
  { value: 'QA', label: 'QA' },
];

export function ServerSection({ clientId, isPinned, onTogglePin, readOnly }: ServerSectionProps) {
  const { servers, isLoading, error, isMutating, mutationError, clearMutationError, refetch, createServer, updateServer, deleteServer } = useServers(clientId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<ServerFormState>(emptyServerForm());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const updateField = <K extends keyof ServerFormState>(key: K, value: ServerFormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    setTouched(true);
  };

  const validation = useMemo(() => ({
    ipAddress: validateIPAddress(formState.ipAddress),
  }), [formState.ipAddress]);

  const hasValidationErrors = useMemo(() => {
    if (!formState.serverName.trim() || !formState.ipAddress.trim()) return true;
    return Object.values(validation).some(v => !v.valid);
  }, [validation, formState.serverName, formState.ipAddress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      case 'maintenance': return 'bg-yellow-500';
      case 'decommissioned': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'Production': return 'destructive';
      case 'Staging': return 'secondary';
      case 'Development': return 'outline';
      default: return 'outline';
    }
  };

  const handleStartEdit = (server: ServerDto) => {
    setEditingId(server.serverId);
    setFormState(serverToForm(server));
    setIsAdding(false);
    setTouched(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormState(emptyServerForm());
    setTouched(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormState(emptyServerForm());
    setTouched(false);
  };

  const handleSave = async () => {
    setTouched(true);
    if (!formState.serverName.trim() || !formState.ipAddress.trim()) {
      toast.error('Server name and IP address are required');
      return;
    }
    if (hasValidationErrors) {
      toast.error('Please fix validation errors before saving');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        clientId,
        serverName: formState.serverName,
        serverType: formState.serverType,
        environment: formState.environment || undefined,
        ipAddress: formState.ipAddress,
        hostname: formState.hostname || undefined,
        operatingSystem: formState.operatingSystem || undefined,
        cpuCores: formState.cpuCores ? parseInt(formState.cpuCores) : undefined,
        ramGb: formState.ramGb ? parseInt(formState.ramGb) : undefined,
        diskGb: formState.diskGb ? parseInt(formState.diskGb) : undefined,
        location: formState.location || undefined,
        provider: formState.provider || undefined,
        isActive: formState.isActive,
        notes: formState.notes || undefined,
      };
      if (editingId !== null) {
        await updateServer({ ...payload, serverId: editingId });
        toast.success('Server updated');
      } else {
        await createServer(payload);
        toast.success('Server created');
      }
      handleCancelEdit();
    } catch {
      // error surfaced via mutationError
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteServer(id);
      toast.success('Server deleted');
    } catch {
      // error surfaced via mutationError
    } finally {
      setDeletingId(null);
    }
  };

  const isFormOpen = isAdding || editingId !== null;

  const renderEditForm = () => (
    <div className="p-4 border border-brand-primary/20 rounded-lg bg-white space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <InlineField label="Server Name" value={formState.serverName} onChange={v => updateField('serverName', v)} placeholder="web-prod-01" required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="Type" value={formState.serverType} onChange={v => updateField('serverType', v)} options={SERVER_TYPES} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="Environment" value={formState.environment} onChange={v => updateField('environment', v)} options={ENVIRONMENTS} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="IP Address" value={formState.ipAddress} onChange={v => updateField('ipAddress', v)} placeholder="192.168.1.1" required disabled={isSaving} error={touched ? validation.ipAddress : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Hostname" value={formState.hostname} onChange={v => updateField('hostname', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Operating System" value={formState.operatingSystem} onChange={v => updateField('operatingSystem', v)} placeholder="Ubuntu 22.04" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="CPU Cores" value={formState.cpuCores} onChange={v => updateField('cpuCores', v)} type="number" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="RAM (GB)" value={formState.ramGb} onChange={v => updateField('ramGb', v)} type="number" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Disk (GB)" value={formState.diskGb} onChange={v => updateField('diskGb', v)} type="number" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Location" value={formState.location} onChange={v => updateField('location', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Provider" value={formState.provider} onChange={v => updateField('provider', v)} placeholder="AWS, Azure, etc." disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineCheckboxField label="Active" checked={formState.isActive} onChange={v => updateField('isActive', v)} disabled={isSaving} className="self-end pb-1" onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
      </div>
      <InlineField label="Notes" value={formState.notes} onChange={v => updateField('notes', v)} type="textarea" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
      <div className="flex items-center justify-end gap-2 pt-1">
        <span className="text-xs text-gray-400 mr-auto hidden sm:inline">Esc to cancel · Ctrl+Enter to save</span>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
          <X className="h-4 w-4 mr-2" />Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <SectionContainer
      title="Servers"
      isPinned={isPinned}
      onTogglePin={onTogglePin}
      forceExpanded={isAdding || editingId !== null}
      error={error}
      onRetry={refetch}
      mutationError={mutationError}
      onDismissMutationError={clearMutationError}
      isMutating={isMutating}
      actions={
        !readOnly ? (
          <Button size="sm" disabled={isMutating || isFormOpen} onClick={handleStartAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Server
          </Button>
        ) : undefined
      }
    >
      {isAdding && renderEditForm()}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !servers || servers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No servers yet. Click "Add Server" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {servers.map((server) =>
            editingId === server.serverId ? (
              <div key={server.serverId}>{renderEditForm()}</div>
            ) : (
              <div
                key={server.serverId}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-medium text-gray-900">{server.serverName}</h3>
                    <Badge variant="outline">{server.serverType}</Badge>
                    {server.environment && (
                      <Badge variant={getEnvironmentColor(server.environment)}>
                        {server.environment}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(server.isActive && server.healthStatus === 'healthy' ? 'active' : 'inactive')}`} />
                      <span className="text-sm text-gray-600">
                        {server.isActive ? (server.healthStatus || 'active') : 'inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-600 space-y-1">
                    <div>
                      {server.ipAddress && `${server.ipAddress}`}
                      {server.hostname && ` · ${server.hostname}`}
                      {server.operatingSystem && ` · ${server.operatingSystem}`}
                    </div>
                    {(server.cpuCores || server.ramGb || server.diskGb) && (
                      <div className="flex items-center gap-3 text-xs">
                        {server.cpuCores && <span>CPU: {server.cpuCores} cores</span>}
                        {server.ramGb && <span>RAM: {server.ramGb}GB</span>}
                        {server.diskGb && <span>Storage: {server.diskGb}GB</span>}
                      </div>
                    )}
                  </div>
                  {server.notes && (
                    <div className="mt-1 text-sm text-gray-500">{server.notes}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!readOnly && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(server)}
                        disabled={isMutating || isFormOpen}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete({ id: server.serverId, name: server.serverName })}
                        disabled={isMutating || isFormOpen}
                      >
                        {deletingId === server.serverId ? (
                          <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}
        title="Delete Server"
        description={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (confirmDelete) {
            handleDelete(confirmDelete.id);
            setConfirmDelete(null);
          }
        }}
      />
    </SectionContainer>
  );
}