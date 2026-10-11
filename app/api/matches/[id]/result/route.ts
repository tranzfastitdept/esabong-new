import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, actorId, proposedResult, confirmedResult, decision, reason } = body;

    const db = getDB();

    if (action === 'submit') {
      if (!actorId || !proposedResult) {
        return NextResponse.json(
          { error: 'actorId and proposedResult are required.' },
          { status: 400 }
        );
      }
      const review = db.submitResultForReview(
        actorId,
        id,
        proposedResult,
        reason || 'Result submitted for referee review'
      );
      return NextResponse.json({ success: true, review });
    }

    if (action === 'review') {
      if (!actorId || !decision) {
        return NextResponse.json(
          { error: 'actorId and decision (APPROVED/REJECTED) are required.' },
          { status: 400 }
        );
      }
      const updatedMatch = db.reviewAndConfirmResult(
        actorId,
        id,
        decision,
        confirmedResult || proposedResult,
        reason || 'Outcome confirmed by senior reviewer'
      );
      return NextResponse.json({ success: true, match: updatedMatch });
    }

    return NextResponse.json({ error: 'Invalid action. Expected "submit" or "review".' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Result processing failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
