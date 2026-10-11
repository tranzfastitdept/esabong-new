'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, CheckCircle2 } from 'lucide-react';
import { MatchItem } from '@/lib/types';

export default function OwnerMatchesOversightPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
        <div className="text-xs font-mono text-neutral-400">GLOBAL OVERSIGHT</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Tournament Matches Oversight</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Monitor all scheduled, active, and completed matches across all tournament arenas.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                <th className="py-2.5 pr-4">Fight #</th>
                <th className="py-2.5 px-4">Meron</th>
                <th className="py-2.5 px-4">Wala</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Result</th>
                <th className="py-2.5 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-[11px]">
              {matches.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-800/40">
                  <td className="py-3 pr-4 font-bold text-white font-mono">Fight #{m.match_number}</td>
                  <td className="py-3 px-4 text-red-400 font-semibold">{m.participant_a.name}</td>
                  <td className="py-3 px-4 text-blue-400 font-semibold">{m.participant_b.name}</td>
                  <td className="py-3 px-4 font-mono uppercase font-bold text-neutral-300">{m.status}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">{m.confirmed_result || '—'}</td>
                  <td className="py-3 pl-4 text-right">
                    <Link
                      href={`/operator/matches/${m.id}`}
                      className="text-xs text-red-400 hover:underline font-semibold"
                    >
                      Inspect State
                    </Link>
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
