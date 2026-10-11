'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { User, Shield, CreditCard, Calendar, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center flex-1">
        <h1 className="text-xl font-bold text-white mb-2">Sign In Required</h1>
        <Link href="/login" className="px-4 py-2 bg-red-600 text-white rounded text-xs font-semibold">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
      <div className="border-b border-neutral-800 pb-6">
        <div className="text-xs font-mono text-neutral-400">USER PROFILE</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Personal Account &amp; Identity</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Review your account credentials, assigned role permissions, and payout identity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (1 col): Identity Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400 text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-base font-bold text-white">{user.name}</div>
            <div className="text-xs text-neutral-400 font-mono">@{user.username}</div>
          </div>
          <div className="pt-2 border-t border-neutral-800 flex justify-center">
            <span className="px-2.5 py-0.5 rounded bg-neutral-800 text-amber-400 text-xs font-mono uppercase font-bold tracking-wider">
              {user.role} ROLE
            </span>
          </div>
        </div>

        {/* Right Column (2 cols): Details */}
        <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-bold text-white border-b border-neutral-800 pb-3">
            Account Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 block">Full Name:</span>
              <span className="text-white font-medium">{user.name}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Username (Unique):</span>
              <span className="text-white font-mono">@{user.username}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Account Status:</span>
              <span className="text-emerald-400 font-semibold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {user.account_status}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Registration Date:</span>
              <span className="text-neutral-300 font-mono">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Protected Payout Box */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Payout Profile (GCash Details)</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Protected non-public personal information
                </p>
              </div>

              <Link
                href="/profile/withdrawal-details"
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-colors"
              >
                <span>Edit Payout Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-3.5 rounded bg-neutral-950 border border-neutral-800/80 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block text-[11px]">Withdrawal Name:</span>
                <span className="text-white font-medium">{user.withdrawalName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">GCash Number:</span>
                <span className="text-neutral-300 font-mono">
                  {user.gcashNum ? user.gcashNum.replace(/(\d{4})\d{3}(\d{4})/, '$1***$2') : 'Not Set'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
