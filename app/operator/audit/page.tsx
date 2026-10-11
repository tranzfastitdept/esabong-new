'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Sliders, History, Search } from 'lucide-react';
import { AuditLogItem } from '@/lib/types';

export default function OperatorAuditPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/owner/audit');
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(query.toLowerCase()) ||
      l.reason.toLowerCase().includes(query.toLowerCase()) ||
      l.entity_type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="border-b border-neutral-800 pb-6">
        <div className="text-xs font-mono text-neutral-400">ACTIVITY AUDIT</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Operator Action Audit Logs</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Detailed operational records of camera cuts, match-state shifts, and outcome proposals.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search action or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 w-64"
          />
          <span className="text-xs font-mono text-neutral-500">{filtered.length} Entries</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-neutral-400">Loading audit records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                  <th className="py-2.5 pr-4">Timestamp</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Entity</th>
                  <th className="py-2.5 px-4">Operator</th>
                  <th className="py-2.5 pl-4">Reason / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-mono text-[11px]">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-neutral-800/40">
                    <td className="py-2.5 pr-4 text-neutral-400 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-white font-sans">{l.action}</td>
                    <td className="py-2.5 px-4 text-neutral-300">
                      {l.entity_type}: {l.entity_id}
                    </td>
                    <td className="py-2.5 px-4 text-neutral-400 font-sans">{l.actor_name || l.actor_id}</td>
                    <td className="py-2.5 pl-4 text-neutral-300 font-sans">{l.reason}</td>
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
