import vituum from 'vituum'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import tailwindcss from '@vituum/vite-plugin-tailwindcss'
import posthtmlFetch from 'posthtml-fetch-context'
import expressions from 'posthtml-expressions'
import beautify from 'posthtml-beautify'
import imgAutosize from 'posthtml-img-autosize'
import posthtmlWebp from 'posthtml-webp'
import posthtmlReplace from 'posthtml-replace'
import PurgeCSS from 'vite-plugin-purgecss'
import posthtml from './plugins/posthtml/customPostHtml.js'
import htmlParse from './plugins/htmlParse.js'

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
   htmlParse
}