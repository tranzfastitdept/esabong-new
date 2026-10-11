'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { History, Filter, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { DemoTransaction } from '@/lib/types';

export default function TransactionsHistoryPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const res = await fetch(`/api/wallet-demo/transactions?userId=${user.id}`);
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const filtered = transactions.filter((t) => {
    if (filterType === 'ALL') return true;
    return t.transaction_type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">LEDGER AUDIT</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Demonstration Transaction History</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Audited simulated credits, bet placements, winnings, and refilled faucet transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
            {['ALL', 'DEMO_BET_PLACED', 'DEMO_PAYOUT_WIN', 'FAUCET_REFILL'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filterType === tab ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab === 'ALL'
                  ? 'All'
                  : tab === 'DEMO_BET_PLACED'
                  ? 'Bets Placed'
                  : tab === 'DEMO_PAYOUT_WIN'
                  ? 'Winnings'
                  : 'Refills'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-neutral-800/40 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-xs">
            No demonstration transactions match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                  <th className="py-2.5 pr-4">Timestamp</th>
                  <th className="py-2.5 px-4">Transaction Type</th>
                  <th className="py-2.5 px-4">Match ID</th>
                  <th className="py-2.5 px-4 text-right">Credit Delta</th>
                  <th className="py-2.5 px-4 text-right">Resulting Balance</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 pl-4 font-mono">Idempotency Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-mono text-[11px]">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-800/40">
                    <td className="py-2.5 pr-4 text-neutral-400">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-sans font-semibold text-white">
                      {t.transaction_type.replace(/_/g, ' ')}
                    </td>
                    <td className="py-2.5 px-4 text-neutral-400">
                      {t.match_id ? (
                        <Link href={`/matches/${t.match_id}`} className="hover:text-red-400 underline">
                          {t.match_id}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right font-bold ${
                        t.transaction_type === 'DEMO_BET_PLACED' ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {t.transaction_type === 'DEMO_BET_PLACED' ? '-' : '+'}₱
                      {t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-right text-white font-bold">
                      ₱{t.resulting_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 uppercase text-[10px]">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2.5 pl-4 text-neutral-500 truncate max-w-[150px]" title={t.idempotency_key}>
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
