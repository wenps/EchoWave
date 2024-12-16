import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import path from 'node:path';
import { fileURLToPath } from 'url';
import dts from 'rollup-plugin-dts';
import babel from 'rollup-plugin-babel';

const input = resolve('./src/index.ts');

function resolve(filePath: string) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, filePath);
}

const buildConfig = defineConfig({
  input: input,
  output: [
    {
      file: resolve('./dist/index.mjs'),
      format: 'esm',
    },
    {
      file: resolve('./dist/index.cjs'),
      format: 'cjs',
    },
  ],
  plugins: [
    typescript({
      tsconfig: resolve('./tsconfig.json'),
    }),
    babel({
      extensions: ['.js', '.ts'],
      include: ['src/**/*'],
    }),
  ],
});

const dtsConfig = defineConfig({
  input: input,
  output: {
    file: resolve('./dist/index.d.ts'),
    format: 'esm',
  },
  plugins: [
    typescript({
      tsconfig: resolve('./tsconfig.json'),
    }),
    dts(),
  ],
});

export default [buildConfig, dtsConfig];