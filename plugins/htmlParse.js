import fs from 'fs';
import path from 'path';

export default function updateImagePaths() {
  return {
    name: 'vite-plugin-update-image-paths',
    apply: 'build',
    writeBundle: async ({ dir }) => {
      const distPath = path.resolve(dir || './dist');
      const processHtmlFile = (filePath) => {
        let content = fs.readFileSync(filePath, 'utf-8');
        const regex = /href=["']\/src\/assets\/(.*?)["']/g;

        content = content.replace(regex, (match, group) => {
          return `href="/${group}"`;
        });

        fs.writeFileSync(filePath, content, 'utf-8');
      };

      const files = fs.readdirSync(distPath);
      files.forEach((file) => {
        const filePath = path.join(distPath, file);

        if (path.extname(file) === '.html') {
          processHtmlFile(filePath);
        }
      });
    },
  };
}
