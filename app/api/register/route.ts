import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { kv } from '@/lib/kv';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  const existing = await kv.get(`user:${username}`);
  if (existing) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
  }
  const hash = await bcrypt.hash(password, 10);
  await kv.set(`user:${username}`, { passwordHash: hash });
  return NextResponse.json({ success: true });
}
