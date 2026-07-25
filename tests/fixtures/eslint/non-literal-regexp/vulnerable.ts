// Vulnerable: non-literal RegExp
function matchPattern(input: string, pattern: string): boolean {
  // eslint-disable-next-line security/detect-non-literal-regexp
  return new RegExp(pattern).test(input);
}

export { matchPattern };
