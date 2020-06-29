import babel from '@rollup/plugin-babel'
const typescript = require('rollup-plugin-typescript2')
const { terser } = require('rollup-plugin-terser')

const babelConfig = require('./babel.config')
const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'umd',
      dir: 'lib',
      name: pkg.name.replace(/^@[^\/]+\//, ''),
    },
    {
      format: 'es',
      dir: 'es',
    },
    {
      format: 'system',
      dir: 'system',
    },
    {
      format: 'cjs',
      dir: 'commonjs',
    },
    {
      format: 'amd',
      dir: 'amd',
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      // tsconfigOverride: { compilerOptions: { target: 'ES2015' } }
    }),
    babel({
      ...babelConfig,
      babelHelpers: 'external',
      exclude: 'node_modules/**' // 只编译我们的源代码
    }),
    terser(),
  ]
}