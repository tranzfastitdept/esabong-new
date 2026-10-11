'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Sliders, Shield, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '@/lib/types';

export default function OwnerOperatorsPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/owner/users');
        const data = await res.json();
        setProfiles(data.profiles || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const operators = profiles.filter((p) => p.role === 'operator');
  const availableBettors = profiles.filter((p) => p.role === 'bettor');

  const handlePromoteToOperator = async (bettorId: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/owner/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_role',
          actorId: user.id,
          targetUserId: bettorId,
          newRole: 'operator',
        }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

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

      <div className="border-b border-neutral-800 pb-6">
        <div className="text-xs font-mono text-neutral-400">OPERATOR DELEGATION</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Operator Authorization &amp; Roster</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Authorized personnel granted camera switcher, match state control, and result entry permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Operators Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Currently Authorized Operators ({operators.length})</span>
          </h2>

          <div className="space-y-3">
            {operators.map((op) => (
              <div
                key={op.id}
                className="p-3.5 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{op.name}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">@{op.username}</div>
                </div>

                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold">
                  ACTIVE OPERATOR
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Promote Bettor Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span>Designate New Operator from Users</span>
          </h2>

          <p className="text-xs text-neutral-400">
            Promote an existing registered user to grant match scheduling and live multi-camera broadcast privileges.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {availableBettors.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{b.name}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">@{b.username}</div>
                </div>

                <button
                  onClick={() => handlePromoteToOperator(b.id)}
                  className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700"
                >
                  Grant Operator Role
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
