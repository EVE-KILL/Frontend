/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			display: ['responsive'],
			fontFamily: {
				sans: ['Shentox', 'sans-serif']
			},
			colors: {
				dark: '#121212', // base dark color
				darker: '#0a0a0a' // darker shade
			},
			backgroundColor: {
				'semi-transparent': 'rgba(0, 0, 0, 0.85)' // semi-transparent black
			}
		}
	},
	plugins: []
};
