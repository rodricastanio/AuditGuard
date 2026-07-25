// Vulnerable: eval()
function executeCode(code: string): unknown {
  // eslint-disable-next-line no-eval
  return eval(code);
}

export { executeCode };
