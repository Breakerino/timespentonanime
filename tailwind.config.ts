import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
		'./storage/framework/views/*.php',
		'./resources/views/**/*.blade.php',
		'./resources/js/**/*.{js,ts,jsx,tsx}',
	],

	theme: {
		extend: {
			screens: {
				xs: '475px',
			},
			fontFamily: {
				sans: ['"Noto Sans"', ...defaultTheme.fontFamily.sans],
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(to right, #56ccf2, #2f80ed);'
			}
		},
	},

	plugins: [forms],
};
