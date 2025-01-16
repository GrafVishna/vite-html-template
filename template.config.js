export default {
   tailwindcss: true,
   cleanCss: false,
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
      // HTML componentS
      '@h': './src/html/',
      '@o': './src/html/other/',
      '@c': './src/html/components/',
      '@ui': './src/html/UI/',
      // JS files
      '@j': '/src/js/',
      // Styles
      '@s': '/src/scss/',
      // Media & files
      '@i': '/src/assets/img/',
      '@v': '/src/assets/video/',
      '@f': '/src/assets/files/'
   }
}