'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileText,
  Ban,
  ArrowLeft,
  Building,
  Calendar,
} from 'lucide-react';
import { ComplianceRecord } from '@/lib/types';

export default function OwnerCompliancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadCompliance = async () => {
    try {
      const res = await fetch('/api/owner/compliance');
      const json = await res.json();
      setData(json);
      setRecords(json.records || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompliance();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
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
        <div className="text-xs font-mono text-neutral-400">LEGAL &amp; STATUTORY COMPLIANCE GATEWAY</div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <span>Administrative Compliance &amp; Deployment Gate</span>
          <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-xs font-mono font-bold uppercase">
            STRICT DEMO LOCK
          </span>
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          Continuous auditing of regulatory status, amusement licenses, broadcast clearance, and non-wagering enforcement.
        </p>
      </div>

      {/* Primary Server Compliance Lock Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-800/60 space-y-3">
        <div className="flex items-center gap-2.5 text-amber-400 text-sm font-bold uppercase tracking-wider font-mono">
          <Lock className="w-4 h-4" />
          <span>Server-Enforced Legal Authorization Gate: ACTIVE</span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
          The application is locked in <strong>DEMO / NON-WAGERING MODE</strong>. All real-money wagering, wallet deposits, payout gateways, cashout APIs, and financial settlements are blocked at the server API layer. No single environment variable or owner switch can bypass this gate without verified external regulatory clearance.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Simulated Credits Isolated
          </span>
          <span>·</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Dual-Operator Verification Enforced
          </span>
          <span>·</span>
          <span className="flex items-center gap-1 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            Statutory Gaming Clearance Pending
          </span>
        </div>
      </div>

      {/* Status Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">DEPLOYMENT MODE</div>
          <div className="text-xl font-bold font-mono text-amber-400">DEMO_NON_WAGERING</div>
          <p className="text-[11px] text-neutral-500">Virtual test credits only</p>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">LEGAL AUTHORIZATION STATUS</div>
          <div className="text-xl font-bold font-mono text-red-400">UNSATISFIED (LOCKED)</div>
          <p className="text-[11px] text-neutral-500">Commercial transactions disabled</p>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">LIVE CAMERA CAPABILITY</div>
          <div className="text-xl font-bold font-mono text-emerald-400">PERMITTED (TECH DEMO)</div>
          <p className="text-[11px] text-neutral-500">LiveKit WebRTC broadcast active</p>
        </div>
      </div>

      {/* Compliance Records Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-400" />
            <span>Audited Statutory Authorization Records</span>
          </h2>
          <span className="text-xs font-mono text-neutral-500">{records.length} Records Tracked</span>
        </div>

        <div className="space-y-3">
          {records.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-lg bg-neutral-950 border border-neutral-800/80 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-bold text-white text-sm">
                  {r.authorization_type.replace(/_/g, ' ')}
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase self-start sm:self-auto ${
                    r.status === 'ACTIVE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="text-neutral-400 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div>Issuing Authority: <span className="text-neutral-200">{r.issuing_authority}</span></div>
                <div>Reference ID: <span className="text-neutral-200">{r.reference_number}</span></div>
                <div>Effective Date: <span className="text-neutral-200">{r.effective_date}</span></div>
                <div>Expiry Date: <span className="text-neutral-200">{r.expiry_date}</span></div>
              </div>

              <div className="p-3 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-300">
                <strong className="text-amber-400">Verification Notes:</strong> {r.verification_notes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
