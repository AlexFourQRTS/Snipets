/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#282c34',
        'bg-panel': '#21252b',
        'text-primary': '#abb2bf',
        'text-secondary': '#5c6370',
        'accent': '#61afef',
        'selection': '#3e4451',
        'button': '#56b6c2',
        'tag-react': '#61dafb',
        'tag-js': '#f7df1e',
        'tag-python': '#306998',
      },
      fontFamily: {
        'code': ['Fira Code', 'Consolas', 'monospace'],
        'ui': ['Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
