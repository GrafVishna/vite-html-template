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
}

function viteHtmlAliasPlugin(aliases, tags = defaultTags) {
  const aliasMap = new Map(Object.entries(aliases))

  return {
    name: 'vite-html-alias-plugin',
    order: 'pre',

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
                  const relativePath = path.relative(
                    process.cwd(),
                    attrValue.replace(alias, aliasPath)
                  )
                  el.setAttribute(attr, `/${relativePath}`)
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
