import { useState } from 'react';
import { useTickets } from '../../hooks/useTickets';
import { SectionContainer } from './SectionContainer';
import { ConfirmDialog } from './ConfirmDialog';
import { InlineField, InlineSelectField } from './InlineField';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Edit, Clock, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import type { TicketDto } from '../../services/api';

interface TicketSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
  readOnly?: boolean;
}

type TicketFormState = {
  ticketNumber: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  dueDate: string;
};

function ticketToForm(t: TicketDto): TicketFormState {
  return {
    ticketNumber: t.ticketNumber || '',
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    category: t.category || '',
    dueDate: t.dueDate ? t.dueDate.substring(0, 10) : '',
  };
}

function emptyTicketForm(): TicketFormState {
  return {
    ticketNumber: '',
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    category: '',
    dueDate: '',
  };
}

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export function TicketSection({ clientId, isPinned, onTogglePin, readOnly }: TicketSectionProps) {
  const { tickets, isLoading, error, isMutating, mutationError, clearMutationError, refetch, createTicket, updateTicket, deleteTicket } = useTickets(clientId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<TicketFormState>(emptyTicketForm());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const updateField = <K extends keyof TicketFormState>(key: K, value: TicketFormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    setTouched(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'in-progress': case 'in_progress': return 'bg-yellow-500';
      case 'waiting-customer': case 'waiting-internal': return 'bg-orange-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-400';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
    switch (priority?.toLowerCase()) {
      case 'critical': case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const handleStartEdit = (ticket: TicketDto) => {
    setEditingId(ticket.ticketId);
    setFormState(ticketToForm(ticket));
    setIsAdding(false);
    setTouched(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormState(emptyTicketForm());
    setTouched(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormState(emptyTicketForm());
    setTouched(false);
  };

  const handleSave = async () => {
    if (!formState.title.trim() || !formState.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        clientId,
        ticketNumber: formState.ticketNumber || undefined,
        title: formState.title,
        description: formState.description,
        priority: formState.priority,
        status: formState.status,
        category: formState.category || undefined,
        dueDate: formState.dueDate || undefined,
      };
      if (editingId !== null) {
        await updateTicket({ ...payload, ticketId: editingId });
        toast.success('Ticket updated');
      } else {
        await createTicket(payload);
        toast.success('Ticket created');
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
      await deleteTicket(id);
      toast.success('Ticket deleted');
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
        <InlineField label="Ticket Number" value={formState.ticketNumber} onChange={v => updateField('ticketNumber', v)} placeholder="Auto-generated if empty" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Title" value={formState.title} onChange={v => updateField('title', v)} required disabled={isSaving} className="sm:col-span-2" onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="Priority" value={formState.priority} onChange={v => updateField('priority', v)} options={PRIORITIES} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="Status" value={formState.status} onChange={v => updateField('status', v)} options={STATUSES} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Category" value={formState.category} onChange={v => updateField('category', v)} placeholder="Bug, Feature, etc." disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Due Date" value={formState.dueDate} onChange={v => updateField('dueDate', v)} type="date" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
      </div>
      <InlineField label="Description" value={formState.description} onChange={v => updateField('description', v)} type="textarea" required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
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
      title="Tickets"
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
            New Ticket
          </Button>
        ) : undefined
      }
    >
      {isAdding && renderEditForm()}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !tickets || tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tickets yet. Click "New Ticket" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) =>
            editingId === ticket.ticketId ? (
              <div key={ticket.ticketId}>{renderEditForm()}</div>
            ) : (
              <div
                key={ticket.ticketId}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm text-gray-500">{ticket.ticketNumber || `#${ticket.ticketId}`}</span>
                    <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`} />
                      <span className="text-sm text-gray-600">{ticket.status.replace('_', ' ')}</span>
                    </div>
                    {ticket.category && (
                      <Badge variant="outline">{ticket.category}</Badge>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {ticket.assignedTo && <span>Assigned to: User #{ticket.assignedTo}</span>}
                    {ticket.dueDate && (
                      <span className="ml-3 flex items-center gap-1 inline-flex">
                        <Clock className="h-3 w-3" />
                        Due: {format(new Date(ticket.dueDate), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                  {ticket.description && (
                    <div className="mt-1 text-xs text-gray-500">
                      {ticket.description.substring(0, 100)}{ticket.description.length > 100 ? '...' : ''}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!readOnly && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(ticket)}
                        disabled={isMutating || isFormOpen}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete({ id: ticket.ticketId, name: ticket.title })}
                        disabled={isMutating || isFormOpen}
                      >
                        {deletingId === ticket.ticketId ? (
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
        title="Delete Ticket"
        description={`Are you sure you want to delete ticket "${confirmDelete?.name}"? This action cannot be undone.`}
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