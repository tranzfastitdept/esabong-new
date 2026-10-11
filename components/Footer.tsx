import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, Cpu, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Platform & Legal Guard */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-white text-[10px] font-black">
                SC
              </div>
              <span>Sabong System Console</span>
            </div>
            <p className="text-neutral-500 leading-relaxed text-[11px]">
              High-concurrency arena event console featuring LiveKit WebRTC multi-camera broadcasting and Supabase data management.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/40 text-amber-400 text-[11px]">
              <Scale className="w-3 h-3" />
              <span>Strictly Non-Wagering Demo</span>
            </div>
          </div>

          {/* Column 2: Public Navigation */}
          <div>
            <div className="text-neutral-200 font-semibold mb-3">Arena Features</div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/matches" className="hover:text-white transition-colors">
                  Match Schedule &amp; Results
                </Link>
              </li>
              <li>
                <Link href="/wallet-demo" className="hover:text-white transition-colors">
                  Demonstration Credit Simulator
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Responsible Entertainment Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Operational Roles */}
          <div>
            <div className="text-neutral-200 font-semibold mb-3">Operator &amp; Governance</div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/operator/broadcast" className="hover:text-white transition-colors">
                  Multi-Camera Broadcast Console
                </Link>
              </li>
              <li>
                <Link href="/operator/results" className="hover:text-white transition-colors">
                  Dual-Operator Result Verification
                </Link>
              </li>
              <li>
                <Link href="/owner/compliance" className="hover:text-white transition-colors">
                  Compliance Gateway &amp; Audit Logs
                </Link>
              </li>
              <li>
                <Link href="/owner/diagnostics" className="hover:text-white transition-colors">
                  System Health &amp; Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance Safeguards */}
          <div className="space-y-2 text-[11px]">
            <div className="text-neutral-200 font-semibold mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compliance Notice</span>
            </div>
            <p className="text-neutral-500 leading-relaxed">
              Real-money transactions, deposits, cashouts, and commercial betting remain permanently disabled until applicable regulatory licenses are verified and approved.
            </p>
            <p className="text-neutral-600 font-mono text-[10px]">
              Build Ref: SSC-SUPABASE-LIVEKIT-DEMO-2026
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-600 text-[11px]">
          <div>
            &copy; 2026 Sabong System Console. All rights reserved. Operating in compliance demonstration mode.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/support" className="hover:text-neutral-400 transition-colors">
              Terms &amp; Policies
            </Link>
            <span>·</span>
            <Link href="/owner/compliance" className="hover:text-neutral-400 transition-colors">
              Statutory Verification
            </Link>
            <span>·</span>
            <Link href="/owner/system-health" className="hover:text-neutral-400 transition-colors">
              Node Health
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
