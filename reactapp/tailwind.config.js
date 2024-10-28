/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-seismogram': "url('/src/img/seismogram-large-cropped.svg')"
      }
    }
  },
  plugins: [],
}

