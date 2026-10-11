'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Radio, Sliders, ChevronDown, Camera, AlertCircle, ArrowLeft } from 'lucide-react';
import { MatchItem } from '@/lib/types';
import BroadcasterConsole from '@/components/BroadcasterConsole';

export default function OperatorBroadcastStudioPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('match_001');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        setMatches(data.matches || []);
        if (data.matches && data.matches.length > 0) {
          const live = data.matches.find((m: MatchItem) => m.status === 'LIVE');
          if (live) setSelectedMatchId(live.id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/operator"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Operator Dashboard</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">STUDIO BROADCAST SWITCHER</div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>LiveKit Multi-Camera Broadcaster</span>
            <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-xs font-mono font-bold uppercase animate-pulse">
              LIVE WEBRTC
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Capture multiple connected hardware webcams, preview staging angles, and switch live program feeds.
          </p>
        </div>

        {/* Match Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400 font-mono">BROADCASTING FIGHT:</label>
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                Fight #{m.match_number} ({m.status}) — {m.participant_a.name} vs {m.participant_b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading || !currentMatch ? (
        <div className="p-12 text-center text-neutral-400">Loading broadcast console...</div>
      ) : (
        <BroadcasterConsole match={currentMatch} />
      )}
    </div>
  );
}
