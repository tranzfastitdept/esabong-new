'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Bell, CheckCircle2, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { NotificationItem } from '@/lib/types';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_001',
      user_id: user?.id || 'usr_demo',
      notification_type: 'INFO',
      title: 'Welcome to Sabong System Console',
      message: 'Your account is loaded with 10,000 non-redeemable demonstration virtual credits.',
      read_at: null,
      created_at: '2026-10-11T00:00:00.000Z',
    },
    {
      id: 'notif_002',
      user_id: user?.id || 'usr_demo',
      notification_type: 'MATCH',
      title: 'Match #1 Live Broadcast Active',
      message: 'Thunderbird Crimson Hatch vs Silver Cobalt Kelso bout is currently streaming.',
      read_at: null,
      created_at: '2026-10-11T01:00:00.000Z',
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">COMMUNICATION CENTER</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System &amp; Event Notifications</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time match alerts, credit disbursements, and operational announcements.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-3.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors"
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-lg border transition-colors flex items-start gap-3.5 ${
              n.read_at
                ? 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                : 'bg-neutral-900 border-neutral-700 text-neutral-200'
            }`}
          >
            <div className="mt-0.5">
              {n.notification_type === 'MATCH' ? (
                <Bell className="w-4 h-4 text-red-400" />
              ) : (
                <Info className="w-4 h-4 text-blue-400" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{n.title}</span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-neutral-400">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
