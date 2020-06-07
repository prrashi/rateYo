// rollup.config.js
import path from 'path';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

export default [{
  input: './src/index.js',
  output: {
    file: 'dist/rateyo.js',
    format: 'iife',
    name: "RateYo"
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      "presets": [
        ["@babel/env", {"modules": false}]
      ],
      babelHelpers: 'bundled'
    }),
    postcss({
      extract: path.resolve('dist/rateyo.css')
    })
  ]
},
{
  input: './src/index.js',
  output: {
    file: 'dist/rateyo.min.js',
    format: 'iife',
    name: "RateYo"
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      "presets": [
        ["@babel/env", {"modules": false}]
      ],
      babelHelpers: 'bundled'
    }),
    terser(),
    postcss({
      extract: path.resolve('dist/rateyo.min.css'),
      plugins: [
        cssnano({preset: "default"})
      ]
    })
  ]
}, 
{
  input: './src/jquery.rateyo.js',
  output: {
    file: 'dist/jquery.rateyo.js',
    format: 'iife'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      "presets": [
        ["@babel/env", {"modules": false}]
      ],
      babelHelpers: 'bundled'
    }),
    postcss({
      extract: path.resolve('dist/jquery.rateyo.css')
    })
  ]
},
{
  input: './src/jquery.rateyo.js',
  output: {
    file: 'dist/jquery.rateyo.min.js',
    format: 'iife'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      "presets": [
        ["@babel/env", {"modules": false}]
      ],
      babelHelpers: 'bundled'
    }),
    terser(),
    postcss({
      extract: path.resolve('dist/jquery.rateyo.min.css'),
      plugins: [
        cssnano({preset: "default"})
      ]
    })
  ]
}];
