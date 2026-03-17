import { useState, useCallback } from 'react';
import { useClientNotes } from '../../hooks/useClientNotes';
import { SectionContainer } from './SectionContainer';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Plus, Trash2, Edit, Check, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner@2.0.3';

interface NotesSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
  readOnly?: boolean;
}

export function NotesSection({ clientId, isPinned, onTogglePin, readOnly }: NotesSectionProps) {
  const { notes, isLoading, error, isMutating, mutationError, clearMutationError, refetch, createNote, updateNote, deleteNote } = useClientNotes(clientId);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await createNote({
        clientId,
        content: newNoteContent.trim(),
      });
      setNewNoteContent('');
      setIsAdding(false);
      toast.success('Note added successfully');
    } catch (err) {
      toast.error('Failed to add note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (noteId: number, content: string) => {
    setEditingId(noteId);
    setEditContent(content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editingId === null) {
      toast.error('Note content cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await updateNote({
        noteId: editingId,
        content: editContent.trim(),
      });
      setEditingId(null);
      setEditContent('');
      toast.success('Note updated successfully');
    } catch (err) {
      toast.error('Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    setDeletingId(noteId);
    try {
      await deleteNote(noteId);
      toast.success('Note deleted successfully');
    } catch (err) {
      toast.error('Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  const handleNoteKeyDown = useCallback((e: React.KeyboardEvent, onSave: () => void, onCancel: () => void) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSave();
    }
  }, []);

  return (
    <SectionContainer
      title="Notes"
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
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding || isMutating}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        ) : undefined
      }
    >
      {isAdding && (
        <div className="mb-4 p-4 border border-brand-primary/20 rounded-lg bg-white">
          <Textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Type your note here..."
            className="mb-3 min-h-[100px]"
            autoFocus
            disabled={isSaving}
            onKeyDown={(e) => handleNoteKeyDown(e, handleAddNote, () => { setIsAdding(false); setNewNoteContent(''); })}
          />
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-gray-400 mr-auto hidden sm:inline">Esc to cancel · Ctrl+Enter to save</span>
            <Button size="sm" onClick={handleAddNote} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewNoteContent('');
              }}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !notes || notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notes yet. Click "Add Note" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.noteId}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              {editingId === note.noteId ? (
                <>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="mb-3 min-h-[100px]"
                    autoFocus
                    disabled={isSaving}
                    onKeyDown={(e) => handleNoteKeyDown(e, handleSaveEdit, handleCancelEdit)}
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSaveEdit} disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span>{note.createdByUsername || 'Unknown'}</span>
                        <span>•</span>
                        <span>{format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                        {note.updatedAt !== note.createdAt && (
                          <>
                            <span>•</span>
                            <span>Edited {format(new Date(note.updatedAt), 'MMM dd, yyyy HH:mm')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!readOnly && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(note.noteId, note.content)}
                            disabled={isMutating}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete(note.noteId)}
                            disabled={isMutating}
                          >
                            {deletingId === note.noteId ? (
                              <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-500" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (confirmDelete !== null) {
            handleDeleteNote(confirmDelete);
            setConfirmDelete(null);
          }
        }}
      />
    </SectionContainer>
  );
}