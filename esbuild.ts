import { build, type BuildOptions } from 'esbuild';

const opts: BuildOptions = {
	bundle: true,
	drop: ['debugger'],
	entryPoints: ['./src/app.ts'],
	format: 'esm',
	legalComments: 'none',
	minify: true,
	outdir: 'dist',
	packages: 'external',
	platform: 'node',
	supported: {
		'node-colon-prefix-import': true,
	},
	target: ['es2023', 'node22'],
	treeShaking: true,
};

await build(opts);
