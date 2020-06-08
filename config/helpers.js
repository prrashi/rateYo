const path = require("path");

function getOutputConfig ({
  outputFormat,
  destPath,
  destFileName, 
  ...rest
}) {

  return {
    file: path.resolve(destPath, outputFormat, destFileName),
    format: outputFormat,
    ...rest
  };
}

function getDestFiles (options={}) {

  const {
    prefix:destFilePrefix="rateyo",
    destPath
  } = options;

  const destMinFilePrefix = `${destFilePrefix}.min`,
      destFileJs = `${destFilePrefix}.js`,
      destFileMinJs = `${destMinFilePrefix}.js`,
      destFileCss = `${destFilePrefix}.css`,
      destFileMinCss = `${destMinFilePrefix}.css`;

  return {
    js: {
      src: destFileJs,
      min: destFileMinJs
    },
    css: {
      src: destFileCss,
      min: destFileMinCss
    }
  };
}

module.exports = {
  getOutputConfig,
  getDestFiles
};
