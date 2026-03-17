import { Button } from './ui/button';
import { 
  Database, 
  Server, 
  Contact, 
  CreditCard, 
  Ticket, 
  Package, 
  Shield,
  Network,
  BarChart3,
  FileText,
  Plus
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function NoClientsEmptyState({ onCreateClient }: { onCreateClient: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-muted">
        <Database className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm text-foreground mb-1">No clients yet</h3>
      <p className="text-xs text-muted-foreground max-w-[200px]">Get started by creating your first client.</p>
    </div>
  );
}

export function NoVPNEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<Shield className="h-8 w-8" />}
      title="No VPN configurations"
      description="Add VPN configurations to securely connect to client networks."
      action={{
        label: 'Add VPN',
        onClick: onCreate,
      }}
    />
  );
}

export function NoConnectionsEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<Network className="h-8 w-8" />}
      title="No connections"
      description="Add database, API, or other connections for this client."
      action={{
        label: 'Add Connection',
        onClick: onCreate,
      }}
    />
  );
}

export function NoServersEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<Server className="h-8 w-8" />}
      title="No servers"
      description="Track and monitor all servers and infrastructure for this client."
      action={{
        label: 'Add Server',
        onClick: onCreate,
      }}
    />
  );
}

export function NoContactsEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<Contact className="h-8 w-8" />}
      title="No contacts"
      description="Add contact information for key people at this client organization."
      action={{
        label: 'Add Contact',
        onClick: onCreate,
      }}
    />
  );
}

export function NoLicensesEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<CreditCard className="h-8 w-8" />}
      title="No licenses"
      description="Track software licenses, renewals, and costs for this client."
      action={{
        label: 'Add License',
        onClick: onCreate,
      }}
    />
  );
}

export function NoTicketsEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<Ticket className="h-8 w-8" />}
      title="No support tickets"
      description="Create and track support tickets for client requests and issues."
      action={{
        label: 'Create Ticket',
        onClick: onCreate,
      }}
    />
  );
}

export function NoUpdatesEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<Package className="h-8 w-8" />}
      title="No updates scheduled"
      description="Schedule software updates and releases for this client."
      action={{
        label: 'Schedule Update',
        onClick: onCreate,
      }}
    />
  );
}

export function NoStatisticsEmptyState() {
  return (
    <EmptyState
      icon={<BarChart3 className="h-8 w-8" />}
      title="No statistics available"
      description="Statistics will appear here once data is collected for this client."
    />
  );
}

export function NoSearchResultsEmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="mb-3 flex items-center justify-center w-10 h-10 rounded-full bg-muted">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm text-foreground mb-1">No results</h3>
      <p className="text-xs text-muted-foreground max-w-[200px]">No matches for "{query}"</p>
    </div>
  );
}

export function ErrorEmptyState({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry?: () => void 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-brand-error-light text-brand-error">
        <FileText className="h-8 w-8" />
      </div>
      <h3 className="text-lg text-foreground mb-2">Error loading data</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}