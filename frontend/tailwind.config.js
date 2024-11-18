/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],

	theme: {
		extend: {
			colors: {
				'hard-orange': '#F24822',
				'orange': '#F25A38',
				'light-orange': '#F2CDC4',
				'white': '#F2F2F2',
				'black': '#0D0D0D'
			}
		},
	},
	plugins: [],
};
