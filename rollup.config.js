// rollup.config.js
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default [{
  input: './src/index.js',
  output: {
    file: 'min/index.js',
    format: 'iife',
    name: "RateYo"
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      "presets": [
        ["@babel/env", {"modules": false}]
      ]
    }),
    uglify()
  ]
}, {
  input: './src/jquery.rateyo.js',
  output: {
    file: 'min/jquery.rateyo.min.js',
    format: 'iife'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      "presets": [
        ["@babel/env", {"modules": false}]
      ]
    }),
    uglify()
  ]
}];
