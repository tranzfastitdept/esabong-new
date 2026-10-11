'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, PlusCircle, MapPin } from 'lucide-react';
import { EventItem } from '@/lib/types';

export default function OwnerEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        setEvents(data.events || []);
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

      <div className="border-b border-neutral-800 pb-6">
        <div className="text-xs font-mono text-neutral-400">DERBY EVENTS</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Arena Events &amp; Tournaments</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Coliseum schedules, rings, venues, and derby tournament sanctions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((evt) => (
          <div key={evt.id} className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">{evt.title}</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold">
                {evt.status}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">{evt.description}</p>

            <div className="pt-2 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{evt.venue_metadata.arena_name} — {evt.venue_metadata.city}</span>
              </div>
              <div>Ring: {evt.venue_metadata.ring} ({evt.venue_metadata.coliseum_code})</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
