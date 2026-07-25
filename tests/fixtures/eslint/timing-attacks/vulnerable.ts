// Vulnerable: timing attack via === comparison
function verifyToken(token: string, secret: string): boolean {
  // eslint-disable-next-line security/detect-possible-timing-attacks
  return token === secret;
}

export { verifyToken };
