// Vulnerable: weak CSP with unsafe-eval
function setCSP(res): void {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-eval' 'unsafe-inline'"
  );
}

export { setCSP };
