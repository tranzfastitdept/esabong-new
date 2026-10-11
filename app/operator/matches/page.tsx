'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { PlusCircle, Sliders, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, Calendar, Clock } from 'lucide-react';
import { MatchItem, EventItem } from '@/lib/types';

export default function OperatorMatchesManagementPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    match_number: 5,
    event_id: 'evt_derby_2026_01',
    participant_a_name: 'Dink Fair Red Hatch',
    participant_a_breed: 'Dink Fair Hatch',
    participant_a_weight: 2.34,
    participant_a_farm: 'Batangas High Ridge',
    participant_a_odds: 1.85,
    participant_b_name: 'Possum Gold Sweater',
    participant_b_breed: 'Possum Sweater',
    participant_b_weight: 2.31,
    participant_b_farm: 'Bulacan Valley Loft',
    participant_b_odds: 1.95,
    scheduled_start: '2026-10-11T14:00',
  });

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const newMatchData = {
        event_id: form.event_id,
        match_number: Number(form.match_number),
        participant_a: {
          name: form.participant_a_name,
          breed: form.participant_a_breed,
          weightKg: Number(form.participant_a_weight),
          legBand: `BAND-M-${form.match_number}`,
          farm: form.participant_a_farm,
          handler: 'Operator Assigned',
          odds: Number(form.participant_a_odds),
          color: '#DC2626',
        },
        participant_b: {
          name: form.participant_b_name,
          breed: form.participant_b_breed,
          weightKg: Number(form.participant_b_weight),
          legBand: `BAND-W-${form.match_number}`,
          farm: form.participant_b_farm,
          handler: 'Operator Assigned',
          odds: Number(form.participant_b_odds),
          color: '#2563EB',
        },
        scheduled_start: new Date(form.scheduled_start).toISOString(),
        status: 'SCHEDULED',
        broadcast_room_id: `livekit-room-match-${String(form.match_number).padStart(3, '0')}`,
        proposed_result: null,
        confirmed_result: null,
        result_status: 'UNRESOLVED',
        active_camera: 'Camera 1 — Main View',
      };

      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId: user.id, matchData: newMatchData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule match');

      setSuccess(`Fight #${form.match_number} successfully scheduled.`);
      setShowCreateModal(false);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Match creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">DERBY QUEUE</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Match Management &amp; Scheduling</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure participant rooster weights, odds, leg bands, and broadcast room assignments.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule New Match</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Matches Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                <th className="py-2.5 pr-4">Fight #</th>
                <th className="py-2.5 px-4">Scheduled Start</th>
                <th className="py-2.5 px-4">Meron (Red)</th>
                <th className="py-2.5 px-4">Wala (Blue)</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 font-mono">LiveKit Room</th>
                <th className="py-2.5 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-[11px]">
              {matches.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-800/40">
                  <td className="py-3 pr-4 font-bold text-white font-mono">
                    Fight #{m.match_number}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400">
                    {new Date(m.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-red-400">{m.participant_a.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      {m.participant_a.weightKg}kg · {m.participant_a.odds}x
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-blue-400">{m.participant_b.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      {m.participant_b.weightKg}kg · {m.participant_b.odds}x
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
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
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400">
                    {m.broadcast_room_id}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <Link
                      href={`/operator/matches/${m.id}`}
                      className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 inline-flex items-center gap-1"
                    >
                      <span>Control</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Match Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-white mb-4 border-b border-neutral-800 pb-2">
              Schedule New Tournament Bout
            </h2>

            <form onSubmit={handleCreateMatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Fight Number</label>
                  <input
                    type="number"
                    required
                    value={form.match_number}
                    onChange={(e) => setForm({ ...form, match_number: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.scheduled_start}
                    onChange={(e) => setForm({ ...form, scheduled_start: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              {/* Meron Info */}
              <div className="p-3 rounded bg-red-950/20 border border-red-900/40 space-y-2">
                <span className="font-bold text-red-400 font-mono uppercase text-[11px]">MERON (RED CORNER)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Rooster Name"
                    value={form.participant_a_name}
                    onChange={(e) => setForm({ ...form, participant_a_name: e.target.value })}
                    className="px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Breed / Lineage"
                    value={form.participant_a_breed}
                    onChange={(e) => setForm({ ...form, participant_a_breed: e.target.value })}
                    className="px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-white"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Weight (kg)"
                    value={form.participant_a_weight}
                    onChange={(e) => setForm({ ...form, participant_a_weight: Number(e.target.value) })}
                    className="px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Odds Multiplier"
                    value={form.participant_a_odds}
                    onChange={(e) => setForm({ ...form, participant_a_odds: Number(e.target.value) })}
                    className="px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              {/* Wala Info */}
              <div className="p-3 rounded bg-blue-950/20 border border-blue-900/40 space-y-2">
                <span className="font-bold text-blue-400 font-mono uppercase text-[11px]">WALA (BLUE CORNER)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Rooster Name"
                    value={form.participant_b_name}
                    onChange={(e) => setForm({ ...form, participant_b_name: e.target.value })}
                    className="px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Breed / Lineage"
                    value={form.participant_b_breed}
                    onChange={(e) => setForm({ ...form, participant_b_breed: e.target.value })}
                    className="px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-white"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Weight (kg)"
                    value={form.participant_b_weight}
                    onChange={(e) => setForm({ ...form, participant_b_weight: Number(e.target.value) })}
                    className="px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Odds Multiplier"
                    value={form.participant_b_odds}
                    onChange={(e) => setForm({ ...form, participant_b_odds: Number(e.target.value) })}
                    className="px-2.5 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  {submitting ? 'Creating...' : 'Create Match Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
