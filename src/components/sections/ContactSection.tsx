import { useState, useMemo } from 'react';
import { useContacts } from '../../hooks/useContacts';
import { SectionContainer } from './SectionContainer';
import { ConfirmDialog } from './ConfirmDialog';
import { InlineField, InlineCheckboxField } from './InlineField';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Edit, Mail, Phone, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { validateEmail, validatePhone } from '../../lib/validation';
import type { ContactDto } from '../../services/api';

interface ContactSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
  readOnly?: boolean;
}

type ContactFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  position: string;
  department: string;
  isPrimary: boolean;
  isActive: boolean;
  notes: string;
};

function contactToForm(c: ContactDto): ContactFormState {
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone || '',
    mobile: c.mobile || '',
    position: c.position || '',
    department: c.department || '',
    isPrimary: c.isPrimary,
    isActive: c.isActive,
    notes: c.notes || '',
  };
}

function emptyContactForm(): ContactFormState {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    position: '',
    department: '',
    isPrimary: false,
    isActive: true,
    notes: '',
  };
}

export function ContactSection({ clientId, isPinned, onTogglePin, readOnly }: ContactSectionProps) {
  const { contacts, isLoading, error, isMutating, mutationError, clearMutationError, refetch, createContact, updateContact, deleteContact } = useContacts(clientId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<ContactFormState>(emptyContactForm());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const updateField = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    setTouched(true);
  };

  const validation = useMemo(() => ({
    email: validateEmail(formState.email),
    phone: validatePhone(formState.phone),
    mobile: validatePhone(formState.mobile),
  }), [formState.email, formState.phone, formState.mobile]);

  const hasValidationErrors = useMemo(() => {
    if (!formState.firstName.trim() || !formState.lastName.trim() || !formState.email.trim()) return true;
    return Object.values(validation).some(v => !v.valid);
  }, [validation, formState.firstName, formState.lastName, formState.email]);

  const getRoleColor = (role: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
    switch (role) {
      case 'Primary': return 'default';
      default: return 'outline';
    }
  };

  const handleStartEdit = (contact: ContactDto) => {
    setEditingId(contact.contactId);
    setFormState(contactToForm(contact));
    setIsAdding(false);
    setTouched(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormState(emptyContactForm());
    setTouched(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormState(emptyContactForm());
    setTouched(false);
  };

  const handleSave = async () => {
    setTouched(true);
    if (!formState.firstName.trim() || !formState.lastName.trim() || !formState.email.trim()) {
      toast.error('First name, last name, and email are required');
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
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        phone: formState.phone || undefined,
        mobile: formState.mobile || undefined,
        position: formState.position || undefined,
        department: formState.department || undefined,
        isPrimary: formState.isPrimary,
        isActive: formState.isActive,
        notes: formState.notes || undefined,
      };
      if (editingId !== null) {
        await updateContact({ ...payload, contactId: editingId });
        toast.success('Contact updated');
      } else {
        await createContact(payload);
        toast.success('Contact created');
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
      await deleteContact(id);
      toast.success('Contact deleted');
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
        <InlineField label="First Name" value={formState.firstName} onChange={v => updateField('firstName', v)} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Last Name" value={formState.lastName} onChange={v => updateField('lastName', v)} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Email" value={formState.email} onChange={v => updateField('email', v)} type="email" required disabled={isSaving} error={touched ? validation.email : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Phone" value={formState.phone} onChange={v => updateField('phone', v)} type="tel" disabled={isSaving} error={touched ? validation.phone : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Mobile" value={formState.mobile} onChange={v => updateField('mobile', v)} type="tel" disabled={isSaving} error={touched ? validation.mobile : undefined} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Position" value={formState.position} onChange={v => updateField('position', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Department" value={formState.department} onChange={v => updateField('department', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineCheckboxField label="Primary Contact" checked={formState.isPrimary} onChange={v => updateField('isPrimary', v)} disabled={isSaving} className="self-end pb-1" onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
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
      title="Contacts"
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
            Add Contact
          </Button>
        ) : undefined
      }
    >
      {isAdding && renderEditForm()}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !contacts || contacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No contacts yet. Click "Add Contact" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) =>
            editingId === contact.contactId ? (
              <div key={contact.contactId}>{renderEditForm()}</div>
            ) : (
              <div
                key={contact.contactId}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</h3>
                    {contact.isPrimary && (
                      <Badge variant="default">Primary</Badge>
                    )}
                    {contact.position && (
                      <Badge variant={getRoleColor(contact.position)}>{contact.position}</Badge>
                    )}
                    {contact.department && (
                      <span className="text-sm text-gray-500">{contact.department}</span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  {contact.notes && (
                    <div className="mt-2 text-sm text-gray-500">{contact.notes}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!readOnly && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(contact)}
                        disabled={isMutating || isFormOpen}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete({ id: contact.contactId, name: `${contact.firstName} ${contact.lastName}` })}
                        disabled={isMutating || isFormOpen}
                      >
                        {deletingId === contact.contactId ? (
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
        title="Delete Contact"
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