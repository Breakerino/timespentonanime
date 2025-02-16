import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';

declare global {
	interface Window {
		axios: AxiosInstance;
	}
	
	interface ObjectConstructor {
		entries<K, V>(o: unknown): ([K, V])[]
	}

	/* eslint-disable no-var */
	var route: typeof ziggyRoute;
}

declare module '@inertiajs/core' {
	interface PageProps extends InertiaPageProps, AppPageProps { }
}