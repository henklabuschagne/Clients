// ─── Centralized Data Store ─────────────────────────────
// All application state lives here. Components NEVER import this directly.
// Only the API layer and the reactive hook may import this module.

import type {
  UserDto,
  ClientDto,
  VPNConfigurationDto,
  ConnectionDto,
  ServerDto,
  ContactDto,
  LicenseDto,
  TicketDto,
  UpdateDto,
  CustomizationDto,
  CustomizationDocumentDto,
  ClientNoteDto,
  ResponsiblePersonDto,
  AuditLogEntryDto,
  AuditAction,
  AuditEntityType,
} from '../services/api';

// ─── Section Preferences ───────────────────────────────
export interface SectionConfig {
  id: string;
  name: string;
  pinned: boolean;
  hideForDelivery?: boolean;
}

export interface UserPreferences {
  sectionOrder: Record<string, SectionConfig[]>; // keyed by clientId
  selectedClientId: number | null;
  timelineFilter: string;
}

// ─── Slice & Subscriber System ─────────────────────────
export type Slice =
  | 'auth'
  | 'clients'
  | 'vpns'
  | 'connections'
  | 'servers'
  | 'contacts'
  | 'licenses'
  | 'tickets'
  | 'updates'
  | 'customizations'
  | 'documents'
  | 'notes'
  | 'responsiblePersons'
  | 'auditLog'
  | 'preferences';

type Listener = () => void;

const subscribers: Record<Slice, Set<Listener>> = {
  auth: new Set(),
  clients: new Set(),
  vpns: new Set(),
  connections: new Set(),
  servers: new Set(),
  contacts: new Set(),
  licenses: new Set(),
  tickets: new Set(),
  updates: new Set(),
  customizations: new Set(),
  documents: new Set(),
  notes: new Set(),
  responsiblePersons: new Set(),
  auditLog: new Set(),
  preferences: new Set(),
};

function notify(slice: Slice) {
  subscribers[slice].forEach(fn => fn());
  persistSlice(slice);
}

// ─── localStorage Persistence ──────────────────────────
const STORAGE_PREFIX = 'appStore_';

