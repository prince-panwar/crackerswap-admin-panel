import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/auth/AuthContext';
import { initialsFromEmail, roleLabel } from '@/auth/permissions';
import { formatDateTime } from '@/lib/format';
import ConfirmationModal from './components/ConfirmationModal';
import { AdminErrorState, AdminLoadingState } from './components/AdminStates';
import type { AdminRole, AdminUserResponse } from './api-types';

const roleColors: Record<string, string> = {
  super_admin: 'bg-[#FF6A1A]/10 text-[#FF6A1A] border-[#FF6A1A]/20',
  admin: 'bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/20',
};

const ROLE_OPTIONS: AdminRole[] = ['admin', 'super_admin'];

export default function AdminUsersPage() {
  const { admin: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<AdminUserResponse | null>(null);
  const [changeRoleTarget, setChangeRoleTarget] = useState<AdminUserResponse | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState('');

  // Create form
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('admin');
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .get<AdminUserResponse[]>('/admin/users')
      .then(setUsers)
      .catch((e) => setError(e?.message || 'Failed to load admins'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const patchUser = async (id: string, body: Record<string, unknown>, msg: string) => {
    try {
      await api.patch(`/admin/users/${id}`, body);
      showToast(msg);
      load();
    } catch (e) {
      showToast((e as { message?: string })?.message || 'Update failed');
    }
  };

  const handleCreate = async () => {
    if (!newEmail || newPassword.length < 8) {
      showToast('Enter an email and a password (min 8 chars)');
      return;
    }
    setCreating(true);
    try {
      await api.post('/admin/users', { email: newEmail.trim(), password: newPassword, role: newRole });
      setShowCreate(false);
      setNewEmail('');
      setNewPassword('');
      setNewRole('admin');
      showToast('Admin created');
      load();
    } catch (e) {
      showToast((e as { message?: string })?.message || 'Failed to create admin');
    } finally {
      setCreating(false);
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/admin/users/${confirmDelete.id}`);
      showToast('Admin deleted');
      setConfirmDelete(null);
      load();
    } catch (e) {
      showToast((e as { message?: string })?.message || 'Delete failed');
      setConfirmDelete(null);
    }
  };

  // Whether the actor may manage this row (not self, not the seeded admin).
  const canManage = (u: AdminUserResponse) => !u.isSeeded && u.id !== currentAdmin?.id;

  return (
    <div className="space-y-6">
      {/* Users table */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Admin Users</h3>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-xs font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <i className="ri-user-add-line mr-1.5"></i>Create Admin
          </button>
        </div>

        {loading && <div className="p-4"><AdminLoadingState /></div>}
        {!loading && error && <AdminErrorState onRetry={load} message={error} />}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A1A2E]/40">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Admin</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider hidden md:table-cell">Last Login</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A2E]/20">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1A1A2E]/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#7B61FF] flex items-center justify-center text-white text-xs font-bold">
                          {initialsFromEmail(user.email)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F6F2EA]">{user.email}</p>
                          {user.isSeeded && <p className="text-[10px] text-[#6E667E]">Default admin</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${roleColors[user.role] || ''}`}>
                        {roleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${user.isActive ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                        <i className="ri-circle-fill text-[6px]" />
                        {user.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-[#A69DB7]">{formatDateTime(user.lastLoginAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {canManage(user) && (
                          <>
                            <button onClick={() => setChangeRoleTarget(user)} title="Change role" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A69DB7] hover:text-white hover:bg-[#1A1A2E]/40 transition-all cursor-pointer">
                              <i className="ri-edit-line text-sm"></i>
                            </button>
                            <button
                              onClick={() => patchUser(user.id, { isActive: !user.isActive }, user.isActive ? 'User disabled' : 'User enabled')}
                              title={user.isActive ? 'Disable' : 'Enable'}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#FF8A3D] hover:bg-[#FF8A3D]/10 transition-all cursor-pointer"
                            >
                              <i className={`${user.isActive ? 'ri-user-unfollow-line' : 'ri-user-follow-line'} text-sm`}></i>
                            </button>
                            <button onClick={() => setConfirmDelete(user)} title="Delete" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#FF5B5B] hover:bg-[#FF5B5B]/10 transition-all cursor-pointer">
                              <i className="ri-delete-bin-line text-sm"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/*
        NO API: the granular "Permission Matrix" and per-user permissions drawer
        are removed — the backend has role-based access (super_admin / admin)
        rather than per-feature permissions.
      */}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-full bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-sm text-[#D8D1E6] animate-slide-down">
          <i className="ri-checkbox-circle-line text-[#34D07F] mr-2"></i>
          {toast}
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreate && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]" onClick={() => setShowCreate(false)} />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-[24px] bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-slide-up-in">
              <div className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-[#F6F2EA]">Create Admin</h3>
                <div>
                  <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="ops@crackerswap.local"
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] placeholder-[#6E667E] outline-none focus:border-[#6C4DFF]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Password (min 8 chars)</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] placeholder-[#6E667E] outline-none focus:border-[#6C4DFF]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#D8D1E6] outline-none cursor-pointer"
                  >
                    {ROLE_OPTIONS.map((r) => (<option key={r} value={r}>{roleLabel(r)}</option>))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 rounded-full border border-[#2A2A3E]/60 text-sm text-[#D8D1E6] hover:bg-[#1A1A2E]/40 transition-all cursor-pointer">Cancel</button>
                  <button onClick={handleCreate} disabled={creating} className="flex-1 px-4 py-2.5 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-sm font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer disabled:opacity-50">
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Change Role Modal */}
      {changeRoleTarget && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]" onClick={() => setChangeRoleTarget(null)} />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-[24px] bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-slide-up-in">
              <div className="p-6">
                <h3 className="text-base font-semibold text-[#F6F2EA]">Change Role</h3>
                <p className="text-xs text-[#A69DB7] mt-1 truncate">{changeRoleTarget.email} · Current: {roleLabel(changeRoleTarget.role)}</p>
                <div className="mt-4 space-y-2">
                  {ROLE_OPTIONS.map((role) => (
                    <button
                      key={role}
                      onClick={() => { patchUser(changeRoleTarget.id, { role }, `Role updated to ${roleLabel(role)}`); setChangeRoleTarget(null); }}
                      className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium border transition-all cursor-pointer ${
                        changeRoleTarget.role === role
                          ? 'bg-[#7B61FF]/10 border-[#7B61FF]/30 text-[#7B61FF]'
                          : 'bg-[#1A1A2E]/20 border-transparent text-[#D8D1E6] hover:border-[#2A2A3E]'
                      }`}
                    >
                      {roleLabel(role)}
                    </button>
                  ))}
                </div>
                <button onClick={() => setChangeRoleTarget(null)} className="w-full mt-3 px-4 py-2.5 rounded-full border border-[#2A2A3E]/60 text-sm text-[#D8D1E6] hover:bg-[#1A1A2E]/40 transition-all cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirm Delete */}
      <ConfirmationModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={doDelete}
        title="Delete admin user?"
        description={`This permanently removes ${confirmDelete?.email}'s admin access.`}
        confirmLabel="Delete User"
        variant="danger"
      />
    </div>
  );
}
