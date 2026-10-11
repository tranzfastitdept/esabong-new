import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { UserRole } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const actorId = searchParams.get('actorId');

    const db = getDB();
    if (actorId) {
      const actor = db.getProfile(actorId);
      if (!actor || actor.role !== 'owner') {
        return NextResponse.json({ error: 'Unauthorized. Owner access required.' }, { status: 403 });
      }
    }

    const profiles = db.getAllProfiles();
    return NextResponse.json({ profiles, total: profiles.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch users';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, actorId, targetUserId, newRole, status, reason } = body;

    const db = getDB();

    if (action === 'update_role') {
      const updated = db.updateUserRole(actorId, targetUserId, newRole as UserRole);
      return NextResponse.json({ success: true, profile: updated });
    }

    if (action === 'set_status') {
      const updated = db.setAccountStatus(actorId, targetUserId, status, reason || 'Owner administrative action');
      return NextResponse.json({ success: true, profile: updated });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Action failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
