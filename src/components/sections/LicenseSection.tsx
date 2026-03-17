import { useState } from 'react';
import { useLicenses } from '../../hooks/useLicenses';
import { SectionContainer } from './SectionContainer';
import { ConfirmDialog } from './ConfirmDialog';
import { InlineField, InlineSelectField, InlineCheckboxField } from './InlineField';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Edit, AlertCircle, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import type { LicenseDto } from '../../services/api';

interface LicenseSectionProps {
  clientId: number;
  isPinned: boolean;
  onTogglePin: () => void;
  readOnly?: boolean;
}

type LicenseFormState = {
  softwareName: string;
  licenseKey: string;
  licenseType: string;
  quantity: string;
  purchaseDate: string;
  expiryDate: string;
  renewalDate: string;
  cost: string;
  currency: string;
  vendor: string;
  isActive: boolean;
  notes: string;
};

function licenseToForm(l: LicenseDto): LicenseFormState {
  return {
    softwareName: l.softwareName,
    licenseKey: l.licenseKey,
    licenseType: l.licenseType,
    quantity: String(l.quantity),
    purchaseDate: l.purchaseDate ? l.purchaseDate.substring(0, 10) : '',
    expiryDate: l.expiryDate ? l.expiryDate.substring(0, 10) : '',
    renewalDate: l.renewalDate ? l.renewalDate.substring(0, 10) : '',
    cost: l.cost ? String(l.cost) : '',
    currency: l.currency || 'USD',
    vendor: l.vendor || '',
    isActive: l.isActive,
    notes: l.notes || '',
  };
}

function emptyLicenseForm(): LicenseFormState {
  return {
    softwareName: '',
    licenseKey: '',
    licenseType: 'subscription',
    quantity: '1',
    purchaseDate: new Date().toISOString().substring(0, 10),
    expiryDate: '',
    renewalDate: '',
    cost: '',
    currency: 'USD',
    vendor: '',
    isActive: true,
    notes: '',
  };
}

const LICENSE_TYPES = [
  { value: 'perpetual', label: 'Perpetual' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'trial', label: 'Trial' },
];

export function LicenseSection({ clientId, isPinned, onTogglePin, readOnly }: LicenseSectionProps) {
  const { licenses, isLoading, error, isMutating, mutationError, clearMutationError, refetch, createLicense, updateLicense, deleteLicense } = useLicenses(clientId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<LicenseFormState>(emptyLicenseForm());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const updateField = <K extends keyof LicenseFormState>(key: K, value: LicenseFormState[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    setTouched(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'expired': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-400';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  const handleStartEdit = (license: LicenseDto) => {
    setEditingId(license.licenseId);
    setFormState(licenseToForm(license));
    setIsAdding(false);
    setTouched(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormState(emptyLicenseForm());
    setTouched(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormState(emptyLicenseForm());
    setTouched(false);
  };

  const handleSave = async () => {
    if (!formState.softwareName.trim() || !formState.licenseKey.trim()) {
      toast.error('Software name and license key are required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        clientId,
        softwareName: formState.softwareName,
        licenseKey: formState.licenseKey,
        licenseType: formState.licenseType,
        quantity: parseInt(formState.quantity) || 1,
        purchaseDate: formState.purchaseDate,
        expiryDate: formState.expiryDate || undefined,
        renewalDate: formState.renewalDate || undefined,
        cost: formState.cost ? parseFloat(formState.cost) : undefined,
        currency: formState.currency || undefined,
        vendor: formState.vendor || undefined,
        isActive: formState.isActive,
        notes: formState.notes || undefined,
      };
      if (editingId !== null) {
        await updateLicense({ ...payload, licenseId: editingId });
        toast.success('License updated');
      } else {
        await createLicense(payload);
        toast.success('License created');
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
      await deleteLicense(id);
      toast.success('License deleted');
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
        <InlineField label="Software Name" value={formState.softwareName} onChange={v => updateField('softwareName', v)} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="License Key" value={formState.licenseKey} onChange={v => updateField('licenseKey', v)} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineSelectField label="License Type" value={formState.licenseType} onChange={v => updateField('licenseType', v)} options={LICENSE_TYPES} required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Quantity" value={formState.quantity} onChange={v => updateField('quantity', v)} type="number" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Vendor" value={formState.vendor} onChange={v => updateField('vendor', v)} disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Cost" value={formState.cost} onChange={v => updateField('cost', v)} type="number" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Currency" value={formState.currency} onChange={v => updateField('currency', v)} placeholder="USD" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Purchase Date" value={formState.purchaseDate} onChange={v => updateField('purchaseDate', v)} type="date" required disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Expiry Date" value={formState.expiryDate} onChange={v => updateField('expiryDate', v)} type="date" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
        <InlineField label="Renewal Date" value={formState.renewalDate} onChange={v => updateField('renewalDate', v)} type="date" disabled={isSaving} onEscape={handleCancelEdit} onCtrlEnter={handleSave} />
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
      title="Licenses"
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
            Add License
          </Button>
        ) : undefined
      }
    >
      {isAdding && renderEditForm()}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !licenses || licenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No licenses yet. Click "Add License" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {licenses.map((license) =>
            editingId === license.licenseId ? (
              <div key={license.licenseId}>{renderEditForm()}</div>
            ) : (
              <div
                key={license.licenseId}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-medium text-gray-900">{license.softwareName}</h3>
                    {license.licenseType && (
                      <Badge variant="outline">{license.licenseType}</Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(license.isActive ? 'active' : 'expired')}`} />
                      <span className="text-sm text-gray-600">{license.isActive ? 'active' : 'inactive'}</span>
                    </div>
                    {isExpiringSoon(license.expiryDate) && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 space-y-1">
                    {license.vendor && <div>Vendor: {license.vendor}</div>}
                    {license.expiryDate && (
                      <div>Expires: {format(new Date(license.expiryDate), 'MMM dd, yyyy')}</div>
                    )}
                    {license.quantity && <div>Quantity: {license.quantity}</div>}
                    {license.cost && <div>Cost: ${license.cost.toLocaleString()}</div>}
                  </div>
                  {license.notes && (
                    <div className="mt-1 text-sm text-gray-500">{license.notes}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!readOnly && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(license)}
                        disabled={isMutating || isFormOpen}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete({ id: license.licenseId, name: license.softwareName })}
                        disabled={isMutating || isFormOpen}
                      >
                        {deletingId === license.licenseId ? (
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
        title="Delete License"
        description={`Are you sure you want to delete the license for "${confirmDelete?.name}"? This action cannot be undone.`}
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