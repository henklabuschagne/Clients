// ===========================
// Canonical DTO Type Definitions
// ===========================
// All domain types live here. Used by hooks, lib/api/*, and lib/appStore.ts.
// The HTTP client for the real .NET Core backend lives in lib/api/config.ts.

// Authentication DTOs
export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  userId: number;
  username: string;
  email: string;
  role: string;
  expiresAt: string;
}

export interface UserDto {
  userId: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Client DTOs
export interface ClientDto {
  clientId: number;
  name: string;
  company: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  status: 'active' | 'inactive' | 'pending';
  hosted: boolean;
  installLink?: string;
  onboardingDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  company: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  status: string;
  hosted: boolean;
  installLink?: string;
  onboardingDate?: string;
  notes?: string;
}

export interface UpdateClientDto extends CreateClientDto {
  clientId: number;
}

// Client Status DTOs
export interface ClientStatusDto {
  statusId: number;
  clientId: number;
  statusType: 'operational' | 'degraded' | 'down' | 'maintenance';
  message?: string;
  affectedServices?: string;
  reportedAt: string;
  resolvedAt?: string;
  createdBy: number;
}

export interface CreateClientStatusDto {
  clientId: number;
  statusType: string;
  message?: string;
  affectedServices?: string;
  reportedAt?: string;
}

// Health Check DTOs
export interface HealthCheckDto {
  healthCheckId: number;
  clientId: number;
  checkType: 'ping' | 'http' | 'database' | 'service';
  endpoint?: string;
  status: 'success' | 'failure' | 'timeout';
  responseTime?: number;
  errorMessage?: string;
  checkedAt: string;
}

export interface CreateHealthCheckDto {
  clientId: number;
  checkType: string;
  endpoint?: string;
  status: string;
  responseTime?: number;
  errorMessage?: string;
}

// VPN Configuration DTOs
export interface VPNConfigurationDto {
  vpnId: number;
  clientId: number;
  name?: string;  // NEW: Display name for VPN config
  vpnType: 'openvpn' | 'wireguard' | 'ipsec' | 'l2tp';
  serverAddress: string;
  port: number;
  protocol?: string;
  username?: string;
  password?: string;
  certificatePath?: string;
  configFile?: string;
  isActive: boolean;
  lastConnected?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVPNConfigurationDto {
  clientId: number;
  name?: string;  // NEW: Display name for VPN config
  vpnType: string;
  serverAddress: string;
  port: number;
  protocol?: string;
  username?: string;
  password?: string;
  certificatePath?: string;
  configFile?: string;
  isActive: boolean;
  notes?: string;
}

export interface UpdateVPNConfigurationDto extends CreateVPNConfigurationDto {
  vpnId: number;
}

// Connection DTOs
export interface ConnectionDto {
  connectionId: number;
  clientId: number;
  connectionType: 'database' | 'api' | 'ftp' | 'ssh' | 'rdp' | 'other';
  name: string;
  host: string;
  port: number;
  database?: string;
  username?: string;
  password?: string;
  connectionString?: string;
  isActive: boolean;
  lastTested?: string;
  testStatus?: 'success' | 'failure';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConnectionDto {
  clientId: number;
  connectionType: string;
  name: string;
  host: string;
  port: number;
  database?: string;
  username?: string;
  password?: string;
  connectionString?: string;
  isActive: boolean;
  notes?: string;
}

export interface UpdateConnectionDto extends CreateConnectionDto {
  connectionId: number;
}

export interface TestConnectionDto {
  connectionId: number;
}

export interface TestConnectionResultDto {
  success: boolean;
  message: string;
  responseTime?: number;
}

// Server DTOs
export interface ServerDto {
  serverId: number;
  clientId: number;
  serverName: string;
  serverType: 'web' | 'database' | 'application' | 'mail' | 'file' | 'backup';
  environment?: 'Production' | 'Staging' | 'Development' | 'Testing' | 'QA';  // NEW: Server environment
  ipAddress: string;
  hostname?: string;
  operatingSystem?: string;
  cpuCores?: number;
  ramGb?: number;
  diskGb?: number;
  location?: string;
  provider?: string;
  isActive: boolean;
  lastHealthCheck?: string;
  healthStatus?: 'healthy' | 'warning' | 'critical';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServerDto {
  clientId: number;
  serverName: string;
  serverType: string;
  environment?: string;  // NEW: Server environment
  ipAddress: string;
  hostname?: string;
  operatingSystem?: string;
  cpuCores?: number;
  ramGb?: number;
  diskGb?: number;
  location?: string;
  provider?: string;
  isActive: boolean;
  notes?: string;
}

export interface UpdateServerDto extends CreateServerDto {
  serverId: number;
}

export interface ServerMetricDto {
  metricId: number;
  serverId: number;
  cpuUsage?: number;
  ramUsage?: number;
  diskUsage?: number;
  networkIn?: number;
  networkOut?: number;
  recordedAt: string;
}

export interface CreateServerMetricDto {
  serverId: number;
  cpuUsage?: number;
  ramUsage?: number;
  diskUsage?: number;
  networkIn?: number;
  networkOut?: number;
}

export interface SoftwareInstallationDto {
  installationId: number;
  serverId: number;
  softwareName: string;
  version: string;
  installedAt: string;
  licensePath?: string;
  notes?: string;
}

export interface CreateSoftwareInstallationDto {
  serverId: number;
  softwareName: string;
  version: string;
  installedAt?: string;
  licensePath?: string;
  notes?: string;
}

// Contact DTOs
export interface ContactDto {
  contactId: number;
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  department?: string;
  isPrimary: boolean;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactDto {
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  department?: string;
  isPrimary: boolean;
  isActive: boolean;
  notes?: string;
}

export interface UpdateContactDto extends CreateContactDto {
  contactId: number;
}

// License DTOs
export interface LicenseDto {
  licenseId: number;
  clientId: number;
  softwareName: string;
  licenseKey: string;
  licenseType: 'perpetual' | 'subscription' | 'trial';
  quantity: number;
  purchaseDate: string;
  expiryDate?: string;
  renewalDate?: string;
  cost?: number;
  currency?: string;
  vendor?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLicenseDto {
  clientId: number;
  softwareName: string;
  licenseKey: string;
  licenseType: string;
  quantity: number;
  purchaseDate: string;
  expiryDate?: string;
  renewalDate?: string;
  cost?: number;
  currency?: string;
  vendor?: string;
  isActive: boolean;
  notes?: string;
}

export interface UpdateLicenseDto extends CreateLicenseDto {
  licenseId: number;
}

export interface RenewLicenseDto {
  licenseId: number;
  newExpiryDate: string;
  newRenewalDate?: string;
  cost?: number;
}

// Statistics DTOs
export interface StatisticDto {
  statisticId: number;
  clientId: number;
  metricName: string;
  metricValue: number;
  unit?: string;
  category?: string;
  recordedAt: string;
  notes?: string;
}

export interface CreateStatisticDto {
  clientId: number;
  metricName: string;
  metricValue: number;
  unit?: string;
  category?: string;
  recordedAt?: string;
  notes?: string;
}

export interface UsageMetricDto {
  usageId: number;
  clientId: number;
  activeUsers?: number;
  totalRequests?: number;
  dataTransferMb?: number;
  storageUsedGb?: number;
  recordedAt: string;
}

export interface CreateUsageMetricDto {
  clientId: number;
  activeUsers?: number;
  totalRequests?: number;
  dataTransferMb?: number;
  storageUsedGb?: number;
}

export interface PerformanceMetricDto {
  performanceId: number;
  clientId: number;
  avgResponseTime?: number;
  errorRate?: number;
  uptime?: number;
  throughput?: number;
  recordedAt: string;
}

export interface CreatePerformanceMetricDto {
  clientId: number;
  avgResponseTime?: number;
  errorRate?: number;
  uptime?: number;
  throughput?: number;
}

export interface FinancialMetricDto {
  financialId: number;
  clientId: number;
  revenue?: number;
  cost?: number;
  profit?: number;
  currency?: string;
  period: string;
  recordedAt: string;
}

export interface CreateFinancialMetricDto {
  clientId: number;
  revenue?: number;
  cost?: number;
  profit?: number;
  currency?: string;
  period: string;
}

// Ticket DTOs
export interface TicketDto {
  ticketId: number;
  clientId: number;
  ticketNumber?: string;  // NEW: Auto-generated ticket number
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category?: string;
  assignedTo?: number;
  reportedBy?: number;
  dueDate?: string;  // NEW: When the ticket is due
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface CreateTicketDto {
  clientId: number;
  ticketNumber?: string;  // NEW: Optional, can be auto-generated
  title: string;
  description: string;
  priority: string;
  status: string;
  category?: string;
  assignedTo?: number;
  reportedBy?: number;
  dueDate?: string;  // NEW: When the ticket is due
}

export interface UpdateTicketDto extends CreateTicketDto {
  ticketId: number;
  resolvedAt?: string;
  closedAt?: string;
}

export interface TicketCommentDto {
  commentId: number;
  ticketId: number;
  userId: number;
  username?: string;
  comment: string;
  isInternal: boolean;
  createdAt: string;
}

export interface CreateTicketCommentDto {
  ticketId: number;
  userId: number;
  comment: string;
  isInternal: boolean;
}

export interface TicketAttachmentDto {
  attachmentId: number;
  ticketId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedBy: number;
  uploadedAt: string;
}

export interface TicketStatisticsDto {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  avgResolutionTime?: number;
}

// Update DTOs
export interface UpdateDto {
  updateId: number;
  clientId: number;
  title: string;
  description: string;
  version: string;
  updateType: 'feature' | 'bugfix' | 'security' | 'maintenance';
  priority?: 'critical' | 'high' | 'medium' | 'low';  // NEW: Update priority
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  performedBy?: number;
  downtime?: number;
  rollbackPlan?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUpdateDto {
  clientId: number;
  title: string;
  description: string;
  version: string;
  updateType: string;
  priority?: string;  // NEW: Update priority
  status: string;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  performedBy?: number;
  downtime?: number;
  rollbackPlan?: string;
  notes?: string;
}

export interface UpdateUpdateDto extends CreateUpdateDto {
  updateId: number;
}

export interface DeploymentStepDto {
  stepId: number;
  updateId: number;
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface CreateDeploymentStepDto {
  updateId: number;
  stepNumber: number;
  title: string;
  description: string;
  status: string;
  notes?: string;
}

export interface UpdateDeploymentStepDto extends CreateDeploymentStepDto {
  stepId: number;
  startedAt?: string;
  completedAt?: string;
}

// Customization DTOs
export interface CustomizationDto {
  customizationId: number;
  clientId: number;
  title: string;
  customizationType: 'Custom Application' | 'Stored Procedure' | 'Database Function' | 'API Integration' | 'UI Customization' | 'Report' | 'Workflow' | 'Configuration' | 'Other';
  description?: string;
  version?: string;
  developer?: string;
  implementationDate?: string;
  status: 'active' | 'deprecated' | 'planned' | 'testing' | 'inactive';
  technicalNotes?: string;
  dependencies?: string;
  codeRepository?: string;
  tags?: string;
  isArchived: boolean;
  createdDate: string;
  modifiedDate: string;
  documentCount: number;
}

export interface CreateCustomizationDto {
  clientId: number;
  title: string;
  customizationType: string;
  description?: string;
  version?: string;
  developer?: string;
  implementationDate?: string;
  status: string;
  technicalNotes?: string;
  dependencies?: string;
  codeRepository?: string;
  tags?: string;
}

export interface UpdateCustomizationDto extends CreateCustomizationDto {
  customizationId: number;
}

export interface CustomizationDocumentDto {
  documentId: number;
  customizationId: number;
  fileName: string;
  filePath: string;
  fileSize?: number;
  fileType?: string;
  documentType?: 'Technical Specification' | 'User Manual' | 'Code Documentation' | 'SQL Script' | 'Configuration File' | 'Test Cases' | 'Deployment Guide' | 'Architecture Diagram' | 'Other';
  description?: string;
  uploadedBy?: string;
  uploadedAt: string;
  isArchived: boolean;
}

export interface CreateCustomizationDocumentDto {
  customizationId: number;
  fileName: string;
  filePath: string;
  fileSize?: number;
  fileType?: string;
  documentType?: string;
  description?: string;
  uploadedBy?: string;
}

export interface UpdateCustomizationDocumentDto {
  documentId: number;
  fileName: string;
  documentType?: string;
  description?: string;
}

export interface CustomizationSummaryDto {
  totalCustomizations: number;
  activeCustomizations: number;
  deprecatedCustomizations: number;
  plannedCustomizations: number;
  testingCustomizations: number;
  totalDocuments: number;
}

// Client Note DTOs
export interface ClientNoteDto {
  noteId: number;
  clientId: number;
  content: string;
  createdBy: number;
  createdByUsername?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientNoteDto {
  clientId: number;
  content: string;
}

export interface UpdateClientNoteDto {
  noteId: number;
  content: string;
}

// Responsible Person DTOs
export interface ResponsiblePersonDto {
  responsiblePersonId: number;
  clientId: number;
  name: string;
  email?: string;
  role: 'reporting_specialist' | 'reporting_consultant';
  priority: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResponsiblePersonDto {
  clientId: number;
  name: string;
  email?: string;
  role: 'reporting_specialist' | 'reporting_consultant';
  priority: number;
  notes?: string;
  isActive: boolean;
}

export interface UpdateResponsiblePersonDto extends CreateResponsiblePersonDto {
  responsiblePersonId: number;
}

// Audit Log DTOs
export type AuditAction = 'created' | 'updated' | 'deleted';
export type AuditEntityType =
  | 'client'
  | 'vpn'
  | 'connection'
  | 'server'
  | 'contact'
  | 'license'
  | 'ticket'
  | 'update'
  | 'note'
  | 'responsiblePerson'
  | 'customization'
  | 'document';

export interface AuditLogEntryDto {
  auditId: number;
  clientId: number;
  entityType: AuditEntityType;
  entityId: number | string;
  action: AuditAction;
  summary: string;
  details?: string;
  changedFields?: string[];
  userId: number;
  username: string;
  timestamp: string;
}