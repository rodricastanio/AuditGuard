// Safe: use JSON.parse instead of eval
function processUserInput(input: string): unknown {
  return JSON.parse(input);
}

export { processUserInput };
