import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { actorId, cameraName, reason } = body;

    if (!actorId || !cameraName) {
      return NextResponse.json(
        { error: 'actorId and cameraName are required.' },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = db.switchCamera(actorId, id, cameraName, reason);

    return NextResponse.json({
      success: true,
      ...result,
      message: `Active program camera switched to ${cameraName}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Camera switch failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
