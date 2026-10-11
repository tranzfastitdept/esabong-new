'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { MatchItem, EventItem } from '@/lib/types';
import LiveKitPlayer from '@/components/LiveKitPlayer';
import {
  Radio,
  Clock,
  MapPin,
  Shield,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Camera,
  Info,
} from 'lucide-react';

export default function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, wallet, updateWalletBalance } = useAuth();

  const [match, setMatch] = useState<MatchItem | null>(null);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo Bet Slip State
  const [betSide, setBetSide] = useState<'MERON' | 'WALA' | 'DRAW'>('MERON');
  const [betAmount, setBetAmount] = useState<number>(500);
  const [submittingBet, setSubmittingBet] = useState(false);
  const [betSuccess, setBetSuccess] = useState<string | null>(null);
  const [betError, setBetError] = useState<string | null>(null);

  const fetchMatchData = async () => {
    try {
      const res = await fetch(`/api/matches/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load match');
      setMatch(data.match);
      setEvent(data.event);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching match');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchData();
  }, [id]);

  // Place Demonstration Bet Handler
  const handlePlaceDemoBet = async () => {
    if (!user) {
      setBetError('Please log in to place a simulated demonstration bet.');
      return;
    }
    if (!match) return;

    setBetError(null);
    setBetSuccess(null);
    setSubmittingBet(true);

    try {
      const idempotencyKey = `idemp_bet_${user.id}_${match.id}_${Date.now()}`;
      const res = await fetch('/api/wallet-demo/bet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          matchId: match.id,
          selection: betSide,
          amount: betAmount,
          idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Simulated bet failed');
      }

      updateWalletBalance(data.newBalance);
      setBetSuccess(
        `Demo bet placed on ${betSide} for ₱${betAmount.toLocaleString()}. Potential Return: ₱${(
          betAmount *
          (betSide === 'MERON'
            ? match.participant_a.odds
            : betSide === 'WALA'
            ? match.participant_b.odds
            : 8.0)
        ).toFixed(2)} DEMO Credits.`
      );
    } catch (err: unknown) {
      setBetError(err instanceof Error ? err.message : 'Demo bet error');
    } finally {
      setSubmittingBet(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full flex-1 animate-pulse space-y-6">
        <div className="h-8 bg-neutral-900 rounded w-1/3" />
        <div className="aspect-video bg-neutral-900 rounded-lg max-w-4xl" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full flex-1 text-center">
        <div className="p-8 rounded-lg bg-neutral-900 border border-neutral-800 max-w-md mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-white">Match Not Found</h2>
          <p className="text-xs text-neutral-400 mt-1">{error || 'This match does not exist.'}</p>
          <Link
            href="/matches"
            className="inline-block mt-4 px-4 py-2 bg-neutral-800 text-white rounded text-xs hover:bg-neutral-700"
          >
            Back to Match Schedule
          </Link>
        </div>
      </div>
    );
  }

  const selectedOdds =
    betSide === 'MERON'
      ? match.participant_a.odds
      : betSide === 'WALA'
      ? match.participant_b.odds
      : 8.0;

  const potentialPayout = (betAmount * selectedOdds).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1">
      {/* Breadcrumb & Match Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
            <Link href="/matches" className="hover:text-white transition-colors">
              Matches
            </Link>
            <span>/</span>
            <span>{event?.title || 'Derby Event'}</span>
            <span>/</span>
            <span className="text-white">Fight #{match.match_number}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Fight #{match.match_number}: {match.participant_a.name} vs {match.participant_b.name}</span>
          </h1>
        </div>

        {/* Status Badge */}
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
            {match.status}
          </span>
          {match.confirmed_result && (
            <span className="px-3 py-1 rounded bg-emerald-900/60 border border-emerald-700 text-emerald-300 font-mono text-xs font-bold">
              WINNER: {match.confirmed_result}
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Player on Left, Demo Bet Slip & Fight Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Responsive Video Player & Participant Metadata */}
        <div className="lg:col-span-8 space-y-6">
          <LiveKitPlayer
            roomName={match.broadcast_room_id}
            matchId={match.id}
            matchStatus={match.status}
            participantA={match.participant_a}
            participantB={match.participant_b}
            activeCamera={match.active_camera}
            onRefresh={fetchMatchData}
          />

          {/* Participant Technical Comparison Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-neutral-400" />
              <span>Gamefowl Specifications &amp; Handler Metadata</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Meron Box */}
              <div className="p-4 rounded-lg bg-red-950/20 border border-red-900/40 space-y-2">
                <div className="flex items-center justify-between border-b border-red-900/30 pb-2">
                  <span className="font-bold text-red-400 text-xs font-mono uppercase tracking-wider">
                    MERON (RED CORNER)
                  </span>
                  <span className="text-xs font-mono text-white font-bold">{match.participant_a.odds}x</span>
                </div>
                <div className="text-base font-bold text-white">{match.participant_a.name}</div>
                <div className="text-xs space-y-1 text-neutral-300 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Breed:</span>
                    <span>{match.participant_a.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Weight:</span>
                    <span className="text-white font-bold">{match.participant_a.weightKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Leg Band:</span>
                    <span>{match.participant_a.legBand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Farm:</span>
                    <span>{match.participant_a.farm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Handler:</span>
                    <span>{match.participant_a.handler}</span>
                  </div>
                </div>
              </div>

              {/* Wala Box */}
              <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-900/40 space-y-2">
                <div className="flex items-center justify-between border-b border-blue-900/30 pb-2">
                  <span className="font-bold text-blue-400 text-xs font-mono uppercase tracking-wider">
                    WALA (BLUE CORNER)
                  </span>
                  <span className="text-xs font-mono text-white font-bold">{match.participant_b.odds}x</span>
                </div>
                <div className="text-base font-bold text-white">{match.participant_b.name}</div>
                <div className="text-xs space-y-1 text-neutral-300 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Breed:</span>
                    <span>{match.participant_b.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Weight:</span>
                    <span className="text-white font-bold">{match.participant_b.weightKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Leg Band:</span>
                    <span>{match.participant_b.legBand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Farm:</span>
                    <span>{match.participant_b.farm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Handler:</span>
                    <span>{match.participant_b.handler}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Demonstration Bet Slip */}
        <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-5 sticky top-24">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Demonstration Bet Slip</span>
              </div>
              <p className="text-[10px] text-neutral-500">Virtual Non-Cash Simulation Only</p>
            </div>
            {wallet && (
              <div className="text-right font-mono text-xs">
                <div className="text-[10px] text-neutral-500 font-sans">Demo Balance:</div>
                <div className="text-emerald-400 font-bold">
                  ₱{wallet.virtual_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            )}
          </div>

          {betError && (
            <div className="p-3 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{betError}</span>
            </div>
          )}

          {betSuccess && (
            <div className="p-3 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{betSuccess}</span>
            </div>
          )}

          {/* Selection buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-300">Choose Side</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBetSide('MERON')}
                className={`p-2.5 rounded border text-center transition-all ${
                  betSide === 'MERON'
                    ? 'bg-red-600 text-white border-red-500 font-bold shadow'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-red-900'
                }`}
              >
                <div className="text-xs uppercase">MERON</div>
                <div className="text-[11px] font-mono mt-0.5">{match.participant_a.odds}x</div>
              </button>

              <button
                type="button"
                onClick={() => setBetSide('WALA')}
                className={`p-2.5 rounded border text-center transition-all ${
                  betSide === 'WALA'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold shadow'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-blue-900'
                }`}
              >
                <div className="text-xs uppercase">WALA</div>
                <div className="text-[11px] font-mono mt-0.5">{match.participant_b.odds}x</div>
              </button>

              <button
                type="button"
                onClick={() => setBetSide('DRAW')}
                className={`p-2.5 rounded border text-center transition-all ${
                  betSide === 'DRAW'
                    ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-emerald-900'
                }`}
              >
                <div className="text-xs uppercase">DRAW</div>
                <div className="text-[11px] font-mono mt-0.5">8.00x</div>
              </button>
            </div>
          </div>

          {/* Amount presets */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-neutral-300">Simulated Amount (Credits)</label>
              <span className="font-mono text-neutral-400">₱{betAmount.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[200, 500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBetAmount(amt)}
                  className={`py-1.5 px-2 rounded text-xs font-mono transition-colors ${
                    betAmount === amt
                      ? 'bg-neutral-700 text-white font-bold'
                      : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  +{amt}
                </button>
              ))}
            </div>

            <input
              type="number"
              min={50}
              step={50}
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white font-mono focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Projected Payout */}
          <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-1 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>Selected Side:</span>
              <span className="text-white font-semibold">{betSide}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Multiplier:</span>
              <span className="text-white">{selectedOdds}x</span>
            </div>
            <div className="flex justify-between border-t border-neutral-800 pt-1 text-emerald-400 font-bold">
              <span>Potential Return:</span>
              <span>₱{potentialPayout} DEMO</span>
            </div>
          </div>

          {/* Place Bet Action Button */}
          <button
            type="button"
            onClick={handlePlaceDemoBet}
            disabled={submittingBet || match.status === 'ENDED' || match.status === 'RESULT_CONFIRMED'}
            className="w-full py-3 px-4 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <span>
              {submittingBet
                ? 'Processing...'
                : match.status === 'ENDED' || match.status === 'RESULT_CONFIRMED'
                ? 'Fight Concluded (Bets Closed)'
                : `Place Simulated Bet on ${betSide}`}
            </span>
          </button>

          <div className="text-[10px] text-neutral-500 leading-relaxed text-center">
            Virtual demonstration credits are non-transferable, non-cashable, and non-redeemable. Transactions are recorded for audit compliance testing.
          </div>
        </div>
      </div>
    </div>
  );
}
