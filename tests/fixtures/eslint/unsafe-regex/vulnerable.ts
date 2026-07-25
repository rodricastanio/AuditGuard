// Vulnerable: unsafe regex vulnerable to ReDoS
function validateEmail(email: string): boolean {
  // eslint-disable-next-line security/detect-unsafe-regex
  return /^(a+)+$/.test(email);
}

export { validateEmail };
