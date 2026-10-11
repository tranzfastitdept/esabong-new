import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const db = getDB();
    const records = db.getComplianceRecords();
    const settings = db.getSystemSettings();

    return NextResponse.json({
      records,
      deploymentMode: 'DEMO_NON_WAGERING',
      isAuthorizedForRealMoney: false,
      legalGateActive: true,
      complianceNotice:
        'CRITICAL LEGAL LOCK: Real-money wagering, actual GCash transfers, deposits, and cashouts are permanently prohibited until statutory regulatory authorization is independently verified.',
      settings,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching compliance data';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { actorId, recordId, updates } = body;

    const db = getDB();
    const updated = db.updateComplianceRecord(actorId, recordId, updates);

    return NextResponse.json({
      success: true,
      record: updated,
      message: 'Compliance record updated. System remains safely guarded in non-wagering mode.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Compliance update failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
