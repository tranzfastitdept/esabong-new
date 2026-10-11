import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, withdrawalName, gcashNum, reason } = body;

    if (!userId || !withdrawalName || !gcashNum) {
      return NextResponse.json(
        { error: 'userId, withdrawalName, and gcashNum are required.' },
        { status: 400 }
      );
    }

    const db = getDB();
    const updated = db.updatePayoutDetails(userId, {
      withdrawalName,
      gcashNum,
      reason,
    });

    return NextResponse.json({
      success: true,
      profile: updated,
      message: 'Payout details updated successfully in your demo profile.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
