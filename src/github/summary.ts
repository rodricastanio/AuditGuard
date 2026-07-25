import * as core from '@actions/core';
import * as fs from 'node:fs';

export function writeJobSummary(report: string): void {
  const summaryFile = process.env['GITHUB_STEP_SUMMARY'];
  if (!summaryFile) {
    core.warning('GITHUB_STEP_SUMMARY not set; skipping job summary.');
    return;
  }

  fs.appendFileSync(summaryFile, report + '\n', 'utf8');
  core.info('Report written to job summary');
}
