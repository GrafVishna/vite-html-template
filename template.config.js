export default {
   tailwindcss: true,
   cleanCss: false,
   images: {
      imageMin: false,
      makeWebp: true,
      ignoreWebpClasses: ['ignore-webp'],
      imageQuality: {
         generateWebP: true,
         webpOptions: { lossless: false, quality: 75 },
         jpegOptions: { quality: 80, progressive: true, mozjpeg: true },
         pngOptions: { compressionLevel: 9, progressive: true },
      }
   },

   serverProxy: {
      target: '/api',
      domain: 'localhost',
      port: 8000
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