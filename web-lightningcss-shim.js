// Shim for lightningcss on web platform
// This prevents the native binary loading error
module.exports = {
  transform: () => ({ code: '', map: null }),
  bundleAsync: () => Promise.resolve({ code: '', map: null }),
  Features: {},
  Targets: {},
  PseudoClasses: {},
  compileString: () => ({ css: '', dependencies: [] }),
  compile: () => ({ css: '', dependencies: [] }),
};