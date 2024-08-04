import wasm from 'vite-plugin-wasm';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), wasm()],
	server: {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
			allowedHeaders: ['Content-Type', 'Authorization']
		}
	},
	build: {
		target: 'esnext'
	},
	esbuild: {
		supported: {
			'top-level-await': true
		}
	}
});
