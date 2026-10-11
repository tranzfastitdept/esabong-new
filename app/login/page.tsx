'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Shield, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickSwitch } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'bettor' | 'operator' | 'owner') => {
    setLoading(true);
    await quickSwitch(role);
    if (role === 'owner') router.push('/owner');
    else if (role === 'operator') router.push('/operator');
    else router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded bg-red-600 mx-auto flex items-center justify-center text-white text-sm font-black mb-3">
            SC
          </div>
          <h1 className="text-xl font-bold text-white">Sign In to Sabong Console</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Access live matches, demonstration test credits, and arena operations
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. carlos.bettor"
                className="w-full pl-9 pr-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-center mb-3">
            Quick Demo Role Access
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('bettor')}
              className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded text-center text-[11px] font-medium text-blue-400 transition-colors"
            >
              Bettor Role
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('operator')}
              className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded text-center text-[11px] font-medium text-emerald-400 transition-colors"
            >
              Operator Role
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('owner')}
              className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded text-center text-[11px] font-medium text-red-400 transition-colors"
            >
              Owner Role
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-400">
          Need an account?{' '}
          <Link href="/register" className="text-red-400 hover:underline font-semibold">
            Register Bettor Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
