'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Users, Shield, Ban, CheckCircle2, AlertTriangle, ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { UserProfile, UserRole } from '@/lib/types';

export default function OwnerUsersManagementPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/owner/users');
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleSuspension = async (targetUser: UserProfile) => {
    if (!user) return;
    setError(null);
    setMessage(null);

    const nextStatus = targetUser.account_status === 'active' ? 'suspended' : 'active';
    const reason = prompt(
      `Please provide an administrative reason for ${nextStatus === 'suspended' ? 'suspending' : 'restoring'} ${targetUser.name}:`,
      nextStatus === 'suspended' ? 'Suspicious betting activity investigation' : 'Account cleared by owner review'
    );

    if (!reason) return;

    try {
      const res = await fetch('/api/owner/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_status',
          actorId: user.id,
          targetUserId: targetUser.id,
          status: nextStatus,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');

      setMessage(`Account ${targetUser.username} status updated to ${nextStatus}.`);
      loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const handleChangeRole = async (targetUser: UserProfile, newRole: UserRole) => {
    if (!user) return;
    if (targetUser.role === newRole) return;
    setError(null);
    setMessage(null);

    if (!confirm(`Are you sure you want to change @${targetUser.username}'s role to ${newRole.toUpperCase()}?`)) {
      return;
    }

    try {
      const res = await fetch('/api/owner/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_role',
          actorId: user.id,
          targetUserId: targetUser.id,
          newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Role update failed');

      setMessage(`User @${targetUser.username} role changed to ${newRole.toUpperCase()}.`);
      loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Role change failed');
    }
  };

  const filtered = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.gcashNum.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/owner"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Owner Desk</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">ACCESS CONTROL</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User &amp; Operator Accounts</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Superadmin account governance, role elevation, suspension freeze, and profile auditing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, username, or GCash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 w-64"
          />
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                <th className="py-2.5 pr-4">User</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Account Status</th>
                <th className="py-2.5 px-4">Protected Payout Info</th>
                <th className="py-2.5 px-4">Registered Date</th>
                <th className="py-2.5 pl-4 text-right">Owner Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-[11px]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-800/40">
                  <td className="py-3 pr-4">
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">@{p.username}</div>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <select
                      value={p.role}
                      onChange={(e) => handleChangeRole(p, e.target.value as UserRole)}
                      disabled={p.id === user?.id}
                      className="px-2 py-1 rounded bg-neutral-950 border border-neutral-800 text-xs text-amber-400 font-bold focus:outline-none"
                    >
                      <option value="bettor">BETTOR</option>
                      <option value="operator">OPERATOR</option>
                      <option value="owner">OWNER</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        p.account_status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {p.account_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    <div>{p.withdrawalName}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      GCash: {p.gcashNum ? p.gcashNum.replace(/(\d{4})\d{3}(\d{4})/, '$1***$2') : 'None'}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    {p.id !== user?.id && p.role !== 'owner' && (
                      <button
                        onClick={() => handleToggleSuspension(p)}
                        className={`px-3 py-1.5 rounded font-semibold text-xs border transition-colors ${
                          p.account_status === 'active'
                            ? 'bg-red-950/40 hover:bg-red-900/60 border-red-800 text-red-300'
                            : 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-800 text-emerald-300'
                        }`}
                      >
                        {p.account_status === 'active' ? 'Suspend' : 'Restore'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
