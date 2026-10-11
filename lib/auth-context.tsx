'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DemoWallet } from './types';

interface AuthContextType {
  user: UserProfile | null;
  wallet: DemoWallet | null;
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  quickSwitch: (role: 'bettor' | 'operator' | 'owner') => Promise<void>;
  updateWalletBalance: (newBalance: number) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  refreshWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<DemoWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore stored session on mount or default to bettor Carlos Reyes
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sabong_user_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setWallet(parsed.wallet);
      } else {
        // Auto-login default bettor Carlos Reyes for immediate exploration
        login('carlos.bettor', 'BettorPass2026!');
      }
    } catch (e) {
      console.error('Session restore error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password = 'demo'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      setUser(data.profile);
      setWallet(data.wallet);
      localStorage.setItem(
        'sabong_user_session',
        JSON.stringify({ user: data.profile, wallet: data.wallet })
      );
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const quickSwitch = async (role: 'bettor' | 'operator' | 'owner') => {
    const defaultUsers = {
      bettor: 'carlos.bettor',
      operator: 'juan.operator',
      owner: 'maria.owner',
    };
    await login(defaultUsers[role]);
  };

  const logout = () => {
    setUser(null);
    setWallet(null);
    localStorage.removeItem('sabong_user_session');
  };

  const updateWalletBalance = (newBalance: number) => {
    setWallet((prev) => (prev ? { ...prev, virtual_balance: newBalance } : null));
  };

  const refreshWallet = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/wallet-demo/transactions?userId=${user.id}`);
      const data = await res.json();
      if (data.wallet) {
        setWallet(data.wallet);
      }
    } catch (e) {
      console.error('Failed to refresh wallet:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        isLoading,
        login,
        logout,
        quickSwitch,
        updateWalletBalance,
        setUser,
        refreshWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
