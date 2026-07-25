// Safe: use JSON.parse
function parseData(data: string): unknown {
  return JSON.parse(data);
}

export { parseData };
