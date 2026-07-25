// Vulnerable: eval() with expression
function processUserInput(input: string): unknown {
  // eslint-disable-next-line security/detect-eval-with-expression
  return eval(input);
}

export { processUserInput };