function persistSlice(slice: Slice) {
  try {
    let data: any;
    switch (slice) {
      case 'auth': data = { currentUser, authToken }; break;
      case 'clients': data = clients; break;
      case 'vpns': data = vpns; break;
      case 'connections': data = connections; break;
      case 'servers': data = servers; break;
      case 'contacts': data = contacts; break;
      case 'licenses': data = licenses; break;
      case 'tickets': data = tickets; break;
      case 'updates': data = updates; break;
      case 'customizations': data = customizations; break;
      case 'documents': data = documents; break;
      case 'notes': data = notes; break;
      case 'responsiblePersons': data = responsiblePersons; break;
      case 'auditLog': data = auditLog; break;
      case 'preferences': data = preferences; break;
    }
    localStorage.setItem(`${STORAGE_PREFIX}${slice}`, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable
  }
}

function loadSlice<T>(slice: Slice, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${slice}`);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function clearAllPersistedData() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}

// ─── Default Seed Data ─────────────────────────────────

const defaultUsers: UserDto[] = [
  { userId: 1, username: 'admin', email: 'admin@example.com', role: 'admin', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', lastLogin: '2024-11-25T00:00:00.000Z' },
  { userId: 2, username: 'delivery', email: 'delivery@example.com', role: 'delivery', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', lastLogin: '2024-11-24T00:00:00.000Z' },
  { userId: 3, username: 'devops', email: 'devops@example.com', role: 'devops', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', lastLogin: '2024-11-23T00:00:00.000Z' },
];

const defaultClients: ClientDto[] = [
  { clientId: 1, name: 'Acme Corporation', company: 'Acme Corp', email: 'contact@acme.com', phone: '+1-555-0100', address: '123 Business St', city: 'New York', country: 'USA', status: 'active', hosted: true, installLink: 'https://install.acme.com/setup', onboardingDate: '2024-01-15', notes: 'Premium client with 24/7 support', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { clientId: 2, name: 'TechStart Inc', company: 'TechStart', email: 'admin@techstart.io', phone: '+1-555-0200', address: '456 Innovation Ave', city: 'San Francisco', country: 'USA', status: 'active', hosted: true, installLink: 'https://setup.techstart.io', onboardingDate: '2024-02-01', notes: 'Growing startup, very responsive team', createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-11-18T00:00:00.000Z' },
  { clientId: 3, name: 'Global Solutions', company: 'Global Sol', email: 'info@globalsolutions.com', phone: '+1-555-0300', address: '789 Enterprise Blvd', city: 'London', country: 'UK', status: 'inactive', hosted: false, installLink: 'https://install.globalsol.com', onboardingDate: '2023-11-01', notes: 'On hold pending contract renewal', createdAt: '2023-11-01T00:00:00.000Z', updatedAt: '2024-10-15T00:00:00.000Z' },
  { clientId: 4, name: 'Innovation Labs', company: 'InnoLabs', email: 'hello@innolabs.com', phone: '+1-555-0400', address: '321 Research Park', city: 'Austin', country: 'USA', status: 'active', hosted: true, installLink: 'https://setup.innolabs.com', onboardingDate: '2024-03-10', createdAt: '2024-03-10T00:00:00.000Z', updatedAt: '2024-11-22T00:00:00.000Z' },
  { clientId: 5, name: 'Digital Dynamics', company: 'DigitalDyn', email: 'support@digitaldynamics.com', phone: '+1-555-0500', address: '654 Tech Circle', city: 'Seattle', country: 'USA', status: 'pending', hosted: false, onboardingDate: '2024-11-20', notes: 'New client, onboarding in progress', createdAt: '2024-11-20T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { clientId: 6, name: 'Cloud Services Ltd', company: 'CloudServ', email: 'info@cloudservices.com', phone: '+44-20-7946-0958', address: '10 Cloud Way', city: 'Dublin', country: 'Ireland', status: 'active', hosted: true, installLink: 'https://install.cloudserv.com', onboardingDate: '2024-04-20', notes: 'EU-based client, GDPR compliant setup', createdAt: '2024-04-20T00:00:00.000Z', updatedAt: '2024-11-19T00:00:00.000Z' },
];

const defaultVPNs: VPNConfigurationDto[] = [
  { vpnId: 1, clientId: 1, name: 'Primary VPN', vpnType: 'openvpn', serverAddress: 'vpn1.acme.com', port: 1194, protocol: 'UDP', username: 'acme_vpn', isActive: true, lastConnected: '2024-11-25T00:00:00.000Z', notes: 'Main VPN configuration for all users', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { vpnId: 2, clientId: 1, name: 'Backup VPN', vpnType: 'wireguard', serverAddress: 'vpn2.acme.com', port: 51820, protocol: 'UDP', isActive: false, notes: 'Backup VPN for failover', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-15T00:00:00.000Z' },
  { vpnId: 3, clientId: 2, name: 'Main VPN', vpnType: 'ipsec', serverAddress: 'vpn.techstart.io', port: 500, protocol: 'IKEv2', username: 'techstart_vpn', isActive: true, lastConnected: '2024-11-24T00:00:00.000Z', createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-11-18T00:00:00.000Z' },
  { vpnId: 4, clientId: 4, name: 'Lab VPN', vpnType: 'wireguard', serverAddress: 'vpn.innolabs.com', port: 51820, protocol: 'UDP', username: 'inno_vpn', isActive: true, lastConnected: '2024-11-22T00:00:00.000Z', createdAt: '2024-03-10T00:00:00.000Z', updatedAt: '2024-11-22T00:00:00.000Z' },
  { vpnId: 5, clientId: 6, name: 'EU VPN Gateway', vpnType: 'openvpn', serverAddress: 'vpn.cloudserv.com', port: 1194, protocol: 'TCP', isActive: true, lastConnected: '2024-11-19T00:00:00.000Z', createdAt: '2024-04-20T00:00:00.000Z', updatedAt: '2024-11-19T00:00:00.000Z' },
];

const defaultConnections: ConnectionDto[] = [
  { connectionId: 1, clientId: 1, connectionType: 'database', name: 'Production Database', host: 'db.acme.com', port: 5432, database: 'acme_prod', username: 'acme_user', isActive: true, lastTested: '2024-11-25T00:00:00.000Z', testStatus: 'success', notes: 'PostgreSQL production database', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { connectionId: 2, clientId: 1, connectionType: 'api', name: 'REST API', host: 'api.acme.com', port: 443, isActive: true, lastTested: '2024-11-25T00:00:00.000Z', testStatus: 'success', notes: 'Main REST API endpoint', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { connectionId: 3, clientId: 2, connectionType: 'database', name: 'Main Database', host: 'db.techstart.io', port: 3306, database: 'techstart_db', username: 'ts_user', isActive: true, lastTested: '2024-11-24T00:00:00.000Z', testStatus: 'success', notes: 'MySQL main database', createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-11-18T00:00:00.000Z' },
  { connectionId: 4, clientId: 4, connectionType: 'ssh', name: 'Lab SSH', host: 'ssh.innolabs.com', port: 22, username: 'deploy', isActive: true, lastTested: '2024-11-21T00:00:00.000Z', testStatus: 'success', createdAt: '2024-03-10T00:00:00.000Z', updatedAt: '2024-11-21T00:00:00.000Z' },
  { connectionId: 5, clientId: 6, connectionType: 'database', name: 'Cloud DB', host: 'db.cloudserv.com', port: 5432, database: 'cloudserv_prod', username: 'cs_admin', isActive: true, lastTested: '2024-11-19T00:00:00.000Z', testStatus: 'success', createdAt: '2024-04-20T00:00:00.000Z', updatedAt: '2024-11-19T00:00:00.000Z' },
];

const defaultServers: ServerDto[] = [
  { serverId: 1, clientId: 1, serverName: 'prod-web-01', serverType: 'web', environment: 'Production', ipAddress: '192.168.1.10', hostname: 'web01.acme.com', operatingSystem: 'Ubuntu 22.04 LTS', cpuCores: 8, ramGb: 32, diskGb: 500, location: 'US-East', provider: 'AWS', isActive: true, lastHealthCheck: '2024-11-25T00:00:00.000Z', healthStatus: 'healthy', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { serverId: 2, clientId: 1, serverName: 'prod-db-01', serverType: 'database', environment: 'Production', ipAddress: '192.168.1.11', hostname: 'db01.acme.com', operatingSystem: 'Ubuntu 22.04 LTS', cpuCores: 16, ramGb: 64, diskGb: 2000, location: 'US-East', provider: 'AWS', isActive: true, lastHealthCheck: '2024-11-25T00:00:00.000Z', healthStatus: 'healthy', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { serverId: 3, clientId: 1, serverName: 'dev-app-01', serverType: 'application', environment: 'Development', ipAddress: '192.168.1.20', hostname: 'dev01.acme.com', operatingSystem: 'Ubuntu 20.04 LTS', cpuCores: 4, ramGb: 16, diskGb: 250, location: 'EU-Central', provider: 'AWS', isActive: true, lastHealthCheck: '2024-11-24T00:00:00.000Z', healthStatus: 'warning', notes: 'Scheduled for maintenance', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-15T00:00:00.000Z' },
  { serverId: 4, clientId: 2, serverName: 'app-server-01', serverType: 'application', environment: 'Production', ipAddress: '10.0.1.5', hostname: 'app.techstart.io', operatingSystem: 'CentOS 8', cpuCores: 4, ramGb: 16, diskGb: 500, location: 'US-Central', provider: 'DigitalOcean', isActive: true, lastHealthCheck: '2024-11-24T00:00:00.000Z', healthStatus: 'healthy', createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-11-18T00:00:00.000Z' },
  { serverId: 5, clientId: 4, serverName: 'research-01', serverType: 'application', environment: 'Production', ipAddress: '10.10.1.5', hostname: 'research.innolabs.com', operatingSystem: 'Ubuntu 22.04 LTS', cpuCores: 32, ramGb: 128, diskGb: 4000, location: 'US-West', provider: 'GCP', isActive: true, lastHealthCheck: '2024-11-22T00:00:00.000Z', healthStatus: 'healthy', createdAt: '2024-03-10T00:00:00.000Z', updatedAt: '2024-11-22T00:00:00.000Z' },
  { serverId: 6, clientId: 6, serverName: 'cloud-web-01', serverType: 'web', environment: 'Production', ipAddress: '10.20.1.5', hostname: 'web.cloudserv.com', operatingSystem: 'Debian 12', cpuCores: 8, ramGb: 32, diskGb: 1000, location: 'EU-West', provider: 'AWS', isActive: true, lastHealthCheck: '2024-11-19T00:00:00.000Z', healthStatus: 'healthy', createdAt: '2024-04-20T00:00:00.000Z', updatedAt: '2024-11-19T00:00:00.000Z' },
];

const defaultContacts: ContactDto[] = [
  { contactId: 1, clientId: 1, firstName: 'John', lastName: 'Smith', email: 'john.smith@acme.com', phone: '+1-555-0101', mobile: '+1-555-0111', position: 'CTO', department: 'Technology', isPrimary: true, isActive: true, notes: 'Primary technical contact', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { contactId: 2, clientId: 1, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@acme.com', phone: '+1-555-0102', mobile: '+1-555-0112', position: 'IT Manager', department: 'IT Operations', isPrimary: false, isActive: true, createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { contactId: 3, clientId: 1, firstName: 'Mike', lastName: 'Davis', email: 'mike.d@acme.com', phone: '+1-555-0103', position: 'System Admin', department: 'IT Operations', isPrimary: false, isActive: true, createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { contactId: 4, clientId: 2, firstName: 'Emily', lastName: 'Chen', email: 'emily@techstart.io', phone: '+1-555-0201', mobile: '+1-555-0211', position: 'CEO', department: 'Executive', isPrimary: true, isActive: true, createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-11-18T00:00:00.000Z' },
  { contactId: 5, clientId: 2, firstName: 'David', lastName: 'Park', email: 'david@techstart.io', phone: '+1-555-0202', position: 'DevOps Lead', department: 'Engineering', isPrimary: false, isActive: true, createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-11-18T00:00:00.000Z' },
  { contactId: 6, clientId: 3, firstName: 'James', lastName: 'Wilson', email: 'james.w@globalsolutions.com', phone: '+44-20-7946-0101', position: 'Project Director', department: 'PMO', isPrimary: true, isActive: true, createdAt: '2023-11-01T00:00:00.000Z', updatedAt: '2024-10-15T00:00:00.000Z' },
  { contactId: 7, clientId: 4, firstName: 'Lisa', lastName: 'Rodriguez', email: 'lisa@innolabs.com', phone: '+1-555-0401', position: 'Head of Research', department: 'R&D', isPrimary: true, isActive: true, createdAt: '2024-03-10T00:00:00.000Z', updatedAt: '2024-11-22T00:00:00.000Z' },
  { contactId: 8, clientId: 5, firstName: 'Tom', lastName: 'Baker', email: 'tom@digitaldynamics.com', phone: '+1-555-0501', position: 'VP Engineering', department: 'Engineering', isPrimary: true, isActive: true, createdAt: '2024-11-20T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { contactId: 9, clientId: 6, firstName: 'Aoife', lastName: 'Murphy', email: 'aoife@cloudservices.com', phone: '+353-1-555-0601', position: 'CTO', department: 'Technology', isPrimary: true, isActive: true, createdAt: '2024-04-20T00:00:00.000Z', updatedAt: '2024-11-19T00:00:00.000Z' },
];

const defaultLicenses: LicenseDto[] = [
  { licenseId: 1, clientId: 1, softwareName: 'Enterprise Platform', licenseKey: 'ENT-ACME-2024-001', licenseType: 'subscription', quantity: 150, purchaseDate: '2024-01-15', expiryDate: '2025-12-31', renewalDate: '2025-11-30', cost: 50000, currency: 'USD', vendor: 'Finnivo', isActive: true, notes: 'Enterprise license with 24/7 support', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { licenseId: 2, clientId: 1, softwareName: 'VPN Access', licenseKey: 'VPN-ACME-2024-002', licenseType: 'subscription', quantity: 100, purchaseDate: '2024-01-15', expiryDate: '2024-12-25', renewalDate: '2024-12-15', cost: 5000, currency: 'USD', vendor: 'OpenVPN', isActive: true, notes: 'Expiring soon - renewal required', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { licenseId: 3, clientId: 1, softwareName: 'Support Package', licenseKey: 'SUP-ACME-2024-003', licenseType: 'subscription', quantity: 1, purchaseDate: '2024-01-15', expiryDate: '2025-12-31', cost: 15000, currency: 'USD', vendor: 'Finnivo', isActive: true, createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { licenseId: 4, clientId: 2, softwareName: 'Startup Plan', licenseKey: 'START-TECH-2024-001', licenseType: 'subscription', quantity: 50, purchaseDate: '2024-02-01', expiryDate: '2025-08-15', cost: 12000, currency: 'USD', vendor: 'Finnivo', isActive: true, createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-11-18T00:00:00.000Z' },
  { licenseId: 5, clientId: 4, softwareName: 'Research Platform', licenseKey: 'RES-INNO-2024-001', licenseType: 'subscription', quantity: 25, purchaseDate: '2024-03-10', expiryDate: '2025-03-10', renewalDate: '2025-02-10', cost: 30000, currency: 'USD', vendor: 'Finnivo', isActive: true, createdAt: '2024-03-10T00:00:00.000Z', updatedAt: '2024-11-22T00:00:00.000Z' },
  { licenseId: 6, clientId: 6, softwareName: 'Cloud Suite', licenseKey: 'CLD-SRV-2024-001', licenseType: 'subscription', quantity: 75, purchaseDate: '2024-04-20', expiryDate: '2025-04-20', cost: 28000, currency: 'EUR', vendor: 'Finnivo', isActive: true, createdAt: '2024-04-20T00:00:00.000Z', updatedAt: '2024-11-19T00:00:00.000Z' },
];

const defaultTickets: TicketDto[] = [
  { ticketId: 1, clientId: 1, ticketNumber: 'TKT-2024-001', title: 'VPN Connection Issues', description: 'Multiple users reporting intermittent VPN disconnections', priority: 'high', status: 'in_progress', category: 'Network', assignedTo: 3, reportedBy: 1, dueDate: '2024-11-28', createdAt: '2024-11-20T00:00:00.000Z', updatedAt: '2024-11-24T00:00:00.000Z' },
  { ticketId: 2, clientId: 1, ticketNumber: 'TKT-2024-002', title: 'License Renewal Request', description: 'VPN license expiring on 2024-12-25, please process renewal', priority: 'medium', status: 'open', category: 'Licensing', assignedTo: 1, reportedBy: 2, dueDate: '2024-12-15', createdAt: '2024-11-22T00:00:00.000Z', updatedAt: '2024-11-22T00:00:00.000Z' },
  { ticketId: 3, clientId: 1, ticketNumber: 'TKT-2024-003', title: 'Server Maintenance Completed', description: 'Routine maintenance on dev-app-01 completed successfully', priority: 'low', status: 'resolved', category: 'Maintenance', assignedTo: 3, reportedBy: 3, createdAt: '2024-11-15T00:00:00.000Z', updatedAt: '2024-11-16T00:00:00.000Z', resolvedAt: '2024-11-16T00:00:00.000Z' },
  { ticketId: 4, clientId: 2, ticketNumber: 'TKT-2024-004', title: 'Performance Optimization', description: 'Application response time increased, need investigation', priority: 'medium', status: 'open', category: 'Performance', assignedTo: 3, reportedBy: 2, dueDate: '2024-12-01', createdAt: '2024-11-23T00:00:00.000Z', updatedAt: '2024-11-23T00:00:00.000Z' },
  { ticketId: 5, clientId: 4, ticketNumber: 'TKT-2024-005', title: 'Storage Capacity Planning', description: 'Research data growing faster than expected, need to plan storage expansion', priority: 'medium', status: 'open', category: 'Infrastructure', assignedTo: 3, reportedBy: 1, dueDate: '2024-12-10', createdAt: '2024-11-21T00:00:00.000Z', updatedAt: '2024-11-21T00:00:00.000Z' },
  { ticketId: 6, clientId: 6, ticketNumber: 'TKT-2024-006', title: 'GDPR Compliance Review', description: 'Annual GDPR compliance review and documentation update', priority: 'high', status: 'in_progress', category: 'Compliance', assignedTo: 1, reportedBy: 2, dueDate: '2024-12-20', createdAt: '2024-11-18T00:00:00.000Z', updatedAt: '2024-11-19T00:00:00.000Z' },
];

const defaultUpdates: UpdateDto[] = [
  { updateId: 1, clientId: 1, title: 'Security Patches and Performance Improvements', description: 'Monthly security updates and performance optimizations', version: 'v2.5.0', updateType: 'security', priority: 'high', status: 'scheduled', scheduledDate: '2024-12-01', performedBy: 3, downtime: 30, rollbackPlan: 'Snapshot taken before update', createdAt: '2024-11-20T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { updateId: 2, clientId: 1, title: 'Critical Security Update', description: 'Patching CVE-2024-12345 vulnerability', version: 'v2.4.2', updateType: 'security', priority: 'critical', status: 'completed', scheduledDate: '2024-11-15', startedAt: '2024-11-15T02:00:00.000Z', completedAt: '2024-11-15T02:30:00.000Z', performedBy: 3, downtime: 25, createdAt: '2024-11-10T00:00:00.000Z', updatedAt: '2024-11-15T00:00:00.000Z' },
  { updateId: 3, clientId: 1, title: 'Bug Fixes and Stability Improvements', description: 'Various bug fixes and stability enhancements', version: 'v2.4.1', updateType: 'bugfix', priority: 'medium', status: 'completed', scheduledDate: '2024-11-01', startedAt: '2024-11-01T03:00:00.000Z', completedAt: '2024-11-01T03:45:00.000Z', performedBy: 3, downtime: 40, createdAt: '2024-10-25T00:00:00.000Z', updatedAt: '2024-11-01T00:00:00.000Z' },
  { updateId: 4, clientId: 2, title: 'Feature Updates', description: 'New features and improvements', version: 'v1.8.0', updateType: 'feature', priority: 'medium', status: 'completed', scheduledDate: '2024-11-10', startedAt: '2024-11-10T01:00:00.000Z', completedAt: '2024-11-10T02:00:00.000Z', performedBy: 3, downtime: 55, createdAt: '2024-11-05T00:00:00.000Z', updatedAt: '2024-11-10T00:00:00.000Z' },
  { updateId: 5, clientId: 4, title: 'Platform Upgrade v3.0', description: 'Major platform upgrade with new analytics engine', version: 'v3.0.0', updateType: 'feature', priority: 'high', status: 'scheduled', scheduledDate: '2024-12-15', performedBy: 3, downtime: 120, rollbackPlan: 'Full VM snapshot and DB backup', createdAt: '2024-11-20T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { updateId: 6, clientId: 6, title: 'EU Data Center Migration', description: 'Migrating to new EU data center for better latency', version: 'v2.1.0', updateType: 'maintenance', priority: 'high', status: 'scheduled', scheduledDate: '2024-12-10', performedBy: 3, downtime: 180, rollbackPlan: 'DNS failback to old data center', createdAt: '2024-11-15T00:00:00.000Z', updatedAt: '2024-11-15T00:00:00.000Z' },
];

const defaultCustomizations: CustomizationDto[] = [
  { customizationId: 1, clientId: 1, title: 'Custom Reporting Dashboard', customizationType: 'Custom Application', description: 'Custom dashboard for executive reporting with real-time KPIs', version: '2.1.0', developer: 'John Developer', implementationDate: '2024-03-15', status: 'active', technicalNotes: 'Built with React and D3.js, connects to main database via API', dependencies: 'Main API v2.4+, PostgreSQL 14+', codeRepository: 'https://github.com/acme/custom-dashboard', tags: 'reporting,dashboard,analytics', isArchived: false, createdDate: '2024-03-01T00:00:00.000Z', modifiedDate: '2024-10-15T00:00:00.000Z', documentCount: 3 },
  { customizationId: 2, clientId: 1, title: 'Advanced Data Validation Procedures', customizationType: 'Stored Procedure', description: 'Custom stored procedures for complex data validation', version: '1.5.2', developer: 'Sarah DBA', implementationDate: '2024-05-20', status: 'active', technicalNotes: 'PostgreSQL stored procedures with error handling and logging', dependencies: 'PostgreSQL 14+', tags: 'database,validation,data-quality', isArchived: false, createdDate: '2024-05-10T00:00:00.000Z', modifiedDate: '2024-11-01T00:00:00.000Z', documentCount: 2 },
  { customizationId: 3, clientId: 1, title: 'Email Notification System', customizationType: 'API Integration', description: 'Integration with SendGrid for automated email notifications', version: '1.0.0', developer: 'Mike API', implementationDate: '2024-07-10', status: 'active', technicalNotes: 'Uses SendGrid API v3, webhooks for delivery tracking', dependencies: 'SendGrid API, Main API v2.3+', codeRepository: 'https://github.com/acme/email-integration', tags: 'email,notifications,integration', isArchived: false, createdDate: '2024-06-15T00:00:00.000Z', modifiedDate: '2024-08-20T00:00:00.000Z', documentCount: 1 },
  { customizationId: 4, clientId: 2, title: 'Custom Authentication Module', customizationType: 'Custom Application', description: 'SSO integration with Azure AD', version: '1.2.0', developer: 'Emily Security', implementationDate: '2024-04-01', status: 'active', technicalNotes: 'OAuth 2.0 flow with Azure AD, JWT tokens', dependencies: 'Azure AD, Main API v1.5+', tags: 'authentication,sso,security', isArchived: false, createdDate: '2024-03-20T00:00:00.000Z', modifiedDate: '2024-09-10T00:00:00.000Z', documentCount: 4 },
];

const defaultDocuments: CustomizationDocumentDto[] = [
  { documentId: 1, customizationId: 1, fileName: 'Technical_Specification.pdf', filePath: '/clients/1/customizations/1/Technical_Specification.pdf', fileSize: 524288, fileType: 'application/pdf', documentType: 'Technical Specification', description: 'Complete technical specification for the custom reporting dashboard', uploadedBy: 'John Developer', uploadedAt: '2024-03-01T00:00:00.000Z', isArchived: false },
  { documentId: 2, customizationId: 1, fileName: 'User_Manual.pdf', filePath: '/clients/1/customizations/1/User_Manual.pdf', fileSize: 1048576, fileType: 'application/pdf', documentType: 'User Manual', description: 'End-user guide for the reporting dashboard', uploadedBy: 'Sarah Writer', uploadedAt: '2024-03-10T00:00:00.000Z', isArchived: false },
  { documentId: 3, customizationId: 1, fileName: 'API_Documentation.pdf', filePath: '/clients/1/customizations/1/API_Documentation.pdf', fileSize: 786432, fileType: 'application/pdf', documentType: 'Code Documentation', description: 'API endpoints documentation', uploadedBy: 'John Developer', uploadedAt: '2024-03-15T00:00:00.000Z', isArchived: false },
  { documentId: 4, customizationId: 2, fileName: 'Stored_Procedures.sql', filePath: '/clients/1/customizations/2/Stored_Procedures.sql', fileSize: 32768, fileType: 'text/plain', documentType: 'SQL Script', description: 'All validation stored procedures', uploadedBy: 'Sarah DBA', uploadedAt: '2024-05-20T00:00:00.000Z', isArchived: false },
  { documentId: 5, customizationId: 2, fileName: 'Database_Schema.pdf', filePath: '/clients/1/customizations/2/Database_Schema.pdf', fileSize: 655360, fileType: 'application/pdf', documentType: 'Architecture Diagram', description: 'Database schema diagrams', uploadedBy: 'Sarah DBA', uploadedAt: '2024-05-22T00:00:00.000Z', isArchived: false },
];

const defaultNotes: ClientNoteDto[] = [
  { noteId: 1, clientId: 1, content: 'Initial onboarding completed successfully. Client is very satisfied with the setup process and support team.', createdBy: 1, createdByUsername: 'admin', createdAt: '2024-01-16T00:00:00.000Z', updatedAt: '2024-01-16T00:00:00.000Z' },
  { noteId: 2, clientId: 1, content: 'Client requested 24/7 premium support package. Contract has been updated and billing team notified.', createdBy: 1, createdByUsername: 'admin', createdAt: '2024-02-10T00:00:00.000Z', updatedAt: '2024-02-10T00:00:00.000Z' },
  { noteId: 3, clientId: 1, content: 'Scheduled quarterly business review meeting for March 15th. Topics: performance metrics, upcoming features, and expansion plans.', createdBy: 2, createdByUsername: 'delivery', createdAt: '2024-02-28T00:00:00.000Z', updatedAt: '2024-02-28T00:00:00.000Z' },
  { noteId: 4, clientId: 1, content: 'VPN performance issues reported. DevOps investigating - appears to be related to peak usage hours. Monitoring closely.', createdBy: 3, createdByUsername: 'devops', createdAt: '2024-11-24T00:00:00.000Z', updatedAt: '2024-11-25T00:00:00.000Z' },
  { noteId: 5, clientId: 1, content: 'Client is considering expanding to 3 additional office locations. Preliminary discussions scheduled for December.', createdBy: 1, createdByUsername: 'admin', createdAt: '2024-11-15T00:00:00.000Z', updatedAt: '2024-11-15T00:00:00.000Z' },
  { noteId: 6, clientId: 1, content: 'Excellent feedback received from client\'s IT Director regarding system uptime and support responsiveness.', createdBy: 2, createdByUsername: 'delivery', createdAt: '2024-11-01T00:00:00.000Z', updatedAt: '2024-11-01T00:00:00.000Z' },
  { noteId: 7, clientId: 2, content: 'TechStart secured Series A funding! Anticipating growth from 20 to 50 employees over next 6 months. Need to scale infrastructure.', createdBy: 1, createdByUsername: 'admin', createdAt: '2024-05-15T00:00:00.000Z', updatedAt: '2024-05-15T00:00:00.000Z' },
  { noteId: 8, clientId: 2, content: 'Meeting with CTO scheduled for next week to discuss integration requirements for their new product launch.', createdBy: 3, createdByUsername: 'devops', createdAt: '2024-11-20T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { noteId: 9, clientId: 2, content: 'Client requested custom dashboard for real-time analytics. Development team has been briefed and will provide estimate.', createdBy: 2, createdByUsername: 'delivery', createdAt: '2024-10-05T00:00:00.000Z', updatedAt: '2024-10-05T00:00:00.000Z' },
  { noteId: 10, clientId: 2, content: 'Very responsive and tech-savvy team. They prefer Slack for communication and weekly sync meetings.', createdBy: 2, createdByUsername: 'delivery', createdAt: '2024-09-10T00:00:00.000Z', updatedAt: '2024-09-10T00:00:00.000Z' },
  { noteId: 11, clientId: 3, content: 'Contract renewal discussions postponed due to internal budget review. Client requested to pause services temporarily.', createdBy: 1, createdByUsername: 'admin', createdAt: '2024-10-15T00:00:00.000Z', updatedAt: '2024-10-15T00:00:00.000Z' },
  { noteId: 12, clientId: 3, content: 'Data backup completed and archived. All client configurations preserved for potential reactivation.', createdBy: 3, createdByUsername: 'devops', createdAt: '2024-10-20T00:00:00.000Z', updatedAt: '2024-10-20T00:00:00.000Z' },
  { noteId: 13, clientId: 4, content: 'Successful go-live! Client\'s research platform is now fully operational. Positive feedback from all stakeholders.', createdBy: 2, createdByUsername: 'delivery', createdAt: '2024-04-01T00:00:00.000Z', updatedAt: '2024-04-01T00:00:00.000Z' },
  { noteId: 14, clientId: 4, content: 'Security audit passed with flying colors. Client\'s compliance team very impressed with our security measures.', createdBy: 3, createdByUsername: 'devops', createdAt: '2024-09-20T00:00:00.000Z', updatedAt: '2024-09-20T00:00:00.000Z' },
  { noteId: 15, clientId: 4, content: 'Client expressed interest in beta testing new AI-powered analytics features. Added to beta program list.', createdBy: 1, createdByUsername: 'admin', createdAt: '2024-11-22T00:00:00.000Z', updatedAt: '2024-11-22T00:00:00.000Z' },
  { noteId: 16, clientId: 5, content: 'Kickoff meeting held. Client has clear requirements and timeline. Project manager assigned: Jane Doe.', createdBy: 1, createdByUsername: 'admin', createdAt: '2024-11-20T00:00:00.000Z', updatedAt: '2024-11-20T00:00:00.000Z' },
  { noteId: 17, clientId: 5, content: 'Initial infrastructure setup in progress. Client prefers AWS over Azure for hosting. Configuration 60% complete.', createdBy: 3, createdByUsername: 'devops', createdAt: '2024-11-21T00:00:00.000Z', updatedAt: '2024-11-21T00:00:00.000Z' },
  { noteId: 18, clientId: 5, content: 'Client team is very engaged and asking good questions. They have a strong technical background which will help smooth onboarding.', createdBy: 2, createdByUsername: 'delivery', createdAt: '2024-11-22T00:00:00.000Z', updatedAt: '2024-11-22T00:00:00.000Z' },
  { noteId: 19, clientId: 6, content: 'EU data residency requirements documented. All data must remain within EU borders per contractual obligation.', createdBy: 1, createdByUsername: 'admin', createdAt: '2024-04-22T00:00:00.000Z', updatedAt: '2024-04-22T00:00:00.000Z' },
  { noteId: 20, clientId: 6, content: 'GDPR audit scheduled for Q4. Client compliance team will participate in review sessions.', createdBy: 2, createdByUsername: 'delivery', createdAt: '2024-10-01T00:00:00.000Z', updatedAt: '2024-10-01T00:00:00.000Z' },
];

const defaultResponsiblePersons: ResponsiblePersonDto[] = [
  // Acme Corporation (clientId: 1) - Priority 1: RS + RC, Priority 2: RS + RC + RC
  { responsiblePersonId: 1, clientId: 1, name: 'Alice van der Merwe', email: 'alice@finnivo.com', role: 'reporting_specialist', priority: 1, isActive: true, createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-01-15T00:00:00.000Z' },
  { responsiblePersonId: 2, clientId: 1, name: 'Alice van der Merwe', email: 'alice@finnivo.com', role: 'reporting_consultant', priority: 1, isActive: true, createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-01-15T00:00:00.000Z' },
  { responsiblePersonId: 3, clientId: 1, name: 'Bob Nkosi', email: 'bob@finnivo.com', role: 'reporting_specialist', priority: 2, isActive: true, createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-01-15T00:00:00.000Z' },
  { responsiblePersonId: 4, clientId: 1, name: 'Bob Nkosi', email: 'bob@finnivo.com', role: 'reporting_consultant', priority: 2, isActive: true, createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-01-15T00:00:00.000Z' },
  { responsiblePersonId: 5, clientId: 1, name: 'Carol Pretorius', email: 'carol@finnivo.com', role: 'reporting_consultant', priority: 2, isActive: true, createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-01-15T00:00:00.000Z' },
  // TechStart Inc (clientId: 2)
  { responsiblePersonId: 6, clientId: 2, name: 'David Botha', email: 'david@finnivo.com', role: 'reporting_specialist', priority: 1, isActive: true, createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-02-01T00:00:00.000Z' },
  { responsiblePersonId: 7, clientId: 2, name: 'Emily Joubert', email: 'emily@finnivo.com', role: 'reporting_consultant', priority: 1, isActive: true, createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-02-01T00:00:00.000Z' },
  // Innovation Labs (clientId: 4)
  { responsiblePersonId: 8, clientId: 4, name: 'Fatima Molefe', email: 'fatima@finnivo.com', role: 'reporting_specialist', priority: 1, isActive: true, createdAt: '2024-03-10T00:00:00.000Z', updatedAt: '2024-03-10T00:00:00.000Z' },
  { responsiblePersonId: 9, clientId: 4, name: 'George du Plessis', email: 'george@finnivo.com', role: 'reporting_consultant', priority: 1, isActive: true, createdAt: '2024-03-10T00:00:00.000Z', updatedAt: '2024-03-10T00:00:00.000Z' },
  { responsiblePersonId: 10, clientId: 4, name: 'Hannah Venter', email: 'hannah@finnivo.com', role: 'reporting_specialist', priority: 2, isActive: true, createdAt: '2024-03-10T00:00:00.000Z', updatedAt: '2024-03-10T00:00:00.000Z' },
  // Cloud Services Ltd (clientId: 6)
  { responsiblePersonId: 11, clientId: 6, name: 'Ivan Steyn', email: 'ivan@finnivo.com', role: 'reporting_specialist', priority: 1, isActive: true, createdAt: '2024-04-20T00:00:00.000Z', updatedAt: '2024-04-20T00:00:00.000Z' },
  { responsiblePersonId: 12, clientId: 6, name: 'Jane Kruger', email: 'jane@finnivo.com', role: 'reporting_consultant', priority: 1, isActive: true, createdAt: '2024-04-20T00:00:00.000Z', updatedAt: '2024-04-20T00:00:00.000Z' },
];

const defaultAuditLog: AuditLogEntryDto[] = [
  // Client setup history
  { auditId: 1, clientId: 1, entityType: 'client', entityId: 1, action: 'created', summary: 'Client "Acme Corporation" created', userId: 1, username: 'admin', timestamp: '2024-01-15T09:00:00.000Z' },
  { auditId: 2, clientId: 1, entityType: 'vpn', entityId: 1, action: 'created', summary: 'VPN "Primary VPN" (OpenVPN) created', userId: 3, username: 'devops', timestamp: '2024-01-15T10:30:00.000Z' },
  { auditId: 3, clientId: 1, entityType: 'vpn', entityId: 2, action: 'created', summary: 'VPN "Backup VPN" (WireGuard) created', userId: 3, username: 'devops', timestamp: '2024-01-15T10:45:00.000Z' },
  { auditId: 4, clientId: 1, entityType: 'connection', entityId: 1, action: 'created', summary: 'Connection "Production Database" (database) created', userId: 3, username: 'devops', timestamp: '2024-01-15T11:00:00.000Z' },
  { auditId: 5, clientId: 1, entityType: 'connection', entityId: 2, action: 'created', summary: 'Connection "REST API" (api) created', userId: 3, username: 'devops', timestamp: '2024-01-15T11:15:00.000Z' },
  { auditId: 6, clientId: 1, entityType: 'server', entityId: 1, action: 'created', summary: 'Server "prod-web-01" (web, Production) created', userId: 3, username: 'devops', timestamp: '2024-01-15T12:00:00.000Z' },
  { auditId: 7, clientId: 1, entityType: 'server', entityId: 2, action: 'created', summary: 'Server "prod-db-01" (database, Production) created', userId: 3, username: 'devops', timestamp: '2024-01-15T12:30:00.000Z' },
  { auditId: 8, clientId: 1, entityType: 'contact', entityId: 1, action: 'created', summary: 'Contact "John Smith" (CTO) added', userId: 1, username: 'admin', timestamp: '2024-01-15T14:00:00.000Z' },
  { auditId: 9, clientId: 1, entityType: 'contact', entityId: 2, action: 'created', summary: 'Contact "Sarah Johnson" (IT Manager) added', userId: 1, username: 'admin', timestamp: '2024-01-15T14:15:00.000Z' },
  { auditId: 10, clientId: 1, entityType: 'license', entityId: 1, action: 'created', summary: 'License "Enterprise Platform" (subscription, 150 seats) created', userId: 1, username: 'admin', timestamp: '2024-01-15T15:00:00.000Z' },
  { auditId: 11, clientId: 1, entityType: 'license', entityId: 2, action: 'created', summary: 'License "VPN Access" (subscription, 100 seats) created', userId: 1, username: 'admin', timestamp: '2024-01-15T15:30:00.000Z' },
  { auditId: 12, clientId: 1, entityType: 'responsiblePerson', entityId: 1, action: 'created', summary: 'RS "Alice van der Merwe" assigned (Priority 1)', userId: 1, username: 'admin', timestamp: '2024-01-16T09:00:00.000Z' },
  { auditId: 13, clientId: 1, entityType: 'responsiblePerson', entityId: 2, action: 'created', summary: 'RC "Alice van der Merwe" assigned (Priority 1)', userId: 1, username: 'admin', timestamp: '2024-01-16T09:05:00.000Z' },
  { auditId: 14, clientId: 1, entityType: 'note', entityId: 1, action: 'created', summary: 'Note added: "Initial onboarding completed successfully..."', userId: 1, username: 'admin', timestamp: '2024-01-16T10:00:00.000Z' },
  // Updates over time
  { auditId: 15, clientId: 1, entityType: 'note', entityId: 2, action: 'created', summary: 'Note added: "Client requested 24/7 premium support..."', userId: 1, username: 'admin', timestamp: '2024-02-10T11:00:00.000Z' },
  { auditId: 16, clientId: 1, entityType: 'contact', entityId: 3, action: 'created', summary: 'Contact "Mike Davis" (System Admin) added', userId: 1, username: 'admin', timestamp: '2024-03-01T09:00:00.000Z' },
  { auditId: 17, clientId: 1, entityType: 'responsiblePerson', entityId: 3, action: 'created', summary: 'RS "Bob Nkosi" assigned (Priority 2)', userId: 1, username: 'admin', timestamp: '2024-05-10T10:00:00.000Z' },
  { auditId: 18, clientId: 1, entityType: 'responsiblePerson', entityId: 5, action: 'created', summary: 'RC "Carol Pretorius" assigned (Priority 2)', userId: 1, username: 'admin', timestamp: '2024-05-10T10:15:00.000Z' },
  { auditId: 19, clientId: 1, entityType: 'server', entityId: 3, action: 'created', summary: 'Server "dev-app-01" (application, Development) created', userId: 3, username: 'devops', timestamp: '2024-06-01T10:00:00.000Z' },
  { auditId: 20, clientId: 1, entityType: 'license', entityId: 3, action: 'created', summary: 'License "Support Package" (subscription) created', userId: 1, username: 'admin', timestamp: '2024-06-15T14:00:00.000Z' },
  { auditId: 21, clientId: 1, entityType: 'update', entityId: 3, action: 'created', summary: 'Update "Bug Fixes v2.4.1" (bugfix) scheduled', userId: 3, username: 'devops', timestamp: '2024-10-25T09:00:00.000Z' },
  { auditId: 22, clientId: 1, entityType: 'update', entityId: 3, action: 'updated', summary: 'Update "Bug Fixes v2.4.1" completed', details: 'Status changed from scheduled to completed', changedFields: ['status', 'startedAt', 'completedAt'], userId: 3, username: 'devops', timestamp: '2024-11-01T03:45:00.000Z' },
  { auditId: 23, clientId: 1, entityType: 'update', entityId: 2, action: 'created', summary: 'Update "Critical Security Update v2.4.2" (security) scheduled', userId: 3, username: 'devops', timestamp: '2024-11-10T09:00:00.000Z' },
  { auditId: 24, clientId: 1, entityType: 'update', entityId: 2, action: 'updated', summary: 'Update "Critical Security Update v2.4.2" completed', details: 'Status changed from scheduled to completed', changedFields: ['status', 'startedAt', 'completedAt'], userId: 3, username: 'devops', timestamp: '2024-11-15T02:30:00.000Z' },
  { auditId: 25, clientId: 1, entityType: 'ticket', entityId: 3, action: 'created', summary: 'Ticket TKT-2024-003 "Server Maintenance Completed" opened', userId: 3, username: 'devops', timestamp: '2024-11-15T08:00:00.000Z' },
  { auditId: 26, clientId: 1, entityType: 'ticket', entityId: 3, action: 'updated', summary: 'Ticket TKT-2024-003 resolved', details: 'Status changed to resolved', changedFields: ['status', 'resolvedAt'], userId: 3, username: 'devops', timestamp: '2024-11-16T10:00:00.000Z' },
  { auditId: 27, clientId: 1, entityType: 'ticket', entityId: 1, action: 'created', summary: 'Ticket TKT-2024-001 "VPN Connection Issues" opened (high priority)', userId: 1, username: 'admin', timestamp: '2024-11-20T09:00:00.000Z' },
  { auditId: 28, clientId: 1, entityType: 'update', entityId: 1, action: 'created', summary: 'Update "Security Patches v2.5.0" (security) scheduled for Dec 1', userId: 3, username: 'devops', timestamp: '2024-11-20T14:00:00.000Z' },
  { auditId: 29, clientId: 1, entityType: 'ticket', entityId: 2, action: 'created', summary: 'Ticket TKT-2024-002 "License Renewal Request" opened', userId: 2, username: 'delivery', timestamp: '2024-11-22T11:00:00.000Z' },
  { auditId: 30, clientId: 1, entityType: 'vpn', entityId: 2, action: 'updated', summary: 'VPN "Backup VPN" deactivated', details: 'isActive changed from true to false', changedFields: ['isActive'], userId: 3, username: 'devops', timestamp: '2024-11-15T09:00:00.000Z' },
  // Client 2 history
  { auditId: 31, clientId: 2, entityType: 'client', entityId: 2, action: 'created', summary: 'Client "TechStart Inc" created', userId: 1, username: 'admin', timestamp: '2024-02-01T09:00:00.000Z' },
  { auditId: 32, clientId: 2, entityType: 'contact', entityId: 4, action: 'created', summary: 'Contact "Emily Chen" (CEO) added', userId: 1, username: 'admin', timestamp: '2024-02-01T10:00:00.000Z' },
  { auditId: 33, clientId: 2, entityType: 'responsiblePerson', entityId: 6, action: 'created', summary: 'RS "David Botha" assigned (Priority 1)', userId: 1, username: 'admin', timestamp: '2024-02-01T10:30:00.000Z' },
  { auditId: 34, clientId: 2, entityType: 'vpn', entityId: 3, action: 'created', summary: 'VPN "Main VPN" (IPSec) created', userId: 3, username: 'devops', timestamp: '2024-02-01T11:00:00.000Z' },
  { auditId: 35, clientId: 2, entityType: 'ticket', entityId: 4, action: 'created', summary: 'Ticket TKT-2024-004 "Performance Optimization" opened', userId: 2, username: 'delivery', timestamp: '2024-11-23T09:00:00.000Z' },
  // Client 4 history
  { auditId: 36, clientId: 4, entityType: 'client', entityId: 4, action: 'created', summary: 'Client "Innovation Labs" created', userId: 1, username: 'admin', timestamp: '2024-03-10T09:00:00.000Z' },
  { auditId: 37, clientId: 4, entityType: 'responsiblePerson', entityId: 8, action: 'created', summary: 'RS "Fatima Molefe" assigned (Priority 1)', userId: 1, username: 'admin', timestamp: '2024-03-10T10:00:00.000Z' },
  { auditId: 38, clientId: 4, entityType: 'server', entityId: 5, action: 'created', summary: 'Server "research-01" (application, Production) created', userId: 3, username: 'devops', timestamp: '2024-03-10T12:00:00.000Z' },
  { auditId: 39, clientId: 4, entityType: 'update', entityId: 5, action: 'created', summary: 'Update "Platform Upgrade v3.0" (feature) scheduled for Dec 15', userId: 3, username: 'devops', timestamp: '2024-11-20T15:00:00.000Z' },
  // Client 6 history
  { auditId: 40, clientId: 6, entityType: 'client', entityId: 6, action: 'created', summary: 'Client "Cloud Services Ltd" created', userId: 1, username: 'admin', timestamp: '2024-04-20T09:00:00.000Z' },
  { auditId: 41, clientId: 6, entityType: 'responsiblePerson', entityId: 11, action: 'created', summary: 'RS "Ivan Steyn" assigned (Priority 1)', userId: 1, username: 'admin', timestamp: '2024-04-20T10:00:00.000Z' },
  { auditId: 42, clientId: 6, entityType: 'ticket', entityId: 6, action: 'created', summary: 'Ticket TKT-2024-006 "GDPR Compliance Review" opened (high priority)', userId: 1, username: 'admin', timestamp: '2024-11-18T09:00:00.000Z' },
];

const defaultPreferences: UserPreferences = {
  sectionOrder: {},
  selectedClientId: null,
  timelineFilter: '30d',
};

const defaultSectionOrder: SectionConfig[] = [
  { id: 'vpn', name: 'VPN', pinned: false },
  { id: 'connection', name: 'Connection', pinned: false },
  { id: 'servers', name: 'Servers', pinned: false, hideForDelivery: true },
  { id: 'contacts', name: 'Contacts', pinned: false },
  { id: 'licenses', name: 'Licenses', pinned: false },
  { id: 'statistics', name: 'Statistics', pinned: false },
  { id: 'tickets', name: 'Tickets', pinned: false },
  { id: 'updates', name: 'Updates', pinned: false },
  { id: 'notes', name: 'Notes', pinned: false },
  { id: 'responsiblePersons', name: 'Responsible Persons', pinned: false },
];

// ─── State ─────────────────────────────────────────────
let users: UserDto[] = loadSlice('auth', { currentUser: null, authToken: null }).currentUser ? defaultUsers : defaultUsers;
let currentUser: UserDto | null = loadSlice<{ currentUser: UserDto | null; authToken: string | null }>('auth', { currentUser: null, authToken: null }).currentUser;
let authToken: string | null = loadSlice<{ currentUser: UserDto | null; authToken: string | null }>('auth', { currentUser: null, authToken: null }).authToken;

let clients: ClientDto[] = loadSlice('clients', defaultClients);
let vpns: VPNConfigurationDto[] = loadSlice('vpns', defaultVPNs);
let connections: ConnectionDto[] = loadSlice('connections', defaultConnections);
let servers: ServerDto[] = loadSlice('servers', defaultServers);
let contacts: ContactDto[] = loadSlice('contacts', defaultContacts);
let licenses: LicenseDto[] = loadSlice('licenses', defaultLicenses);
let tickets: TicketDto[] = loadSlice('tickets', defaultTickets);
let updates: UpdateDto[] = loadSlice('updates', defaultUpdates);
let customizations: CustomizationDto[] = loadSlice('customizations', defaultCustomizations);
let documents: CustomizationDocumentDto[] = loadSlice('documents', defaultDocuments);
let notes: ClientNoteDto[] = loadSlice('notes', defaultNotes);
let responsiblePersons: ResponsiblePersonDto[] = loadSlice('responsiblePersons', defaultResponsiblePersons);
let auditLog: AuditLogEntryDto[] = loadSlice('auditLog', defaultAuditLog);
let preferences: UserPreferences = loadSlice('preferences', defaultPreferences);

// ─── ID Generators ─────────────────────────────────────
function nextId(arr: { [key: string]: any }[], idField: string): number {
  if (arr.length === 0) return 1;
  return Math.max(...arr.map(item => item[idField] || 0)) + 1;
}

function generateStringId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ─── Audit Logging Helper ──────────────────────────────
function logAudit(
  clientId: number,
  entityType: AuditEntityType,
  entityId: number | string,
  action: AuditAction,
  summary: string,
  details?: string,
  changedFields?: string[],
) {
  const user = currentUser;
  const entry: AuditLogEntryDto = {
    auditId: nextId(auditLog, 'auditId'),
    clientId,
    entityType,
    entityId,
    action,
    summary,
    details,
    changedFields,
    userId: user?.userId ?? 0,
    username: user?.username ?? 'system',
    timestamp: new Date().toISOString(),
  };
  auditLog = [...auditLog, entry];
  notify('auditLog');
}

function getAuditLogByClient(clientId: number): AuditLogEntryDto[] {
  return auditLog.filter(e => e.clientId === clientId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ─── Auth Methods ──────────────────────────────────────
function login(username: string, _password: string): UserDto | null {
  const user = users.find(u => u.username === username);
  if (!user) return null;
  currentUser = { ...user, lastLogin: new Date().toISOString() };
  authToken = `mock_token_${user.userId}_${Date.now()}`;
  notify('auth');
  return currentUser;
}

function logout() {
  currentUser = null;
  authToken = null;
  notify('auth');
}

function setCurrentUser(user: UserDto) {
  currentUser = user;
  notify('auth');
}

// ─── Client Methods ────────────────────────────────────
function createClient(data: Omit<ClientDto, 'clientId' | 'createdAt' | 'updatedAt'>): ClientDto {
  const client: ClientDto = {
    ...data,
    clientId: nextId(clients, 'clientId'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  clients = [...clients, client];
  notify('clients');
  logAudit(client.clientId, 'client', client.clientId, 'created', `Client "${client.name}" created`);
  return client;
}

function updateClient(clientId: number, data: Partial<ClientDto>): ClientDto | null {
  const index = clients.findIndex(c => c.clientId === clientId);
  if (index === -1) return null;
  const changed = Object.keys(data).filter(k => (data as any)[k] !== (clients[index] as any)[k]);
  clients[index] = { ...clients[index], ...data, updatedAt: new Date().toISOString() };
  clients = [...clients];
  notify('clients');
  logAudit(clientId, 'client', clientId, 'updated', `Client "${clients[index].name}" updated`, `Fields: ${changed.join(', ')}`, changed);
  return clients[index];
}

function deleteClient(clientId: number): boolean {
  const cl = clients.find(c => c.clientId === clientId);
  const before = clients.length;
  clients = clients.filter(c => c.clientId !== clientId);
  if (clients.length < before) {
    // Cross-domain side effects
    vpns = vpns.filter(v => v.clientId !== clientId);
    connections = connections.filter(c => c.clientId !== clientId);
    servers = servers.filter(s => s.clientId !== clientId);
    contacts = contacts.filter(c => c.clientId !== clientId);
    licenses = licenses.filter(l => l.clientId !== clientId);
    tickets = tickets.filter(t => t.clientId !== clientId);
    updates = updates.filter(u => u.clientId !== clientId);
    notes = notes.filter(n => n.clientId !== clientId);
    responsiblePersons = responsiblePersons.filter(r => r.clientId !== clientId);
    const custIds = customizations.filter(c => c.clientId === clientId).map(c => c.customizationId);
    customizations = customizations.filter(c => c.clientId !== clientId);
    documents = documents.filter(d => !custIds.includes(d.customizationId));
    notify('clients');
    notify('vpns');
    notify('connections');
    notify('servers');
    notify('contacts');
    notify('licenses');
    notify('tickets');
    notify('updates');
    notify('notes');
    notify('responsiblePersons');
    notify('customizations');
    notify('documents');
    if (cl) logAudit(clientId, 'client', clientId, 'deleted', `Client "${cl.name}" deleted`);
    return true;
  }
  return false;
}

// ─── VPN Methods ───────────────────────────────────────
function createVPN(data: Omit<VPNConfigurationDto, 'vpnId' | 'createdAt' | 'updatedAt'>): VPNConfigurationDto {
  const vpn: VPNConfigurationDto = { ...data, vpnId: nextId(vpns, 'vpnId'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  vpns = [...vpns, vpn];
  notify('vpns');
  logAudit(vpn.clientId, 'vpn', vpn.vpnId, 'created', `VPN "${vpn.name || vpn.serverAddress}" (${vpn.vpnType}) created`);
  return vpn;
}

function updateVPN(vpnId: number, data: Partial<VPNConfigurationDto>): VPNConfigurationDto | null {
  const index = vpns.findIndex(v => v.vpnId === vpnId);
  if (index === -1) return null;
  const old = vpns[index];
  const changed = Object.keys(data).filter(k => (data as any)[k] !== (old as any)[k]);
  vpns[index] = { ...old, ...data, updatedAt: new Date().toISOString() };
  vpns = [...vpns];
  notify('vpns');
  logAudit(old.clientId, 'vpn', vpnId, 'updated', `VPN "${vpns[index].name || vpns[index].serverAddress}" updated`, `Fields: ${changed.join(', ')}`, changed);
  return vpns[index];
}

function deleteVPN(vpnId: number): boolean {
  const vpn = vpns.find(v => v.vpnId === vpnId);
  const before = vpns.length;
  vpns = vpns.filter(v => v.vpnId !== vpnId);
  if (vpns.length < before) { notify('vpns'); if (vpn) logAudit(vpn.clientId, 'vpn', vpnId, 'deleted', `VPN "${vpn.name || vpn.serverAddress}" deleted`); return true; }
  return false;
}

// ─── Connection Methods ────────────────────────────────
function createConnection(data: Omit<ConnectionDto, 'connectionId' | 'createdAt' | 'updatedAt'>): ConnectionDto {
  const conn: ConnectionDto = { ...data, connectionId: nextId(connections, 'connectionId'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  connections = [...connections, conn];
  notify('connections');
  logAudit(conn.clientId, 'connection', conn.connectionId, 'created', `Connection "${conn.name}" (${conn.connectionType}) created`);
  return conn;
}

function updateConnection(connectionId: number, data: Partial<ConnectionDto>): ConnectionDto | null {
  const index = connections.findIndex(c => c.connectionId === connectionId);
  if (index === -1) return null;
  const old = connections[index];
  const changed = Object.keys(data).filter(k => (data as any)[k] !== (old as any)[k]);
  connections[index] = { ...old, ...data, updatedAt: new Date().toISOString() };
  connections = [...connections];
  notify('connections');
  logAudit(old.clientId, 'connection', connectionId, 'updated', `Connection "${connections[index].name}" updated`, `Fields: ${changed.join(', ')}`, changed);
  return connections[index];
}

function deleteConnection(connectionId: number): boolean {
  const conn = connections.find(c => c.connectionId === connectionId);
  const before = connections.length;
  connections = connections.filter(c => c.connectionId !== connectionId);
  if (connections.length < before) { notify('connections'); if (conn) logAudit(conn.clientId, 'connection', connectionId, 'deleted', `Connection "${conn.name}" deleted`); return true; }
  return false;
}

// ─── Server Methods ────────────────────────────────────
function createServer(data: Omit<ServerDto, 'serverId' | 'createdAt' | 'updatedAt'>): ServerDto {
  const server: ServerDto = { ...data, serverId: nextId(servers, 'serverId'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  servers = [...servers, server];
  notify('servers');
  logAudit(server.clientId, 'server', server.serverId, 'created', `Server "${server.serverName}" (${server.serverType}${server.environment ? ', ' + server.environment : ''}) created`);
  return server;
}

function updateServer(serverId: number, data: Partial<ServerDto>): ServerDto | null {
  const index = servers.findIndex(s => s.serverId === serverId);
  if (index === -1) return null;
  const old = servers[index];
  const changed = Object.keys(data).filter(k => (data as any)[k] !== (old as any)[k]);
  servers[index] = { ...old, ...data, updatedAt: new Date().toISOString() };
  servers = [...servers];
  notify('servers');
  logAudit(old.clientId, 'server', serverId, 'updated', `Server "${servers[index].serverName}" updated`, `Fields: ${changed.join(', ')}`, changed);
  return servers[index];
}

function deleteServer(serverId: number): boolean {
  const srv = servers.find(s => s.serverId === serverId);
  const before = servers.length;
  servers = servers.filter(s => s.serverId !== serverId);
  if (servers.length < before) { notify('servers'); if (srv) logAudit(srv.clientId, 'server', serverId, 'deleted', `Server "${srv.serverName}" deleted`); return true; }
  return false;
}

// ─── Contact Methods ───────────────────────────────────
function createContact(data: Omit<ContactDto, 'contactId' | 'createdAt' | 'updatedAt'>): ContactDto {
  const contact: ContactDto = { ...data, contactId: nextId(contacts, 'contactId'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  contacts = [...contacts, contact];
  notify('contacts');
  logAudit(contact.clientId, 'contact', contact.contactId, 'created', `Contact "${contact.firstName} ${contact.lastName}"${contact.position ? ' (' + contact.position + ')' : ''} added`);
  return contact;
}

function updateContact(contactId: number, data: Partial<ContactDto>): ContactDto | null {
  const index = contacts.findIndex(c => c.contactId === contactId);
  if (index === -1) return null;
  const old = contacts[index];
  const changed = Object.keys(data).filter(k => (data as any)[k] !== (old as any)[k]);
  contacts[index] = { ...old, ...data, updatedAt: new Date().toISOString() };
  contacts = [...contacts];
  notify('contacts');
  logAudit(old.clientId, 'contact', contactId, 'updated', `Contact "${contacts[index].firstName} ${contacts[index].lastName}" updated`, `Fields: ${changed.join(', ')}`, changed);
  return contacts[index];
}

function deleteContact(contactId: number): boolean {
  const ct = contacts.find(c => c.contactId === contactId);
  const before = contacts.length;
  contacts = contacts.filter(c => c.contactId !== contactId);
  if (contacts.length < before) { notify('contacts'); if (ct) logAudit(ct.clientId, 'contact', contactId, 'deleted', `Contact "${ct.firstName} ${ct.lastName}" deleted`); return true; }
  return false;
}

// ─── License Methods ───────────────────────────────────
function createLicense(data: Omit<LicenseDto, 'licenseId' | 'createdAt' | 'updatedAt'>): LicenseDto {
  const license: LicenseDto = { ...data, licenseId: nextId(licenses, 'licenseId'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  licenses = [...licenses, license];
  notify('licenses');
  logAudit(license.clientId, 'license', license.licenseId, 'created', `License "${license.softwareName}" (${license.licenseType}, ${license.quantity} seats) created`);
  return license;
}

function updateLicense(licenseId: number, data: Partial<LicenseDto>): LicenseDto | null {
  const index = licenses.findIndex(l => l.licenseId === licenseId);
  if (index === -1) return null;
  const old = licenses[index];
  const changed = Object.keys(data).filter(k => (data as any)[k] !== (old as any)[k]);
  licenses[index] = { ...old, ...data, updatedAt: new Date().toISOString() };
  licenses = [...licenses];
  notify('licenses');
  logAudit(old.clientId, 'license', licenseId, 'updated', `License "${licenses[index].softwareName}" updated`, `Fields: ${changed.join(', ')}`, changed);
  return licenses[index];
}

function deleteLicense(licenseId: number): boolean {
  const lic = licenses.find(l => l.licenseId === licenseId);
  const before = licenses.length;
  licenses = licenses.filter(l => l.licenseId !== licenseId);
  if (licenses.length < before) { notify('licenses'); if (lic) logAudit(lic.clientId, 'license', licenseId, 'deleted', `License "${lic.softwareName}" deleted`); return true; }
  return false;
}

function renewLicense(licenseId: number, newExpiryDate: string, newRenewalDate?: string, cost?: number): LicenseDto | null {
  const index = licenses.findIndex(l => l.licenseId === licenseId);
  if (index === -1) return null;
  licenses[index] = {
    ...licenses[index],
    expiryDate: newExpiryDate,
    renewalDate: newRenewalDate ?? licenses[index].renewalDate,
    cost: cost ?? licenses[index].cost,
    updatedAt: new Date().toISOString(),
  };
  licenses = [...licenses];
  notify('licenses');
  logAudit(licenses[index].clientId, 'license', licenseId, 'updated', `License "${licenses[index].softwareName}" renewed (expires ${newExpiryDate})`, `New expiry: ${newExpiryDate}`, ['expiryDate', 'renewalDate', 'cost']);
  return licenses[index];
}

// ─── Ticket Methods ────────────────────────────────────
function createTicket(data: Omit<TicketDto, 'ticketId' | 'createdAt' | 'updatedAt'>): TicketDto {
  const id = nextId(tickets, 'ticketId');
  const ticket: TicketDto = {
    ...data,
    ticketId: id,
    ticketNumber: data.ticketNumber || `TKT-2024-${String(id).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tickets = [...tickets, ticket];
  notify('tickets');
  logAudit(ticket.clientId, 'ticket', ticket.ticketId, 'created', `Ticket ${ticket.ticketNumber} "${ticket.title}" opened (${ticket.priority} priority)`);
  return ticket;
}

function updateTicket(ticketId: number, data: Partial<TicketDto>): TicketDto | null {
  const index = tickets.findIndex(t => t.ticketId === ticketId);
  if (index === -1) return null;
  const old = tickets[index];
  const changed = Object.keys(data).filter(k => (data as any)[k] !== (old as any)[k]);
  tickets[index] = { ...old, ...data, updatedAt: new Date().toISOString() };
  tickets = [...tickets];
  notify('tickets');
  const statusInfo = data.status && data.status !== old.status ? ` — status: ${old.status} → ${data.status}` : '';
  logAudit(old.clientId, 'ticket', ticketId, 'updated', `Ticket ${tickets[index].ticketNumber} "${tickets[index].title}" updated${statusInfo}`, `Fields: ${changed.join(', ')}`, changed);
  return tickets[index];
}

function deleteTicket(ticketId: number): boolean {
  const tkt = tickets.find(t => t.ticketId === ticketId);
  const before = tickets.length;
  tickets = tickets.filter(t => t.ticketId !== ticketId);
  if (tickets.length < before) { notify('tickets'); if (tkt) logAudit(tkt.clientId, 'ticket', ticketId, 'deleted', `Ticket ${tkt.ticketNumber} "${tkt.title}" deleted`); return true; }
  return false;
}

// ─── Update Methods ────────────────────────────────────
function createUpdate(data: Omit<UpdateDto, 'updateId' | 'createdAt' | 'updatedAt'>): UpdateDto {
  const upd: UpdateDto = { ...data, updateId: nextId(updates, 'updateId'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  updates = [...updates, upd];
  notify('updates');
  logAudit(upd.clientId, 'update', upd.updateId, 'created', `Update "${upd.title}" ${upd.version} (${upd.updateType}) ${upd.status}`);
  return upd;
}

function updateUpdate(updateId: number, data: Partial<UpdateDto>): UpdateDto | null {
  const index = updates.findIndex(u => u.updateId === updateId);
  if (index === -1) return null;
  const old = updates[index];
  const changed = Object.keys(data).filter(k => (data as any)[k] !== (old as any)[k]);
  updates[index] = { ...old, ...data, updatedAt: new Date().toISOString() };
  updates = [...updates];
  notify('updates');
  const statusInfo = data.status && data.status !== old.status ? ` — status: ${old.status} → ${data.status}` : '';
  logAudit(old.clientId, 'update', updateId, 'updated', `Update "${updates[index].title}" updated${statusInfo}`, `Fields: ${changed.join(', ')}`, changed);
  return updates[index];
}

function deleteUpdate(updateId: number): boolean {
  const upd = updates.find(u => u.updateId === updateId);
  const before = updates.length;
  updates = updates.filter(u => u.updateId !== updateId);
  if (updates.length < before) { notify('updates'); if (upd) logAudit(upd.clientId, 'update', updateId, 'deleted', `Update "${upd.title}" deleted`); return true; }
  return false;
}

// ─── Customization Methods ─────────────────────────────
function createCustomization(data: Omit<CustomizationDto, 'customizationId' | 'createdDate' | 'modifiedDate' | 'documentCount' | 'isArchived'>): CustomizationDto {
  const cust: CustomizationDto = { ...data, customizationId: nextId(customizations, 'customizationId'), isArchived: false, createdDate: new Date().toISOString(), modifiedDate: new Date().toISOString(), documentCount: 0 };
  customizations = [...customizations, cust];
  notify('customizations');
  return cust;
}

function updateCustomization(customizationId: number, data: Partial<CustomizationDto>): CustomizationDto | null {
  const index = customizations.findIndex(c => c.customizationId === customizationId);
  if (index === -1) return null;
  customizations[index] = { ...customizations[index], ...data, modifiedDate: new Date().toISOString() };
  customizations = [...customizations];
  notify('customizations');
  return customizations[index];
}

function deleteCustomization(customizationId: number): boolean {
  const before = customizations.length;
  customizations = customizations.filter(c => c.customizationId !== customizationId);
  if (customizations.length < before) {
    documents = documents.filter(d => d.customizationId !== customizationId);
    notify('customizations');
    notify('documents');
    return true;
  }
  return false;
}

// ─── Document Methods ──────────────────────────────────
function createDocument(data: Omit<CustomizationDocumentDto, 'documentId'>): CustomizationDocumentDto {
  const doc: CustomizationDocumentDto = { ...data, documentId: nextId(documents, 'documentId') };
  documents = [...documents, doc];
  // Update document count
  const custIdx = customizations.findIndex(c => c.customizationId === data.customizationId);
  if (custIdx !== -1) {
    customizations[custIdx] = { ...customizations[custIdx], documentCount: customizations[custIdx].documentCount + 1 };
    customizations = [...customizations];
    notify('customizations');
  }
  notify('documents');
  return doc;
}

function deleteDocument(documentId: number): boolean {
  const doc = documents.find(d => d.documentId === documentId);
  if (!doc) return false;
  documents = documents.filter(d => d.documentId !== documentId);
  const custIdx = customizations.findIndex(c => c.customizationId === doc.customizationId);
  if (custIdx !== -1 && customizations[custIdx].documentCount > 0) {
    customizations[custIdx] = { ...customizations[custIdx], documentCount: customizations[custIdx].documentCount - 1 };
    customizations = [...customizations];
    notify('customizations');
  }
  notify('documents');
  return true;
}

function updateDocument(documentId: number, data: Partial<CustomizationDocumentDto>): CustomizationDocumentDto | null {
  const index = documents.findIndex(d => d.documentId === documentId);
  if (index === -1) return null;
  documents[index] = { ...documents[index], ...data };
  documents = [...documents];
  notify('documents');
  return documents[index];
}

// ─── Note Methods ──────────────────────────────────────
function createNote(data: Omit<ClientNoteDto, 'noteId' | 'createdAt' | 'updatedAt'>): ClientNoteDto {
  const note: ClientNoteDto = { ...data, noteId: nextId(notes, 'noteId'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  notes = [...notes, note];
  notify('notes');
  logAudit(note.clientId, 'note', note.noteId, 'created', `Note added: "${note.content.substring(0, 60)}${note.content.length > 60 ? '...' : ''}"`);
  return note;
}

function updateNote(noteId: number, content: string): ClientNoteDto | null {
  const index = notes.findIndex(n => n.noteId === noteId);
  if (index === -1) return null;
  const old = notes[index];
  notes[index] = { ...old, content, updatedAt: new Date().toISOString() };
  notes = [...notes];
  notify('notes');
  logAudit(old.clientId, 'note', noteId, 'updated', `Note updated: "${content.substring(0, 60)}${content.length > 60 ? '...' : ''}"`);
  return notes[index];
}

function deleteNote(noteId: number): boolean {
  const nt = notes.find(n => n.noteId === noteId);
  const before = notes.length;
  notes = notes.filter(n => n.noteId !== noteId);
  if (notes.length < before) { notify('notes'); if (nt) logAudit(nt.clientId, 'note', noteId, 'deleted', `Note deleted`); return true; }
  return false;
}

// ─── Responsible Person Methods ─────────────────────────
function createResponsiblePerson(data: Omit<ResponsiblePersonDto, 'responsiblePersonId' | 'createdAt' | 'updatedAt'>): ResponsiblePersonDto {
  const rp: ResponsiblePersonDto = { ...data, responsiblePersonId: nextId(responsiblePersons, 'responsiblePersonId'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  responsiblePersons = [...responsiblePersons, rp];
  notify('responsiblePersons');
  const roleLabel = rp.role === 'reporting_specialist' ? 'RS' : 'RC';
  logAudit(rp.clientId, 'responsiblePerson', rp.responsiblePersonId, 'created', `${roleLabel} "${rp.name}" assigned (Priority ${rp.priority})`);
  return rp;
}

function updateResponsiblePerson(id: number, data: Partial<ResponsiblePersonDto>): ResponsiblePersonDto | null {
  const index = responsiblePersons.findIndex(r => r.responsiblePersonId === id);
  if (index === -1) return null;
  const old = responsiblePersons[index];
  const changed = Object.keys(data).filter(k => (data as any)[k] !== (old as any)[k]);
  responsiblePersons[index] = { ...old, ...data, updatedAt: new Date().toISOString() };
  responsiblePersons = [...responsiblePersons];
  notify('responsiblePersons');
  const roleLabel = responsiblePersons[index].role === 'reporting_specialist' ? 'RS' : 'RC';
  logAudit(old.clientId, 'responsiblePerson', id, 'updated', `${roleLabel} "${responsiblePersons[index].name}" updated`, `Fields: ${changed.join(', ')}`, changed);
  return responsiblePersons[index];
}

function deleteResponsiblePerson(id: number): boolean {
  const rp = responsiblePersons.find(r => r.responsiblePersonId === id);
  const before = responsiblePersons.length;
  responsiblePersons = responsiblePersons.filter(r => r.responsiblePersonId !== id);
  if (responsiblePersons.length < before) { notify('responsiblePersons'); if (rp) { const rl = rp.role === 'reporting_specialist' ? 'RS' : 'RC'; logAudit(rp.clientId, 'responsiblePerson', id, 'deleted', `${rl} "${rp.name}" removed`); } return true; }
  return false;
}

// ─── Preferences Methods ───────────────────────────────
function setSectionOrder(clientId: string, sections: SectionConfig[]) {
  preferences = { ...preferences, sectionOrder: { ...preferences.sectionOrder, [clientId]: sections } };
  notify('preferences');
}

function getSectionOrder(clientId: string): SectionConfig[] {
  return preferences.sectionOrder[clientId] || [...defaultSectionOrder];
}

function setSelectedClientId(clientId: number | null) {
  preferences = { ...preferences, selectedClientId: clientId };
  notify('preferences');
}

function setTimelineFilter(timeline: string) {
  preferences = { ...preferences, timelineFilter: timeline };
  notify('preferences');
}

// ─── Computed Getters ──────────────────────────────────
function getClientsByStatus(status: string): ClientDto[] {
  return clients.filter(c => c.status === status);
}

function getVPNsByClient(clientId: number): VPNConfigurationDto[] {
  return vpns.filter(v => v.clientId === clientId);
}

function getConnectionsByClient(clientId: number): ConnectionDto[] {
  return connections.filter(c => c.clientId === clientId);
}

function getServersByClient(clientId: number): ServerDto[] {
  return servers.filter(s => s.clientId === clientId);
}

function getContactsByClient(clientId: number): ContactDto[] {
  return contacts.filter(c => c.clientId === clientId);
}

function getLicensesByClient(clientId: number): LicenseDto[] {
  return licenses.filter(l => l.clientId === clientId);
}

function getTicketsByClient(clientId: number): TicketDto[] {
  return tickets.filter(t => t.clientId === clientId);
}

function getUpdatesByClient(clientId: number): UpdateDto[] {
  return updates.filter(u => u.clientId === clientId);
}

function getCustomizationsByClient(clientId: number): CustomizationDto[] {
  return customizations.filter(c => c.clientId === clientId);
}

function getDocumentsByCustomization(customizationId: number): CustomizationDocumentDto[] {
  return documents.filter(d => d.customizationId === customizationId);
}

function getNotesByClient(clientId: number): ClientNoteDto[] {
  return notes.filter(n => n.clientId === clientId);
}

function getResponsiblePersonsByClient(clientId: number): ResponsiblePersonDto[] {
  return responsiblePersons.filter(r => r.clientId === clientId);
}

function getExpiringLicenses(days: number = 30): LicenseDto[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return licenses.filter(l => {
    if (!l.expiryDate) return false;
    const expiry = new Date(l.expiryDate);
    return expiry >= now && expiry <= futureDate;
  });
}

function getTicketStatistics() {
  return {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    closedTickets: tickets.filter(t => t.status === 'closed').length,
    avgResolutionTime: 72,
  };
}

function getUserById(userId: number): UserDto | undefined {
  return users.find(u => u.userId === userId);
}

// ─── Reset to Defaults ─────────────────────────────────
function resetToDefaults() {
  clearAllPersistedData();
  clients = [...defaultClients];
  vpns = [...defaultVPNs];
  connections = [...defaultConnections];
  servers = [...defaultServers];
  contacts = [...defaultContacts];
  licenses = [...defaultLicenses];
  tickets = [...defaultTickets];
  updates = [...defaultUpdates];
  customizations = [...defaultCustomizations];
  documents = [...defaultDocuments];
  notes = [...defaultNotes];
  responsiblePersons = [...defaultResponsiblePersons];
  auditLog = [...defaultAuditLog];
  preferences = { ...defaultPreferences };
  currentUser = null;
  authToken = null;
  // Notify all slices
  (Object.keys(subscribers) as Slice[]).forEach(slice => notify(slice));
}

// ─── Public API ────────────────────────────────────────
export const appStore = {
  // Reactive state
  get users() { return users; },
  get currentUser() { return currentUser; },
  get authToken() { return authToken; },
  get clients() { return clients; },
  get vpns() { return vpns; },
  get connections() { return connections; },
  get servers() { return servers; },
  get contacts() { return contacts; },
  get licenses() { return licenses; },
  get tickets() { return tickets; },
  get updates() { return updates; },
  get customizations() { return customizations; },
  get documents() { return documents; },
  get notes() { return notes; },
  get responsiblePersons() { return responsiblePersons; },
  get auditLog() { return auditLog; },
  get preferences() { return preferences; },

  // Computed
  get activeClientCount() { return clients.filter(c => c.status === 'active').length; },
  get openTicketCount() { return tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length; },

  // Getters
  getClientsByStatus,
  getVPNsByClient,
  getConnectionsByClient,
  getServersByClient,
  getContactsByClient,
  getLicensesByClient,
  getTicketsByClient,
  getUpdatesByClient,
  getCustomizationsByClient,
  getDocumentsByCustomization,
  getNotesByClient,
  getResponsiblePersonsByClient,
  getAuditLogByClient,
  getExpiringLicenses,
  getTicketStatistics,
  getSectionOrder,
  getUserById,

  // Auth
  login,
  logout,
  setCurrentUser,

  // Client CRUD
  createClient,
  updateClient,
  deleteClient,

  // VPN CRUD
  createVPN,
  updateVPN,
  deleteVPN,

  // Connection CRUD
  createConnection,
  updateConnection,
  deleteConnection,

  // Server CRUD
  createServer,
  updateServer,
  deleteServer,

  // Contact CRUD
  createContact,
  updateContact,
  deleteContact,

  // License CRUD
  createLicense,
  updateLicense,
  deleteLicense,
  renewLicense,

  // Ticket CRUD
  createTicket,
  updateTicket,
  deleteTicket,

  // Update CRUD
  createUpdate,
  updateUpdate,
  deleteUpdate,

  // Customization CRUD
  createCustomization,
  updateCustomization,
  deleteCustomization,

  // Document CRUD
  createDocument,
  updateDocument,
  deleteDocument,

  // Note CRUD
  createNote,
  updateNote,
  deleteNote,

  // Responsible Person CRUD
  createResponsiblePerson,
  updateResponsiblePerson,
  deleteResponsiblePerson,

  // Preferences
  setSectionOrder,
  setSelectedClientId,
  setTimelineFilter,

  // Reset
  resetToDefaults,

  // Pub/sub
  subscribe(slice: Slice, listener: Listener): () => void {
    subscribers[slice].add(listener);
    return () => subscribers[slice].delete(listener);
  },
};
