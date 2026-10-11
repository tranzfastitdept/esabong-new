'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Sliders,
  Play,
  Pause,
  Square,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCheck,
  Ban,
  Archive,
  ArrowLeft,
  Clock,
  History,
} from 'lucide-react';
import { MatchItem, MatchStatus } from '@/lib/types';

export default function OperatorMatchControlPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();

  const [match, setMatch] = useState<MatchItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Modal for confirmation / reason
  const [confirmModal, setConfirmModal] = useState<{
    targetStatus: MatchStatus;
    title: string;
    description: string;
    requiresReason?: boolean;
  } | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  const loadMatch = async () => {
    try {
      const res = await fetch(`/api/matches/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load match');
      setMatch(data.match);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Match load error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatch();
  }, [id]);

  const handleExecuteTransition = async (newStatus: MatchStatus, reason: string) => {
    if (!user) return;
    setError(null);
    setSuccess(null);
    setActionInProgress(true);

    try {
      const res = await fetch(`/api/matches/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: user.id,
          newStatus,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'State transition failed');

      setSuccess(`Match transitioned to ${newStatus}. Logged to audit trail.`);
      setConfirmModal(null);
      setReasonInput('');
      loadMatch();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Transition error');
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading || !match) {
    return <div className="p-12 text-center text-neutral-400">Loading match controls...</div>;
  }

  // Allowed transitions map for button states
  const allowedMap: Record<MatchStatus, MatchStatus[]> = {
    DRAFT: ['SCHEDULED', 'CANCELLED'],
    SCHEDULED: ['READY', 'DRAFT', 'CANCELLED'],
    READY: ['LIVE', 'SCHEDULED', 'CANCELLED'],
    LIVE: ['PAUSED', 'ENDED', 'CANCELLED'],
    PAUSED: ['LIVE', 'ENDED', 'CANCELLED'],
    ENDED: ['RESULT_PENDING_REVIEW', 'CANCELLED'],
    RESULT_PENDING_REVIEW: ['RESULT_CONFIRMED', 'ENDED', 'CANCELLED'],
    RESULT_CONFIRMED: ['ARCHIVED'],
    CANCELLED: ['ARCHIVED'],
    ARCHIVED: [],
  };

  const allowedNext = allowedMap[match.status] || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/operator/matches"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Match Queue</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">STATE MACHINE CONTROLLER</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Fight #{match.match_number} Operations Desk
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {match.participant_a.name} (Meron) vs {match.participant_b.name} (Wala)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded text-xs font-mono font-bold tracking-wider uppercase ${
              match.status === 'LIVE'
                ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                : match.status === 'READY'
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : match.status === 'RESULT_CONFIRMED'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            CURRENT STATUS: {match.status}
          </span>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* State Machine Transition Flow Visualizer */}
      <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-4">
        <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono">
          State Machine Transition Workflow
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
          {[
            'DRAFT',
            'SCHEDULED',
            'READY',
            'LIVE',
            'PAUSED',
            'ENDED',
            'RESULT_PENDING_REVIEW',
            'RESULT_CONFIRMED',
            'CANCELLED',
            'ARCHIVED',
          ].map((st) => {
            const isCurrent = match.status === st;
            const isAllowed = allowedNext.includes(st as MatchStatus);
            return (
              <div
                key={st}
                className={`p-2.5 rounded border text-center transition-colors ${
                  isCurrent
                    ? 'bg-red-600 text-white border-red-500 font-bold shadow-md'
                    : isAllowed
                    ? 'bg-neutral-950 text-emerald-400 border-emerald-800 font-semibold'
                    : 'bg-neutral-950/60 text-neutral-600 border-neutral-800/80 opacity-60'
                }`}
              >
                <div>{st}</div>
                {isCurrent && <div className="text-[9px] uppercase tracking-wider text-red-100 font-bold mt-0.5">CURRENT</div>}
                {isAllowed && <div className="text-[9px] text-emerald-500 font-bold mt-0.5">PERMITTED</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Operator Action Buttons Grid */}
      <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-neutral-800 pb-2">
          Operator Action Controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Mark Ready */}
          <button
            onClick={() =>
              setConfirmModal({
                targetStatus: 'READY',
                title: 'Mark Bout READY',
                description: 'Verifies roosters are weighed, leg bands inspected, and arena pit cleared.',
              })
            }
            disabled={!allowedNext.includes('READY')}
            className="p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 text-left transition-colors"
          >
            <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Ready for Chute</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Transitions match from SCHEDULED to READY.</p>
          </button>

          {/* Start Broadcast (Go Live) */}
          <button
            onClick={() =>
              setConfirmModal({
                targetStatus: 'LIVE',
                title: 'Start Live Program Broadcast',
                description: 'Activates LiveKit program stream and opens live spectator view.',
              })
            }
            disabled={!allowedNext.includes('LIVE')}
            className="p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 text-left transition-colors"
          >
            <div className="font-bold text-xs text-red-400 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" />
              <span>Start Broadcast (GO LIVE)</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Transitions match to LIVE broadcasting.</p>
          </button>

          {/* Pause Broadcast */}
          <button
            onClick={() =>
              setConfirmModal({
                targetStatus: 'PAUSED',
                title: 'Pause Broadcast',
                description: 'Temporarily halts match timer and live program feed.',
                requiresReason: true,
              })
            }
            disabled={!allowedNext.includes('PAUSED')}
            className="p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 text-left transition-colors"
          >
            <div className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Broadcast</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Suspends match for referee timeout or incident.</p>
          </button>

          {/* End Event */}
          <button
            onClick={() =>
              setConfirmModal({
                targetStatus: 'ENDED',
                title: 'End Live Bout',
                description: 'Concludes the physical fight. Closes demonstration betting and prepares outcome entry.',
              })
            }
            disabled={!allowedNext.includes('ENDED')}
            className="p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 text-left transition-colors"
          >
            <div className="font-bold text-xs text-neutral-300 flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5" />
              <span>End Bout (Conclude Fight)</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Transitions match to ENDED status.</p>
          </button>

          {/* Submit Result Review Link */}
          <Link
            href="/operator/results"
            className="p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors block"
          >
            <div className="font-bold text-xs text-blue-400 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Submit / Review Outcome</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Dual-operator verification workflow.</p>
          </Link>

          {/* Cancel Event */}
          <button
            onClick={() =>
              setConfirmModal({
                targetStatus: 'CANCELLED',
                title: 'Cancel Event Bout',
                description: 'Cancels match and refunds all simulated bet entries. Required reason.',
                requiresReason: true,
              })
            }
            disabled={!allowedNext.includes('CANCELLED')}
            className="p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 text-left transition-colors"
          >
            <div className="font-bold text-xs text-red-500 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Bout (Refund Bets)</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Requires official cancellation reason.</p>
          </button>

          {/* Archive Completed */}
          <button
            onClick={() =>
              setConfirmModal({
                targetStatus: 'ARCHIVED',
                title: 'Archive Bout Record',
                description: 'Moves confirmed event to read-only historical archive.',
              })
            }
            disabled={!allowedNext.includes('ARCHIVED')}
            className="p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 text-left transition-colors"
          >
            <div className="font-bold text-xs text-neutral-400 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5" />
              <span>Archive Bout Record</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Terminal historical status.</p>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">{confirmModal.title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">{confirmModal.description}</p>

            {confirmModal.requiresReason && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Required Operational Reason:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Referee injury timeout / Weight discrepancy"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionInProgress || (confirmModal.requiresReason && !reasonInput.trim())}
                onClick={() =>
                  handleExecuteTransition(
                    confirmModal.targetStatus,
                    reasonInput || `Transitioned to ${confirmModal.targetStatus}`
                  )
                }
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold"
              >
                {actionInProgress ? 'Processing...' : 'Confirm Transition'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
