'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { FileText, Download, Search, Filter, ArrowLeft, Shield } from 'lucide-react';
import { AuditLogItem } from '@/lib/types';

export default function OwnerAuditPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const loadLogs = async () => {
    try {
      const res = await fetch('/api/owner/audit');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleExportCSV = () => {
    window.location.href = '/api/owner/audit?format=csv';
  };

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.reason.toLowerCase().includes(search.toLowerCase()) ||
      (l.actor_name && l.actor_name.toLowerCase().includes(search.toLowerCase())) ||
      l.entity_id.toLowerCase().includes(search.toLowerCase());

    if (entityFilter === 'ALL') return matchesSearch;
    return matchesSearch && l.entity_type === entityFilter;
  });

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
          <div className="text-xs font-mono text-neutral-400">IMMUTABLE SECURITY LEDGER</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Audit &amp; Event Logs</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Complete audit trail of user logins, role modifications, match transitions, and video cuts.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-2 border border-neutral-700 transition-colors shadow"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search actions, actors, reasons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 w-64"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
            {['ALL', 'MATCH', 'BROADCAST', 'USER', 'COMPLIANCE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setEntityFilter(tab)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  entityFilter === tab ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-neutral-500">{filtered.length} Recorded Events</span>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        {loading ? (
          <div className="p-8 text-center text-neutral-400">Loading audit records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                  <th className="py-2.5 pr-4">Timestamp (UTC)</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Entity</th>
                  <th className="py-2.5 px-4">Actor</th>
                  <th className="py-2.5 pl-4">Reason / Audit Trail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-mono text-[11px]">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-neutral-800/40">
                    <td className="py-3 pr-4 text-neutral-400 whitespace-nowrap">
                      {new Date(l.created_at).toISOString().replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="py-3 px-4 font-bold text-white font-sans">{l.action}</td>
                    <td className="py-3 px-4 text-neutral-300">
                      <span className="text-neutral-500">{l.entity_type}:</span> {l.entity_id}
                    </td>
                    <td className="py-3 px-4 font-sans text-neutral-300">{l.actor_name || l.actor_id}</td>
                    <td className="py-3 pl-4 font-sans text-neutral-300 max-w-md truncate" title={l.reason}>
                      {l.reason}
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
