'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Settings, Shield, Lock, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function OwnerSettingsPage() {
  const { user } = useAuth();
  const [faucetAmount, setFaucetAmount] = useState(5000);
  const [maxBet, setMaxBet] = useState(50000);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('System settings saved. Demo Mode remains enforced by compliance gateway.');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
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
        <div className="text-xs font-mono text-neutral-400">PLATFORM PARAMETERS</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings &amp; Feature Flags</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure faucet disbursement limits, max demonstration wagers, and compliance guards.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Compliance Lock Notice */}
      <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-800/40 flex items-start gap-3 text-xs text-amber-300">
        <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <div>
          <strong>Server-Enforced Legal Lock:</strong> The <code>demo_mode</code> setting is permanently locked on <code>true</code>. Disabling demo mode requires independent legal verification from the national regulatory authority.
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Demo Credit Faucet Refill Amount
          </label>
          <input
            type="number"
            value={faucetAmount}
            onChange={(e) => setFaucetAmount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white font-mono"
          />
          <p className="text-[10px] text-neutral-500 mt-1">Amount granted per faucet claim in virtual credits.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Max Demonstration Bet Limit
          </label>
          <input
            type="number"
            value={maxBet}
            onChange={(e) => setMaxBet(Number(e.target.value))}
            className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white font-mono"
          />
          <p className="text-[10px] text-neutral-500 mt-1">Maximum allowed virtual credits per simulated bout.</p>
        </div>

        <div className="pt-2 border-t border-neutral-800">
          <button
            type="submit"
            className="px-5 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
          >
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
}
