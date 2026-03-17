import { useState, useEffect } from 'react';
import { ClientSidebar } from './ClientSidebar';
import { ClientDetail } from './ClientDetail';
import { useAppStore } from '../hooks/useAppStore';
import { Toaster } from './ui/sonner';
import { OnboardingTour, mainAppTourSteps } from './OnboardingTour';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { useKeyboardShortcuts, commonShortcuts } from '../hooks/useKeyboardShortcuts';
import { ClientDetailSkeleton } from './LoadingSkeletons';
import { DevApiPanel } from './DevApiPanel';
import type { ClientDto } from '../services/api';

export function MainLayout() {
  const { clients } = useAppStore('clients', 'auth');
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  const shortcuts = [
    commonShortcuts.help(() => setShowShortcutsHelp(true)),
    commonShortcuts.search(() => {
      document.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
    }),
    commonShortcuts.nextItem(() => {
      if (!selectedClient || !clients.length) return;
      const currentIndex = clients.findIndex(c => c.clientId === selectedClient.clientId);
      if (currentIndex < clients.length - 1) {
        setSelectedClient(clients[currentIndex + 1]);
      }
    }),
    commonShortcuts.previousItem(() => {
      if (!selectedClient || !clients.length) return;
      const currentIndex = clients.findIndex(c => c.clientId === selectedClient.clientId);
      if (currentIndex > 0) {
        setSelectedClient(clients[currentIndex - 1]);
      }
    }),
  ];

  useKeyboardShortcuts(shortcuts);

  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      setSelectedClient(clients[0]);
    }
  }, [clients, selectedClient]);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <ClientSidebar
        clients={clients}
        selectedClient={selectedClient}
        onSelectClient={setSelectedClient}
        isLoading={initialLoading}
      />
      <main className="flex-1 overflow-auto bg-background" id="main-content" role="main">
        {initialLoading ? (
          <ClientDetailSkeleton />
        ) : selectedClient ? (
          <ClientDetail client={selectedClient} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a client to view details
          </div>
        )}
      </main>
      <Toaster />
      <OnboardingTour 
        steps={mainAppTourSteps} 
        onComplete={() => console.log('Tour completed')}
      />
      {showShortcutsHelp && (
        <KeyboardShortcutsHelp shortcuts={shortcuts} />
      )}
      <DevApiPanel />
    </div>
  );
}