import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const actorId = searchParams.get('actorId') || undefined;
    const entityType = searchParams.get('entityType') || undefined;
    const action = searchParams.get('action') || undefined;
    const format = searchParams.get('format');

    const db = getDB();
    const logs = db.getAuditLogs({ actorId, entityType, action });

    if (format === 'csv') {
      // Export sanitized CSV (excluding passwords and sensitive personal information)
      const header = 'ID,Timestamp,Actor ID,Actor Name,Action,Entity Type,Entity ID,Reason\n';
      const rows = logs.map((l) => {
        const cleanReason = (l.reason || '').replace(/"/g, '""');
        const cleanName = (l.actor_name || '').replace(/"/g, '""');
        return `"${l.id}","${l.created_at}","${l.actor_id}","${cleanName}","${l.action}","${l.entity_type}","${l.entity_id}","${cleanReason}"`;
      }).join('\n');

      return new NextResponse(header + rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="sabong_audit_logs_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ logs, total: logs.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve audit logs';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
