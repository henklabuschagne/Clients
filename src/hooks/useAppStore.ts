import { useState, useEffect, useMemo } from 'react';
import { appStore, type Slice, type SectionConfig } from '../lib/appStore';
import { api } from '../lib/api';
import type {
  ClientDto, CreateClientDto, UpdateClientDto,
  VPNConfigurationDto, CreateVPNConfigurationDto, UpdateVPNConfigurationDto,
  ConnectionDto, CreateConnectionDto, UpdateConnectionDto,
  ServerDto, CreateServerDto, UpdateServerDto,
  ContactDto, CreateContactDto, UpdateContactDto,
  LicenseDto, CreateLicenseDto, UpdateLicenseDto, RenewLicenseDto,
  TicketDto, CreateTicketDto, UpdateTicketDto,
  UpdateDto, CreateUpdateDto, UpdateUpdateDto,
  CustomizationDto, CreateCustomizationDto, UpdateCustomizationDto,
  UpdateCustomizationDocumentDto,
  CreateClientNoteDto, UpdateClientNoteDto,
  ResponsiblePersonDto, CreateResponsiblePersonDto, UpdateResponsiblePersonDto,
  UserDto,
} from '../services/api';

export function useAppStore(...subscribeTo: Slice[]) {
  const [, bump] = useState(0);

  useEffect(() => {
    const unsubscribes = subscribeTo.map(slice =>
      appStore.subscribe(slice, () => bump(v => v + 1))
    );
    return () => unsubscribes.forEach(unsub => unsub());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeTo.join(',')]);

  // ─── Reactive State ──────────────────────────────────
  const currentUser = appStore.currentUser;
  const authToken = appStore.authToken;
  const clients = appStore.clients;
  const vpns = appStore.vpns;
  const connections = appStore.connections;
  const servers = appStore.servers;
  const contacts = appStore.contacts;
  const licenses = appStore.licenses;
  const tickets = appStore.tickets;
  const updates = appStore.updates;
  const customizations = appStore.customizations;
  const documents = appStore.documents;
  const notes = appStore.notes;
  const responsiblePersons = appStore.responsiblePersons;
  const preferences = appStore.preferences;

  // Computed
  const activeClientCount = appStore.activeClientCount;
  const openTicketCount = appStore.openTicketCount;

  // ─── Sync Read Helpers ───────────────────────────────
  const reads = useMemo(() => ({
    getClientsByStatus: (status: string) => appStore.getClientsByStatus(status),
    getVPNsByClient: (clientId: number) => appStore.getVPNsByClient(clientId),
    getConnectionsByClient: (clientId: number) => appStore.getConnectionsByClient(clientId),
    getServersByClient: (clientId: number) => appStore.getServersByClient(clientId),
    getContactsByClient: (clientId: number) => appStore.getContactsByClient(clientId),
    getLicensesByClient: (clientId: number) => appStore.getLicensesByClient(clientId),
    getTicketsByClient: (clientId: number) => appStore.getTicketsByClient(clientId),
    getUpdatesByClient: (clientId: number) => appStore.getUpdatesByClient(clientId),
    getCustomizationsByClient: (clientId: number) => appStore.getCustomizationsByClient(clientId),
    getDocumentsByCustomization: (customizationId: number) => appStore.getDocumentsByCustomization(customizationId),
    getNotesByClient: (clientId: number) => appStore.getNotesByClient(clientId),
    getResponsiblePersonsByClient: (clientId: number) => appStore.getResponsiblePersonsByClient(clientId),
    getAuditLogByClient: (clientId: number) => appStore.getAuditLogByClient(clientId),
    getExpiringLicenses: (days?: number) => appStore.getExpiringLicenses(days),
    getTicketStatistics: () => appStore.getTicketStatistics(),
    getSectionOrder: (clientId: string) => appStore.getSectionOrder(clientId),
    getUserById: (userId: number) => appStore.getUserById(userId),
    isAuthenticated: () => !!appStore.authToken,
    getCurrentUser: () => appStore.currentUser,
  }), []);

  // ─── Async Actions ───────────────────────────────────
  const actions = useMemo(() => ({
    // Auth
    login: (username: string, password: string) => api.auth.login({ username, password }),
    logout: () => api.auth.logout(),
    setCurrentUser: (user: UserDto) => api.auth.setCurrentUser(user),

    // Clients
    getClients: () => api.clients.getAll(),
    getClient: (id: number) => api.clients.getById(id),
    createClient: (data: CreateClientDto) => api.clients.create(data),
    updateClient: (data: UpdateClientDto) => api.clients.update(data),
    deleteClient: (id: number) => api.clients.deleteClient(id),

    // VPNs
    getVPNsByClient: (clientId: number) => api.vpns.getByClient(clientId),
    createVPN: (data: CreateVPNConfigurationDto) => api.vpns.create(data),
    updateVPN: (data: UpdateVPNConfigurationDto) => api.vpns.update(data),
    deleteVPN: (id: number) => api.vpns.deleteVPN(id),

    // Connections
    getConnectionsByClient: (clientId: number) => api.connections.getByClient(clientId),
    createConnection: (data: CreateConnectionDto) => api.connections.create(data),
    updateConnection: (data: UpdateConnectionDto) => api.connections.update(data),
    deleteConnection: (id: number) => api.connections.deleteConnection(id),
    testConnection: (id: number) => api.connections.test(id),

    // Servers
    getServersByClient: (clientId: number) => api.servers.getByClient(clientId),
    createServer: (data: CreateServerDto) => api.servers.create(data),
    updateServer: (data: UpdateServerDto) => api.servers.update(data),
    deleteServer: (id: number) => api.servers.deleteServer(id),

    // Contacts
    getContactsByClient: (clientId: number) => api.contacts.getByClient(clientId),
    createContact: (data: CreateContactDto) => api.contacts.create(data),
    updateContact: (data: UpdateContactDto) => api.contacts.update(data),
    deleteContact: (id: number) => api.contacts.deleteContact(id),

    // Licenses
    getLicensesByClient: (clientId: number) => api.licenses.getByClient(clientId),
    createLicense: (data: CreateLicenseDto) => api.licenses.create(data),
    updateLicense: (data: UpdateLicenseDto) => api.licenses.update(data),
    deleteLicense: (id: number) => api.licenses.deleteLicense(id),
    renewLicense: (data: RenewLicenseDto) => api.licenses.renew(data),
    getExpiringLicenses: (days?: number) => api.licenses.getExpiring(days),

    // Statistics
    getUsage: (clientId: number, timeline?: string) => api.statistics.getUsage(clientId, timeline),
    getPerformance: (clientId: number, timeline?: string) => api.statistics.getPerformance(clientId, timeline),
    getFinancial: (clientId: number, timeline?: string) => api.statistics.getFinancial(clientId, timeline),
    getDashboardStats: (clientId: number, timeline?: string) => api.statistics.getDashboardStats(clientId, timeline),

    // Tickets
    getTicketsByClient: (clientId: number) => api.tickets.getByClient(clientId),
    createTicket: (data: CreateTicketDto) => api.tickets.create(data),
    updateTicket: (data: UpdateTicketDto) => api.tickets.update(data),
    deleteTicket: (id: number) => api.tickets.deleteTicket(id),
    getTicketStatistics: () => api.tickets.getStatistics(),

    // Updates
    getUpdatesByClient: (clientId: number) => api.updates.getByClient(clientId),
    createUpdate: (data: CreateUpdateDto) => api.updates.create(data),
    updateUpdate: (data: UpdateUpdateDto) => api.updates.update(data),
    deleteUpdate: (id: number) => api.updates.deleteUpdate(id),
    getUpcomingUpdates: (days?: number) => api.updates.getUpcoming(days),

    // Customizations
    getCustomizationsByClient: (clientId: number) => api.customizations.getByClient(clientId),
    createCustomization: (data: CreateCustomizationDto) => api.customizations.create(data),
    updateCustomization: (data: UpdateCustomizationDto) => api.customizations.update(data),
    deleteCustomization: (id: number) => api.customizations.deleteCustomization(id),
    getDocuments: (customizationId: number) => api.customizations.getDocuments(customizationId),
    uploadDocument: (customizationId: number, file: File, documentType?: string, description?: string, uploadedBy?: string) =>
      api.customizations.uploadDocument(customizationId, file, documentType, description, uploadedBy),
    updateDocument: (data: UpdateCustomizationDocumentDto) => api.customizations.updateDocument(data),
    deleteDocument: (id: number) => api.customizations.deleteDocument(id),
    downloadDocument: (id: number, fileName: string) => api.customizations.downloadDocument(id, fileName),
    getCustomizationSummary: (clientId: number) => api.customizations.getSummary(clientId),

    // Notes
    getNotesByClient: (clientId: number) => api.notes.getByClient(clientId),
    createNote: (data: CreateClientNoteDto) => api.notes.create(data),
    updateNote: (data: UpdateClientNoteDto) => api.notes.update(data),
    deleteNote: (id: number) => api.notes.deleteNote(id),

    // Responsible Persons
    getResponsiblePersonsByClient: (clientId: number) => api.responsiblePersons.getByClient(clientId),
    createResponsiblePerson: (data: CreateResponsiblePersonDto) => api.responsiblePersons.create(data),
    updateResponsiblePerson: (data: UpdateResponsiblePersonDto) => api.responsiblePersons.update(data),
    deleteResponsiblePerson: (id: number) => api.responsiblePersons.deleteResponsiblePerson(id),

    // Preferences
    setSectionOrder: (clientId: string, sections: SectionConfig[]) => api.preferences.setSectionOrder(clientId, sections),
    setSelectedClient: (clientId: number | null) => api.preferences.setSelectedClient(clientId),
    setTimelineFilter: (timeline: string) => api.preferences.setTimelineFilter(timeline),

    // Reset
    resetToDefaults: () => appStore.resetToDefaults(),
  }), []);

  return {
    // Reactive state
    currentUser,
    authToken,
    clients,
    vpns,
    connections,
    servers,
    contacts,
    licenses,
    tickets,
    updates,
    customizations,
    documents,
    notes,
    responsiblePersons,
    preferences,

    // Computed
    activeClientCount,
    openTicketCount,

    // Sync reads
    reads,

    // Async writes
    actions,
  };
}