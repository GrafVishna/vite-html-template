import fs from 'fs'
import path from 'path'
import posthtml from 'posthtml'
import { parser } from 'posthtml-parser'
import { match } from 'posthtml/lib/api'
import expressions from 'posthtml-expressions'
import replaceAliases from './posthtmlReplaceAliases.js'

/**
 * Обробка атрибутів вузла з заміною аліасів.
 * @param {Object} attrs - Об'єкт атрибутів
 * @param {boolean} prependDot - Чи додавати крапку перед значенням
 * @param {string[]} targetAttrs - Масив атрибутів для пошуку (наприклад, ['src', 'url'])
 * @returns {string|false} - Знайдене значення src/url або false
 */
const processAttributes = (attrs, prependDot, targetAttrs) => {
   let src = false
   for (const [attr, value] of Object.entries(attrs || {})) {
      if (typeof value === 'string') {
         attrs[attr] = replaceAliases(value, { prependDot })
         if (targetAttrs.includes(attr)) src = attrs[attr]
      }
   }
   return src
}

/**
 * Обробка тегів <include> і заміна аліасів в атрибутах.
 * @param {Object} options
 * @param {string} options.root
 * @param {Object} options.posthtmlExpressionsOptions
 * @returns {Function}
 */
export default (options = {}) => {
   const { root = './', encoding = 'utf-8', posthtmlExpressionsOptions = { locals: false } } = options
   const tagsArr = ['include', 'fetch']
   const attrArr = ['src', 'url']

   return function posthtmlInclude(tree) {
      tree.parser = tree.parser || parser
      tree.match = tree.match || match

      tagsArr.forEach((tag) => {
         tree.match({ tag }, (node) => {
            let src = node.attrs?.src || node.attrs?.url || false
            const exprOptions = { ...posthtmlExpressionsOptions, ...(options.delimiters && { delimiters: options.delimiters }) }

            if (node.attrs) {
               src = processAttributes(node.attrs, true, attrArr)
            }

            if (tag === 'include' && src) {
               const filePath = path.resolve(root, src)
               let source = fs.readFileSync(filePath, encoding)

               try {
                  const localsRaw = node.attrs.locals || (node.content ? node.content.join('').replace(/\n/g, '') : false)
                  if (localsRaw) {
                     const localsJson = JSON.parse(localsRaw)
                     exprOptions.locals = exprOptions.locals ? { ...exprOptions.locals, ...localsJson } : localsJson
                  }
               } catch { }

               if (exprOptions.locals) {
                  source = posthtml().use(expressions(exprOptions)).process(source, { sync: true }).html
               }

               const subtree = tree.parser(source)
               Object.assign(subtree, { match: tree.match, parser: tree.parser, messages: tree.messages })
               const content = source.includes('include') ? posthtmlInclude(subtree) : subtree

               tree.messages.push({ type: 'dependency', file: filePath })

               return { tag: false, content }
            }

            return node
         })
      })

      tree.match({ attrs: true }, (node) => {
         if (!tagsArr.includes(node.tag) && node.attrs) {
            processAttributes(node.attrs, false, [])
         }
         return node
      })

      return tree
   }
}