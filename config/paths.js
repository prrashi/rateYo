const path = require("path");

const srcPath  = path.resolve(__dirname, "../src"),
      destPath = path.resolve(__dirname, "../lib"),
      srcFile  = path.resolve(srcPath, "index.js");

module.exports = {
  srcPath,
  destPath,
  srcFile
};
