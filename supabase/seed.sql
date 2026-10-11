-- ==============================================================================
-- SABONG SYSTEM CONSOLE — SEED FIXTURES (DEMONSTRATION ONLY)
-- All data is explicitly labeled as non-wagering simulation data.
-- ==============================================================================

-- Sample profiles:
-- 1. Owner: Maria Santos (superadmin / platform owner)
-- 2. Operator: Juan Del Rosario (broadcast operator)
-- 3. Bettor: Carlos Reyes (bettor with test virtual credits)

-- Compliance record: Strictly Unverified / Demo Only
INSERT INTO public.compliance_records (
    id,
    authorization_type,
    issuing_authority,
    reference_number,
    status,
    effective_date,
    expiry_date,
    verification_notes,
    created_at
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'AMUSEMENT_GAMING_LICENSING',
    'NATIONAL_GAMING_COMMISSION_DEMO',
    'PAGCOR-DEMO-2026-NONWAGER',
    'PENDING_REVIEW',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year',
    'TEST SYSTEM: STRICTLY DEMO NON-WAGERING MODE ENFORCED. No real-money transaction gateway permitted.',
    NOW()
) ON CONFLICT (id) DO NOTHING;
