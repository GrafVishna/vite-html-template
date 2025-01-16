import { defineConfig } from 'vite'
import path from 'path'
import templateCfg from './template.config.js'
import modules from './imports.js'
import postcssPresetEnv from 'postcss-preset-env'

const makeAliases = (aliases) => {
  return Object.entries(aliases).reduce((acc, [key, value]) => {
    acc[key] = path.resolve(process.cwd(), value)
    return acc
  }, {})
}

const aliases = makeAliases(templateCfg.aliases)
const isProduction = process.env.NODE_ENV === 'production'

const ignoredDirs = [
  'vendor', 'node_modules', 'ifont-gen', 'plugins', 'dist', '.git'
]
const ignoredFiles = ['package.json', 'yarn.lock', 'snippets.json']


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
        modules.beautify({ rules: { blankLines: '', sortAttrs: true }, }),
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
        content: ['./src/**/*.html'],
        defaultExtractor: (content) =>
          content.match(/[\w-/:]+(?<!:)/g) || [],
      }),
    ] : []),
    // Parse HTML
    ...((isProduction) ? [
      modules.htmlParse()
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
    }
  },

  resolve: {
    alias: { ...aliases },
  },

  build: {
    modulePreload: {
      polyfill: false,
    },

    rollupOptions: {
      output: {
        format: 'es',
        assetFileNames: (asset) => {
          const ext = asset.name.split('.').pop()
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
          }
          return `${folders[ext] || 'assets'}/[name][extname]`
        },
      },
    },
  },
})
