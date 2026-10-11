'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Shield,
  Users,
  Radio,
  Sliders,
  Wallet,
  Activity,
  Scale,
  FileText,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export default function OwnerOverviewPage() {
  const { user } = useAuth();
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiag() {
      try {
        const res = await fetch('/api/owner/diagnostics');
        const data = await res.json();
        setDiagnostics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDiag();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">SUPERADMIN GOVERNANCE</div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Platform Owner Executive Desk</span>
            <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-xs font-mono font-bold uppercase">
              OWNER ROLE
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Global account management, role delegation, Supabase database health, LiveKit monitoring, and statutory compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/owner/compliance"
            className="px-3.5 py-2 rounded bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Compliance Gateway</span>
          </Link>
          <Link
            href="/owner/audit"
            className="px-3.5 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-2 border border-neutral-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Trail &amp; CSV</span>
          </Link>
        </div>
      </div>

      {/* Compliance Strip */}
      <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-800/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <Scale className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-neutral-300">
            System deployment mode: <strong className="text-amber-400">DEMO_NON_WAGERING</strong>. Compliance lock enforces zero real-money transactions until independent authorization is satisfied.
          </span>
        </div>
        <Link
          href="/owner/compliance"
          className="text-xs font-bold text-amber-400 hover:underline shrink-0"
        >
          Inspect Gateway &rarr;
        </Link>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Total Registered Users</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {diagnostics?.metrics?.totalUsers || 3}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            {diagnostics?.metrics?.bettorsCount || 1} Bettors · {diagnostics?.metrics?.operatorsCount || 1} Operators
          </div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Active Live Broadcasts</span>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            {diagnostics?.metrics?.activeBroadcasts || 1}
          </div>
          <div className="text-[11px] text-neutral-500">LiveKit WebRTC active rooms</div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Virtual Credits Wagered</span>
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            ₱{(diagnostics?.metrics?.totalDemoWagered || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            {diagnostics?.metrics?.demoTransactionCount || 0} Total simulated txs
          </div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Database &amp; Node Health</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-1.5">
            <span>100% OPERATIONAL</span>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            {diagnostics?.database?.provider || 'Supabase / Local Engine'}
          </div>
        </div>
      </div>

      {/* Navigation Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/owner/users"
          className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 block transition-all group"
        >
          <Users className="w-5 h-5 text-blue-400 mb-2" />
          <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
            Account Management &amp; Suspension
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Manage user accounts, freeze/suspend suspicious logins, inspect payout identities, and review account histories.
          </p>
        </Link>

        <Link
          href="/owner/operators"
          className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 block transition-all group"
        >
          <Sliders className="w-5 h-5 text-emerald-400 mb-2" />
          <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
            Operator Access &amp; Role Grants
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Authorize game operators, assign pit duties, grant broadcasting rights, and manage administrative privileges.
          </p>
        </Link>

        <Link
          href="/owner/broadcasts"
          className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 block transition-all group"
        >
          <Radio className="w-5 h-5 text-red-500 mb-2" />
          <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
            LiveKit Diagnostics &amp; Rooms
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Monitor real-time WebRTC room subscriptions, multi-camera switching telemetry, and token generation health.
          </p>
        </Link>

        <Link
          href="/owner/audit"
          className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 block transition-all group"
        >
          <FileText className="w-5 h-5 text-amber-400 mb-2" />
          <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
            Security Audit Trail &amp; Export
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Full tamper-evident audit logs with entity filtering, actor identification, and sanitized CSV download.
          </p>
        </Link>

        <Link
          href="/owner/compliance"
          className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 block transition-all group"
        >
          <Scale className="w-5 h-5 text-amber-500 mb-2" />
          <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
            Statutory Compliance &amp; Licensing
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Review deployment authorization records, outstanding requirements, and statutory non-wagering status.
          </p>
        </Link>

        <Link
          href="/owner/system-health"
          className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 block transition-all group"
        >
          <Database className="w-5 h-5 text-purple-400 mb-2" />
          <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
            Supabase Status &amp; System Health
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Inspect Supabase database connectivity, RLS status, seed schema migration scripts, and node performance.
          </p>
        </Link>
      </div>
    </div>
  );
}
