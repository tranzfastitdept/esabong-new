import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, idempotencyKey } = body;

    if (!userId || !idempotencyKey) {
      return NextResponse.json(
        { error: 'userId and idempotencyKey are required.' },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = db.refillDemoCredits(userId, idempotencyKey);

    return NextResponse.json({
      success: true,
      newBalance: result.newBalance,
      transaction: result.transaction,
      message: 'Demonstration credits refilled (+5,000 DEMO). These credits have no cash value.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Credit refill failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
