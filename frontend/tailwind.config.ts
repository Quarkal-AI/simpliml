import type { Config } from "tailwindcss"
import colors, { gray } from "tailwindcss/colors"

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				navy: {
					500: "#00AAF0",
					700: "#1440B5",
					800: "#01112C",
					900: "#000211",
				},
				white: "#DBE3F6",
				black: { 800: "#15171F", 900: "#0E1018" },
			},
			backgroundSize: {
				"size-100": "100% 100%",
				"size-200": "200% 200%",
			},
			backgroundPosition: {
				"pos-0": "0% 0%",
				"pos-100": "100% 100%",
				"pos-200": "200% 200%",
			},
		},
	},
	plugins: [],
}
export default config
