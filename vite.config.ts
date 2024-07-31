import wasm from 'vite-plugin-wasm';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
	plugins: [sveltekit(), wasm()]
});
