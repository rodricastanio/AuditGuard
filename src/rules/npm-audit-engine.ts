import { execFile } from 'node:child_process';
import type { Finding, Severity } from '../types/finding.js';

interface NpmAuditVulnerability {
  name: string;
  severity: string;
  isDirect: boolean;
  via: Array<string | NpmAuditAdvisory>;
  range: string;
  nodes: string[];
  fixAvailable: boolean | { name: string; version: string; isSemVerMajor: boolean };
}

interface NpmAuditAdvisory {
  source: number;
  name: string;
  dependency: string;
  title: string;
  url: string;
  severity: string;
  cwe: string[];
  cvss: { score: number; vectorString: string };
  range: string;
}

interface NpmAuditOutput {
  auditReportVersion: number;
  vulnerabilities: Record<string, NpmAuditVulnerability>;
  metadata: {
    vulnerabilities: Record<string, number>;
    dependencies: Record<string, number>;
  };
}

const SEVERITY_MAP: Record<string, Severity> = {
  critical: 'critical',
  high: 'high',
  moderate: 'medium',
  low: 'low',
  info: 'info',
};

function execNpmAuditJson(
  scanPath: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      'npm',
      ['audit', '--json'],
      { cwd: scanPath, timeout: 60_000, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout) => {
        if (stdout) {
          resolve(stdout);
        } else if (error) {
          reject(
            new Error(
              `npm audit failed: ${error.message}${error.code ? ` (exit code ${error.code})` : ''}`,
            ),
          );
        } else {
          resolve(stdout || '{}');
        }
      },
    );
  });
}

export async function runNpmAuditEngine(scanPath: string): Promise<Finding[]> {
  const stdout = await execNpmAuditJson(scanPath);
  const output: NpmAuditOutput = JSON.parse(stdout);
  const findings: Finding[] = [];

  for (const [pkgName, vuln] of Object.entries(output.vulnerabilities || {})) {
    const advisories = vuln.via.filter(
      (v): v is NpmAuditAdvisory => typeof v === 'object',
    );

    for (const advisory of advisories) {
      const severity: Severity = SEVERITY_MAP[advisory.severity] || 'medium';

      const fixAvailable =
        typeof vuln.fixAvailable === 'object'
          ? vuln.fixAvailable
          : vuln.fixAvailable
            ? { name: pkgName, version: '', isSemVerMajor: false }
            : null;

      const autoFixEligible =
        fixAvailable !== null && !fixAvailable.isSemVerMajor;

      findings.push({
        id: `npm-audit-${advisory.source}-${pkgName}`,
        engine: 'npm-audit',
        rule: `npm-audit/${pkgName}`,
        severity,
        file: 'package.json',
        line: 0,
        column: 0,
        message: `${advisory.title} in ${pkgName} (${vuln.range})`,
        explanation: `${advisory.title}. Vulnerability range: ${vuln.range}. ${advisory.url}`,
        suggestion: fixAvailable
          ? `Run 'npm audit fix' to update ${pkgName} to a patched version.`
          : `No automatic fix available. Check ${advisory.url} for manual remediation steps.`,
        cwe: advisory.cwe?.[0] || '',
        cweUrl: advisory.cwe?.[0]
          ? `https://cwe.mitre.org/data/definitions/${advisory.cwe[0].replace('CWE-', '')}.html`
          : undefined,
        fixAvailable: fixAvailable !== null,
        autoFixEligible,
        evidence: `Package: ${pkgName}, Severity: ${advisory.severity}, CVSS: ${advisory.cvss?.score || 'N/A'}`,
      });
    }

    if (advisories.length === 0 && vuln.severity !== 'info') {
      findings.push({
        id: `npm-audit-transitive-${pkgName}`,
        engine: 'npm-audit',
        rule: `npm-audit/${pkgName}`,
        severity: SEVERITY_MAP[vuln.severity] || 'medium',
        file: 'package.json',
        line: 0,
        column: 0,
        message: `Vulnerability in transitive dependency ${pkgName} (${vuln.range})`,
        explanation: `Transitive dependency ${pkgName} has a known vulnerability. Range: ${vuln.range}.`,
        suggestion: typeof vuln.fixAvailable === 'object' && !vuln.fixAvailable.isSemVerMajor
          ? `Run 'npm audit fix' to update.`
          : `May require a breaking change. Review manually.`,
        cwe: '',
        fixAvailable: vuln.fixAvailable !== false,
        autoFixEligible:
          typeof vuln.fixAvailable === 'object' && !vuln.fixAvailable.isSemVerMajor,
      });
    }
  }

  return findings;
}
