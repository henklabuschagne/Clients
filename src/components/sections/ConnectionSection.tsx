import { useState, useMemo } from 'react';
import { useConnections } from '../../hooks/useConnections';
import { SectionContainer } from './SectionContainer';
import { ConfirmDialog } from './ConfirmDialog';
import { InlineField, InlineSelectField, InlineCheckboxField } from './InlineField';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Edit, Play, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { validateHostnameOrIP, validatePort } from '../../lib/validation';
import type { ConnectionDto } from '../../services/api';

interface ConnectionSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
  readOnly?: boolean;
}

type ConnectionFormState = {
  name: string;
  connectionType: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  connectionString: string;
  isActive: boolean;
  notes: string;
};

function connToForm(c: ConnectionDto): ConnectionFormState {
  return {
    name: c.name,
    connectionType: c.connectionType,
    host: c.host,
    port: String(c.port),
    database: c.database || '',
    username: c.username || '',
    password: c.password || '',
    connectionString: c.connectionString || '',
    isActive: c.isActive,
    notes: c.notes || '',
  };
}

function emptyConnForm(): ConnectionFormState {
  return {
    name: '',
    connectionType: 'database',
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: '',
    connectionString: '',
    isActive: true,
    notes: '',
  };
}

const CONN_TYPES = [
  { value: 'database', label: 'Database' },
  { value: 'api', label: 'API' },
  { value: 'ftp', label: 'FTP' },
  { value: 'ssh', label: 'SSH' },
  { value: 'rdp', label: 'RDP' },
  { value: 'other', label: 'Other' },
];

export function ConnectionSection({ clientId, isPinned, onTogglePin, readOnly }: ConnectionSectionProps) {
  const { connections, isLoading, error, isMutating, mutationError, clearMutationError, refetch, createConnection, updateConnection, deleteConnection, testConnection } = useConnections(clientId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<ConnectionFormState>(emptyConnForm());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [testingId, setTestingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const updateField = <K extends keyof ConnectionFormState>(key: K, value: ConnectionFormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    setTouched(true);
  };

  const validation = useMemo(() => ({
    host: validateHostnameOrIP(formState.host),
    port: validatePort(formState.port),
  }), [formState.host, formState.port]);

  const hasValidationErrors = useMemo(() => {
    if (!formState.name.trim() || !formState.host.trim()) return true;
    return Object.values(validation).some(v => !v.valid);
  }, [validation, formState.name, formState.host]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      case 'testing': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getTestResultColor = (result?: string) => {
    switch (result) {
      case 'success': return 'text-green-600';
      case 'failure': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const handleStartEdit = (conn: ConnectionDto) => {
    setEditingId(conn.connectionId);
    setFormState(connToForm(conn));
    setIsAdding(false);
    setTouched(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormState(emptyConnForm());
    setTouched(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormState(emptyConnForm());
    setTouched(false);
  };

  const handleSave = async () => {
    setTouched(true);
    if (!formState.name.trim() || !formState.host.trim()) {
      toast.error('Name and host are required');
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
        name: formState.name,
        connectionType: formState.connectionType,
        host: formState.host,
        port: parseInt(formState.port) || 5432,
        database: formState.database || undefined,
        username: formState.username || undefined,
        password: formState.password || undefined,
        connectionString: formState.connectionString || undefined,
        isActive: formState.isActive,
        notes: formState.notes || undefined,
      };
      if (editingId !== null) {
        await updateConnection({ ...payload, connectionId: editingId });
        toast.success('Connection updated');
      } else {
        await createConnection(payload);
        toast.success('Connection created');
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
      await deleteConnection(id);
      toast.success('Connection deleted');
    } catch {
      // error surfaced via mutationError
    } finally {
      setDeletingId(null);
    }
  };

  const handleTest = async (id: number) => {
    setTestingId(id);
    try {
      await testConnection(id);
      toast.success('Connection test completed');
    } catch {
      // error surfaced via mutationError
    } finally {
      setTestingId(null);
    }
  };

  const isFormOpen = isAdding || editingId !== null;

  const renderEditForm = () => (
    <div className="p-4 border border-brand-primary/20 rounded-lg bg-white space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <InlineField label="Name" value={formState.name} onChange={v => updateField('name', v)} placeholder="Connection name" required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="Type" value={formState.connectionType} onChange={v => updateField('connectionType', v)} options={CONN_TYPES} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Host" value={formState.host} onChange={v => updateField('host', v)} placeholder="hostname or IP" required disabled={isSaving} error={touched ? validation.host : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Port" value={formState.port} onChange={v => updateField('port', v)} type="number" placeholder="5432" disabled={isSaving} error={touched ? validation.port : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Database" value={formState.database} onChange={v => updateField('database', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Username" value={formState.username} onChange={v => updateField('username', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Connection String" value={formState.connectionString} onChange={v => updateField('connectionString', v)} className="sm:col-span-2" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
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
      title="Connection"
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
            Add Connection
          </Button>
        ) : undefined
      }
    >
      {isAdding && renderEditForm()}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !connections || connections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No connections yet. Click "Add Connection" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((connection) =>
            editingId === connection.connectionId ? (
              <div key={connection.connectionId}>{renderEditForm()}</div>
            ) : (
              <div
                key={connection.connectionId}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900">{connection.name}</h3>
                    <Badge variant="outline">{connection.connectionType}</Badge>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(connection.isActive ? 'active' : 'inactive')}`} />
                      <span className="text-sm text-gray-600">{connection.isActive ? 'active' : 'inactive'}</span>
                    </div>
                    {connection.testStatus && (
                      <span className={`text-sm ${getTestResultColor(connection.testStatus)}`}>
                        {connection.testStatus}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {connection.host}
                    {connection.port && `:${connection.port}`}
                    {connection.database && ` · DB: ${connection.database}`}
                  </div>
                  {connection.notes && (
                    <div className="mt-1 text-sm text-gray-500">{connection.notes}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTest(connection.connectionId)}
                    disabled={isMutating || isFormOpen}
                  >
                    {testingId === connection.connectionId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  {!readOnly && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(connection)}
                        disabled={isMutating || isFormOpen}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete({ id: connection.connectionId, name: connection.name })}
                        disabled={isMutating || isFormOpen}
                      >
                        {deletingId === connection.connectionId ? (
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
        title="Delete Connection"
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