'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, ArrowLeft, Download } from 'lucide-react';
import { DemoTransaction } from '@/lib/types';

export default function OwnerTransactionsDemoPage() {
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/wallet-demo/transactions');
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/owner"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Owner Desk</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">FINANCIAL AUDITING</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Global Demonstration Transactions</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Auditing virtual credit volumes, simulated bet placements, and faucet refills.
          </p>
        </div>

        <span className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded">
          {transactions.length} Total Virtual Transactions
        </span>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                <th className="py-2.5 pr-4">Timestamp</th>
                <th className="py-2.5 px-4">User ID</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
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
                  <td className="py-2.5 px-4 text-white font-sans">{t.user_id}</td>
                  <td className="py-2.5 px-4 font-semibold text-neutral-200">
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
                  <td className="py-2.5 px-4 text-right text-white">
                    ₱{t.resulting_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 uppercase text-[10px]">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2.5 pl-4 text-neutral-500 truncate max-w-[150px]">
                    {t.idempotency_key}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
