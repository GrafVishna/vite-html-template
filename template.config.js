export default {
   tailwindcss: true,
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
      '@h': './src/html/',
      '@c': './src/html/components/',
      '@j': '/src/js/',
      '@s': '/src/scss/',
      '@i': '/src/assets/img/',
      '@f': '/src/assets/files/'
   }
}