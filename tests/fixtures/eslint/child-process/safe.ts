// Safe: use execFile with literal argument
import { execFile } from 'child_process';

function runLs(): void {
  execFile('ls', ['-la']);
}

export { runLs };
