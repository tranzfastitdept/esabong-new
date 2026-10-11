import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { MatchStatus } from '@/lib/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { actorId, newStatus, reason } = body;

    if (!actorId || !newStatus) {
      return NextResponse.json(
        { error: 'actorId and newStatus are required.' },
        { status: 400 }
      );
    }

    const db = getDB();
    const updated = db.transitionMatchStatus(
      actorId,
      id,
      newStatus as MatchStatus,
      reason || `Status updated to ${newStatus}`
    );

    return NextResponse.json({
      success: true,
      match: updated,
      message: `Match status updated to ${newStatus}.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update status';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
