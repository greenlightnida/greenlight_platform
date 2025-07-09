import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  target: 'node18',
  platform: 'node',
  outDir: 'dist',
  onSuccess: 'node dist/index.js',
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
}) 