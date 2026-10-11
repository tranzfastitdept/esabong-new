import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    const match = db.getMatch(id);

    if (!match) {
      return NextResponse.json({ error: 'Match not found.' }, { status: 404 });
    }

    const event = db.getEvent(match.event_id);
    const broadcastEvents = db.getBroadcastEvents(match.id);

    return NextResponse.json({
      match,
      event,
      broadcastEvents,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error retrieving match';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
