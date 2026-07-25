import { ESLint } from 'eslint';
const SECURITY_RULES = {
    'security/detect-eval-with-expression': 'critical',
    'security/detect-child-process': 'high',
    'security/detect-non-literal-fs-filename': 'high',
    'security/detect-non-literal-regexp': 'medium',
    'security/detect-unsafe-regex': 'high',
    'security/detect-possible-timing-attacks': 'medium',
    'security/detect-non-literal-require': 'high',
    'security/detect-object-injection': 'medium',
    'security/detect-pseudo-random-bytes': 'medium',
    'security/detect-new-buffer': 'high',
    'security/detect-buffer-noassert': 'medium',
    'security/detect-bidi-characters': 'high',
    'no-secrets/no-secrets': 'critical',
    'no-eval': 'critical',
    'no-implied-eval': 'high',
    'no-new-func': 'high',
    'no-script-url': 'high',
};
const RULE_EXPLANATIONS = {
    'security/detect-eval-with-expression': {
        explanation: 'eval() executes arbitrary code from a string. If the argument comes from user input, this is a Remote Code Execution (RCE) vulnerability.',
        suggestion: 'Replace with a safe parser like JSON.parse() or a sandboxed evaluation library (e.g., isolated-vm).',
        cwe: 'CWE-95',
    },
    'security/detect-child-process': {
        explanation: 'child_process.exec() with a non-literal argument allows command injection if the argument is user-controlled.',
        suggestion: 'Use execFile() with an array of arguments, or use a library like cross-spawn with proper escaping.',
        cwe: 'CWE-78',
    },
    'security/detect-non-literal-fs-filename': {
        explanation: 'File system operations with variable filenames can lead to path traversal attacks if the filename is user-controlled.',
        suggestion: 'Validate and sanitize file paths. Use path.resolve() and verify the result is within the expected directory.',
        cwe: 'CWE-22',
    },
    'security/detect-non-literal-regexp': {
        explanation: 'Constructing a RegExp from a variable allows an attacker to inject arbitrary patterns, potentially causing ReDoS.',
        suggestion: 'Use literal regular expressions or validate the input against an allowlist of patterns.',
        cwe: 'CWE-1333',
    },
    'security/detect-unsafe-regex': {
        explanation: 'This regular expression is vulnerable to ReDoS (Regular Expression Denial of Service). It can cause catastrophic backtracking.',
        suggestion: 'Rewrite the regex to avoid nested quantifiers or use a ReDoS-safe alternative.',
        cwe: 'CWE-1333',
    },
    'security/detect-possible-timing-attacks': {
        explanation: 'Comparing secrets or tokens with == or === can leak timing information that enables timing attacks.',
        suggestion: 'Use a constant-time comparison function (e.g., crypto.timingSafeEqual()).',
        cwe: 'CWE-208',
    },
    'security/detect-non-literal-require': {
        explanation: 'require() with a variable argument can load arbitrary modules, leading to code execution.',
        suggestion: 'Use a static require() with a literal string, or validate the module name against an allowlist.',
        cwe: 'CWE-94',
    },
    'security/detect-object-injection': {
        explanation: 'Using user-controlled keys to access object properties can lead to prototype pollution.',
        suggestion: 'Use Object.create(null) for dictionaries, or validate keys against an allowlist.',
        cwe: 'CWE-1321',
    },
    'security/detect-pseudo-random-bytes': {
        explanation: 'pseudoRandomBytes() is not cryptographically secure. It should not be used for security-sensitive operations.',
        suggestion: 'Use crypto.randomBytes() or crypto.randomUUID() for cryptographic randomness.',
        cwe: 'CWE-330',
    },
    'security/detect-new-buffer': {
        explanation: 'new Buffer() is deprecated and can lead to buffer overflow vulnerabilities.',
        suggestion: 'Use Buffer.alloc(), Buffer.from(), or Buffer.allocUnsafe() instead.',
        cwe: 'CWE-120',
    },
    'security/detect-buffer-noassert': {
        explanation: 'Buffer with noAssert flag skips boundary checks, which can lead to buffer overflows.',
        suggestion: 'Remove the noAssert flag and handle buffer boundaries explicitly.',
        cwe: 'CWE-120',
    },
    'security/detect-bidi-characters': {
        explanation: 'Unicode bidirectional characters can be used in Trojan Source attacks to visually obfuscate code.',
        suggestion: 'Remove or escape bidirectional characters from source code.',
        cwe: 'CWE-502',
    },
    'no-secrets/no-secrets': {
        explanation: 'Hardcoded secrets (API keys, tokens, passwords) in source code can be extracted by anyone with repository access.',
        suggestion: 'Move secrets to environment variables or a secrets manager. Add the secret to .env.example with a placeholder.',
        cwe: 'CWE-798',
    },
    'no-eval': {
        explanation: 'eval() executes arbitrary code from a string, which is a Remote Code Execution vulnerability.',
        suggestion: 'Remove eval() usage. Use JSON.parse() for data parsing or a sandboxed evaluation library.',
        cwe: 'CWE-95',
    },
    'no-implied-eval': {
        explanation: 'Passing a string to setTimeout() or setInterval() is equivalent to eval().',
        suggestion: 'Pass a function instead of a string to setTimeout/setInterval.',
        cwe: 'CWE-95',
    },
    'no-new-func': {
        explanation: 'new Function() compiles a string into code, which is equivalent to eval().',
        suggestion: 'Use a predefined function or a safe evaluation library.',
        cwe: 'CWE-94',
    },
    'no-script-url': {
        explanation: 'javascript: URLs execute code in the context of the page, which can lead to XSS.',
        suggestion: 'Use event handlers or navigation methods instead of javascript: URLs.',
        cwe: 'CWE-79',
    },
};
function getCweUrl(cwe) {
    const match = cwe.match(/CWE-(\d+)/);
    if (match) {
        return `https://cwe.mitre.org/data/definitions/${match[1]}.html`;
    }
    return undefined;
}
export async function runEslintEngine(scanPath, configPath) {
    const [securityPlugin, noSecretsPlugin] = await Promise.all([
        import('eslint-plugin-security'),
        import('eslint-plugin-no-secrets'),
    ]);
    const overrideConfig = {
        plugins: {
            security: securityPlugin.default || securityPlugin,
            'no-secrets': noSecretsPlugin.default || noSecretsPlugin,
        },
        rules: {
            'security/detect-eval-with-expression': 'error',
            'security/detect-child-process': 'error',
            'security/detect-non-literal-fs-filename': 'warn',
            'security/detect-non-literal-regexp': 'warn',
            'security/detect-unsafe-regex': 'error',
            'security/detect-possible-timing-attacks': 'warn',
            'security/detect-non-literal-require': 'error',
            'security/detect-object-injection': 'warn',
            'security/detect-pseudo-random-bytes': 'warn',
            'security/detect-new-buffer': 'error',
            'security/detect-buffer-noassert': 'warn',
            'security/detect-bidi-characters': 'error',
            'no-secrets/no-secrets': ['error', { tolerance: 4.0 }],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-script-url': 'error',
        },
    };
    const eslint = new ESLint({
        overrideConfig: overrideConfig,
        overrideConfigFile: configPath,
    });
    const results = await eslint.lintFiles([scanPath]);
    const findings = [];
    for (const result of results) {
        for (const message of result.messages) {
            if (!message.ruleId)
                continue;
            const severity = SECURITY_RULES[message.ruleId];
            if (!severity)
                continue;
            const meta = RULE_EXPLANATIONS[message.ruleId] || {
                explanation: message.message,
                suggestion: 'Review the flagged code and apply security best practices.',
                cwe: '',
            };
            findings.push({
                id: `eslint-${message.ruleId}-${result.filePath}:${message.line}`,
                engine: 'eslint',
                rule: message.ruleId,
                severity,
                file: result.filePath,
                line: message.line,
                column: message.column,
                endLine: message.endLine,
                endColumn: message.endColumn,
                message: message.message,
                explanation: meta.explanation,
                suggestion: meta.suggestion,
                cwe: meta.cwe,
                cweUrl: getCweUrl(meta.cwe),
                fixAvailable: false,
                autoFixEligible: false,
            });
        }
    }
    return findings;
}
//# sourceMappingURL=eslint-engine.js.map