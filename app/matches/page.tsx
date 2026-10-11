'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Radio, Calendar, ArrowRight, Wifi } from 'lucide-react';
import { MatchItem } from '@/lib/types';

export default function MatchesSchedulePage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'COMPLETED'>('ALL');

  useEffect(() => {
    async function loadMatches() {
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
    loadMatches();
  }, []);

  const filtered = matches.filter((m) => {
    const queryMatches =
      m.participant_a.name.toLowerCase().includes(search.toLowerCase()) ||
      m.participant_b.name.toLowerCase().includes(search.toLowerCase()) ||
      m.participant_a.farm.toLowerCase().includes(search.toLowerCase());

    if (filter === 'ALL') return queryMatches;
    if (filter === 'LIVE') return queryMatches && m.status === 'LIVE';
    if (filter === 'SCHEDULED') return queryMatches && (m.status === 'SCHEDULED' || m.status === 'READY');
    if (filter === 'COMPLETED') return queryMatches && (m.status === 'RESULT_CONFIRMED' || m.status === 'ENDED');
    return queryMatches;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Arena Match Schedule</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Browse all scheduled bouts, active LiveKit multi-camera feeds, and historical results.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter matches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
            {(['ALL', 'LIVE', 'SCHEDULED', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filter === tab ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab === 'LIVE' ? 'Live' : tab === 'SCHEDULED' ? 'Upcoming' : 'Completed'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-neutral-900 rounded-lg border border-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 rounded-lg border border-neutral-800 text-neutral-400 text-xs">
          No matches found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((m) => (
            <Link
              key={m.id}
              href={`/matches/${m.id}`}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg p-4 transition-all hover:shadow-xl block group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white text-sm">Fight #{m.match_number}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                    m.status === 'LIVE'
                      ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                      : m.status === 'READY'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : m.status === 'RESULT_CONFIRMED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              {/* Matchup row */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs p-2 rounded bg-red-950/20 border border-red-900/30">
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-mono font-bold text-red-400 mr-2">MERON</span>
                    <span className="font-semibold text-white">{m.participant_a.name}</span>
                  </div>
                  <span className="font-mono text-neutral-300 shrink-0">{m.participant_a.odds}x</span>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded bg-blue-950/20 border border-blue-900/30">
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-mono font-bold text-blue-400 mr-2">WALA</span>
                    <span className="font-semibold text-white">{m.participant_b.name}</span>
                  </div>
                  <span className="font-mono text-neutral-300 shrink-0">{m.participant_b.odds}x</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Start: {new Date(m.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-red-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                  <span>Enter Broadcast</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
