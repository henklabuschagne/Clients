import { useState, useMemo } from 'react';
import { useResponsiblePersons } from '../../hooks/useResponsiblePersons';
import { SectionContainer } from './SectionContainer';
import { ConfirmDialog } from './ConfirmDialog';
import { InlineField, InlineSelectField } from './InlineField';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Edit, Mail, Check, X, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { validateEmail } from '../../lib/validation';
import type { ResponsiblePersonDto } from '../../services/api';

interface ResponsiblePersonsSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
  readOnly?: boolean;
}

type FormState = {
  name: string;
  email: string;
  role: 'reporting_specialist' | 'reporting_consultant';
  priority: string;
  notes: string;
  isActive: boolean;
};

const roleLabels: Record<string, string> = {
  reporting_specialist: 'Reporting Specialist',
  reporting_consultant: 'Reporting Consultant',
};

const roleShortLabels: Record<string, string> = {
  reporting_specialist: 'RS',
  reporting_consultant: 'RC',
};

function personToForm(p: ResponsiblePersonDto): FormState {
  return {
    name: p.name,
    email: p.email || '',
    role: p.role,
    priority: String(p.priority),
    notes: p.notes || '',
    isActive: p.isActive,
  };
}

function emptyForm(): FormState {
  return {
    name: '',
    email: '',
    role: 'reporting_specialist',
    priority: '1',
    notes: '',
    isActive: true,
  };
}

