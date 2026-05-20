import jwt from 'jsonwebtoken';

export function signToken(username: string) {
  return jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
}
