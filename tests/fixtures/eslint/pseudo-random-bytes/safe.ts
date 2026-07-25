// Safe: use randomBytes
import { randomBytes } from 'crypto';

function generateToken(): Buffer {
  return randomBytes(32);
}

export { generateToken };
