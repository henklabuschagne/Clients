import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { ClientDto } from '../services/api';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Copy, ExternalLink, History } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { VPNSection } from './sections/VPNSection';
import { ConnectionSection } from './sections/ConnectionSection';
import { ServerSection } from './sections/ServerSection';
import { ContactSection } from './sections/ContactSection';
import { LicenseSection } from './sections/LicenseSection';
import { StatisticsSection } from './sections/StatisticsSection';
import { TicketSection } from './sections/TicketSection';
import { UpdateSection } from './sections/UpdateSection';
import { NotesSection } from './sections/NotesSection';
import { ResponsiblePersonsSection } from './sections/ResponsiblePersonsSection';
import { ClientHistoryPanel } from './ClientHistoryPanel';
import { announceToScreenReader } from '../utils/accessibility';
import type { SectionConfig } from '../lib/appStore';
import { getSectionPermission, type SectionId } from '../lib/roles';

interface ClientDetailProps {
  client: ClientDto;
}

const sectionComponents: Record<string, React.ComponentType<any>> = {
  vpn: VPNSection,
  connection: ConnectionSection,
  servers: ServerSection,
  contacts: ContactSection,
  licenses: LicenseSection,
  statistics: StatisticsSection,
  tickets: TicketSection,
  updates: UpdateSection,
  notes: NotesSection,
  responsiblePersons: ResponsiblePersonsSection,
};

export function ClientDetail({ client }: ClientDetailProps) {
  const { currentUser, reads, actions } = useAppStore('auth', 'preferences');
  const userRole = currentUser?.role;
  const [historyOpen, setHistoryOpen] = useState(false);

  const sectionOrder = reads.getSectionOrder(String(client.clientId));

  const handleTogglePin = async (sectionId: string) => {
    const newOrder = sectionOrder.map(s =>
      s.id === sectionId ? { ...s, pinned: !s.pinned } : s
    );
    await actions.setSectionOrder(String(client.clientId), newOrder);
    const section = sectionOrder.find(s => s.id === sectionId);
    if (section) {
      announceToScreenReader(`${section.name} section ${section.pinned ? 'unpinned' : 'pinned'}`);
    }
  };

  const copyInstallLink = () => {
    if (client.installLink) {
      navigator.clipboard.writeText(client.installLink);
      toast.success('Installation link copied to clipboard');
      announceToScreenReader('Installation link copied to clipboard');
    }
  };

  const openInstallLink = () => {
    if (client.installLink) {
      window.open(client.installLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Filter sections based on role permissions
  const visibleSections = sectionOrder.filter(section => {
    const perm = getSectionPermission(userRole, section.id as SectionId);
    return perm.canView;
  });

  const pinnedSections = visibleSections.filter(s => s.pinned);
  const unpinnedSections = visibleSections.filter(s => !s.pinned);

  const renderSection = (section: SectionConfig) => {
    const SectionComponent = sectionComponents[section.id];
    if (!SectionComponent) return null;
    const perm = getSectionPermission(userRole, section.id as SectionId);
    return (
      <SectionComponent
        key={section.id}
        clientId={client.clientId}
        isPinned={section.pinned}
        onTogglePin={() => handleTogglePin(section.id)}
        readOnly={!perm.canEdit}
      />
    );
  };

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <header 
        className="sticky top-0 z-10 bg-white border-b border-border px-8 py-6"
        data-tour="client-header"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{client.name}</h1>
              <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                {client.status}
              </Badge>
              {client.hosted && (
                <Badge variant="outline">Hosted</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">{client.company}</p>
            <p className="text-sm text-muted-foreground mt-1">
              <a href={`mailto:${client.email}`} className="hover:text-brand-primary">
                {client.email}
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {client.installLink && (
              <>
                <div className="text-sm text-muted-foreground">Finnivo Installation Link:</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyInstallLink}
                  aria-label="Copy installation link"
                >
                  <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openInstallLink}
                  aria-label="Open installation link in new tab"
                >
                  <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                  Open
                </Button>
                <div className="border-l border-border h-6 mx-1" />
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryOpen(true)}
              aria-label="View client history"
            >
              <History className="h-4 w-4 mr-2" aria-hidden="true" />
              History
            </Button>
          </div>
        </div>
      </header>

      {/* Sections */}
      <div className="px-8 py-6 space-y-4 bg-white" data-tour="sections">
        {pinnedSections.map(renderSection)}
        {unpinnedSections.map(renderSection)}
      </div>

      <ClientHistoryPanel
        clientId={client.clientId}
        clientName={client.name}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </div>
  );
}