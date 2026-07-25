// Vulnerable: Buffer with noAssert
function createBuffer(data: string): Buffer {
  // eslint-disable-next-line security/detect-buffer-noassert
  return new Buffer(data, 'utf8', true);
}

export { createBuffer };
