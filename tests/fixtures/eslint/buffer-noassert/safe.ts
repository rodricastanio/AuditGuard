// Safe: Buffer without noAssert
function createBuffer(data: string): Buffer {
  return Buffer.from(data, 'utf8');
}

export { createBuffer };
