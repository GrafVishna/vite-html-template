import fs from 'fs'
import path from 'path'

export default function updateImagePaths(configParams) {
  const defaultParams = [
    {
      from: ['/src/assets'],
      to: '/assets',
      attributes: ['href', 'src', 'srcset']
    },
    {
      from: ['jpg', 'jpeg', 'png'],
      to: 'webp',
      attributes: ['src', 'srcset'],
      isExtension: true
    },
  ]

  const params = configParams || defaultParams

  return {
    name: 'vite-plugin-update-image-paths',
    apply: 'build',
    writeBundle: async ({ dir }) => {
      const distPath = path.resolve(dir || './dist')

      const processHtmlFile = (filePath) => {
        let content = fs.readFileSync(filePath, 'utf-8')

        params.forEach(({ from, to, attributes, isExtension }) => {
          attributes.forEach((attr) => {
            if (isExtension) {
              const fromExtensions = from.join('|')
              const regex = new RegExp(`(${attr}=["'][^"']+)\\.(${fromExtensions})(["'])`, 'g')
              content = content.replace(regex, `$1.${to}$3`)
            } else {
              const fromPaths = from.join('|')
              const regex = new RegExp(`${attr}=["'](${fromPaths})/(.*?)["']`, 'g')
              content = content.replace(regex, `${attr}="${to}/$2"`)
            }
          })
        })

        fs.writeFileSync(filePath, content, 'utf-8')
      }

      const files = fs.readdirSync(distPath)
      files.forEach((file) => {
        const filePath = path.join(distPath, file)

        if (path.extname(file) === '.html') {
          processHtmlFile(filePath)
        }
      })
    },
  }
}
