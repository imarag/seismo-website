import daisyui from 'daisyui'


export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [ 
      {
        mytheme: {
          "primary": "#3B9C67",
          "primary-content": "#0F2F1D",
          "secondary": "#A89C68",
          "secondary-content": "#0F2F1D",
          "accent": "#4BAA99",
          "accent-content": "#103731",
          "neutral": "#2F3E46",
          "neutral-content": "#E8EDEF",
          "base-100": "#fafafa",
          "base-200": "#B8D8BE",
          "base-300": "#9BB9A1",
          "base-content": "#1C2D21",
          "info": "#67B7D1",
          "info-content": "#0F2530",
          "success": "#46A36F",
          "success-content": "#0D2C1A",
          "warning": "#F4D03F",
          "warning-content": "#5A4710",
          "error": "#D9534F",
          "error-content": "#3B1614",
          },
        }
      ],
  },
};