export function ResponsiblePersonsSection({ clientId, isPinned, onTogglePin, readOnly }: ResponsiblePersonsSectionProps) {
  const {
    responsiblePersons, isLoading, error, isMutating, mutationError, clearMutationError,
    refetch, createResponsiblePerson, updateResponsiblePerson, deleteResponsiblePerson,
  } = useResponsiblePersons(clientId);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<FormState>(emptyForm());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    setTouched(true);
  };

  const validation = useMemo(() => ({
    email: formState.email ? validateEmail(formState.email) : { valid: true },
  }), [formState.email]);

  const hasValidationErrors = useMemo(() => {
    if (!formState.name.trim()) return true;
    const priorityNum = parseInt(formState.priority, 10);
    if (isNaN(priorityNum) || priorityNum < 1) return true;
    return Object.values(validation).some(v => !v.valid);
  }, [validation, formState.name, formState.priority]);

  // Group persons by priority
  const groupedByPriority = useMemo(() => {
    if (!responsiblePersons || responsiblePersons.length === 0) return [];
    const map = new Map<number, ResponsiblePersonDto[]>();
    for (const p of responsiblePersons) {
      const existing = map.get(p.priority) || [];
      existing.push(p);
      map.set(p.priority, existing);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [responsiblePersons]);

  const handleStartEdit = (person: ResponsiblePersonDto) => {
    setEditingId(person.responsiblePersonId);
    setFormState(personToForm(person));
    setIsAdding(false);
    setTouched(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormState(emptyForm());
    setTouched(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormState(emptyForm());
    setTouched(false);
  };

  const handleSave = async () => {
    setTouched(true);
    if (!formState.name.trim()) {
      toast.error('Name is required');
      return;
    }
    const priorityNum = parseInt(formState.priority, 10);
    if (isNaN(priorityNum) || priorityNum < 1) {
      toast.error('Priority must be a positive number');
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
        email: formState.email || undefined,
        role: formState.role,
        priority: priorityNum,
        notes: formState.notes || undefined,
        isActive: formState.isActive,
      };
      if (editingId !== null) {
        await updateResponsiblePerson({ ...payload, responsiblePersonId: editingId });
        toast.success('Responsible person updated');
      } else {
        await createResponsiblePerson(payload);
        toast.success('Responsible person added');
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
      await deleteResponsiblePerson(id);
      toast.success('Responsible person removed');
    } catch {
      // error surfaced via mutationError
    } finally {
      setDeletingId(null);
    }
  };

  const isFormOpen = isAdding || editingId !== null;

  const roleOptions = [
    { value: 'reporting_specialist', label: 'Reporting Specialist (RS)' },
    { value: 'reporting_consultant', label: 'Reporting Consultant (RC)' },
  ];

  const renderEditForm = () => (
    <div className="p-4 border border-brand-primary/20 rounded-lg bg-white space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <InlineField label="Name" value={formState.name} onChange={v => updateField('name', v)} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Email" value={formState.email} onChange={v => updateField('email', v)} type="email" disabled={isSaving} error={touched ? validation.email : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField
          label="Role"
          value={formState.role}
          onChange={v => updateField('role', v as FormState['role'])}
          options={roleOptions}
          disabled={isSaving}
          onEscape={handleCancelEdit}
          onCtrlEnter={handleSave}
        />
        <InlineField label="Priority" value={formState.priority} onChange={v => updateField('priority', v)} type="number" required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
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

  const renderPersonRow = (person: ResponsiblePersonDto) => {
    if (editingId === person.responsiblePersonId) {
      return <div key={person.responsiblePersonId}>{renderEditForm()}</div>;
    }

    return (
      <div
        key={person.responsiblePersonId}
        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors group"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Badge
            variant={person.role === 'reporting_specialist' ? 'default' : 'secondary'}
            className="shrink-0"
          >
            {roleShortLabels[person.role]}
          </Badge>
          <div className="min-w-0">
            <span className="text-foreground">{person.name}</span>
            {person.email && (
              <div className="flex items-center gap-1 mt-0.5">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <a href={`mailto:${person.email}`} className="text-xs text-muted-foreground hover:text-brand-primary truncate">
                  {person.email}
                </a>
              </div>
            )}
          </div>
          {!person.isActive && (
            <Badge variant="outline" className="text-muted-foreground shrink-0">Inactive</Badge>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!readOnly && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStartEdit(person)}
                disabled={isMutating || isFormOpen}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete({ id: person.responsiblePersonId, name: person.name })}
                disabled={isMutating || isFormOpen}
              >
                {deletingId === person.responsiblePersonId ? (
                  <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-500" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <SectionContainer
      title="Responsible Persons"
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
            Add Person
          </Button>
        ) : undefined
      }
    >
      {isAdding && renderEditForm()}

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : !responsiblePersons || responsiblePersons.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
          No responsible persons assigned yet.{!readOnly && ' Click "Add Person" to assign one.'}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByPriority.map(([priority, persons]) => {
            const specialists = persons.filter(p => p.role === 'reporting_specialist');
            const consultants = persons.filter(p => p.role === 'reporting_consultant');

            return (
              <div key={priority} className="bg-white border border-border rounded-lg overflow-hidden">
                {/* Priority header */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 border-b border-border">
                  <span className="text-xs text-muted-foreground tracking-wide uppercase">Priority {priority}</span>
                  <div className="flex gap-1.5 ml-auto">
                    {specialists.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {specialists.length} RS
                      </span>
                    )}
                    {consultants.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {consultants.length} RC
                      </span>
                    )}
                  </div>
                </div>

                {/* Two-column layout: RS | RC */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  {/* Reporting Specialists */}
                  <div className="px-3 py-2">
                    <div className="text-xs text-muted-foreground mb-1.5 px-3">Reporting Specialists</div>
                    {specialists.length > 0 ? (
                      specialists.map(renderPersonRow)
                    ) : (
                      <div className="text-xs text-muted-foreground/60 px-3 py-2 italic">None assigned</div>
                    )}
                  </div>
                  {/* Reporting Consultants */}
                  <div className="px-3 py-2">
                    <div className="text-xs text-muted-foreground mb-1.5 px-3">Reporting Consultants</div>
                    {consultants.length > 0 ? (
                      consultants.map(renderPersonRow)
                    ) : (
                      <div className="text-xs text-muted-foreground/60 px-3 py-2 italic">None assigned</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}
        title="Remove Responsible Person"
        description={`Are you sure you want to remove "${confirmDelete?.name}" from this client? This action cannot be undone.`}
        confirmLabel="Remove"
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