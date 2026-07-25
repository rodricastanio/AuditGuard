// Safe: strong CSP without unsafe directives
function setCSP(res): void {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self'"
  );
}

export { setCSP };
