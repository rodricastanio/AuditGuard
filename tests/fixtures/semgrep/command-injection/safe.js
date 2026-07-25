// Safe: use execFile with array
import { execFile } from 'child_process';

function runEcho(): void {
  execFile('echo', ['hello']);
}

export { runEcho };
