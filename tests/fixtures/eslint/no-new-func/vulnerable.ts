// Vulnerable: new Function constructor
function createFunction(code: string): Function {
  // eslint-disable-next-line no-new-func
  return new Function('return ' + code);
}

export { createFunction };
