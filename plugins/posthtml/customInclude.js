import fs from 'fs'
import path from 'path'
import posthtml from 'posthtml'
import { parser } from 'posthtml-parser'
import { match } from 'posthtml/lib/api'
import expressions from 'posthtml-expressions'
import replaceAliases from './posthtmlReplaceAliases.js'

/**
 * Tagin Tags <Include> and alias replacement in attributes.
 * @param {Object} options
 * @param {string} options.root
 * @param {Object} options.aliases
 * @param {Object} options.posthtmlExpressionsOptions
 * @returns {Function}
 */
export default (options = {}) => {
   const { root = './', encoding = 'utf-8', posthtmlExpressionsOptions = { locals: false } } = options

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
            // Заміна аліасів в src та додавання крапки на початку
            src = replaceAliases(src, { prependDot: true })

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

      // Обробка аліасів у всіх атрибутах
      tree.match({ attrs: true }, (node) => {
         const dotsTags = ['fetch', 'each']
         const shouldPrependDot = dotsTags.includes(node.tag)

         Object.keys(node.attrs).forEach((attr) => {
            let value = node.attrs[attr]
            if (typeof value === 'string') {
               node.attrs[attr] = replaceAliases(value, { prependDot: shouldPrependDot })
            }
         })
         return node
      })

      return tree
   }
}