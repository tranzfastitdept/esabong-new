import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');
    const db = getDB();
    let matches = db.getAllMatches();

    if (statusFilter && statusFilter !== 'ALL') {
      matches = matches.filter((m) => m.status === statusFilter);
    }

    return NextResponse.json({
      matches,
      events: db.getAllEvents(),
      total: matches.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch matches';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { actorId, matchData } = body;

    if (!actorId || !matchData) {
      return NextResponse.json(
        { error: 'actorId and matchData are required.' },
        { status: 400 }
      );
    }

    const db = getDB();
    const newMatch = db.createMatch(actorId, matchData);

    return NextResponse.json({
      success: true,
      match: newMatch,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create match';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
