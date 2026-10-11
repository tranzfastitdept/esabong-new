-- ==============================================================================
-- SABONG SYSTEM CONSOLE — SUPABASE SCHEMA & ROW LEVEL SECURITY MIGRATION
-- Deployment Mode: STRICTLY DEMO / NON-WAGERING
-- Version: 1.0.0
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('bettor', 'operator', 'owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE match_status_type AS ENUM (
        'DRAFT',
        'SCHEDULED',
        'READY',
        'LIVE',
        'PAUSED',
        'ENDED',
        'RESULT_PENDING_REVIEW',
        'RESULT_CONFIRMED',
        'CANCELLED',
        'ARCHIVED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE demo_tx_type AS ENUM (
        'INITIAL_CREDIT',
        'DEMO_BET_PLACED',
        'DEMO_PAYOUT_WIN',
        'DEMO_BET_REFUND',
        'FAUCET_REFILL',
        'ADMIN_ADJUSTMENT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
-- Associated with auth.users. Includes required fields: name, username, withdrawalName, gcashNum
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    withdrawal_name TEXT NOT NULL,
    gcash_num TEXT NOT NULL,
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'bettor',
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, role)
);

-- 5. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    scheduled_start TIMESTAMPTZ NOT NULL,
    venue_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    match_number INT NOT NULL,
    participant_a JSONB NOT NULL DEFAULT '{}'::jsonb, -- Meron (e.g. name, breed, weight, farm, odds)
    participant_b JSONB NOT NULL DEFAULT '{}'::jsonb, -- Wala (e.g. name, breed, weight, farm, odds)
    scheduled_start TIMESTAMPTZ NOT NULL,
    status match_status_type NOT NULL DEFAULT 'SCHEDULED',
    broadcast_room_id TEXT NOT NULL,
    proposed_result TEXT, -- 'MERON' | 'WALA' | 'DRAW' | 'CANCELLED'
    confirmed_result TEXT,
    result_status TEXT NOT NULL DEFAULT 'UNRESOLVED' CHECK (result_status IN ('UNRESOLVED', 'PENDING_REVIEW', 'CONFIRMED', 'CANCELLED')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. BROADCASTS TABLE
CREATE TABLE IF NOT EXISTS public.broadcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    livekit_room_name TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'IDLE' CHECK (status IN ('IDLE', 'LIVE', 'PAUSED', 'ENDED')),
    active_program_source TEXT NOT NULL DEFAULT 'Camera 1 - Main View',
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 8. BROADCAST EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.broadcast_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broadcast_id UUID NOT NULL REFERENCES public.broadcasts(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'stream_started', 'camera_switched', 'stream_paused', 'health_degraded', 'stream_ended'
    source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    details JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 9. DEMO WALLETS TABLE
-- Strictly virtual non-cash demonstration credit wallet
CREATE TABLE IF NOT EXISTS public.demo_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    virtual_balance NUMERIC(14, 2) NOT NULL DEFAULT 10000.00 CHECK (virtual_balance >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. DEMO TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.demo_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.demo_wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    transaction_type demo_tx_type NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    previous_balance NUMERIC(14, 2) NOT NULL,
    resulting_balance NUMERIC(14, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED')),
    idempotency_key TEXT NOT NULL UNIQUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. RESULT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.result_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    proposed_result TEXT NOT NULL,
    confirmed_result TEXT,
    decision TEXT NOT NULL DEFAULT 'PENDING' CHECK (decision IN ('PENDING', 'APPROVED', 'REJECTED')),
    reason TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_at TIMESTAMPTZ
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    previous_values JSONB,
    new_values JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL DEFAULT 'INFO',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. COMPLIANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    authorization_type TEXT NOT NULL,
    issuing_authority TEXT NOT NULL,
    reference_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('ACTIVE', 'PENDING_REVIEW', 'SUSPENDED', 'EXPIRED')),
    effective_date DATE,
    expiry_date DATE,
    verification_notes TEXT,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;

-- Security Helper Functions
CREATE OR REPLACE FUNCTION public.get_user_role(u_id UUID)
RETURNS TEXT AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = u_id LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Bettor can view their own, operators/owners can view all for management
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Operators and owners can view profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role IN ('operator', 'owner')
        )
    );

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- User roles: Only owner can modify roles
CREATE POLICY "Users can read own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'owner'
    ));

-- Events & Matches: Public read
CREATE POLICY "Public can view scheduled and live events" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Public can view matches" ON public.matches
    FOR SELECT USING (true);

CREATE POLICY "Operators and owners can manage matches" ON public.matches
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role IN ('operator', 'owner')
        )
    );

-- Demo Wallets: Bettor can view own wallet, not mutate directly
CREATE POLICY "Users can view own demo wallet" ON public.demo_wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own demo transactions" ON public.demo_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Notifications: User can view own
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark notifications read" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Audit logs: Read only for operators and owners
CREATE POLICY "Audits visible to privileged roles" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role IN ('operator', 'owner')
        )
    );

-- Compliance: Visible to owner
CREATE POLICY "Compliance records visible to owners" ON public.compliance_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'owner'
        )
    );
