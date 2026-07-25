// Vulnerable: deprecated Buffer constructor
function createBuffer(data: string): Buffer {
  // eslint-disable-next-line security/detect-new-buffer
  return new Buffer(data);
}

export { createBuffer };
