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

const ignoredDirs = [
  'vendor', 'node_modules', 'plugins', 'dist', '.git', 'documentation', 'fonts-convert'
]
const ignoredFiles = ['package.json', 'yarn.lock', 'snippets.json', 'README.md']

export default defineConfig({
  plugins: [
    modules.vituum({
      pages: { normalizeBasePath: true, }
    }),

    // PostHTML
    modules.posthtml({
      encoding: 'utf-8',
      root: process.cwd(),
      plugins: [
        modules.posthtmlFetch(),
        modules.expressions(),
        modules.beautify({ rules: { blankLines: '', sortAttrs: true }, }),
        ...((templateCfg.addImgSizes) ? [modules.imgAutosize(),] : []),
      ],
    }),

    // TailwindCSS
    ...((templateCfg.tailwindcss) ? [modules.tailwindcss()] : []),

    // Image optimization & webp
    ...((isProduction && templateCfg.images.makeWebp && !templateCfg.images.optimizeNoWebp) ? [
      modules.vitePluginImageOptimizer(templateCfg.images.webpQuality),
    ] : []),
    // Image optimization & no webp
    ...((isProduction && templateCfg.images.optimizeNoWebp) ? [
      modules.vitePluginImageOptimizer(templateCfg.images.imgQuality),
    ] : []),

    // Hot Module Replacement
    {
      name: 'custom-hmr',
      enforce: 'post',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.html') || file.endsWith('.json')) {
          server.ws.send({ type: 'full-reload', path: '*' })
        }
      },
    },
  ],

  // CSS preprocessor
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "@s/inc" as *;`,
        sourceMap: true,
        quietDeps: true,
      },
    },
  },

  // Server config
  server: {
    host: '0.0.0.0',
    watch: {
      ignored: [
        ...ignoredDirs.map(dir => `**/${dir}/**`),
        ...ignoredFiles.map(file => `**/${file}/**`),
      ],
    },
    proxy: {
      '/api': {
        target: `http://${templateCfg.serverProxy.domain}:${templateCfg.serverProxy.port}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^${templateCfg.serverProxy.target}`), '')
      }
    }
  },

  resolve: {
    alias: { ...aliases },
  },

  build: {
    cssCodeSplit: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'es',
        assetFileNames: (asset) => {
          const ext = asset.name.split('.').pop().toLowerCase()
          if (ext === 'css') {
            return 'assets/css/style[extname]'
          }
          const srcPath = asset.originalFileNames?.[0].replace('src/assets/', 'assets/').replace(/\/([^/]+)$/g, '') || ''

          const folders = {
            png: srcPath,
            jpg: srcPath,
            jpeg: srcPath,
            webp: srcPath,
            svg: srcPath,
            avi: 'assets/video',
            mp4: 'assets/video',
            mebm: 'assets/video',
            woff2: 'assets/fonts',
            css: 'assets/css',
          }
          return `${folders[ext] || 'assets'}/[name][extname]`
        },
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
      },
    },
  },
})