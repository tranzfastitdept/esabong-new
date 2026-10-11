'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Radio,
  Shield,
  Sliders,
  Wallet,
  UserCheck,
  ChevronDown,
  LogOut,
  Bell,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, wallet, logout, quickSwitch } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getLinks = () => {
    if (!user) {
      return [
        { href: '/matches', label: 'Matches' },
        { href: '/support', label: 'Compliance & Support' },
      ];
    }
    if (user.role === 'owner') {
      return [
        { href: '/owner', label: 'Overview' },
        { href: '/owner/users', label: 'Accounts' },
        { href: '/owner/matches', label: 'Matches' },
        { href: '/owner/broadcasts', label: 'Broadcasts' },
        { href: '/owner/compliance', label: 'Compliance' },
        { href: '/owner/audit', label: 'Audit Trail' },
      ];
    }
    if (user.role === 'operator') {
      return [
        { href: '/operator', label: 'Dashboard' },
        { href: '/operator/matches', label: 'Matches' },
        { href: '/operator/broadcast', label: 'Live Broadcast' },
        { href: '/operator/results', label: 'Results' },
        { href: '/operator/audit', label: 'Operator Logs' },
      ];
    }
    // Bettor
    return [
      { href: '/matches', label: 'Matches' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/wallet-demo', label: 'Virtual Credits' },
      { href: '/transactions', label: 'Transactions' },
      { href: '/profile', label: 'Profile' },
      { href: '/support', label: 'Support' },
    ];
  };

  const navLinks = getLinks();

  return (
    <>
      {/* Top Compliance Notice Bar */}
      <div className="w-full bg-neutral-950 border-b border-neutral-800/80 px-4 py-1.5 text-xs text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl truncate">
          <span className="font-semibold text-amber-400 tracking-wider">DEMO ENVIRONMENT</span>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline truncate">
            Strictly Non-Wagering Demonstration Mode. No real money betting or withdrawals enabled.
          </span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px] shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            LIVEKIT WebRTC
          </span>
          <span className="text-neutral-600">·</span>
          <span>LATENCY &lt; 250ms</span>
        </div>
      </div>

      {/* Main Top Bar Contract */}
      <header className="sticky top-0 z-50 w-full bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white font-bold text-lg tracking-tight whitespace-nowrap shrink-0 hover:text-neutral-200 transition-colors"
          >
            <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white text-xs font-black shadow-inner">
              SC
            </div>
            <span>Sabong System Console</span>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                    active
                      ? 'text-white border-b-2 border-red-500 font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: User Action & Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <>
                {/* Virtual Balance Pill */}
                {user.role === 'bettor' && wallet && (
                  <Link
                    href="/wallet-demo"
                    className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700/80 text-xs font-mono text-neutral-200 hover:border-neutral-600 transition-colors"
                    title="Non-redeemable demonstration test credits"
                  >
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="tabular-nums font-semibold text-emerald-400">
                      ₱{wallet.virtual_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-sans">DEMO</span>
                  </Link>
                )}

                {/* Notifications Link */}
                <Link
                  href="/notifications"
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </Link>

                {/* Role Switcher & Account Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700 text-xs text-white transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-medium truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                    <span className="uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-neutral-900 text-amber-400 font-mono">
                      {user.role}
                    </span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </button>

                  {roleMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-72 rounded-lg bg-neutral-900 border border-neutral-800 shadow-2xl p-2 text-xs z-50 text-neutral-300"
                      onMouseLeave={() => setRoleMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-neutral-500 font-mono text-[11px]">@{user.username}</div>
                        <div className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Role: <strong className="uppercase">{user.role}</strong>
                        </div>
                      </div>

                      {/* Quick Role Tester Switcher */}
                      <div className="px-3 py-1.5 text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                        Switch Role Interface
                      </div>
                      <button
                        onClick={() => {
                          quickSwitch('bettor');
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
                          user.role === 'bettor' ? 'bg-neutral-800 text-white font-semibold' : 'hover:bg-neutral-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Bettor (Carlos Reyes)</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Public &amp; Bets</span>
                      </button>

                      <button
                        onClick={() => {
                          quickSwitch('operator');
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
                          user.role === 'operator' ? 'bg-neutral-800 text-white font-semibold' : 'hover:bg-neutral-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Operator (Juan Del Rosario)</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Cameras &amp; Matches</span>
                      </button>

                      <button
                        onClick={() => {
                          quickSwitch('owner');
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
                          user.role === 'owner' ? 'bg-neutral-800 text-white font-semibold' : 'hover:bg-neutral-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5 text-red-400" />
                          <span>Owner (Maria Santos)</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Superadmin &amp; RLS</span>
                      </button>

                      <div className="border-t border-neutral-800 mt-2 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setRoleMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded text-red-400 hover:bg-neutral-800/80 text-left transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white rounded bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
