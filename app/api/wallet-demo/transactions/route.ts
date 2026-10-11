import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;

    const db = getDB();
    const transactions = db.getTransactions(userId);
    const wallet = userId ? db.getWallet(userId) : null;

    return NextResponse.json({
      transactions,
      wallet,
      total: transactions.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve transactions';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
