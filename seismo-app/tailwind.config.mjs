/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui'


export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#4CAF50",      
          "secondary": "#81C784",
          "accent": "#388E3C",
          "neutral": "#37474F",
          "base-100": "#FFFFFF",
          "info": "#0288D1",
          "success": "#43A047",
          "warning": "#F9A825",
          "error": "#D32F2F",
          },
        },
      ],
  },
};
