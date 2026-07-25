// Vulnerable: pseudoRandomBytes instead of randomBytes
import { pseudoRandomBytes } from 'crypto';

function generateToken(): Buffer {
  // eslint-disable-next-line security/detect-pseudo-random-bytes
  return pseudoRandomBytes(32);
}

export { generateToken };
