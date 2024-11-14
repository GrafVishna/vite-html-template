import postcss from 'postcss'

/** @type {import('tailwindcss').Config} */
export default {
   plugins: [
      postcss
   ],
   content: [
      './src/**/*.{html,scss,css,js}',
   ],
}