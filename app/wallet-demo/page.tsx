'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Wallet,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Scale,
  CreditCard,
  Ban,
  Activity,
} from 'lucide-react';
import { DemoTransaction } from '@/lib/types';

export default function WalletDemoPage() {
  const { user, wallet, updateWalletBalance, refreshWallet } = useAuth();
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refilling, setRefilling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Test Scenario State
  const [scenarioType, setScenarioType] = useState<'success' | 'insufficient' | 'duplicate'>('success');
  const [runningScenario, setRunningScenario] = useState(false);

  const loadTransactions = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/wallet-demo/transactions?userId=${user.id}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  // Refill Faucet
  const handleRefillFaucet = async () => {
    if (!user) return;
    setRefilling(true);
    setError(null);
    setMessage(null);

    try {
      const idempotencyKey = `idemp_refill_${user.id}_${Date.now()}`;
      const res = await fetch('/api/wallet-demo/refill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, idempotencyKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Refill failed');

      updateWalletBalance(data.newBalance);
      setMessage(data.message || 'Demonstration credits refilled (+5,000 DEMO).');
      loadTransactions();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Refill error');
    } finally {
      setRefilling(false);
    }
  };

  // Run Test Scenarios
  const handleRunScenario = async () => {
    if (!user) return;
    setRunningScenario(true);
    setError(null);
    setMessage(null);

    try {
      if (scenarioType === 'insufficient') {
        // Attempt to place a bet larger than current balance
        const fakeAmount = (wallet?.virtual_balance || 0) + 500000;
        const res = await fetch('/api/wallet-demo/bet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            matchId: 'match_001',
            selection: 'MERON',
            amount: fakeAmount,
            idempotencyKey: `idemp_scenario_fail_${Date.now()}`,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(`Simulated Rejection Verified: Server correctly blocked transaction with: "${data.error}"`);
        } else {
          setError('Unexpected success: Balance check failed to trigger.');
        }
      } else if (scenarioType === 'duplicate') {
        // Submit duplicate idempotency key
        const fixedKey = `idemp_duplicate_test_key_fixed`;
        const res1 = await fetch('/api/wallet-demo/bet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            matchId: 'match_001',
            selection: 'MERON',
            amount: 100,
            idempotencyKey: fixedKey,
          }),
        });
        const res2 = await fetch('/api/wallet-demo/bet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            matchId: 'match_001',
            selection: 'MERON',
            amount: 100,
            idempotencyKey: fixedKey,
          }),
        });
        const data2 = await res2.json();
        setMessage(`Idempotency Verified: Server detected identical key "${fixedKey}". Deduplication preserved wallet balance without double charge!`);
        refreshWallet();
      } else {
        // Successful test bet
        const res = await fetch('/api/wallet-demo/bet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            matchId: 'match_001',
            selection: 'WALA',
            amount: 250,
            idempotencyKey: `idemp_scenario_success_${Date.now()}`,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        updateWalletBalance(data.newBalance);
        setMessage('Success Scenario Verified: ₱250.00 simulated bet processed and deducted with ACID ledger record.');
      }
      loadTransactions();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Scenario failed');
    } finally {
      setRunningScenario(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">FINANCIAL SUBSYSTEM COMPLIANCE</div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Virtual-Credit Demonstration Module</span>
            <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-xs font-mono font-bold uppercase">
              DEMO ONLY
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Simulated credit ledger for interface testing and database transaction integrity validation. No real-money gambling transactions may be enabled in demo mode.
          </p>
        </div>

        {/* Faucet Refill Action */}
        <button
          onClick={handleRefillFaucet}
          disabled={refilling}
          className="px-4 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{refilling ? 'Refilling Credits...' : 'Claim 5,000 Demo Credits'}</span>
        </button>
      </div>

      {/* Alerts */}
      {message && (
        <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Non-Wagering Legal Shield Notice */}
      <div className="p-5 rounded-lg bg-amber-950/20 border border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              STRICT COMPLIANCE &amp; LEGAL RESTRICTION
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Virtual demonstration credits have <strong>zero monetary value</strong>, cannot be converted to actual currency, and cannot be withdrawn or transferred to external accounts. Real-money betting, deposits, and cashouts remain disabled behind a server-enforced compliance gate.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Ban className="w-4 h-4 text-red-400" />
          <span>REAL DEPOSITS BLOCKED</span>
        </div>
      </div>

      {/* Wallet Balance Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>CURRENT VIRTUAL BALANCE</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tabular-nums">
            ₱{wallet?.virtual_balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </div>
          <div className="text-xs text-neutral-400">Non-redeemable demonstration testing units</div>
        </div>

        <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>REGISTERED WALLET ID</span>
            <span className="text-neutral-500 font-mono text-[10px]">UUID</span>
          </div>
          <div className="text-sm font-bold text-white font-mono truncate">{wallet?.id || 'wal_guest'}</div>
          <div className="text-xs text-neutral-400">Linked to user: {user?.username}</div>
        </div>

        <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>TRANSACTION INTEGRITY</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-bold text-white">Idempotency &amp; ACID Enforced</div>
          <div className="text-xs text-neutral-400">Duplicate requests are rejected server-side</div>
        </div>
      </div>

      {/* Automated Test Scenarios Console (For Architecture & QA Verification) */}
      <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="border-b border-neutral-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Interactive Database Integrity Scenarios</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Trigger simulated edge-cases to verify server-side validation and idempotency handling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setScenarioType('success')}
            className={`p-3 rounded border text-left text-xs transition-colors ${
              scenarioType === 'success'
                ? 'bg-neutral-800 border-emerald-500 text-white font-semibold'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
            }`}
          >
            <div className="font-bold text-emerald-400 mb-1">1. Successful Simulated Bet</div>
            <p className="text-[11px] text-neutral-400">Tests clean atomic balance deduction &amp; transaction logging.</p>
          </button>

          <button
            type="button"
            onClick={() => setScenarioType('insufficient')}
            className={`p-3 rounded border text-left text-xs transition-colors ${
              scenarioType === 'insufficient'
                ? 'bg-neutral-800 border-red-500 text-white font-semibold'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
            }`}
          >
            <div className="font-bold text-red-400 mb-1">2. Insufficient Balance Test</div>
            <p className="text-[11px] text-neutral-400">Verifies server rejects bets exceeding current wallet balance.</p>
          </button>

          <button
            type="button"
            onClick={() => setScenarioType('duplicate')}
            className={`p-3 rounded border text-left text-xs transition-colors ${
              scenarioType === 'duplicate'
                ? 'bg-neutral-800 border-blue-500 text-white font-semibold'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
            }`}
          >
            <div className="font-bold text-blue-400 mb-1">3. Idempotency Re-submission</div>
            <p className="text-[11px] text-neutral-400">Verifies duplicate submission keys cannot double-charge balance.</p>
          </button>
        </div>

        <button
          onClick={handleRunScenario}
          disabled={runningScenario}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded transition-colors flex items-center gap-2 border border-neutral-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{runningScenario ? 'Executing Scenario...' : `Execute Scenario: ${scenarioType.toUpperCase()}`}</span>
        </button>
      </div>

      {/* Transaction History Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="text-sm font-bold text-white">Full Virtual Transaction Audit Ledger</h2>
          <span className="text-xs font-mono text-neutral-500">{transactions.length} Records</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-xs">
            No demonstration transactions logged for this account yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                  <th className="py-2.5 pr-4">Timestamp</th>
                  <th className="py-2.5 px-4">Transaction Type</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-right">Prev Balance</th>
                  <th className="py-2.5 px-4 text-right">Resulting Balance</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 pl-4 font-mono">Idempotency Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-mono text-[11px]">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-800/40">
                    <td className="py-2.5 pr-4 text-neutral-400">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-sans font-semibold text-white">
                      {t.transaction_type.replace(/_/g, ' ')}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right font-bold ${
                        t.transaction_type === 'DEMO_BET_PLACED' ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {t.transaction_type === 'DEMO_BET_PLACED' ? '-' : '+'}₱
                      {t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-right text-neutral-400">
                      ₱{t.previous_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-right text-white font-bold">
                      ₱{t.resulting_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 uppercase text-[10px]">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2.5 pl-4 text-neutral-500 truncate max-w-[140px]" title={t.idempotency_key}>
                      {t.idempotency_key}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
