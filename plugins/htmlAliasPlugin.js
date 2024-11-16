import path from 'path'
import { parse } from 'node-html-parser'

const defaultTags = {
  video: ['src', 'poster'],
  source: ['src'],
  img: ['src'],
  image: ['xlink:href', 'href'],
  use: ['xlink:href', 'href'],
  link: ['href'],
  script: ['src'],
  include: ['src'],
  extend: ['src'],
  fetch: ['url'],
}

function viteHtmlAliasPlugin(aliases, tags = defaultTags) {
  const aliasMap = new Map(Object.entries(aliases))

  return {
    name: 'vite-html-alias-plugin',
    enforce: 'pre',

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const root = parse(html)

        for (const [tag, attributes] of Object.entries(tags)) {
          root.querySelectorAll(tag).forEach((el) => {
            attributes.forEach((attr) => {
              const attrValue = el.getAttribute(attr)
              if (!attrValue) return

              aliasMap.forEach((aliasPath, alias) => {
                if (attrValue.startsWith(alias)) {
                  let absolutePath = attrValue.replace(alias, aliasPath)

                  absolutePath = path.normalize(absolutePath)

                  const normalizedPath = path
                    .relative(process.cwd(), absolutePath)
                    .split(path.sep)
                    .join('/')

                  if (tag !== 'include' && tag !== 'fetch' && tag !== 'extend') {
                    el.setAttribute(attr, `/${normalizedPath}`)
                  } else {
                    el.setAttribute(attr, `./${normalizedPath}`)
                  }
                }
              })
            })
          })
        }

        return root.toString()
      },
    },
  }
}

export default viteHtmlAliasPlugin
