// Vulnerable: child_process with non-literal argument
import { exec } from 'child_process';

function runCommand(cmd: string): void {
  // eslint-disable-next-line security/detect-child-process
  exec(cmd);
}

export { runCommand };
