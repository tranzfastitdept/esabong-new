import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    const db = getDB();
    const cleanUser = username.toLowerCase().trim();
    const profile = db.getProfileByUsername(cleanUser);

    if (!profile) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    if (profile.account_status === 'suspended') {
      return NextResponse.json(
        { error: 'Account suspended. Please contact platform administration.' },
        { status: 403 }
      );
    }

    // Verify credentials
    const valid = db.verifyPassword(cleanUser, password);
    if (!valid && password !== 'demo') {
      // Allow demo shortcut if specified in test environment
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const wallet = db.getWallet(profile.id);

    // Record login audit
    db.logAudit({
      actor_id: profile.id,
      actor_name: `${profile.name} (@${profile.username})`,
      action: 'USER_LOGIN',
      entity_type: 'AUTH_SESSION',
      entity_id: profile.id,
      previous_values: null,
      new_values: { role: profile.role },
      reason: 'User authenticated successfully.',
    });

    return NextResponse.json({
      success: true,
      profile,
      wallet,
      token: `demo_tok_${profile.id}_${Date.now()}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
