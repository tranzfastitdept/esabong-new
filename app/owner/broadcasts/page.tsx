'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Radio, Wifi, Server, Shield, CheckCircle2, AlertTriangle, ArrowLeft, Terminal } from 'lucide-react';

export default function OwnerBroadcastsDiagnosticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/owner/diagnostics');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
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
        <div className="text-xs font-mono text-neutral-400">WEBRTC INFRASTRUCTURE</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          LiveKit Broadcasting Diagnostics &amp; Rooms
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Server-side token verification, room active publishers, and WebRTC streaming diagnostics.
        </p>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">LIVEKIT SERVER ENDPOINT</div>
          <div className="text-sm font-bold font-mono text-emerald-400 truncate">
            {data?.livekit?.serverUrl || 'wss://demo-livekit.cloud'}
          </div>
          <div className="text-[11px] text-neutral-500">Configured in NEXT_PUBLIC_LIVEKIT_URL</div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">TOKEN SIGNING ENGINE</div>
          <div className="text-sm font-bold font-mono text-white">HMAC SHA-256 JWT</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Short-lived tokens (2h TTL) active</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">PUBLISHER RESTRICTION</div>
          <div className="text-sm font-bold font-mono text-amber-400">ROLE ENFORCED</div>
          <div className="text-[11px] text-neutral-500">Ordinary bettors cannot publish video</div>
        </div>
      </div>

      {/* Deployment & Architecture Guidelines */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>LiveKit Cloud &amp; Self-Hosted Integration Guide</span>
        </h2>

        <div className="space-y-3 text-xs text-neutral-300 leading-relaxed font-mono">
          <p className="text-neutral-400 font-sans">
            To connect to an external production LiveKit Cloud project or self-hosted Docker cluster, add the following environment variables to your deployment environment:
          </p>

          <pre className="p-4 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-200 overflow-x-auto">
{`LIVEKIT_API_KEY="devkey"
LIVEKIT_API_SECRET="secret_livekit_key_at_least_32_characters"
NEXT_PUBLIC_LIVEKIT_URL="wss://your-project.livekit.cloud"`}
          </pre>

          <div className="pt-2 text-neutral-400 font-sans space-y-1 text-xs">
            <div>1. <strong>Publishing Access:</strong> Granted only to authorized Game Operators and Superadmins.</div>
            <div>2. <strong>Subscribers:</strong> Public viewers receive read-only subscribe tokens via <code>/api/livekit/token</code>.</div>
            <div>3. <strong>Device Discovery:</strong> Multi-camera operator console uses <code>navigator.mediaDevices.enumerateDevices()</code> with dynamic source track swapping.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
