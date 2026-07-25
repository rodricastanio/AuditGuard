// Safe: use Buffer.from
function createBuffer(data: string): Buffer {
  return Buffer.from(data);
}

export { createBuffer };
