'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Wallet,
  Radio,
  ArrowRight,
  TrendingUp,
  History,
  Shield,
  Smartphone,
  ExternalLink,
  Play,
  RotateCcw,
} from 'lucide-react';
import { MatchItem, DemoTransaction } from '@/lib/types';

export default function BettorDashboardPage() {
  const { user, wallet, refreshWallet } = useAuth();
  const [liveMatches, setLiveMatches] = useState<MatchItem[]>([]);
  const [recentTxs, setRecentTxs] = useState<DemoTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [mRes, tRes] = await fetch('/api/matches').then((r) => r.json());
        const matchesRes = await fetch('/api/matches');
        const matchesData = await matchesRes.json();
        setLiveMatches(matchesData.matches || []);

        if (user) {
          const txRes = await fetch(`/api/wallet-demo/transactions?userId=${user.id}`);
          const txData = await txRes.json();
          setRecentTxs(txData.transactions?.slice(0, 5) || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center flex-1">
        <h1 className="text-xl font-bold text-white mb-2">Sign In Required</h1>
        <p className="text-xs text-neutral-400 mb-4">Please log in to access your personal dashboard.</p>
        <Link href="/login" className="px-4 py-2 bg-red-600 text-white rounded text-xs font-semibold">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const activeLive = liveMatches.find((m) => m.status === 'LIVE');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">ACCOUNT OVERVIEW</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Signed in as <span className="font-mono text-neutral-200">@{user.username}</span> · Role: <span className="uppercase text-amber-400 font-semibold">{user.role}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/wallet-demo"
            className="px-3.5 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-2 border border-neutral-700 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manage Demo Credits</span>
          </Link>
          <Link
            href="/matches"
            className="px-3.5 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Watch Live Matches</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Demo Virtual Balance</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400">
              NON-CASH
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            ₱{wallet?.virtual_balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </div>
          <div className="text-[11px] text-neutral-500">Refillable anytime via Demo Faucet</div>
        </div>

        {/* GCash Profile Card */}
        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Protected Payout Name</span>
            <Shield className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-white truncate">{user.withdrawalName}</div>
          <div className="text-[11px] text-neutral-500 font-mono">
            GCash: {user.gcashNum ? user.gcashNum.replace(/(\d{4})\d{3}(\d{4})/, '$1***$2') : 'None'}
          </div>
        </div>

        {/* Live Broadcast Status */}
        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Live Coliseum Octagon</span>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="text-lg font-bold text-white">
            {activeLive ? `Fight #${activeLive.match_number} Live` : 'Standby Mode'}
          </div>
          <div className="text-[11px] text-neutral-500 truncate">
            {activeLive ? `${activeLive.participant_a.name} vs ${activeLive.participant_b.name}` : 'Next bout preparing'}
          </div>
        </div>

        {/* Compliance Guard */}
        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Operational Mode</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400">
              GATE ACTIVE
            </span>
          </div>
          <div className="text-lg font-bold text-amber-400">Non-Wagering Demo</div>
          <div className="text-[11px] text-neutral-500">No real funds at risk</div>
        </div>
      </div>

      {/* Main Grid: Active Match on Left, Recent Transactions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Live Match Highlight */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Current Featured Arena Match</span>
            </h2>
            {activeLive && (
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                {activeLive.status}
              </span>
            )}
          </div>

          {activeLive ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-950/20 border border-red-900/40">
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase">MERON</span>
                  <div className="text-sm font-bold text-white mt-1">{activeLive.participant_a.name}</div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    {activeLive.participant_a.weightKg}kg · {activeLive.participant_a.odds}x
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-900/40">
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">WALA</span>
                  <div className="text-sm font-bold text-white mt-1">{activeLive.participant_b.name}</div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    {activeLive.participant_b.weightKg}kg · {activeLive.participant_b.odds}x
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-neutral-400">Camera Source: {activeLive.active_camera}</span>
                <Link
                  href={`/matches/${activeLive.id}`}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <span>Enter Match Octagon</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-400 text-xs">
              No live bout right now. Standby for the next event in the queue.
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Recent Transactions */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-neutral-400" />
              <span>Simulated Transaction History</span>
            </h2>
            <Link href="/transactions" className="text-xs text-red-400 hover:underline">
              View All
            </Link>
          </div>

          {recentTxs.length === 0 ? (
            <div className="p-6 text-center text-neutral-500 text-xs">
              No simulated transactions yet. Place a test bet on any live match!
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTxs.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">
                      {tx.transaction_type.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {tx.idempotency_key.substring(0, 16)}...
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div
                      className={`font-bold ${
                        tx.transaction_type === 'DEMO_PAYOUT_WIN' || tx.transaction_type === 'FAUCET_REFILL' || tx.transaction_type === 'INITIAL_CREDIT'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {tx.transaction_type === 'DEMO_BET_PLACED' ? '-' : '+'}₱
                      {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
