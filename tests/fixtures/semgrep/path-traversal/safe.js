// Safe: validate path
import * as fs from 'fs';
import * as path from 'path';

function readFile(userPath: string): string {
  const resolved = path.resolve(__dirname, userPath);
  if (!resolved.startsWith(__dirname)) {
    throw new Error('Path traversal detected');
  }
  return fs.readFileSync(resolved, 'utf8');
}

export { readFile };
