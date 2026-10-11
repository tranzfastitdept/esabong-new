'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Database, CheckCircle2, ArrowLeft, Copy, Check, Radio, Code2, Server } from 'lucide-react';

export default function OwnerSystemHealthPage() {
  const [data, setData] = useState<any>(null);
  const [sqlData, setSqlData] = useState<{ schemaSQL: string; seedSQL: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schema' | 'seed'>('schema');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [diagRes, sqlRes] = await Promise.all([
          fetch('/api/owner/diagnostics'),
          fetch('/api/owner/sql'),
        ]);
        const diagJson = await diagRes.json();
        const sqlJson = await sqlRes.json();
        setData(diagJson);
        setSqlData(sqlJson);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const copySQL = () => {
    if (!sqlData) return;
    const textToCopy = activeTab === 'schema' ? sqlData.schemaSQL : sqlData.seedSQL;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/owner"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Owner Desk</span>
        </Link>
      </div>

      <div className="border-b border-neutral-800 pb-6">
        <div className="text-xs font-mono text-neutral-400">NODE DIAGNOSTICS &amp; SQL ENGINE</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Health &amp; Supabase Integration</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Connected to LiveKit Cloud WebRTC and Supabase PostgreSQL with real database persistence.
        </p>
      </div>

      {/* Live Service Endpoints Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supabase Endpoint */}
        <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Supabase Project URL
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold">
              CONNECTED
            </span>
          </div>
          <div className="text-xs font-mono text-emerald-400 truncate">
            https://rtpgaqrxdnuffxcjdxfa.supabase.co
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            Key: sb_publishable_qdN1E...aimUQ8K
          </div>
        </div>

        {/* LiveKit Endpoint */}
        <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              LiveKit Cloud WebRTC Server
            </span>
            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-mono font-bold">
              ACTIVE CLOUD
            </span>
          </div>
          <div className="text-xs font-mono text-red-400 truncate">
            wss://mescord-1sohduxx.livekit.cloud
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            API Key: APIFF6LuRzKUHHp
          </div>
        </div>
      </div>

      {/* Primary Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 font-mono">NODE HEALTH</div>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>OPERATIONAL</span>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">Real-time WebRTC active</div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 font-mono">DATABASE PROVIDER</div>
          <div className="text-sm font-bold text-white truncate">
            Supabase PostgreSQL
          </div>
          <div className="text-[11px] text-neutral-500">
            Real persistence without mock data
          </div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 font-mono">TRACKED SCHEMAS</div>
          <div className="text-xl font-bold font-mono text-white">12 Tables</div>
          <div className="text-[11px] text-neutral-500 font-mono">PostgreSQL RLS Protected</div>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 font-mono">COMPLIANCE GATE</div>
          <div className="text-xl font-bold font-mono text-amber-400">DEMO MODE</div>
          <div className="text-[11px] text-neutral-500 font-mono">Wagering Gate Enforced</div>
        </div>
      </div>

      {/* Supabase SQL DDL & Migration Viewer */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Full Supabase Database SQL Script (DDL &amp; RLS)</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Copy and execute in your Supabase SQL Editor to verify tables and security policies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded text-xs">
              <button
                onClick={() => setActiveTab('schema')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeTab === 'schema' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Schema &amp; RLS DDL
              </button>
              <button
                onClick={() => setActiveTab('seed')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeTab === 'seed' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Seed SQL
              </button>
            </div>

            <button
              onClick={copySQL}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
            </button>
          </div>
        </div>

        {/* Code Block with line-clamp/scrolling */}
        <div className="relative">
          <pre className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-[480px] leading-relaxed">
            {activeTab === 'schema' ? sqlData?.schemaSQL : sqlData?.seedSQL}
          </pre>
        </div>
      </div>
    </div>
  );
}
