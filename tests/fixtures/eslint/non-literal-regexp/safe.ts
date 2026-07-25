// Safe: use literal RegExp
function matchEmail(input: string): boolean {
  return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(input);
}

export { matchEmail };
