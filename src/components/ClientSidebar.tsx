import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ClientDto } from '../services/api';
import { useAppStore } from '../hooks/useAppStore';
import { Search, LogOut, Settings, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ClientListSkeleton } from './LoadingSkeletons';
import { NoClientsEmptyState, NoSearchResultsEmptyState } from './EmptyStates';
import { MockModeToggle } from './MockModeToggle';

interface ClientSidebarProps {
  clients: ClientDto[];
  selectedClient: ClientDto | null;
  onSelectClient: (client: ClientDto) => void;
  isLoading: boolean;
}

export function ClientSidebar({ clients, selectedClient, onSelectClient, isLoading }: ClientSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { currentUser, actions } = useAppStore('auth');

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'delivery': return 'Delivery Manager';
      case 'devops': return 'DevOps Engineer';
      default: return role || 'User';
    }
  };

  return (
    <aside
      className="w-72 bg-white border-r border-border flex flex-col h-full"
      data-tour="client-list"
      role="complementary"
      aria-label="Client list sidebar"
    >
      {/* User Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-foreground truncate">{getRoleLabel(currentUser?.role)}</div>
            <Badge variant="outline" className="mt-1 text-xs">
              {currentUser?.role ?? 'user'}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <MockModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Log out"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Nav Item */}
      <div className="px-4 py-3 border-b border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">Admin</span>
        </button>
      </div>

      {/* Clients Section Label */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-xs text-brand-primary uppercase tracking-wider">Clients</span>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-input-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
            data-search-input
            aria-label="Search clients"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-auto px-4" role="list" aria-label="Client list">
        {isLoading ? (
          <ClientListSkeleton />
        ) : clients.length === 0 ? (
          <NoClientsEmptyState onCreateClient={() => console.log('Create client')} />
        ) : filteredClients.length === 0 ? (
          <NoSearchResultsEmptyState query={searchQuery} />
        ) : (
          <div className="space-y-0.5">
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.clientId === client.clientId;
              return (
                <button
                  key={client.clientId}
                  onClick={() => onSelectClient(client)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-brand-primary-light text-brand-primary'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                  role="listitem"
                  aria-label={`${client.name} - ${client.status}`}
                  aria-current={isSelected ? 'true' : undefined}
                >
                  <Building2 className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-brand-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${isSelected ? 'text-brand-primary' : 'text-foreground'}`}>
                      {client.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {client.email}
                    </div>
                  </div>
                  {client.country && (
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {client.country}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground text-center" role="status" aria-live="polite">
        {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'}
      </div>
    </aside>
  );
}
