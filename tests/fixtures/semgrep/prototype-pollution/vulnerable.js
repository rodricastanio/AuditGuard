// Vulnerable: prototype pollution
function merge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = merge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export { merge };
