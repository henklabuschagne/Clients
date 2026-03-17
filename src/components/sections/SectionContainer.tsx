import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Pin, AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '../ui/button';

interface SectionContainerProps {
  title: string;
  isPinned: boolean;
  onTogglePin: () => void;
  defaultExpanded?: boolean;
  /** When true, forces the section open (e.g. form is active) */
  forceExpanded?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
  /** Fetch-level error string from the domain hook */
  error?: string | null;
  /** Called when the user clicks "Retry" on the error banner */
  onRetry?: () => void;
  /** Mutation-level error string (e.g. save/delete failed) */
  mutationError?: string | null;
  /** Called to dismiss the mutation error */
  onDismissMutationError?: () => void;
  /** Whether a mutation is in progress (shows subtle indicator) */
  isMutating?: boolean;
  /** When this number changes (increments), the section will expand */
  expandTrigger?: number;
}

export function SectionContainer({
  title,
  isPinned,
  onTogglePin,
  defaultExpanded = false,
  forceExpanded,
  children,
  actions,
  error,
  onRetry,
  mutationError,
  onDismissMutationError,
  isMutating,
  expandTrigger,
}: SectionContainerProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Auto-expand when forceExpanded becomes true
  useEffect(() => {
    if (forceExpanded) {
      setIsExpanded(true);
    }
  }, [forceExpanded]);

  // Auto-expand when expandTrigger changes
  useEffect(() => {
    if (expandTrigger !== undefined && expandTrigger > 0) {
      setIsExpanded(true);
    }
  }, [expandTrigger]);

  const expanded = isExpanded || !!forceExpanded;

  return (
    <section 
      className="bg-secondary text-card-foreground flex flex-col rounded-xl border shadow-sm overflow-hidden"
      aria-labelledby={`section-${title.toLowerCase()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!expanded)}
            className="flex items-center gap-2 hover:text-brand-primary transition-colors"
            aria-expanded={expanded}
            aria-controls={`section-content-${title.toLowerCase()}`}
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            )}
            <h2 
              id={`section-${title.toLowerCase()}`}
              className="text-foreground"
            >
              {title}
            </h2>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePin}
            className={isPinned ? 'text-brand-primary' : 'text-muted-foreground'}
            aria-label={isPinned ? `Unpin ${title} section` : `Pin ${title} section`}
            data-tour="pin-button"
          >
            <Pin className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} aria-hidden="true" />
          </Button>
          {isMutating && (
            <div className="flex items-center gap-1.5 text-xs text-brand-primary">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </div>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Content */}
      {expanded && (
        <div 
          className="px-6 py-6" 
          id={`section-content-${title.toLowerCase()}`}
          role="region"
          aria-labelledby={`section-${title.toLowerCase()}`}
        >
          {/* Fetch error banner */}
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-brand-error-mid bg-brand-error-light p-3" role="alert">
              <AlertCircle className="h-5 w-5 text-brand-error mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-brand-error">Failed to load data</p>
                <p className="text-xs text-brand-error/70 mt-0.5">{error}</p>
              </div>
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="shrink-0 border-brand-error-mid text-brand-error hover:bg-brand-error-light"
                >
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                  Retry
                </Button>
              )}
            </div>
          )}

          {/* Mutation error banner */}
          {mutationError && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-brand-warning-mid bg-brand-warning-light p-3" role="alert">
              <AlertCircle className="h-5 w-5 text-brand-warning mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-brand-warning">Action failed</p>
                <p className="text-xs text-brand-warning/80 mt-0.5">{mutationError}</p>
              </div>
              {onDismissMutationError && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismissMutationError}
                  className="shrink-0 text-brand-warning hover:bg-brand-warning-light"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {children}
        </div>
      )}
    </section>
  );
}