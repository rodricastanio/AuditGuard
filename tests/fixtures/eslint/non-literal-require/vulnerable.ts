// Vulnerable: require with variable
function loadModule(moduleName: string): unknown {
  // eslint-disable-next-line security/detect-non-literal-require
  return require(moduleName);
}

export { loadModule };
