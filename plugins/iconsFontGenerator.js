import { outlineSvg } from '@davestewart/outliner';
import svgtofont from 'svgtofont';
import { optimize } from 'svgo';
import fs from 'fs/promises';
import path from 'path';
const pkg = JSON.parse(await fs.readFile('./package.json', 'utf8'));

// Configuration parameters
const paths = {
  src: path.resolve(process.cwd(), `./fonts-convert/icons`),
  optimizedDist: path.resolve(
    process.cwd(),
    `./plugins/ifont-gen/optimized-icons`
  ),
  buildDist: path.resolve(process.cwd(), `./plugins/ifont-gen/build`),
  templates: path.resolve(
    process.cwd(),
    `./plugins/ifont-gen/templates/styles`
  ),
  fonts: path.resolve(process.cwd(), './src/assets/fonts'),
  scss: path.resolve(process.cwd(), `src/scss/fonts`),
};

const fontParams = {
  fontName: 'icons',
  classNamePrefix: '_icon',
};

// Create a directory if it doesn't exist
const createDirectoryIfNotExists = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

// Convert SVG strokes to paths and optimize SVG
const convertAndOptimizeSvg = async (file, srcDir, distDir) => {
  const filePath = path.join(srcDir, file);
  const outputFilePath = path.join(distDir, file);
  try {
    let svgContent = await fs.readFile(filePath, 'utf8');
    const outlinedSvg = outlineSvg(svgContent); // Конвертація штрихів у шляхи
    console.log(`Converted strokes to paths for: ${file}`);

    const optimizedSvg = optimize(outlinedSvg, {
      path: outputFilePath,
      plugins: getSvgOptimizationPlugins(),
    });
    await fs.writeFile(outputFilePath, optimizedSvg.data, 'utf8');
    console.log(`Optimized SVG: ${file}`);
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
  }
};

// SVG optimization plugins
const getSvgOptimizationPlugins = () => [
  { name: 'removeXMLProcInst', active: true },
  {
    name: 'removeAttrs',
    params: { attrs: '(stroke|style|fill|clip-path|id|data-name)' },
  },
  { name: 'removeUselessDefs', active: true },
  { name: 'removeEmptyContainers', active: true },
  {
    name: 'addAttributesToSVGElement',
    params: { attributes: [{ fill: 'black' }] },
  },
  { name: 'convertStyleToAttrs', active: true },
  { name: 'convertPathData', active: true },
];

// Generate font from SVGs
const generateFont = async () => {
  try {
    await svgtofont({
      src: paths.optimizedDist,
      dist: paths.buildDist,
      fontName: fontParams.fontName,
      classNamePrefix: fontParams.classNamePrefix,
      outSVGPath: true,
      startNumber: 20000,
      css: true,
      useCSSVars: true,
      generateInfoData: true,
      styleTemplates: paths.templates,
      svgicons2svgfont: {
        fontHeight: 1024,
        unitsPerEm: 1024,
        centerHorizontally: true,
        centerVertically: true,
        normalize: true,
      },
      website: {
        index: 'unicode',
        title: `${pkg.name} icons`,
        version: pkg.version,
        meta: {
          description: 'Converts SVG fonts to TTF/EOT/WOFF/WOFF2/SVG format.',
          keywords: 'icons font,TTF,EOT,WOFF,WOFF2,SVG',
        },
        links: [
          { title: 'Class Demo', url: 'font-class.html' },
          { title: 'Symbol Demo', url: 'symbol.html' },
          { title: 'Unicode Demo', url: 'index.html' },
        ],
      },
    });
    console.log('Font generation is completed!');

    await copyGeneratedFiles();
  } catch (error) {
    console.error('Error generating font:', error);
  }
};

// Copy generated font and style files
const copyGeneratedFiles = async () => {
  try {
    const ttfSourcePath = path.join(
      paths.buildDist,
      `${fontParams.fontName}.woff2`
    );
    const ttfDestPath = path.join(paths.fonts, `${fontParams.fontName}.woff2`);
    await fs.copyFile(ttfSourcePath, ttfDestPath);
    console.log(`Copied ${ttfSourcePath} to ${ttfDestPath}`);

    const scssSourcePath = path.join(
      paths.buildDist,
      `${fontParams.fontName}.scss`
    );
    const scssDestPath = path.join(paths.scss, `${fontParams.fontName}.scss`);
    await fs.copyFile(scssSourcePath, scssDestPath);
    console.log(`Copied ${scssSourcePath} to ${scssDestPath}`);
  } catch (error) {
    console.error('Error copying files:', error);
  }
};

// Main process execution
(async () => {
  try {
    await createDirectoryIfNotExists(paths.optimizedDist);

    const svgFiles = (await fs.readdir(paths.src)).filter(
      (file) => path.extname(file) === '.svg'
    );
    await Promise.all(
      svgFiles.map((file) =>
        convertAndOptimizeSvg(file, paths.src, paths.optimizedDist)
      )
    );

    console.log('SVG optimization done');
    await generateFont();
  } catch (error) {
    console.error('Error while performing:', error);
  }
})();
