'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Radio,
  Sliders,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Video,
  FileCheck,
  AlertOctagon,
  History,
  Shield,
} from 'lucide-react';
import { MatchItem, EventItem } from '@/lib/types';

export default function OperatorDashboardPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        setMatches(data.matches || []);
        setEvents(data.events || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const readyMatches = matches.filter((m) => m.status === 'READY');
  const pendingReview = matches.filter((m) => m.status === 'RESULT_PENDING_REVIEW');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">OPERATIONAL CONSOLE</div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Arena Operator Control Desk</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold uppercase">
              OPERATOR ROLE
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Live broadcast management, multi-camera switching, match lifecycle controls, and result submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/operator/matches"
            className="px-3.5 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors"
          >
            Match Queue
          </Link>
          <Link
            href="/operator/broadcast"
            className="px-3.5 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Launch Broadcast Switcher</span>
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>On-Air Matches</span>
            <div className={`w-2 h-2 rounded-full ${liveMatches.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'}`} />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{liveMatches.length}</div>
          <div className="text-[11px] text-neutral-500">LiveKit Room publishing</div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Ready in Chute</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{readyMatches.length}</div>
          <div className="text-[11px] text-neutral-500">Inspections completed</div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Results Pending Review</span>
            <FileCheck className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">{pendingReview.length}</div>
          <div className="text-[11px] text-neutral-500">Dual-operator review queue</div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Total Today Matches</span>
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{matches.length}</div>
          <div className="text-[11px] text-neutral-500">Pasay Grand Coliseum</div>
        </div>
      </div>

      {/* Main Grid: Today's Matches & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Match Schedule & Actions */}
        <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Match Operations Queue</span>
            </h2>
            <Link href="/operator/matches" className="text-xs text-red-400 hover:underline">
              Manage All Matches
            </Link>
          </div>

          <div className="space-y-3">
            {matches.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-lg bg-neutral-950 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Fight #{m.match_number}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        m.status === 'LIVE'
                          ? 'bg-red-950 text-red-400 border border-red-800'
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

                  <div className="text-xs text-neutral-300">
                    <strong className="text-red-400">Meron:</strong> {m.participant_a.name} ({m.participant_a.weightKg}kg) vs{' '}
                    <strong className="text-blue-400">Wala:</strong> {m.participant_b.name} ({m.participant_b.weightKg}kg)
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Program Source: {m.active_camera || 'Camera 1 — Main View'} · Room: {m.broadcast_room_id}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/operator/matches/${m.id}`}
                    className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors"
                  >
                    State Controls
                  </Link>

                  {m.status === 'LIVE' && (
                    <Link
                      href="/operator/broadcast"
                      className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Radio className="w-3 h-3" />
                      <span>Switch Cams</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Operator Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
            <h2 className="text-sm font-bold text-white border-b border-neutral-800 pb-2">
              Operator Workflows
            </h2>

            <Link
              href="/operator/broadcast"
              className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 block transition-colors group"
            >
              <div className="font-bold text-xs text-white group-hover:text-red-400 flex items-center justify-between">
                <span>Multi-Camera Video Switcher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Preview connected hardware webcams and switch live program angles.
              </p>
            </Link>

            <Link
              href="/operator/results"
              className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 block transition-colors group"
            >
              <div className="font-bold text-xs text-white group-hover:text-red-400 flex items-center justify-between">
                <span>Submit Outcome Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Record referee decision, ring countdown outcome, and submit for verification.
              </p>
            </Link>

            <Link
              href="/operator/audit"
              className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 block transition-colors group"
            >
              <div className="font-bold text-xs text-white group-hover:text-red-400 flex items-center justify-between">
                <span>Operator Activity Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Audit trail of all camera switches, status changes, and fight updates.
              </p>
            </Link>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-2 text-xs text-neutral-400">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Permission Guard</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Operators can manage fight state and broadcasting feeds. Creating superadmins, changing owner access, or bypassing compliance gates is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
