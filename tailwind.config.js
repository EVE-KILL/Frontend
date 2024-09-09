import colors from 'tailwindcss/colors';

import { useColors } from './src/lib/models/useColors';
const { generateBackgroundColors, generateColors } = useColors();

const baseBackgroundColor = '#121212';
const basePrimaryColor = '#0084ff';
const baseSecondaryColor = '#ffb300';
const overlayOpacity = 0.2;

/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			slate: colors.slate,
			red: colors.red,
			primary: generateColors(baseBackgroundColor, basePrimaryColor, overlayOpacity),
			secondary: generateColors(baseBackgroundColor, baseSecondaryColor, overlayOpacity),
			background: generateBackgroundColors(baseBackgroundColor),
			'semi-transparent': 'rgba(0, 0, 0, 0.85)'
		},
		extend: {
			display: ['responsive'],
			fontFamily: {
				sans: ['Shentox', 'sans-serif']
			},
			colors: {
				dark: baseBackgroundColor, // base dark color
				darker: '#0a0a0a', // darker shade
				backgroundColor: {
					'semi-transparent': 'rgba(0, 0, 0, 0.85)' // semi-transparent black
				},

				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: generateBackgroundColors(baseBackgroundColor),
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: generateColors(baseBackgroundColor, basePrimaryColor, overlayOpacity)[500],
					foreground: generateColors(baseBackgroundColor, basePrimaryColor, overlayOpacity),
					...generateColors(baseBackgroundColor, basePrimaryColor, overlayOpacity)
				},
				secondary: {
					DEFAULT: generateColors(baseBackgroundColor, baseSecondaryColor, overlayOpacity)[500],
					foreground: generateColors(baseBackgroundColor, baseSecondaryColor, overlayOpacity),
					...generateColors(baseBackgroundColor, baseSecondaryColor, overlayOpacity)
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		function ({ addBase, theme }) {
			function extractColorVars(colorObj, colorGroup = '') {
				return Object.keys(colorObj).reduce((vars, colorKey) => {
					const value = colorObj[colorKey];

					const newVars = typeof value === 'string' ? { [`--color${colorGroup}-${colorKey}`]: value } : extractColorVars(value, `-${colorKey}`);

					return { ...vars, ...newVars };
				}, {});
			}

			addBase({
				':root': extractColorVars(theme('colors'))
			});
		}
	]
};

export default config;
