// Vulnerable: object injection with user key
function getValue(obj: Record<string, unknown>, key: string): unknown {
  // eslint-disable-next-line security/detect-object-injection
  return obj[key];
}

export { getValue };
