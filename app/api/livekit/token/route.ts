import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { getDB } from '@/lib/db';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret_livekit_mock_test_key_minimum_length_required';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomName, identity, name, role = 'bettor' } = body;

    if (!roomName || !identity) {
      return NextResponse.json(
        { error: 'Missing required parameters: roomName and identity are required.' },
        { status: 400 }
      );
    }

    // Role-based publish permission check:
    // Bettors can NEVER publish video to the official event room
    // Only operators and owners can publish!
    const isPublisher = role === 'operator' || role === 'owner';

    // Verify user role on server if user profile exists
    const db = getDB();
    const userProfile = db.getProfile(identity);
    if (userProfile && (userProfile.role !== 'operator' && userProfile.role !== 'owner') && isPublisher) {
      return NextResponse.json(
        { error: 'Unauthorized: Bettors are prohibited from publishing video.' },
        { status: 403 }
      );
    }

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity,
      name: name || identity,
      ttl: '2h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isPublisher,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      roomName,
      identity,
      isPublisher,
      livekitUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://demo-livekit.cloud',
      mode: 'DEMO_BROADCAST',
    });
  } catch (error: unknown) {
    console.error('Error generating LiveKit token:', error);
    const msg = error instanceof Error ? error.message : 'Failed to generate token';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
