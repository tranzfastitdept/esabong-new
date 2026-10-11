import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, matchId, selection, amount, idempotencyKey } = body;

    if (!userId || !matchId || !selection || !amount || !idempotencyKey) {
      return NextResponse.json(
        { error: 'userId, matchId, selection, amount, and idempotencyKey are required.' },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = db.placeDemoBet({
      userId,
      matchId,
      selection,
      amount: Number(amount),
      idempotencyKey,
    });

    return NextResponse.json({
      success: true,
      transaction: result.transaction,
      newBalance: result.newBalance,
      message: 'Simulated demonstration bet successfully recorded.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Demo bet failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
