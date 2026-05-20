import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') ?? '';
  const roomId = url.searchParams.get('roomId') ?? '';
  try {
    const payload = verifyToken(token);
    const username = payload.username;
    if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });
    const members = await kv.smembers(`room:${roomId}:users`);
    if (!members.includes(username)) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 });
    }
    const messages = await kv.lrange(`room:${roomId}:messages`, -50, -1);
    const parsed = messages.map((m: string) => JSON.parse(m));
    return NextResponse.json({ messages: parsed });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const { token, roomId, text } = await req.json();
  try {
    const payload = verifyToken(token);
    const username = payload.username;
    if (!roomId || !text) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const members = await kv.smembers(`room:${roomId}:users`);
    if (!members.includes(username)) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 });
    }
    const msg = { from: username, text, time: Date.now() };
    await kv.rpush(`room:${roomId}:messages`, JSON.stringify(msg));
    await kv.ltrim(`room:${roomId}:messages`, -200, -1);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
