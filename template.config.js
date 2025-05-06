export default {
   tailwindcss: true,
   images: {
      makeWebp: true,
      optimizeNoWebp: true,
      webpQuality: {
         generateWebP: true,
         webpOptions: { lossless: false, quality: 75 },
         jpegOptions: { quality: 80, progressive: true, mozjpeg: true },
         pngOptions: { compressionLevel: 9, progressive: true },
      },
      imgQuality: {
         generateWebP: false,
         jpegOptions: { quality: 80, progressive: true, mozjpeg: true },
         pngOptions: { compressionLevel: 9, progressive: true },
      },
      ignoreWebpClasses: ['ignore-webp'],
      ignoreOptimizeClasses: ['ignore-optimize'],
   },

   serverProxy: {
      target: '/api',
      domain: 'localhost',
      port: 8000
   },

   aliases: {
      '@h': '/src/html/',
      '@o': '/src/html/other/',
      '@c': '/src/html/components/',
      '@ui': '/src/html/components/UI/',
      '@j': '/src/js/',
      '@s': '/src/scss/',
      '@i': '/src/assets/img/',
      '@v': '/src/assets/video/',
      '@f': '/src/assets/files/'
   },

   componentsImports: {
      html: ["<link rel='stylesheet' href='@c/{component}/{component}.scss'/>"],
      scss: []
   }
}