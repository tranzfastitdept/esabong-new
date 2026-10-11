'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Shield,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { MatchItem, ResultReview } from '@/lib/types';

export default function OperatorResultsReviewPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [proposedResult, setProposedResult] = useState<'MERON' | 'WALA' | 'DRAW' | 'CANCELLED'>('MERON');
  const [submissionReason, setSubmissionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      setMatches(data.matches || []);
      const ended = data.matches?.find((m: MatchItem) => m.status === 'ENDED' || m.status === 'RESULT_PENDING_REVIEW');
      if (ended) setSelectedMatchId(ended.id);
      else if (data.matches?.length > 0) setSelectedMatchId(data.matches[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Submit Proposed Result
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedMatchId) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/matches/${selectedMatchId}/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          actorId: user.id,
          proposedResult,
          reason: submissionReason || 'Official ring referee verdict submitted.',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit result proposal');

      setSuccess(`Proposed result for ${proposedResult} submitted for mandatory dual-operator review.`);
      setSubmissionReason('');
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Review and Confirm (Owner or authorized reviewer)
  const handleReviewDecision = async (matchId: string, decision: 'APPROVED' | 'REJECTED') => {
    if (!user) return;
    setError(null);
    setSuccess(null);
    setReviewing(true);

    try {
      const targetMatch = matches.find((m) => m.id === matchId);
      const res = await fetch(`/api/matches/${matchId}/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review',
          actorId: user.id,
          decision,
          confirmedResult: targetMatch?.proposed_result || 'MERON',
          reason:
            decision === 'APPROVED'
              ? 'Outcome verified against certified referee log and score sheet.'
              : 'Rejected due to video review ambiguity or referee protest.',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Review action failed');

      setSuccess(`Result review processed: ${decision}. Ledger settlement executed.`);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Review action failed');
    } finally {
      setReviewing(false);
    }
  };

  const pendingMatches = matches.filter((m) => m.status === 'RESULT_PENDING_REVIEW');
  const completedMatches = matches.filter((m) => m.status === 'RESULT_CONFIRMED');
  const eligibleForSubmission = matches.filter((m) => m.status === 'ENDED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
      <div className="border-b border-neutral-800 pb-6">
        <div className="text-xs font-mono text-neutral-400">INTEGRITY &amp; ADJUDICATION</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Result Submission &amp; Dual-Review Queue
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Strict two-man verification protocol: operators submit proposed outcomes; senior reviewer confirms ledger settlement.
        </p>
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

      {/* Two Columns: Submit Proposal on Left, Verification Queue on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Operator Submission Form */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Submit Proposed Bout Result</span>
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Available only after bout has concluded (ENDED status).
            </p>
          </div>

          <form onSubmit={handleSubmitProposal} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Select Concluded Match</label>
              <select
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-white font-medium focus:outline-none focus:border-red-500"
              >
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    Fight #{m.match_number} ({m.status}) — {m.participant_a.name} vs {m.participant_b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Proposed Victor</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProposedResult('MERON')}
                  className={`p-2.5 rounded border text-center transition-colors ${
                    proposedResult === 'MERON'
                      ? 'bg-red-600 text-white border-red-500 font-bold'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                  }`}
                >
                  MERON
                </button>
                <button
                  type="button"
                  onClick={() => setProposedResult('WALA')}
                  className={`p-2.5 rounded border text-center transition-colors ${
                    proposedResult === 'WALA'
                      ? 'bg-blue-600 text-white border-blue-500 font-bold'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                  }`}
                >
                  WALA
                </button>
                <button
                  type="button"
                  onClick={() => setProposedResult('DRAW')}
                  className={`p-2.5 rounded border text-center transition-colors ${
                    proposedResult === 'DRAW'
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                  }`}
                >
                  DRAW
                </button>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Adjudication Notes &amp; Referee Verification
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Ring count-out completed at 1m45s. Referee confirmed Meron victor without protest."
                value={submissionReason}
                onChange={(e) => setSubmissionReason(e.target.value)}
                className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <span>{submitting ? 'Submitting...' : 'Submit Proposal for Verification'}</span>
            </button>
          </form>
        </div>

        {/* Right Column (7 cols): Senior Reviewer Verification Queue */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Review Queue */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Pending Review Queue ({pendingMatches.length})</span>
              </h2>
              <span className="text-[11px] font-mono text-neutral-500">Requires Senior Reviewer / Owner</span>
            </div>

            {pendingMatches.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-xs">
                No match outcomes currently waiting for review.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingMatches.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-lg bg-neutral-950 border border-amber-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">Fight #{m.match_number}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono text-[10px] font-bold">
                        PROPOSED: {m.proposed_result}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-300">
                      <strong>Meron:</strong> {m.participant_a.name} vs <strong>Wala:</strong> {m.participant_b.name}
                    </div>

                    <div className="text-[11px] text-neutral-400 bg-neutral-900 p-2.5 rounded border border-neutral-800">
                      Operator submitted outcome awaiting secondary review.
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                      <button
                        onClick={() => handleReviewDecision(m.id, 'REJECTED')}
                        disabled={reviewing}
                        className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-red-400 text-xs font-semibold"
                      >
                        Reject Outcome
                      </button>
                      <button
                        onClick={() => handleReviewDecision(m.id, 'APPROVED')}
                        disabled={reviewing}
                        className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                      >
                        Confirm &amp; Commit Result
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmed History */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
            <h2 className="text-sm font-bold text-white border-b border-neutral-800 pb-2">
              Recently Confirmed Outcomes
            </h2>

            <div className="space-y-2">
              {completedMatches.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white">Fight #{m.match_number}: </span>
                    <span className="text-neutral-400">{m.participant_a.name} vs {m.participant_b.name}</span>
                  </div>
                  <span className="font-bold font-mono text-emerald-400">
                    WON: {m.confirmed_result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
