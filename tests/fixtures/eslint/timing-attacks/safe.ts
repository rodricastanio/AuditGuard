// Safe: use constant-time comparison
import { timingSafeEqual } from 'crypto';

function verifyToken(token: string, secret: string): boolean {
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export { verifyToken };
