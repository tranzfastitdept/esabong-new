import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, password, withdrawalName, gcashNum } = body;

    if (!name || !username || !password || !withdrawalName || !gcashNum) {
      return NextResponse.json(
        {
          error:
            'All registration fields are required: name, username, password, withdrawalName, and gcashNum.',
        },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = db.registerUser({
      name,
      username,
      password,
      withdrawalName,
      gcashNum,
      role: 'bettor',
    });

    return NextResponse.json({
      success: true,
      profile: result.profile,
      wallet: result.wallet,
      token: `demo_tok_${result.profile.id}_${Date.now()}`,
      message: 'Account registered successfully with 10,000 non-redeemable demonstration credits.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
