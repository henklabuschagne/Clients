import { useCallback } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { ValidationResult } from '../../lib/validation';

interface InlineFieldProps {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'tel' | 'url' | 'date' | 'datetime-local' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** Validation result — if invalid, shows error message below the field */
  error?: ValidationResult;
  /** Called on Escape key press (cancel editing) */
  onEscape?: () => void;
  /** Called on Ctrl+Enter (save) */
  onCtrlEnter?: () => void;
}

function useFormKeys(onEscape?: () => void, onCtrlEnter?: () => void) {
  return useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        e.stopPropagation();
        onEscape();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && onCtrlEnter) {
        e.preventDefault();
        e.stopPropagation();
        onCtrlEnter();
      }
    },
    [onEscape, onCtrlEnter]
  );
}

export function InlineField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className = '',
  error,
  onEscape,
  onCtrlEnter,
}: InlineFieldProps) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hasError = error && !error.valid;
  const handleKeyDown = useFormKeys(onEscape, onCtrlEnter);

  if (type === 'textarea') {
    return (
      <div className={`space-y-1 ${className}`}>
        <Label htmlFor={id} className="text-xs text-gray-600">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
        <Textarea
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`min-h-[60px] text-sm ${hasError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
          onKeyDown={handleKeyDown}
        />
        {hasError && (
          <p className="text-xs text-red-500 mt-0.5">{(error as { valid: false; message: string }).message}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <Label htmlFor={id} className="text-xs text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`h-8 text-sm ${hasError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
        onKeyDown={handleKeyDown}
      />
      {hasError && (
        <p className="text-xs text-red-500 mt-0.5">{(error as { valid: false; message: string }).message}</p>
      )}
    </div>
  );
}

interface InlineSelectFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** Called on Escape key press (cancel editing) */
  onEscape?: () => void;
  /** Called on Ctrl+Enter (save) */
  onCtrlEnter?: () => void;
}

export function InlineSelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = '',
  onEscape,
  onCtrlEnter,
}: InlineSelectFieldProps) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const handleKeyDown = useFormKeys(onEscape, onCtrlEnter);

  return (
    <div className={`space-y-1 ${className}`}>
      <Label htmlFor={id} className="text-xs text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <select
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex h-8 w-full rounded-md border border-input bg-input-background px-2 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        onKeyDown={handleKeyDown}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface InlineCheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  /** Called on Escape key press (cancel editing) */
  onEscape?: () => void;
  /** Called on Ctrl+Enter (save) */
  onCtrlEnter?: () => void;
}

export function InlineCheckboxField({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  onEscape,
  onCtrlEnter,
}: InlineCheckboxFieldProps) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const handleKeyDown = useFormKeys(onEscape, onCtrlEnter);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        onKeyDown={handleKeyDown}
      />
      <Label htmlFor={id} className="text-xs text-gray-600 cursor-pointer">
        {label}
      </Label>
    </div>
  );
}
