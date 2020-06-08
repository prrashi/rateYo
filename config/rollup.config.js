// rollup.config.js
const babel = require("@rollup/plugin-babel"),
      { terser } = require("rollup-plugin-terser"),
      postcss = require("rollup-plugin-postcss"),
      cssnano = require("cssnano");

const paths = require("./paths"),
      { getOutputConfig, getDestFiles } = require("./helpers"),
      babelConfig = require("./babel.config.js");

const destPath = paths.destPath;

const destFiles = getDestFiles({
  destPath
});

module.exports = [{
  input: paths.srcFile,
  output: [
    getOutputConfig({
      destPath,
      outputFormat: "es",
      destFileName: destFiles.js.src
    }),
    getOutputConfig({
      destPath,
      outputFormat: "cjs",
      destFileName: destFiles.js.src
    }),
    getOutputConfig({
      destPath,
      outputFormat: "iife" ,
      destFileName: destFiles.js.src,
      name: "RateYo"
    })
  ],
  plugins: [
    babel.default(babelConfig),
    postcss({
      syntax: 'postcss-scss',
      extract: destFiles.css.src
    })
  ]
},
{
  input: paths.srcFile,
  output: [
    getOutputConfig({
      destPath,
      outputFormat: "es",
      destFileName: destFiles.js.min
    }),
    getOutputConfig({
      destPath,
      outputFormat: "cjs",
      destFileName: destFiles.js.min
    }),
    getOutputConfig({
      destPath,
      outputFormat: "iife" ,
      destFileName: destFiles.js.min,
      name: "RateYo"
    })
  ],
  plugins: [
    babel.default(babelConfig),
    terser(),
    postcss({
      syntax: 'postcss-scss',
      extract: destFiles.css.min,
      plugins: [
        cssnano({preset: "default"})
      ]
    })
  ]
}];
