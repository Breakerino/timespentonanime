import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import svgSpritemap from '@spiriit/vite-plugin-svg-spritemap'


export default defineConfig({
	plugins: [
		laravel({
			input: [
				'resources/css/app.css',
				'resources/scss/main.scss',
				'resources/js/app.tsx'
			],
			ssr: 'resources/js/ssr.tsx',
			refresh: true,
		}),
		react(),
		svgSpritemap(`resources/svg/*.svg`, {
			prefix: 'icon-',
			injectSVGOnDev: true,
			output: {
				filename: 'icons.svg',
				use: false,
				view: false
			}
		})
	],
	resolve: {
		alias: {
			lodash: 'lodash-es',
		},
	},
});
