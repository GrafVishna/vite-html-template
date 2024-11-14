import { defineConfig } from 'vite'
import path from 'path'
import vituum from 'vituum'
import sassGlobImports from 'vite-plugin-sass-glob-import'

import posthtml from '@vituum/vite-plugin-posthtml'
import tailwindcss from '@vituum/vite-plugin-tailwindcss'

import posthtmlFetch from 'posthtml-fetch'
import expressions from 'posthtml-expressions'
import beautify from 'posthtml-beautify'
import imgAutosize from 'posthtml-img-autosize'
import posthtmlWebp from 'posthtml-webp'
import posthtmlReplace from 'posthtml-replace'

import PurgeCSS from 'vite-plugin-purgecss'
import viteImagemin from '@vheemstra/vite-plugin-imagemin'

import templateCfg from './template.config.js'

import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminWebp from 'imagemin-webp'
import imageminPngquant from 'imagemin-pngquant'

import viteHtmlAliasPlugin from './plugins/htmlAliasPlugin.js'

const rootPath = './src'

const makeAliases = (aliases) => {
  return Object.entries(aliases).map(([key, value]) => {
    return { key: path.resolve(process.cwd(), value) }
  })
}
const aliases = makeAliases(templateCfg.aliases)
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    tailwindcss(),
    viteHtmlAliasPlugin(aliases),
    sassGlobImports(),
    vituum(),
    posthtml({
      encoding: 'utf-8',
      root: process.cwd(),
      plugins: [
        ...((isProduction && templateCfg.images.makeWebp)
          ? [posthtmlWebp({ classIgnore: [...templateCfg.images.ignoreWebpClasses], }),] : []
        ),
        posthtmlFetch(),
        expressions(),
        imgAutosize(),
        posthtmlReplace([
          {
            match: { tag: 'img', },
            attrs: { src: { from: '@img/', to: templateCfg.aliases['@img'], } }
          },
          {
            match: { tag: 'source', },
            attrs: { srcset: { from: '/src/assets/img/', to: '/img/', } }
          },
          {
            match: { tag: 'video' },
            attrs: { src: { from: '@vid/', to: templateCfg.aliases['@vid'], } }
          },
          {
            match: { tag: 'include', },
            attrs: { src: { from: '@cmp/', to: templateCfg.aliases['@cmp'], } }
          },
        ]),

        beautify({ rules: { blankLines: '', sortAttrs: true }, }),
      ],
    }),


    ...((tailwindcss) ? [tailwindcss(),] : []),

    // PurgeCSS "Cleaner"
    ...((isProduction && templateCfg.cleanCss) ? [
      PurgeCSS({
        content: ['./src/**/*.html', './src/**/*.js'],
        defaultExtractor: (content) =>
          content.match(/[\w-/:]+(?<!:)/g) || [],
      }),
    ] : []),

    // Image optimization
    ...((isProduction && templateCfg.images.imageMin) ? [
      viteImagemin({
        plugins: {
          jpg: imageminMozjpeg({ quality: templateCfg.images.imageQuality.jpg || 75 }),
          png: imageminPngquant({ quality: templateCfg.images.imageQuality.png || [0.6, 0.8] }),
        },
        makeWebp: templateCfg.images.makeWebp ? {
          plugins: {
            jpg: imageminWebp({ quality: templateCfg.images.imageQuality.webp || 75 }),
            png: imageminWebp({ quality: templateCfg.images.imageQuality.webp || 75 }),
          },
        } : undefined,
      }),
    ] : []),

    // Hot Module Replacement
    {
      name: 'custom-hmr',
      enforce: 'post',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.html')) {
          server.ws.send({ type: 'full-reload', path: '*' })
        }
      },
    },
  ],

  // Aliases
  resolve: {
    alias: { ...aliases },
  },

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
    watch: {
      ignored: [
        '**/vendor/**',
        '**/storage/**',
        '**/node_modules/**',
        '**/ifont-gen/**',
        '**/plugins/**',
        '**/dist/**',
        '**/.git/**',
      ],
    },
  },

  // Build config
  build: {
    target: 'esnext',
    root: rootPath,
    assetsDir: 'src/assets',
    sourcemap: true,
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
          console.log(srcPath)
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
