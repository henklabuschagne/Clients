import { useState, useMemo } from 'react';
import { useUpdates } from '../../hooks/useUpdates';
import { SectionContainer } from './SectionContainer';
import { ConfirmDialog } from './ConfirmDialog';
import { InlineField, InlineSelectField } from './InlineField';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Edit, Calendar, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { validateVersion } from '../../lib/validation';
import { format } from 'date-fns';
import type { UpdateDto } from '../../services/api';

interface UpdateSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
  readOnly?: boolean;
}

type UpdateFormState = {
  title: string;
  description: string;
  version: string;
  updateType: string;
  priority: string;
  status: string;
  scheduledDate: string;
  rollbackPlan: string;
  notes: string;
};

function updateToForm(u: UpdateDto): UpdateFormState {
  return {
    title: u.title,
    description: u.description,
    version: u.version,
    updateType: u.updateType,
    priority: u.priority || '',
    status: u.status,
    scheduledDate: u.scheduledDate ? u.scheduledDate.substring(0, 16) : '',
    rollbackPlan: u.rollbackPlan || '',
    notes: u.notes || '',
  };
}

function emptyUpdateForm(): UpdateFormState {
  return {
    title: '',
    description: '',
    version: '',
    updateType: 'feature',
    priority: 'medium',
    status: 'scheduled',
    scheduledDate: '',
    rollbackPlan: '',
    notes: '',
  };
}

const UPDATE_TYPES = [
  { value: 'feature', label: 'Feature' },
  { value: 'bugfix', label: 'Bug Fix' },
  { value: 'security', label: 'Security' },
  { value: 'maintenance', label: 'Maintenance' },
];

const UPDATE_PRIORITIES = [
  { value: '', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const UPDATE_STATUSES = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function UpdateSection({ clientId, isPinned, onTogglePin, readOnly }: UpdateSectionProps) {
  const { updates, isLoading, error, isMutating, mutationError, clearMutationError, refetch, createUpdate, updateUpdate, deleteUpdate } = useUpdates(clientId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<UpdateFormState>(emptyUpdateForm());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const updateField = <K extends keyof UpdateFormState>(key: K, value: UpdateFormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    setTouched(true);
  };

  const validation = useMemo(() => ({
    version: validateVersion(formState.version),
  }), [formState.version]);

  const hasValidationErrors = useMemo(() => {
    if (!formState.title.trim() || !formState.version.trim()) return true;
    return Object.values(validation).some(v => !v.valid);
  }, [validation, formState.title, formState.version]);

  const getPriorityColor = (priority: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
    switch (priority) {
      case 'critical': case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const handleStartEdit = (update: UpdateDto) => {
    setEditingId(update.updateId);
    setFormState(updateToForm(update));
    setIsAdding(false);
    setTouched(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormState(emptyUpdateForm());
    setTouched(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormState(emptyUpdateForm());
    setTouched(false);
  };

  const handleSave = async () => {
    setTouched(true);
    if (!formState.title.trim() || !formState.version.trim()) {
      toast.error('Title and version are required');
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
        title: formState.title,
        description: formState.description,
        version: formState.version,
        updateType: formState.updateType,
        priority: formState.priority || undefined,
        status: formState.status,
        scheduledDate: formState.scheduledDate || undefined,
        rollbackPlan: formState.rollbackPlan || undefined,
        notes: formState.notes || undefined,
      };
      if (editingId !== null) {
        await updateUpdate({ ...payload, updateId: editingId });
        toast.success('Update entry updated');
      } else {
        await createUpdate(payload);
        toast.success('Update entry created');
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
      await deleteUpdate(id);
      toast.success('Update entry deleted');
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
        <InlineField label="Title" value={formState.title} onChange={v => updateField('title', v)} required disabled={isSaving} className="sm:col-span-2" onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Version" value={formState.version} onChange={v => updateField('version', v)} placeholder="1.0.0" required disabled={isSaving} error={touched ? validation.version : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="Type" value={formState.updateType} onChange={v => updateField('updateType', v)} options={UPDATE_TYPES} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="Priority" value={formState.priority} onChange={v => updateField('priority', v)} options={UPDATE_PRIORITIES} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="Status" value={formState.status} onChange={v => updateField('status', v)} options={UPDATE_STATUSES} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Scheduled Date" value={formState.scheduledDate} onChange={v => updateField('scheduledDate', v)} type="datetime-local" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
      </div>
      <InlineField label="Description" value={formState.description} onChange={v => updateField('description', v)} type="textarea" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
      <InlineField label="Rollback Plan" value={formState.rollbackPlan} onChange={v => updateField('rollbackPlan', v)} type="textarea" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
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
      title="Updates"
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
            Add Update
          </Button>
        ) : undefined
      }
    >
      {isAdding && renderEditForm()}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !updates || updates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No updates yet. Click "Add Update" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((update) =>
            editingId === update.updateId ? (
              <div key={update.updateId}>{renderEditForm()}</div>
            ) : (
              <div
                key={update.updateId}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm text-gray-500">{update.version}</span>
                    <h3 className="font-medium text-gray-900">{update.title}</h3>
                    {update.priority && (
                      <Badge variant={getPriorityColor(update.priority)}>
                        {update.priority}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {update.scheduledDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Scheduled: {format(new Date(update.scheduledDate), 'MMM dd, yyyy HH:mm')}
                      </div>
                    )}
                  </div>
                  {update.description && (
                    <div className="mt-1 text-sm text-gray-500">
                      {update.description.substring(0, 150)}{update.description.length > 150 ? '...' : ''}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!readOnly && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(update)}
                        disabled={isMutating || isFormOpen}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete({ id: update.updateId, name: update.title })}
                        disabled={isMutating || isFormOpen}
                      >
                        {deletingId === update.updateId ? (
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
        title="Delete Update"
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