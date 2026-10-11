'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Shield, User, Lock, Smartphone, CreditCard, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    withdrawalName: '',
    gcashNum: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.profile);
      localStorage.setItem(
        'sabong_user_session',
        JSON.stringify({ user: data.profile, wallet: data.wallet })
      );
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded bg-red-600 mx-auto flex items-center justify-center text-white text-sm font-black mb-3">
            SC
          </div>
          <h1 className="text-xl font-bold text-white">Bettor Account Registration</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Create your account to participate in live demonstration matches with virtual credits.
          </p>
        </div>

        {/* Notice of Demo Status */}
        <div className="mb-5 p-3 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-start gap-2.5">
          <Shield className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Demonstration Notice:</strong> Registration provisions 10,000 non-redeemable virtual demonstration credits. Payout details are stored as protected profile data; actual withdrawals are strictly disabled in demo mode.
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Full Legal Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Carlos Reyes"
              className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Unique Username <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-mono">@</span>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="carlos.bettor"
                className="w-full pl-8 pr-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">This will be your public identifier in chat and records.</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Account Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Protected Payout Details Section */}
          <div className="pt-2 border-t border-neutral-800 space-y-3">
            <div className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
              <span>Protected Payout Profile (Non-Public)</span>
            </div>

            {/* withdrawalName */}
            <div>
              <label className="block text-xs text-neutral-300 mb-1">
                Withdrawal Account Name (<code>withdrawalName</code>) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.withdrawalName}
                onChange={(e) => setForm({ ...form, withdrawalName: e.target.value })}
                placeholder="Exact name matching payment identity"
                className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* gcashNum */}
            <div>
              <label className="block text-xs text-neutral-300 mb-1">
                GCash Mobile Number (<code>gcashNum</code>) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={form.gcashNum}
                  onChange={(e) => setForm({ ...form, gcashNum: e.target.value })}
                  placeholder="09171234567"
                  className="w-full pl-9 pr-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                11-digit mobile number format. Encrypted and never shared publicly.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 px-4 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow"
          >
            <span>{loading ? 'Creating Account & Wallet...' : 'Complete Registration'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-400">
          Already registered?{' '}
          <Link href="/login" className="text-red-400 hover:underline font-semibold">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
