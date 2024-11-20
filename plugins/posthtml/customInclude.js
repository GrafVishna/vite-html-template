import fs from 'fs'
import path from 'path'
import posthtml from 'posthtml'
import { parser } from 'posthtml-parser'
import { match } from 'posthtml/lib/api'
import expressions from 'posthtml-expressions'
import templateCfg from '../../template.config.js'

/**
 * Tagin Tags <Include> and alias replacement in attributes.
 * @param {Object} options
 * @param {string} options.root
 * @param {Object} options.aliases
 * @param {Object} options.posthtmlExpressionsOptions
 * @returns {Function}
 */
export default (options = {}) => {
   const { root = './', encoding = 'utf-8', aliases = {}, posthtmlExpressionsOptions = { locals: false } } = options

   const defaultAliases = {
      '@h': './src/html/',
      '@c': './src/html/components/',
      '@j': '/src/js/',
      '@s': '/src/scss/',
      '@i': '/src/assets/img/',
      '@f': '/src/assets/files/',
   }

   const finalAliases = { ...defaultAliases, ...templateCfg.aliases }

   return function posthtmlInclude(tree) {
      tree.parser = tree.parser || parser
      tree.match = tree.match || match

      tree.match({ tag: 'include' }, (node) => {
         let src = node.attrs.src || false
         let content
         let subtree
         let source

         let currentPosthtmlExpressionsOptions = { ...posthtmlExpressionsOptions }
         if (options.delimiters) {
            currentPosthtmlExpressionsOptions.delimiters = options.delimiters
         }

         if (src) {
            Object.keys(finalAliases).forEach((alias) => {
               if (src.startsWith(alias)) {
                  src = src.replace(alias, finalAliases[alias])
               }
            })

            src = path.resolve(root, src)
            source = fs.readFileSync(src, encoding)

            try {
               const localsRaw = node.attrs.locals || (node.content ? node.content.join().replace(/\n/g, '') : false)
               const localsJson = JSON.parse(localsRaw)
               currentPosthtmlExpressionsOptions = {
                  ...currentPosthtmlExpressionsOptions,
                  locals: currentPosthtmlExpressionsOptions.locals
                     ? { ...currentPosthtmlExpressionsOptions.locals, ...localsJson }
                     : localsJson,
               }
            } catch { }

            if (currentPosthtmlExpressionsOptions.locals) {
               const result = posthtml()
                  .use(expressions(currentPosthtmlExpressionsOptions))
                  .process(source, { sync: true })
               source = result.html
            }

            subtree = tree.parser(source)
            subtree.match = tree.match
            subtree.parser = tree.parser
            subtree.messages = tree.messages
            content = source.includes('include') ? posthtmlInclude(subtree) : subtree

            if (tree.messages) {
               tree.messages.push({
                  type: 'dependency',
                  file: src,
               })
            }
         }

         return {
            tag: false,
            content,
         }
      })

      tree.match({ attrs: true }, (node) => {
         Object.keys(node.attrs).forEach((attr) => {
            let value = node.attrs[attr]
            if (typeof value === 'string') {
               Object.keys(finalAliases).forEach((alias) => {
                  if (value.startsWith(alias)) {
                     value = value.replace(alias, finalAliases[alias])
                  }
               })
               node.attrs[attr] = value
            }
         })
         return node
      })

      return tree
   }
}
