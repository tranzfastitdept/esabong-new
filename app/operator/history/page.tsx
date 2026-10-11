'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { MatchItem } from '@/lib/types';

export default function OperatorHistoryPage() {
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

  const completed = matches.filter((m) => m.status === 'RESULT_CONFIRMED' || m.status === 'ARCHIVED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="border-b border-neutral-800 pb-6">
        <div className="text-xs font-mono text-neutral-400">EVENT ARCHIVES</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Broadcast &amp; Match History</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Historical record of completed tournament bouts, verified outcomes, and video logs.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        {loading ? (
          <div className="p-8 text-center text-neutral-400">Loading history...</div>
        ) : completed.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-xs">
            No completed matches in the archive yet.
          </div>
        ) : (
          <div className="space-y-3">
            {completed.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">Fight #{m.match_number}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold">
                      OFFICIAL: {m.confirmed_result}
                    </span>
                  </div>
                  <div className="text-neutral-300">
                    <span className="text-red-400 font-semibold">{m.participant_a.name}</span> ({m.participant_a.farm}) vs{' '}
                    <span className="text-blue-400 font-semibold">{m.participant_b.name}</span> ({m.participant_b.farm})
                  </div>
                </div>

                <Link
                  href={`/matches/${m.id}`}
                  className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
