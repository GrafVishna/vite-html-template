import vituum from 'vituum'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import tailwindcss from '@vituum/vite-plugin-tailwindcss'
import posthtmlFetch from './plugins/posthtml/posthtmlFetch.js'
import expressions from 'posthtml-expressions'
import beautify from 'posthtml-beautify'
import imgAutosize from 'posthtml-img-autosize'
import posthtmlReplace from 'posthtml-replace'
import posthtml from './plugins/posthtml/customPostHtml.js'
import { vitePluginImageOptimizer } from "./plugins/imageOptimizer.js"

export default {
   vituum,
   sassGlobImports,
   posthtml,
   tailwindcss,
   posthtmlFetch,
   expressions,
   beautify,
   imgAutosize,
   posthtmlReplace,
   vitePluginImageOptimizer
}