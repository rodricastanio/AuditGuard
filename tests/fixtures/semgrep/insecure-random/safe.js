// Safe: use crypto for security purposes
import { randomBytes } from 'crypto';

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export { generateToken };
