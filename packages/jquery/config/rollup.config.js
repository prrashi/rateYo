// rollup.config.js
const resolve = require("@rollup/plugin-node-resolve"),
      babel = require("@rollup/plugin-babel"),
      { terser } = require("rollup-plugin-terser"),
      postcss = require("rollup-plugin-postcss"),
      cssnano = require("cssnano");

const paths = require("./paths"),
      { getOutputConfig, getDestFiles } = require("../../../config/helpers.js"),
      babelConfig = require("../../../config/babel.config.js");

const destPath = paths.destPath;

const prefix = "jquery.rateyo";

const destFiles = getDestFiles({
  prefix,
  destPath
});

const commonOptions = {
  external: ['jquery']
}, commonOutputOptions = {
  destPath
};

module.exports = [{
  input: paths.srcFile,
  output: [
    getOutputConfig({
      ...commonOutputOptions,
      outputFormat: "es",
      destFileName: destFiles.js.src
    }),
    getOutputConfig({
      ...commonOutputOptions,
      outputFormat: "cjs",
      destFileName: destFiles.js.src
    }),
    getOutputConfig({
      ...commonOutputOptions,
      outputFormat: "iife" ,
      destFileName: destFiles.js.src,
      globals: {
        "jquery": "$"
      }
    })
  ],
  plugins: [
    resolve.default(),
    babel.default(babelConfig),
    postcss({
      syntax: 'postcss-scss',
      extract: destFiles.css.src
    })
  ],
  ...commonOptions
},
{
  input: paths.srcFile,
  output: [
    getOutputConfig({
      ...commonOutputOptions,
      outputFormat: "es",
      destFileName: destFiles.js.min
    }),
    getOutputConfig({
      ...commonOutputOptions,
      outputFormat: "cjs",
      destFileName: destFiles.js.min
    }),
    getOutputConfig({
      ...commonOutputOptions,
      outputFormat: "iife" ,
      destFileName: destFiles.js.min,
      globals: {
        "jquery": "$"
      }
    })
  ],
  plugins: [
    resolve.default(),
    babel.default(babelConfig),
    terser(),
    postcss({
      syntax: 'postcss-scss',
      extract: destFiles.css.min,
      plugins: [
        cssnano({preset: "default"})
      ]
    })
  ],
  ...commonOptions 
}];
