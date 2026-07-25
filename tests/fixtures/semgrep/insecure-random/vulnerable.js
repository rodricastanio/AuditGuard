// Vulnerable: insecure random for security purposes
function generateToken(): string {
  return Math.random().toString(36).substring(2);
}

export { generateToken };
