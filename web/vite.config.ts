import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// better-sqlite3 adalah modul native — jangan dibundel oleh Vite SSR.
	ssr: {
		external: ['better-sqlite3']
	}
});
