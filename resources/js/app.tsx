import '../scss/main.scss';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

createInertiaApp({
	title: title => title ? `${title} | ${import.meta.env.VITE_APP_NAME}` : import.meta.env.VITE_APP_NAME,
	resolve: (name) =>
		resolvePageComponent(
			`./pages/${name}.tsx`,
			import.meta.glob('./pages/**/*.tsx'),
		),
	setup({ el, App, props }) {
		if (import.meta.env.SSR) {
			hydrateRoot(el, <App {...props} />);
			return;
		}

		createRoot(el).render(<App {...props} />);
	},
	progress: {
		color: '#60a5fa',
	},
});
