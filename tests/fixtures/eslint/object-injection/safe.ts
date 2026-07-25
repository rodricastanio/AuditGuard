// Safe: use Object.hasOwn or Map
function getValue(obj: Record<string, unknown>, key: string): unknown {
  if (Object.hasOwn(obj, key)) {
    return obj[key];
  }
  return undefined;
}

export { getValue };
