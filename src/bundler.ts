import { rollup } from 'rollup';
import * as resolve from '@rollup/plugin-node-resolve';
import * as commonjs from '@rollup/plugin-commonjs';
import * as json from '@rollup/plugin-json';
import * as image from '@rollup/plugin-image';
import * as postcss from 'rollup-plugin-postcss';
import * as typescript2 from 'rollup-plugin-typescript2';
import * as typescript from 'typescript';
import * as babel from 'rollup-plugin-babel';

type Options = {
  format?: 'esm' | 'cjs' | 'umd' | string[];
  entry?: string;
  output?: string;
};




class Bundler {
  format: string[];
  entry: string;
  output: string;
  constructor (options: Options) {
    this.format = options.format as string[] || ['esm', 'cjs', 'umd'];
    if (!Array.isArray(this.format)) {
      this.format = [this.format];
    }
    this.entry = options.entry;
    this.output = options.output || 'dist';
  }

  async run() {
    const configs = this.getConfig()
    for(const config of configs) {
      const { inputConfig, outputConfig } = config;
      const bundle = await rollup(inputConfig);
      await bundle.write(outputConfig)
    }
  }

  getBabelConfig() {
    return {
      babelrc: false,
      runtimeHelpers: true,
      presets: [['@babel/preset-env', { modules: false, targets: '>1%, not dead, not ie 11, not op_mini all' }], '@babel/preset-typescript'],
      plugins: [
        [require('@babel/plugin-transform-react-jsx')],
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
        [require.resolve('@babel/plugin-proposal-object-rest-spread'), { loose: true }],
        [require.resolve('@babel/plugin-syntax-dynamic-import')],
      ],
      cwd: __dirname,
    };
  }

  getPlugin() {
    return [
      resolve(),
      commonjs({
      }),
      json(),
      image(),
      postcss({
        extract: false,
        modules: true,
        use: ['sass'],
      }),
      typescript2({
        typescript
      }),
      babel(this.getBabelConfig())
    ];
  }

  getConfig() {
    return this.format.map(f => {
      return {
        inputConfig: {
          input: this.entry,
          external: (id:string) => id.includes('node_modules'),
          plugins: [
            this.getPlugin()
          ],
        },
        outputConfig: {
          dir: this.output,
          entryFileNames: `index.${f}.js`,
          name: 'index',
          format: f,
          sourcemap: true
        }
      };
    });
  }
}

export default Bundler;
