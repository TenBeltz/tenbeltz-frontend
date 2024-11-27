/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}'],
	theme: {
		extend: {
			colors: {
				'petal-plush': '#E5C6F3',
				'blueberry-glaze': '#BE71E0',
				'pheromone-purple': '#922ABF',
				'sapphire-siren': '#6C208C',
				'berry-blackmail': '#581A73',
				'cold-heights': '#21EFE3',
				'spiro-disco-ball': '#11B2FC',
				'vivid-blue': '#2140FF',
				'child-of-the-night': '#1A0076',
				'white-smoke': '#F2F2F2',
				'obsidian-shard': '#02010A'
			}
		},
	},
	plugins: [
		function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hidden': {
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
		}
	],
}
