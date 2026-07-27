import * as core from '@actions/core';
import { execFile } from 'node:child_process';
import { SEMGREP_VERSION } from '../types/config.js';
const SEMGREP_SEVERITY_MAP = {
    ERROR: 'high',
    WARNING: 'medium',
    INFO: 'low',
};
const PATTERN_EXPLANATIONS = {
    'javascript.sequelize.security.audit.sequelize-injection-express': { explanation: 'SQL injection via string interpolation in Sequelize query.', suggestion: 'Use parameterized queries or Sequelize operators.', cwe: 'CWE-89' },
    'javascript.xss.react.dangerously-set-innerhtml': { explanation: 'XSS via dangerouslySetInnerHTML with user-controlled content.', suggestion: 'Sanitize HTML with a library like DOMPurify before rendering.', cwe: 'CWE-79' },
    'javascript.lang.security.audit.detect-eval-with-expression': { explanation: 'eval() with dynamic input enables Remote Code Execution.', suggestion: 'Remove eval() and use a safe alternative.', cwe: 'CWE-95' },
    'javascript.express.security.audit.express-cors-misconfiguration': { explanation: 'CORS configured to allow all origins, which may expose the API to cross-origin attacks.', suggestion: 'Restrict CORS to specific trusted origins.', cwe: 'CWE-942' },
    'javascript.lang.security.audit.node-deserialize': { explanation: 'Insecure deserialization using node-serialize can lead to Remote Code Execution.', suggestion: 'Use JSON.parse() instead of node-serialize, or validate input thoroughly.', cwe: 'CWE-502' },
    'javascript.lang.security.audit.yaml-deserialize': { explanation: 'Unsafe YAML deserialization with yaml.load() can execute arbitrary code.', suggestion: 'Use yaml.safeLoad() or yaml.load() with a safe schema.', cwe: 'CWE-502' },
    'javascript.lang.security.audit.path-traversal.non-literal-fs-filename': { explanation: 'File system operation with variable filename can lead to path traversal.', suggestion: 'Validate file paths and ensure they stay within the expected directory.', cwe: 'CWE-22' },
    'javascript.lang.security.audit.prototype-polluting-assignment': { explanation: 'Direct prototype pollution by assigning to __proto__ or constructor.prototype.', suggestion: 'Use Object.create(null) or validate keys before assignment.', cwe: 'CWE-1321' },
    'javascript.lang.security.audit.crypto-insecure-random': { explanation: 'Math.random() is not cryptographically secure and should not be used for security purposes.', suggestion: 'Use crypto.randomBytes() or crypto.randomUUID().', cwe: 'CWE-330' },
    'javascript.xss.bad-csp': { explanation: 'Content Security Policy allows unsafe-eval or unsafe-inline, weakening XSS protection.', suggestion: 'Remove unsafe-eval and unsafe-inline from CSP directives.', cwe: 'CWE-693' },
    'javascript.express.security.audit.express-open-redirect': { explanation: 'Unvalidated redirect can be used for phishing attacks.', suggestion: 'Validate the redirect URL against an allowlist of trusted domains.', cwe: 'CWE-601' },
    'javascript.express.security.audit.detect-child-process': { explanation: 'Command injection via child_process with user-controlled input.', suggestion: 'Use execFile() with an array of arguments instead of exec() with string interpolation.', cwe: 'CWE-78' },
};
function inferCweFromRuleId(ruleId) {
    if (ruleId.includes('sql') || ruleId.includes('injection'))
        return 'CWE-89';
    if (ruleId.includes('xss') || ruleId.includes('innerHTML'))
        return 'CWE-79';
    if (ruleId.includes('eval') || ruleId.includes('deserializ'))
        return 'CWE-502';
    if (ruleId.includes('cors'))
        return 'CWE-942';
    if (ruleId.includes('path') || ruleId.includes('traversal'))
        return 'CWE-22';
    if (ruleId.includes('prototype'))
        return 'CWE-1321';
    if (ruleId.includes('random') || ruleId.includes('crypto'))
        return 'CWE-330';
    if (ruleId.includes('csp'))
        return 'CWE-693';
    if (ruleId.includes('redirect'))
        return 'CWE-601';
    if (ruleId.includes('child-process') || ruleId.includes('command'))
        return 'CWE-78';
    return '';
}
function getCweUrl(cwe) {
    const match = cwe.match(/CWE-(\d+)/);
    if (match) {
        return `https://cwe.mitre.org/data/definitions/${match[1]}.html`;
    }
    return undefined;
}
export async function runSemgrepEngine(scanPath, rulesets) {
    const configs = (rulesets || ['p/default', 'p/security-audit', 'p/owasp-top-ten'])
        .flatMap((r) => ['--config', r]);
    const stdout = await new Promise((resolve, reject) => {
        execFile('semgrep', ['scan', ...configs, '--json', '--jobs', '4', '--quiet', scanPath], {
            timeout: 120_000,
            maxBuffer: 50 * 1024 * 1024,
            env: { ...process.env, SEMGREP_SEND_METRICS: 'off' },
        }, (error, stdout, stderr) => {
            if (stdout) {
                resolve(stdout);
            }
            else {
                const detail = stderr ? `: ${stderr.trim()}` : '';
                reject(new Error(`Semgrep scan failed (v${SEMGREP_VERSION})${detail}${error ? ` — ${error.message}` : ''}`));
            }
        });
    });
    const parsed = JSON.parse(stdout);
    if (parsed.errors?.length) {
        for (const err of parsed.errors) {
            core.warning(`Semgrep error: [${err.type}] ${err.message}`);
        }
    }
    const findings = [];
    for (const result of parsed.results) {
        const ruleId = result.check_id;
        const severity = SEMGREP_SEVERITY_MAP[result.extra.severity.toUpperCase()] || 'medium';
        const meta = PATTERN_EXPLANATIONS[ruleId] || {
            explanation: result.extra.message,
            suggestion: 'Review the flagged code and apply security best practices.',
            cwe: result.extra.metadata.cwe?.[0] || inferCweFromRuleId(ruleId),
        };
        findings.push({
            id: `semgrep-${ruleId}-${result.path}:${result.start.line}`,
            engine: 'semgrep',
            rule: ruleId,
            severity,
            file: result.path,
            line: result.start.line,
            column: result.start.col,
            endLine: result.end.line,
            endColumn: result.end.col,
            message: result.extra.message,
            explanation: meta.explanation,
            suggestion: meta.suggestion,
            cwe: meta.cwe,
            cweUrl: getCweUrl(meta.cwe),
            fixAvailable: false,
            autoFixEligible: false,
        });
    }
    return findings;
}
//# sourceMappingURL=semgrep-engine.js.map