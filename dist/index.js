import * as core from '@actions/core';
import { runEslintEngine } from './rules/eslint-engine.js';
import { runSemgrepEngine } from './rules/semgrep-engine.js';
import { runNpmAuditEngine } from './rules/npm-audit-engine.js';
import { deduplicateFindings } from './rules/deduplicator.js';
import { generateMarkdownReport } from './report/markdown-generator.js';
import { writeJobSummary } from './github/summary.js';
const SEVERITY_EXIT_ORDER = ['critical', 'high', 'medium', 'low', 'info'];
function shouldFail(findings, failOnLevel) {
    if (failOnLevel === 'never')
        return false;
    const threshold = SEVERITY_EXIT_ORDER.indexOf(failOnLevel);
    return findings.some((f) => SEVERITY_EXIT_ORDER.indexOf(f.severity) <= threshold);
}
export async function runAudit(config) {
    const allFindings = [];
    core.info('Starting ESLint security scan...');
    try {
        const eslintFindings = await runEslintEngine(config.scanPath, config.eslintConfigPath);
        core.info(`ESLint: ${eslintFindings.length} findings`);
        allFindings.push(...eslintFindings);
    }
    catch (error) {
        core.warning(`ESLint scan failed: ${error}`);
    }
    core.info('Starting Semgrep scan...');
    try {
        const semgrepFindings = await runSemgrepEngine(config.scanPath, config.semgrepRulesets);
        core.info(`Semgrep: ${semgrepFindings.length} findings`);
        allFindings.push(...semgrepFindings);
    }
    catch (error) {
        core.warning(`Semgrep scan failed: ${error}`);
    }
    core.info('Starting npm audit...');
    try {
        const npmFindings = await runNpmAuditEngine(config.scanPath);
        core.info(`npm audit: ${npmFindings.length} findings`);
        allFindings.push(...npmFindings);
    }
    catch (error) {
        core.warning(`npm audit failed: ${error}`);
    }
    const deduplicated = deduplicateFindings(allFindings);
    core.info(`After deduplication: ${deduplicated.length} findings`);
    return deduplicated;
}
export function generateReport(findings, meta) {
    return generateMarkdownReport(findings, meta);
}
export function evaluateExitCode(findings, failOnLevel) {
    if (shouldFail(findings, failOnLevel)) {
        core.setFailed(`AuditGuard found findings at or above ${failOnLevel} severity.`);
    }
}
function parseConfig() {
    const semgrepRulesetsRaw = process.env['AUDITGUARD_SEMGREP_RULESETS'] || '';
    const semgrepRulesets = semgrepRulesetsRaw
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);
    return {
        scanPath: process.env['AUDITGUARD_SCAN_PATH'] || '.',
        failOnLevel: (process.env['AUDITGUARD_FAIL_ON_LEVEL'] || 'critical'),
        semgrepRulesets,
        eslintConfigPath: process.env['AUDITGUARD_ESLINT_CONFIG'] || undefined,
        autoPrEnabled: process.env['AUDITGUARD_AUTO_PR'] === 'true',
        dryRun: process.env['AUDITGUARD_DRY_RUN'] === 'true',
    };
}
function readOutputs() {
    const repo = process.env['GITHUB_REPOSITORY'];
    const branch = process.env['GITHUB_REF_NAME'];
    const commit = process.env['GITHUB_SHA'];
    return { repo, branch, commit };
}
async function main() {
    try {
        core.info('=== AuditGuard starting ===');
        core.info('Reading configuration from environment variables...');
        const config = parseConfig();
        core.info(`Scan path: ${config.scanPath}`);
        core.info(`Fail on level: ${config.failOnLevel}`);
        core.info(`Semgrep rulesets: ${config.semgrepRulesets.join(', ') || '(default)'}`);
        core.info(`ESLint config: ${config.eslintConfigPath || '(default)'}`);
        core.info(`Auto-PR: ${config.autoPrEnabled}`);
        core.info(`Dry run: ${config.dryRun}`);
        core.info('--- Running security engines ---');
        const findings = await runAudit(config);
        core.info(`=== Scan complete: ${findings.length} findings total ===`);
        core.info('Generating markdown report...');
        const meta = readOutputs();
        const report = generateMarkdownReport(findings, meta);
        core.info(`Report generated (${report.length} chars)`);
        core.info('Writing report to GITHUB_STEP_SUMMARY...');
        writeJobSummary(report);
        core.info('Setting action outputs...');
        core.setOutput('total-findings', findings.length.toString());
        const criticalCount = findings.filter((f) => f.severity === 'critical').length;
        core.setOutput('critical-count', criticalCount.toString());
        core.info('Evaluating exit code...');
        evaluateExitCode(findings, config.failOnLevel);
        core.info('=== AuditGuard finished ===');
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        core.error(`AuditGuard failed: ${msg}`);
        core.setFailed(msg);
    }
}
main();
//# sourceMappingURL=index.js.map