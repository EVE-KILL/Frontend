import { sentrySvelteKit } from "@sentry/sveltekit";
import wasm from 'vite-plugin-wasm';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from "path";

export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "eve-kill",
            project: "frontend"
        }
    }), sveltekit(), wasm()],
	server: {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
			allowedHeaders: ['Content-Type', 'Authorization']
		}
	},
	build: {
		target: 'esnext',
		sourcemap: true,
	},
	esbuild: {
		supported: {
			'top-level-await': true
		}
	},
	resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
});
