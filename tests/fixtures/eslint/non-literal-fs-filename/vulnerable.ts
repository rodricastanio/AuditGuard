// Vulnerable: non-literal filename in fs operation
import * as fs from 'fs';

function readFile(filename: string): void {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.readFile(filename, () => {});
}

export { readFile };
