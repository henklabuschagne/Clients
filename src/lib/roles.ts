// ─── Role-Based Access Control ─────────────────────────
// Defines which sections each role can view and edit.
// Components use `useRoleAccess()` hook to check permissions.

export type Role = 'admin' | 'delivery' | 'devops';

export type SectionId =
  | 'vpn'
  | 'connection'
  | 'servers'
  | 'contacts'
  | 'licenses'
  | 'statistics'
  | 'tickets'
  | 'updates'
  | 'notes'
  | 'responsiblePersons';

export interface SectionPermission {
  canView: boolean;
  canEdit: boolean;
}

/**
 * Permission matrix:
 * 
 * | Section      | admin       | delivery     | devops       |
 * |-------------|-------------|--------------|--------------|
 * | VPN         | view + edit | —            | view + edit  |
 * | Connection  | view + edit | —            | view + edit  |
 * | Servers     | view + edit | —            | view + edit  |
 * | Contacts    | view + edit | view + edit  | view only    |
 * | Licenses    | view + edit | view + edit  | view only    |
 * | Statistics  | view        | view         | view         |
 * | Tickets     | view + edit | view + edit  | view + edit  |
 * | Updates     | view + edit | view only    | view + edit  |
 * | Notes       | view + edit | view + edit  | view + edit  |
 * | Resp.Persons| view + edit | view + edit  | view only    |
 */
const permissionMatrix: Record<Role, Record<SectionId, SectionPermission>> = {
  admin: {
    vpn:        { canView: true, canEdit: true },
    connection: { canView: true, canEdit: true },
    servers:    { canView: true, canEdit: true },
    contacts:   { canView: true, canEdit: true },
    licenses:   { canView: true, canEdit: true },
    statistics: { canView: true, canEdit: false },
    tickets:    { canView: true, canEdit: true },
    updates:    { canView: true, canEdit: true },
    notes:      { canView: true, canEdit: true },
    responsiblePersons: { canView: true, canEdit: true },
  },
  delivery: {
    vpn:        { canView: false, canEdit: false },
    connection: { canView: false, canEdit: false },
    servers:    { canView: false, canEdit: false },
    contacts:   { canView: true, canEdit: true },
    licenses:   { canView: true, canEdit: true },
    statistics: { canView: true, canEdit: false },
    tickets:    { canView: true, canEdit: true },
    updates:    { canView: true, canEdit: false },
    notes:      { canView: true, canEdit: true },
    responsiblePersons: { canView: true, canEdit: true },
  },
  devops: {
    vpn:        { canView: true, canEdit: true },
    connection: { canView: true, canEdit: true },
    servers:    { canView: true, canEdit: true },
    contacts:   { canView: true, canEdit: false },
    licenses:   { canView: true, canEdit: false },
    statistics: { canView: true, canEdit: false },
    tickets:    { canView: true, canEdit: true },
    updates:    { canView: true, canEdit: true },
    notes:      { canView: true, canEdit: true },
    responsiblePersons: { canView: true, canEdit: false },
  },
};

export function getSectionPermission(role: string | undefined, sectionId: SectionId): SectionPermission {
  const r = (role || 'delivery') as Role;
  return permissionMatrix[r]?.[sectionId] ?? { canView: false, canEdit: false };
}

export function getVisibleSections(role: string | undefined): SectionId[] {
  const r = (role || 'delivery') as Role;
  const matrix = permissionMatrix[r];
  if (!matrix) return [];
  return (Object.keys(matrix) as SectionId[]).filter(id => matrix[id].canView);
}