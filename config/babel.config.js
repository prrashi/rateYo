module.exports = {
  exclude: 'node_modules/**', // only transpile our source code
  "presets": [
    ["@babel/env", {"modules": false}]
  ],
  babelHelpers: 'bundled'
};
