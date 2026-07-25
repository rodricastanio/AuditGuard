// Safe: use JSON.parse
function deserializeUser(data: string): unknown {
  return JSON.parse(data);
}

export { deserializeUser };
