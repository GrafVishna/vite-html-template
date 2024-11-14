export default {
   tailwindcss: false,
   cleanCss: true,
   images: {
      imageMin: true,
      makeWebp: false,
      addImgSizes: false,
      ignoreWebpClasses: ['ignore-webp'],
      imageQuality: {
         jpg: 80,
         png: [0.6, 0.8],
         webp: 80
      }
   },

   aliases: {
      '@': './src/',
      '@js': './src/js',
      '@scss': './src/scss',
      '@img': '/src/assets/img/',
      '@vid': './src/assets/video/',
      '@files': './src/assets/files',
      '@cmp': './src/html/components/',
   }
}