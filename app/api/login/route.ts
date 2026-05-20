import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { kv } from '@/lib/kv';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const userData = await kv.get(`user:${username}`) as any;
  if (!userData) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, userData.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = signToken(username);
  const response = NextResponse.json({ success: true });
  response.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 3600 });
  return response;
}
