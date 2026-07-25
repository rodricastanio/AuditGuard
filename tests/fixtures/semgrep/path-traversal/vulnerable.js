// Vulnerable: path traversal
import * as fs from 'fs';

function readFile(userPath: string): string {
  return fs.readFileSync('../' + userPath, 'utf8');
}

export { readFile };
