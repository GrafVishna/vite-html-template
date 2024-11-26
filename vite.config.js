import { defineConfig } from 'vite'
import path from 'path'
import templateCfg from './template.config.js'
import modules from './imports.js'


const makeAliases = (aliases) => {
  return Object.entries(aliases).reduce((acc, [key, value]) => {
    acc[key] = path.resolve(process.cwd(), value)
    return acc
  }, {})
}

const aliases = makeAliases(templateCfg.aliases)
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    modules.sassGlobImports(),
    modules.vituum(),
    modules.posthtml({
      encoding: 'utf-8',
      root: process.cwd(),
      plugins: [
        modules.posthtmlFetch(),
        modules.expressions(),
        ...((isProduction)
          ? [modules.beautify({ rules: { blankLines: '', sortAttrs: true }, })] : []
        ),
        ...((templateCfg.addImgSizes) ? [modules.imgAutosize(),] : []),
        ...((isProduction && templateCfg.images.makeWebp)
          ? [modules.posthtmlWebp({ classIgnore: [...templateCfg.images.ignoreWebpClasses], }),] : []
        ),
      ],
    }),

    // TailwindCSS
    ...((templateCfg.tailwindcss) ? [modules.tailwindcss()] : []),

    // PurgeCSS "Cleaner"
    ...((isProduction && templateCfg.cleanCss) ? [
      modules.PurgeCSS({
        content: ['./src/**/*.html', './src/**/*.js'],
        defaultExtractor: (content) =>
          content.match(/[\w-/:]+(?<!:)/g) || [],
      }),
    ] : []),

    // Image optimization
    ...((isProduction && templateCfg.images.imageMin) ? [
      modules.viteImagemin({
        plugins: {
          jpg: modules.imageminMozjpeg({ quality: templateCfg.images.imageQuality.jpg || 75 }),
          png: modules.imageminPngquant({ quality: templateCfg.images.imageQuality.png || [0.6, 0.8] }),
        },
        makeWebp: templateCfg.images.makeWebp ? {
          plugins: {
            jpg: modules.imageminWebp({ quality: templateCfg.images.imageQuality.webp || 75 }),
            png: modules.imageminWebp({ quality: templateCfg.images.imageQuality.webp || 75 }),
          },
        } : undefined,
      }),
    ] : []),

    // Hot Module Replacement
    {
      name: 'custom-hmr',
      enforce: 'post',
      handleHotUpdate({ file, server }) {
        console.log(file)
        if (file.endsWith('.html')) {
          server.ws.send({ type: 'full-reload', path: '*' })
        }
      },
    },
  ],

  // CSS preprocessor
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },

  // Server config
  server: {
    host: '0.0.0.0',
    watch: {
      ignored: [
        '**/vendor/**',
        '**/node_modules/**',
        '**/ifont-gen/**',
        '**/plugins/**',
        '**/dist/**',
        '**/.git/**',
        '**/.gitattributes/**',
        '**/package.json/**',
        '**/yarn.lock/**',
        '**/snippets.json/**',
      ],
      include: ['./src/**/*.json'],
    },
  },

  resolve: {
    alias: { ...aliases },
  },

  // Build config
  build: {
    root: './src',
    target: 'esnext',
    assetsDir: 'src/assets',
    sourcemap: true,
    assetsInlineLimit: 0,
    modulePreload: {
      polyfill: false,
    },

    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (asset) => {
          const ext = asset.name.split('.').pop()
          const srcPath = asset.originalFileNames
            ? asset.originalFileNames[0].replace('src/assets/', '').replace(/\/([^/]+)$/g, '')
            : ''

          const folders = {
            css: 'css',
            png: srcPath,
            jpg: srcPath,
            jpeg: srcPath,
            webp: srcPath,
            svg: srcPath,
            avi: 'files/video',
            mp4: 'files/video',
            mebm: 'files/video',
            woff2: 'fonts',
          }

          return `${folders[ext] || 'files'}/[name][extname]`
        },
      },
    },
  },
})
