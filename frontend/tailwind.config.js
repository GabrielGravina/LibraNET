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
			},
			animation: {
				'spin-slow': 'spin 3s linear infinite',
			},
			backgroundImage: {
				'gradient-conic': 'conic-gradient(from var(--angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545)',
			 },
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'], // Adicione a fonte aqui
			  },
		},
	},
	plugins: [],
};
