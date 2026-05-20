import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { token, roomId } = await req.json();
  try {
    const payload = verifyToken(token);
    const username = payload.username;
    if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });
    const roomKey = `room:${roomId}:users`;
    const members = await kv.smembers(roomKey);
    if (members.length >= 2 && !members.includes(username)) {
      return NextResponse.json({ error: 'Room is full (max 2 persons)' }, { status: 403 });
    }
    await kv.sadd(roomKey, username);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
