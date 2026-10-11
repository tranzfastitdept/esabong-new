import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20261011_init_sabong_system.sql');
    const seedPath = path.join(process.cwd(), 'supabase', 'seed.sql');

    const schemaSQL = fs.existsSync(migrationPath)
      ? fs.readFileSync(migrationPath, 'utf-8')
      : '-- Schema file not found';

    const seedSQL = fs.existsSync(seedPath)
      ? fs.readFileSync(seedPath, 'utf-8')
      : '-- Seed file not found';

    return NextResponse.json({
      schemaSQL,
      seedSQL,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rtpgaqrxdnuffxcjdxfa.supabase.co',
      livekitUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://mescord-1sohduxx.livekit.cloud',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error reading SQL';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
