// Safe: use literal filename
import * as fs from 'fs';

function readConfig(): void {
  fs.readFile('config.json', () => {});
}

export { readConfig };
