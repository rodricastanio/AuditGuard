// Vulnerable: javascript: URL
function redirectToScript(code: string): void {
  // eslint-disable-next-line no-script-url
  location.href = 'javascript:' + code;
}

export { redirectToScript };
