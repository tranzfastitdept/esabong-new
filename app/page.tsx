'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Radio,
  Calendar,
  Clock,
  Shield,
  Search,
  Filter,
  ArrowRight,
  Wifi,
  Scale,
  Sparkles,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { MatchItem, EventItem } from '@/lib/types';
import LiveKitPlayer from '@/components/LiveKitPlayer';

export default function LandingPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'RESULT_CONFIRMED'>('ALL');

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        setMatches(data.matches || []);
        setEvents(data.events || []);
      } catch (e) {
        console.error('Error fetching matches:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  // Sort matches: LIVE first, then READY/SCHEDULED, then completed
  const liveMatch = matches.find((m) => m.status === 'LIVE') || matches[0];

  const filteredMatches = matches.filter((m) => {
    const matchesQuery =
      m.participant_a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.participant_b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.participant_a.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.participant_b.farm.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'ALL') return matchesQuery;
    if (statusFilter === 'LIVE') return matchesQuery && m.status === 'LIVE';
    if (statusFilter === 'SCHEDULED')
      return matchesQuery && (m.status === 'SCHEDULED' || m.status === 'READY');
    if (statusFilter === 'RESULT_CONFIRMED')
      return matchesQuery && (m.status === 'RESULT_CONFIRMED' || m.status === 'ENDED');
    return matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Featured Live Broadcast Section */}
      <section className="relative bg-[#0d0f14] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Headline & Compliance Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
                <span>PASAY COLISEUM</span>
                <span aria-hidden="true">·</span>
                <span>OCTAGON RING 1</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  SUB-SECOND WEBRTC
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
                Live Arena Program &amp; Broadcast Console
              </h1>
              <p className="text-sm text-neutral-400 mt-1 max-w-2xl text-pretty">
                Real-time multi-camera gamefowl event broadcasting powered by LiveKit WebRTC and Supabase records.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/operator/broadcast"
                className="px-3.5 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-neutral-700"
              >
                <Radio className="w-3.5 h-3.5 text-red-400" />
                <span>Operator Console</span>
              </Link>
              <Link
                href="/wallet-demo"
                className="px-3.5 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Explore Demo Credits</span>
              </Link>
            </div>
          </div>

          {/* Featured Match Video Player Panel */}
          {liveMatch ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Player Frame (8 cols) */}
              <div className="lg:col-span-8">
                <LiveKitPlayer
                  roomName={liveMatch.broadcast_room_id}
                  matchId={liveMatch.id}
                  matchStatus={liveMatch.status}
                  participantA={liveMatch.participant_a}
                  participantB={liveMatch.participant_b}
                  activeCamera={liveMatch.active_camera}
                />
              </div>

              {/* Fight Card & Match Details (4 cols) */}
              <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-neutral-400">DERBY EVENT #1</span>
                    <h2 className="text-base font-bold text-white">Fight #{liveMatch.match_number}</h2>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase font-mono ${
                        liveMatch.status === 'LIVE'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {liveMatch.status}
                    </span>
                  </div>
                </div>

                {/* Meron vs Wala Breakdown */}
                <div className="space-y-3">
                  {/* Meron Card */}
                  <div className="p-3 rounded bg-red-950/20 border border-red-900/40 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-red-400 uppercase tracking-wider font-mono">MERON</span>
                      <span className="text-white font-mono">{liveMatch.participant_a.odds}x</span>
                    </div>
                    <div className="text-sm font-bold text-white">{liveMatch.participant_a.name}</div>
                    <div className="text-xs text-neutral-400 flex items-center gap-2">
                      <span>{liveMatch.participant_a.farm}</span>
                      <span>·</span>
                      <span className="font-mono">{liveMatch.participant_a.weightKg} kg</span>
                    </div>
                  </div>

                  {/* Wala Card */}
                  <div className="p-3 rounded bg-blue-950/20 border border-blue-900/40 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-blue-400 uppercase tracking-wider font-mono">WALA</span>
                      <span className="text-white font-mono">{liveMatch.participant_b.odds}x</span>
                    </div>
                    <div className="text-sm font-bold text-white">{liveMatch.participant_b.name}</div>
                    <div className="text-xs text-neutral-400 flex items-center gap-2">
                      <span>{liveMatch.participant_b.farm}</span>
                      <span>·</span>
                      <span className="font-mono">{liveMatch.participant_b.weightKg} kg</span>
                    </div>
                  </div>
                </div>

                {/* Demonstration Bet CTA */}
                <div className="pt-2">
                  <Link
                    href={`/matches/${liveMatch.id}`}
                    className="w-full py-2.5 px-4 rounded bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <span>Open Fight Console &amp; Slip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <p className="text-[10px] text-center text-neutral-500 mt-2 font-mono">
                    * Simulates non-wagering virtual bets only. Zero monetary risk.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-neutral-900 rounded-lg border border-neutral-800">
              <Radio className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <div className="text-white font-semibold">No Live Broadcast in Session</div>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                All camera feeds are currently on standby. Explore the upcoming match schedule below.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Match Schedule & Filter Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Event Match Schedule</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live broadcast queue, ready matches, and verified completed outcomes.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rooster, breed, or farm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 w-52 sm:w-64"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
              {(['ALL', 'LIVE', 'SCHEDULED', 'RESULT_CONFIRMED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    statusFilter === tab
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab === 'ALL'
                    ? 'All'
                    : tab === 'LIVE'
                    ? 'Live'
                    : tab === 'SCHEDULED'
                    ? 'Scheduled'
                    : 'Completed'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-neutral-900 rounded-lg border border-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="p-8 text-center bg-neutral-900/50 rounded-lg border border-neutral-800 text-neutral-400 text-xs">
            No matches found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMatches.map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="block bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg p-4 transition-all hover:shadow-xl group"
              >
                {/* Header row: Match # and Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Fight #{match.match_number}</span>
                    <span className="text-neutral-500 font-mono text-xs">
                      {new Date(match.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                      match.status === 'LIVE'
                        ? 'bg-red-950 text-red-400 border border-red-800/80 animate-pulse'
                        : match.status === 'READY'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/80'
                        : match.status === 'RESULT_CONFIRMED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {match.status}
                  </span>
                </div>

                {/* Matchup strip */}
                <div className="space-y-2 mb-4">
                  {/* Meron */}
                  <div className="flex items-center justify-between text-xs p-2 rounded bg-red-950/15 border border-red-900/30">
                    <div className="truncate pr-2">
                      <span className="text-[10px] font-mono font-bold text-red-400 mr-2">MERON</span>
                      <span className="font-semibold text-white">{match.participant_a.name}</span>
                    </div>
                    <span className="font-mono text-neutral-300 shrink-0">{match.participant_a.odds}x</span>
                  </div>

                  {/* Wala */}
                  <div className="flex items-center justify-between text-xs p-2 rounded bg-blue-950/15 border border-blue-900/30">
                    <div className="truncate pr-2">
                      <span className="text-[10px] font-mono font-bold text-blue-400 mr-2">WALA</span>
                      <span className="font-semibold text-white">{match.participant_b.name}</span>
                    </div>
                    <span className="font-mono text-neutral-300 shrink-0">{match.participant_b.odds}x</span>
                  </div>
                </div>

                {/* Footer status / Result */}
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    {match.confirmed_result ? (
                      <span className="text-emerald-400 font-bold font-mono">
                        RESULT: {match.confirmed_result}
                      </span>
                    ) : (
                      <span>Cam: {match.active_camera || 'Main View'}</span>
                    )}
                  </div>
                  <span className="text-red-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                    <span>View Match</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Platform Guarantees & Non-Wagering Notice */}
      <section className="bg-neutral-950 border-t border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-neutral-900/70 border border-neutral-800">
              <Scale className="w-6 h-6 text-amber-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Non-Wagering Demonstration Mode</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Operating strictly as a broadcast console evaluation. No actual real money wagers, deposits, or cashout mechanisms are enabled.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-neutral-900/70 border border-neutral-800">
              <Radio className="w-6 h-6 text-red-500 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Multi-Camera WebRTC Switching</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                LiveKit WebRTC engine delivers sub-250ms broadcast latency with seamless multi-webcam program switching.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-neutral-900/70 border border-neutral-800">
              <Shield className="w-6 h-6 text-emerald-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Supabase Dual-Review Audit Trail</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Fight outcomes require operator submission and authorized reviewer confirmation before official ledger settlement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
