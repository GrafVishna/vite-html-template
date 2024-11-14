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
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminWebp from 'imagemin-webp'
import imageminPngquant from 'imagemin-pngquant'
import viteHtmlAliasPlugin from './plugins/htmlAliasPlugin.js'

export default {
   vituum,
   sassGlobImports,
   posthtml,
   tailwindcss,
   posthtmlFetch,
   expressions,
   beautify,
   imgAutosize,
   posthtmlWebp,
   posthtmlReplace,
   PurgeCSS,
   viteImagemin,
   imageminMozjpeg,
   imageminWebp,
   imageminPngquant,
   viteHtmlAliasPlugin,
}