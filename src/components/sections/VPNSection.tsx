import { useState, useMemo } from 'react';
import { useVPNConfigurations } from '../../hooks/useVPNConfigurations';
import { SectionContainer } from './SectionContainer';
import { ConfirmDialog } from './ConfirmDialog';
import { InlineField, InlineSelectField, InlineCheckboxField } from './InlineField';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Edit, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { validateHostnameOrIP, validatePort } from '../../lib/validation';
import type { VPNConfigurationDto } from '../../services/api';

interface VPNSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
  readOnly?: boolean;
}

type VPNFormState = {
  name: string;
  vpnType: string;
  serverAddress: string;
  port: string;
  protocol: string;
  username: string;
  password: string;
  certificatePath: string;
  configFile: string;
  isActive: boolean;
  notes: string;
};

function vpnToForm(config: VPNConfigurationDto): VPNFormState {
  return {
    name: config.name || '',
    vpnType: config.vpnType,
    serverAddress: config.serverAddress,
    port: String(config.port),
    protocol: config.protocol || '',
    username: config.username || '',
    password: config.password || '',
    certificatePath: config.certificatePath || '',
    configFile: config.configFile || '',
    isActive: config.isActive,
    notes: config.notes || '',
  };
}

function emptyVPNForm(clientId: number): VPNFormState {
  return {
    name: '',
    vpnType: 'openvpn',
    serverAddress: '',
    port: '1194',
    protocol: 'UDP',
    username: '',
    password: '',
    certificatePath: '',
    configFile: '',
    isActive: true,
    notes: '',
  };
}

const VPN_TYPES = [
  { value: 'openvpn', label: 'OpenVPN' },
  { value: 'wireguard', label: 'WireGuard' },
  { value: 'ipsec', label: 'IPSec' },
  { value: 'l2tp', label: 'L2TP' },
];

export function VPNSection({ clientId, isPinned, onTogglePin, readOnly }: VPNSectionProps) {
  const { vpnConfigs, isLoading, error, isMutating, mutationError, clearMutationError, refetch, createVPNConfig, updateVPNConfig, deleteVPNConfig } = useVPNConfigurations(clientId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<VPNFormState>(emptyVPNForm(clientId));
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const updateField = <K extends keyof VPNFormState>(key: K, value: VPNFormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    setTouched(true);
  };

  // Validation
  const validation = useMemo(() => ({
    serverAddress: validateHostnameOrIP(formState.serverAddress),
    port: validatePort(formState.port),
  }), [formState.serverAddress, formState.port]);

  const hasValidationErrors = useMemo(() => {
    if (!formState.serverAddress.trim()) return true;
    return Object.values(validation).some(v => !v.valid);
  }, [validation, formState.serverAddress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      case 'testing': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const handleStartEdit = (config: VPNConfigurationDto) => {
    setEditingId(config.vpnId);
    setFormState(vpnToForm(config));
    setIsAdding(false);
    setTouched(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormState(emptyVPNForm(clientId));
    setTouched(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormState(emptyVPNForm(clientId));
    setTouched(false);
  };

  const handleSave = async () => {
    setTouched(true);
    if (!formState.serverAddress.trim()) {
      toast.error('Server address is required');
      return;
    }
    if (hasValidationErrors) {
      toast.error('Please fix validation errors before saving');
      return;
    }
    setIsSaving(true);
    try {
      if (editingId !== null) {
        await updateVPNConfig({
          vpnId: editingId,
          clientId,
          name: formState.name || undefined,
          vpnType: formState.vpnType,
          serverAddress: formState.serverAddress,
          port: parseInt(formState.port) || 1194,
          protocol: formState.protocol || undefined,
          username: formState.username || undefined,
          password: formState.password || undefined,
          certificatePath: formState.certificatePath || undefined,
          configFile: formState.configFile || undefined,
          isActive: formState.isActive,
          notes: formState.notes || undefined,
        });
        toast.success('VPN configuration updated');
      } else {
        await createVPNConfig({
          clientId,
          name: formState.name || undefined,
          vpnType: formState.vpnType,
          serverAddress: formState.serverAddress,
          port: parseInt(formState.port) || 1194,
          protocol: formState.protocol || undefined,
          username: formState.username || undefined,
          password: formState.password || undefined,
          certificatePath: formState.certificatePath || undefined,
          configFile: formState.configFile || undefined,
          isActive: formState.isActive,
          notes: formState.notes || undefined,
        });
        toast.success('VPN configuration created');
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
      await deleteVPNConfig(id);
      toast.success('VPN configuration deleted');
    } catch {
      // error surfaced via mutationError
    } finally {
      setDeletingId(null);
    }
  };

  const renderEditForm = () => (
    <div className="p-4 border border-brand-primary/20 rounded-lg bg-white space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <InlineField label="Name" value={formState.name} onChange={v => updateField('name', v)} placeholder="VPN display name" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="VPN Type" value={formState.vpnType} onChange={v => updateField('vpnType', v)} options={VPN_TYPES} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Server Address" value={formState.serverAddress} onChange={v => updateField('serverAddress', v)} placeholder="vpn.example.com" required disabled={isSaving} error={touched ? validation.serverAddress : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Port" value={formState.port} onChange={v => updateField('port', v)} type="number" placeholder="1194" disabled={isSaving} error={touched ? validation.port : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Protocol" value={formState.protocol} onChange={v => updateField('protocol', v)} placeholder="UDP" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Username" value={formState.username} onChange={v => updateField('username', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Certificate Path" value={formState.certificatePath} onChange={v => updateField('certificatePath', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Config File" value={formState.configFile} onChange={v => updateField('configFile', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
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
      title="VPN"
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
          <Button size="sm" disabled={isMutating || isAdding} onClick={handleStartAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add VPN
          </Button>
        ) : undefined
      }
    >
      {isAdding && renderEditForm()}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !vpnConfigs || vpnConfigs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No VPN configurations yet. Click "Add VPN" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {vpnConfigs.map((config) =>
            editingId === config.vpnId ? (
              <div key={config.vpnId}>{renderEditForm()}</div>
            ) : (
              <div
                key={config.vpnId}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900">{config.name || config.serverAddress || `VPN-${config.vpnId}`}</h3>
                    <Badge variant="outline">{config.vpnType}</Badge>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(config.isActive ? 'active' : 'inactive')}`} />
                      <span className="text-sm text-gray-600">{config.isActive ? 'active' : 'inactive'}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {config.serverAddress}:{config.port}
                    {config.username && ` · User: ${config.username}`}
                    {config.protocol && ` · Protocol: ${config.protocol}`}
                  </div>
                  {config.notes && (
                    <div className="mt-1 text-sm text-gray-500">{config.notes}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!readOnly && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(config)}
                        disabled={isMutating || isAdding || editingId !== null}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete({ id: config.vpnId, name: config.name || config.serverAddress || `VPN-${config.vpnId}` })}
                        disabled={isMutating || isAdding || editingId !== null}
                      >
                        {deletingId === config.vpnId ? (
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
        title="Delete VPN Configuration"
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