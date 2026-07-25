// Vulnerable: command injection via child_process
import { exec } from 'child_process';

function runUserCommand(cmd: string): void {
  exec('echo ' + cmd);
}

export { runUserCommand };
