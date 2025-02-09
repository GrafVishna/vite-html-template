import fs from 'fs'
import path from 'path'
import templateConfig from '../template.config.js'

function generateConfigFiles() {
   const aliases = templateConfig.aliases

   const jsConfig = {
      compilerOptions: {
         target: 'esnext',
         baseUrl: './',
         paths: Object.entries(aliases).reduce((acc, [key, value]) => {
            acc[key + '/*'] = [path.join(value, '*').replace(/\\+/g, '/')]
            return acc
         }, {}),
      },
   }

   const vscodeSettings = {
      'path-autocomplete.pathMappings': Object.entries(aliases).reduce((acc, [key, value]) => {
         acc[key] = path.join('${folder}', value).replace(/\\+/g, '/')
         return acc
      }, {}),
   }

   fs.writeFileSync(path.resolve('jsconfig.json'), JSON.stringify(jsConfig, null, 2))
   fs.writeFileSync(path.resolve('.vscode/settings.json'), JSON.stringify(vscodeSettings, null, 2))

   console.log('Config files have been generated!')
}

generateConfigFiles()
