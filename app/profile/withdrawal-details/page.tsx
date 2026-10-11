'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Shield, Smartphone, CreditCard, ArrowLeft, CheckCircle2, AlertCircle, Ban } from 'lucide-react';

export default function WithdrawalDetailsPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [withdrawalName, setWithdrawalName] = useState(user?.withdrawalName || '');
  const [gcashNum, setGcashNum] = useState(user?.gcashNum || '');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <Link href="/login" className="text-red-400 hover:underline">Please sign in</Link>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/profile/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          withdrawalName,
          gcashNum,
          reason: reason || 'User updated protected payout profile details.',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update details');

      setUser(data.profile);
      setSuccess('Payout details updated successfully. Changes recorded in security audit logs.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/profile"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </Link>
      </div>

      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Protected Payout Profile Details
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage your registered GCash account credentials and designated beneficiary name.
        </p>
      </div>

      {/* Demo Warning Banner */}
      <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-800/50 flex items-start gap-3 text-xs text-amber-300">
        <Ban className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <div className="leading-relaxed">
          <strong>Non-Wagering Demo Disclaimer:</strong> In accordance with regulatory safeguards, actual GCash withdrawals and monetary cashouts remain permanently disabled in demo mode. This form simulates account payout profile management and updates your secure ledger identity.
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Designated Payout Name (<code>withdrawalName</code>)
          </label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={withdrawalName}
              onChange={(e) => setWithdrawalName(e.target.value)}
              placeholder="e.g. Carlos Reyes"
              className="w-full pl-9 pr-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Must match your verified government identification.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Registered GCash Number (<code>gcashNum</code>)
          </label>
          <div className="relative">
            <Smartphone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={gcashNum}
              onChange={(e) => setGcashNum(e.target.value)}
              placeholder="09171234567"
              className="w-full pl-9 pr-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Philippine 11-digit mobile format (e.g. 09171234567).</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Reason for Update (Audit Reference)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Updated primary mobile number for demo profile"
            className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
          />
          <p className="text-[10px] text-neutral-500 mt-1">Recorded in immutable security audit logs.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow"
        >
          <span>{loading ? 'Saving Profile Details...' : 'Save Payout Details'}</span>
        </button>
      </form>
    </div>
  );
}
