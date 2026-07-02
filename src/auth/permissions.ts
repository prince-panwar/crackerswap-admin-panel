import type { AdminRole } from '@/pages/admin/api-types';

// The backend only has two roles. Map them to the sidebar permission keys.
// (Token Queue and Settings have no backend and are dropped from the nav.)
const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: [
    'dashboard',
    'token-moderation',
    'featured-tokens',
    'monitoring',
    'users-roles',
    'transactions',
  ],
  // Regular admins can do everything except manage other admins.
  admin: [
    'dashboard',
    'token-moderation',
    'featured-tokens',
    'monitoring',
    'transactions',
  ],
};

export function permissionsForRole(role: AdminRole | undefined): string[] {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] ?? [];
}

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
};

export function roleLabel(role: string | undefined): string {
  if (!role) return '—';
  return ROLE_LABELS[role] ?? role;
}

export function initialsFromEmail(email: string | undefined): string {
  if (!email) return '?';
  const name = email.split('@')[0];
  const parts = name.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
