// vite.config.js
import { defineConfig } from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/vite/dist/node/index.js";
import path2 from "path";

// template.config.js
var template_config_default = {
  tailwindcss: false,
  cleanCss: true,
  images: {
    imageMin: true,
    makeWebp: false,
    addImgSizes: false,
    ignoreWebpClasses: ["ignore-webp"],
    imageQuality: {
      jpg: 80,
      png: [0.6, 0.8],
      webp: 80
    }
  },
  aliases: {
    "@": "./src/",
    "@js": "./src/js",
    "@scss": "./src/scss",
    "@img": "/src/assets/img/",
    "@vid": "./src/assets/video/",
    "@files": "./src/assets/files",
    "@cmp": "./src/html/components/"
  }
};

// imports.js
import vituum from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/vituum/src/index.js";
import sassGlobImports from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/vite-plugin-sass-glob-import/dist/index.mjs";
import posthtml from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/@vituum/vite-plugin-posthtml/index.js";
import tailwindcss from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/@vituum/vite-plugin-tailwindcss/index.js";
import posthtmlFetch from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/posthtml-fetch/lib/index.js";
import expressions from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/posthtml-expressions/lib/index.js";
import beautify from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/posthtml-beautify/lib/index.js";
import imgAutosize from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/posthtml-img-autosize/index.js";
import posthtmlWebp from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/posthtml-webp/lib/index.js";
import posthtmlReplace from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/posthtml-replace/lib/index.js";
import PurgeCSS from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/vite-plugin-purgecss/dist/index.mjs";
import viteImagemin from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/@vheemstra/vite-plugin-imagemin/dist/index.js";
import imageminMozjpeg from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/imagemin-mozjpeg/index.js";
import imageminWebp from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/imagemin-webp/index.js";
import imageminPngquant from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/imagemin-pngquant/index.js";

// plugins/htmlAliasPlugin.js
import path from "path";
import { parse } from "file:///C:/Users/grafv/Documents/WEB/vite-html-template/node_modules/node-html-parser/dist/index.js";
var defaultTags = {
  video: ["src", "poster"],
  source: ["src"],
  img: ["src"],
  image: ["xlink:href", "href"],
  use: ["xlink:href", "href"],
  link: ["href"],
  script: ["src"]
};
function viteHtmlAliasPlugin(aliases2, tags = defaultTags) {
  const aliasMap = new Map(Object.entries(aliases2));
  return {
    name: "vite-html-alias-plugin",
    order: "pre",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const root = parse(html);
        for (const [tag, attributes] of Object.entries(tags)) {
          root.querySelectorAll(tag).forEach((el) => {
            attributes.forEach((attr) => {
              const attrValue = el.getAttribute(attr);
              if (!attrValue) return;
              aliasMap.forEach((aliasPath, alias) => {
                if (attrValue.startsWith(alias)) {
                  const relativePath = path.relative(
                    process.cwd(),
                    attrValue.replace(alias, aliasPath)
                  );
                  el.setAttribute(attr, `/${relativePath}`);
                }
              });
            });
          });
        }
        return root.toString();
      }
    }
  };
}
var htmlAliasPlugin_default = viteHtmlAliasPlugin;

// imports.js
var imports_default = {
  vituum,
  sassGlobImports,
  posthtml,
  tailwindcss,
  posthtmlFetch,
  expressions,
  beautify,
  imgAutosize,
  posthtmlWebp,
  posthtmlReplace,
  PurgeCSS,
  viteImagemin,
  imageminMozjpeg,
  imageminWebp,
  imageminPngquant,
  viteHtmlAliasPlugin: htmlAliasPlugin_default
};

// vite.config.js
var makeAliases = (aliases2) => {
  return Object.entries(aliases2).map(([key, value]) => {
    return { key: path2.resolve(process.cwd(), value) };
  });
};
var aliases = makeAliases(template_config_default.aliases);
var isProduction = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig({
  plugins: [
    // modules.tailwindcss(),
    imports_default.viteHtmlAliasPlugin(aliases),
    imports_default.sassGlobImports(),
    imports_default.vituum(),
    imports_default.posthtml({
      encoding: "utf-8",
      root: process.cwd(),
      plugins: [
        ...isProduction && template_config_default.images.makeWebp ? [imports_default.posthtmlWebp({ classIgnore: [...template_config_default.images.ignoreWebpClasses] })] : [],
        imports_default.posthtmlFetch(),
        imports_default.expressions(),
        imports_default.imgAutosize(),
        imports_default.beautify({ rules: { blankLines: "", sortAttrs: true } })
      ]
    }),
    // TailwindCSS
    ...template_config_default.tailwindcss ? [imports_default.tailwindcss()] : [],
    // PurgeCSS "Cleaner"
    ...isProduction && template_config_default.cleanCss ? [
      imports_default.PurgeCSS({
        content: ["./src/**/*.html", "./src/**/*.js"],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
      })
    ] : [],
    // Image optimization
    ...isProduction && template_config_default.images.imageMin ? [
      imports_default.viteImagemin({
        plugins: {
          jpg: imports_default.imageminMozjpeg({ quality: template_config_default.images.imageQuality.jpg || 75 }),
          png: imports_default.imageminPngquant({ quality: template_config_default.images.imageQuality.png || [0.6, 0.8] })
        },
        makeWebp: template_config_default.images.makeWebp ? {
          plugins: {
            jpg: imports_default.imageminWebp({ quality: template_config_default.images.imageQuality.webp || 75 }),
            png: imports_default.imageminWebp({ quality: template_config_default.images.imageQuality.webp || 75 })
          }
        } : void 0
      })
    ] : [],
    // Hot Module Replacement
    {
      name: "custom-hmr",
      enforce: "post",
      handleHotUpdate({ file, server }) {
        if (file.endsWith(".html")) {
          server.ws.send({ type: "full-reload", path: "*" });
        }
      }
    }
  ],
  // CSS preprocessor
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  // Server config
  server: {
    watch: {
      ignored: [
        "**/vendor/**",
        "**/storage/**",
        "**/node_modules/**",
        "**/ifont-gen/**",
        "**/plugins/**",
        "**/dist/**",
        "**/.git/**"
      ]
    }
  },
  // Build config
  build: {
    root: "./src",
    target: "esnext",
    assetsDir: "src/assets",
    sourcemap: true,
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (asset) => {
          const ext = asset.name.split(".").pop();
          const srcPath = asset.originalFileNames ? asset.originalFileNames[0].replace("src/assets/", "sdf").replace(/\/([^/]+)$/g, "sdf") : "";
          console.log(srcPath);
          const folders = {
            css: "css",
            png: srcPath,
            jpg: srcPath,
            jpeg: srcPath,
            webp: srcPath,
            svg: srcPath,
            avi: "files/video",
            mp4: "files/video",
            mebm: "files/video",
            woff2: "fonts"
          };
          return `${folders[ext] || "files"}/[name][extname]`;
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAidGVtcGxhdGUuY29uZmlnLmpzIiwgImltcG9ydHMuanMiLCAicGx1Z2lucy9odG1sQWxpYXNQbHVnaW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncmFmdlxcXFxEb2N1bWVudHNcXFxcV0VCXFxcXHZpdGUtaHRtbC10ZW1wbGF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3JhZnZcXFxcRG9jdW1lbnRzXFxcXFdFQlxcXFx2aXRlLWh0bWwtdGVtcGxhdGVcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2dyYWZ2L0RvY3VtZW50cy9XRUIvdml0ZS1odG1sLXRlbXBsYXRlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IHRlbXBsYXRlQ2ZnIGZyb20gJy4vdGVtcGxhdGUuY29uZmlnLmpzJ1xyXG5pbXBvcnQgbW9kdWxlcyBmcm9tICcuL2ltcG9ydHMuanMnXHJcblxyXG5jb25zdCBtYWtlQWxpYXNlcyA9IChhbGlhc2VzKSA9PiB7XHJcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGFsaWFzZXMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICByZXR1cm4geyBrZXk6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCB2YWx1ZSkgfVxyXG4gIH0pXHJcbn1cclxuY29uc3QgYWxpYXNlcyA9IG1ha2VBbGlhc2VzKHRlbXBsYXRlQ2ZnLmFsaWFzZXMpXHJcbmNvbnN0IGlzUHJvZHVjdGlvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgLy8gbW9kdWxlcy50YWlsd2luZGNzcygpLFxyXG4gICAgbW9kdWxlcy52aXRlSHRtbEFsaWFzUGx1Z2luKGFsaWFzZXMpLFxyXG4gICAgbW9kdWxlcy5zYXNzR2xvYkltcG9ydHMoKSxcclxuICAgIG1vZHVsZXMudml0dXVtKCksXHJcbiAgICBtb2R1bGVzLnBvc3RodG1sKHtcclxuICAgICAgZW5jb2Rpbmc6ICd1dGYtOCcsXHJcbiAgICAgIHJvb3Q6IHByb2Nlc3MuY3dkKCksXHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAuLi4oKGlzUHJvZHVjdGlvbiAmJiB0ZW1wbGF0ZUNmZy5pbWFnZXMubWFrZVdlYnApXHJcbiAgICAgICAgICA/IFttb2R1bGVzLnBvc3RodG1sV2VicCh7IGNsYXNzSWdub3JlOiBbLi4udGVtcGxhdGVDZmcuaW1hZ2VzLmlnbm9yZVdlYnBDbGFzc2VzXSwgfSksXSA6IFtdXHJcbiAgICAgICAgKSxcclxuICAgICAgICBtb2R1bGVzLnBvc3RodG1sRmV0Y2goKSxcclxuICAgICAgICBtb2R1bGVzLmV4cHJlc3Npb25zKCksXHJcbiAgICAgICAgbW9kdWxlcy5pbWdBdXRvc2l6ZSgpLFxyXG4gICAgICAgIG1vZHVsZXMuYmVhdXRpZnkoeyBydWxlczogeyBibGFua0xpbmVzOiAnJywgc29ydEF0dHJzOiB0cnVlIH0sIH0pLFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcblxyXG4gICAgLy8gVGFpbHdpbmRDU1NcclxuICAgIC4uLigodGVtcGxhdGVDZmcudGFpbHdpbmRjc3MpID8gW21vZHVsZXMudGFpbHdpbmRjc3MoKSxdIDogW10pLFxyXG5cclxuICAgIC8vIFB1cmdlQ1NTIFwiQ2xlYW5lclwiXHJcbiAgICAuLi4oKGlzUHJvZHVjdGlvbiAmJiB0ZW1wbGF0ZUNmZy5jbGVhbkNzcykgPyBbXHJcbiAgICAgIG1vZHVsZXMuUHVyZ2VDU1Moe1xyXG4gICAgICAgIGNvbnRlbnQ6IFsnLi9zcmMvKiovKi5odG1sJywgJy4vc3JjLyoqLyouanMnXSxcclxuICAgICAgICBkZWZhdWx0RXh0cmFjdG9yOiAoY29udGVudCkgPT5cclxuICAgICAgICAgIGNvbnRlbnQubWF0Y2goL1tcXHctLzpdKyg/PCE6KS9nKSB8fCBbXSxcclxuICAgICAgfSksXHJcbiAgICBdIDogW10pLFxyXG5cclxuICAgIC8vIEltYWdlIG9wdGltaXphdGlvblxyXG4gICAgLi4uKChpc1Byb2R1Y3Rpb24gJiYgdGVtcGxhdGVDZmcuaW1hZ2VzLmltYWdlTWluKSA/IFtcclxuICAgICAgbW9kdWxlcy52aXRlSW1hZ2VtaW4oe1xyXG4gICAgICAgIHBsdWdpbnM6IHtcclxuICAgICAgICAgIGpwZzogbW9kdWxlcy5pbWFnZW1pbk1vempwZWcoeyBxdWFsaXR5OiB0ZW1wbGF0ZUNmZy5pbWFnZXMuaW1hZ2VRdWFsaXR5LmpwZyB8fCA3NSB9KSxcclxuICAgICAgICAgIHBuZzogbW9kdWxlcy5pbWFnZW1pblBuZ3F1YW50KHsgcXVhbGl0eTogdGVtcGxhdGVDZmcuaW1hZ2VzLmltYWdlUXVhbGl0eS5wbmcgfHwgWzAuNiwgMC44XSB9KSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ha2VXZWJwOiB0ZW1wbGF0ZUNmZy5pbWFnZXMubWFrZVdlYnAgPyB7XHJcbiAgICAgICAgICBwbHVnaW5zOiB7XHJcbiAgICAgICAgICAgIGpwZzogbW9kdWxlcy5pbWFnZW1pbldlYnAoeyBxdWFsaXR5OiB0ZW1wbGF0ZUNmZy5pbWFnZXMuaW1hZ2VRdWFsaXR5LndlYnAgfHwgNzUgfSksXHJcbiAgICAgICAgICAgIHBuZzogbW9kdWxlcy5pbWFnZW1pbldlYnAoeyBxdWFsaXR5OiB0ZW1wbGF0ZUNmZy5pbWFnZXMuaW1hZ2VRdWFsaXR5LndlYnAgfHwgNzUgfSksXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0gOiB1bmRlZmluZWQsXHJcbiAgICAgIH0pLFxyXG4gICAgXSA6IFtdKSxcclxuXHJcbiAgICAvLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdjdXN0b20taG1yJyxcclxuICAgICAgZW5mb3JjZTogJ3Bvc3QnLFxyXG4gICAgICBoYW5kbGVIb3RVcGRhdGUoeyBmaWxlLCBzZXJ2ZXIgfSkge1xyXG4gICAgICAgIGlmIChmaWxlLmVuZHNXaXRoKCcuaHRtbCcpKSB7XHJcbiAgICAgICAgICBzZXJ2ZXIud3Muc2VuZCh7IHR5cGU6ICdmdWxsLXJlbG9hZCcsIHBhdGg6ICcqJyB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxuXHJcbiAgLy8gQ1NTIHByZXByb2Nlc3NvclxyXG4gIGNzczoge1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuXHJcbiAgLy8gU2VydmVyIGNvbmZpZ1xyXG4gIHNlcnZlcjoge1xyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgaWdub3JlZDogW1xyXG4gICAgICAgICcqKi92ZW5kb3IvKionLFxyXG4gICAgICAgICcqKi9zdG9yYWdlLyoqJyxcclxuICAgICAgICAnKiovbm9kZV9tb2R1bGVzLyoqJyxcclxuICAgICAgICAnKiovaWZvbnQtZ2VuLyoqJyxcclxuICAgICAgICAnKiovcGx1Z2lucy8qKicsXHJcbiAgICAgICAgJyoqL2Rpc3QvKionLFxyXG4gICAgICAgICcqKi8uZ2l0LyoqJyxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgfSxcclxuXHJcbiAgLy8gQnVpbGQgY29uZmlnXHJcbiAgYnVpbGQ6IHtcclxuICAgIHJvb3Q6ICcuL3NyYycsXHJcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgYXNzZXRzRGlyOiAnc3JjL2Fzc2V0cycsXHJcbiAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICBtb2R1bGVQcmVsb2FkOiB7XHJcbiAgICAgIHBvbHlmaWxsOiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGZvcm1hdDogJ2VzJyxcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZXh0ID0gYXNzZXQubmFtZS5zcGxpdCgnLicpLnBvcCgpXHJcbiAgICAgICAgICBjb25zdCBzcmNQYXRoID0gYXNzZXQub3JpZ2luYWxGaWxlTmFtZXNcclxuICAgICAgICAgICAgPyBhc3NldC5vcmlnaW5hbEZpbGVOYW1lc1swXS5yZXBsYWNlKCdzcmMvYXNzZXRzLycsICdzZGYnKS5yZXBsYWNlKC9cXC8oW14vXSspJC9nLCAnc2RmJylcclxuICAgICAgICAgICAgOiAnJ1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc3JjUGF0aClcclxuICAgICAgICAgIGNvbnN0IGZvbGRlcnMgPSB7XHJcbiAgICAgICAgICAgIGNzczogJ2NzcycsXHJcbiAgICAgICAgICAgIHBuZzogc3JjUGF0aCxcclxuICAgICAgICAgICAganBnOiBzcmNQYXRoLFxyXG4gICAgICAgICAgICBqcGVnOiBzcmNQYXRoLFxyXG4gICAgICAgICAgICB3ZWJwOiBzcmNQYXRoLFxyXG4gICAgICAgICAgICBzdmc6IHNyY1BhdGgsXHJcbiAgICAgICAgICAgIGF2aTogJ2ZpbGVzL3ZpZGVvJyxcclxuICAgICAgICAgICAgbXA0OiAnZmlsZXMvdmlkZW8nLFxyXG4gICAgICAgICAgICBtZWJtOiAnZmlsZXMvdmlkZW8nLFxyXG4gICAgICAgICAgICB3b2ZmMjogJ2ZvbnRzJyxcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gYCR7Zm9sZGVyc1tleHRdIHx8ICdmaWxlcyd9L1tuYW1lXVtleHRuYW1lXWBcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdyYWZ2XFxcXERvY3VtZW50c1xcXFxXRUJcXFxcdml0ZS1odG1sLXRlbXBsYXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncmFmdlxcXFxEb2N1bWVudHNcXFxcV0VCXFxcXHZpdGUtaHRtbC10ZW1wbGF0ZVxcXFx0ZW1wbGF0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2dyYWZ2L0RvY3VtZW50cy9XRUIvdml0ZS1odG1sLXRlbXBsYXRlL3RlbXBsYXRlLmNvbmZpZy5qc1wiO2V4cG9ydCBkZWZhdWx0IHtcclxuICAgdGFpbHdpbmRjc3M6IGZhbHNlLFxyXG4gICBjbGVhbkNzczogdHJ1ZSxcclxuICAgaW1hZ2VzOiB7XHJcbiAgICAgIGltYWdlTWluOiB0cnVlLFxyXG4gICAgICBtYWtlV2VicDogZmFsc2UsXHJcbiAgICAgIGFkZEltZ1NpemVzOiBmYWxzZSxcclxuICAgICAgaWdub3JlV2VicENsYXNzZXM6IFsnaWdub3JlLXdlYnAnXSxcclxuICAgICAgaW1hZ2VRdWFsaXR5OiB7XHJcbiAgICAgICAgIGpwZzogODAsXHJcbiAgICAgICAgIHBuZzogWzAuNiwgMC44XSxcclxuICAgICAgICAgd2VicDogODBcclxuICAgICAgfVxyXG4gICB9LFxyXG5cclxuICAgYWxpYXNlczoge1xyXG4gICAgICAnQCc6ICcuL3NyYy8nLFxyXG4gICAgICAnQGpzJzogJy4vc3JjL2pzJyxcclxuICAgICAgJ0BzY3NzJzogJy4vc3JjL3Njc3MnLFxyXG4gICAgICAnQGltZyc6ICcvc3JjL2Fzc2V0cy9pbWcvJyxcclxuICAgICAgJ0B2aWQnOiAnLi9zcmMvYXNzZXRzL3ZpZGVvLycsXHJcbiAgICAgICdAZmlsZXMnOiAnLi9zcmMvYXNzZXRzL2ZpbGVzJyxcclxuICAgICAgJ0BjbXAnOiAnLi9zcmMvaHRtbC9jb21wb25lbnRzLycsXHJcbiAgIH1cclxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3JhZnZcXFxcRG9jdW1lbnRzXFxcXFdFQlxcXFx2aXRlLWh0bWwtdGVtcGxhdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdyYWZ2XFxcXERvY3VtZW50c1xcXFxXRUJcXFxcdml0ZS1odG1sLXRlbXBsYXRlXFxcXGltcG9ydHMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2dyYWZ2L0RvY3VtZW50cy9XRUIvdml0ZS1odG1sLXRlbXBsYXRlL2ltcG9ydHMuanNcIjtpbXBvcnQgdml0dXVtIGZyb20gJ3ZpdHV1bSdcclxuaW1wb3J0IHNhc3NHbG9iSW1wb3J0cyBmcm9tICd2aXRlLXBsdWdpbi1zYXNzLWdsb2ItaW1wb3J0J1xyXG5pbXBvcnQgcG9zdGh0bWwgZnJvbSAnQHZpdHV1bS92aXRlLXBsdWdpbi1wb3N0aHRtbCdcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B2aXR1dW0vdml0ZS1wbHVnaW4tdGFpbHdpbmRjc3MnXHJcbmltcG9ydCBwb3N0aHRtbEZldGNoIGZyb20gJ3Bvc3RodG1sLWZldGNoJ1xyXG5pbXBvcnQgZXhwcmVzc2lvbnMgZnJvbSAncG9zdGh0bWwtZXhwcmVzc2lvbnMnXHJcbmltcG9ydCBiZWF1dGlmeSBmcm9tICdwb3N0aHRtbC1iZWF1dGlmeSdcclxuaW1wb3J0IGltZ0F1dG9zaXplIGZyb20gJ3Bvc3RodG1sLWltZy1hdXRvc2l6ZSdcclxuaW1wb3J0IHBvc3RodG1sV2VicCBmcm9tICdwb3N0aHRtbC13ZWJwJ1xyXG5pbXBvcnQgcG9zdGh0bWxSZXBsYWNlIGZyb20gJ3Bvc3RodG1sLXJlcGxhY2UnXHJcbmltcG9ydCBQdXJnZUNTUyBmcm9tICd2aXRlLXBsdWdpbi1wdXJnZWNzcydcclxuaW1wb3J0IHZpdGVJbWFnZW1pbiBmcm9tICdAdmhlZW1zdHJhL3ZpdGUtcGx1Z2luLWltYWdlbWluJ1xyXG5pbXBvcnQgaW1hZ2VtaW5Nb3pqcGVnIGZyb20gJ2ltYWdlbWluLW1vempwZWcnXHJcbmltcG9ydCBpbWFnZW1pbldlYnAgZnJvbSAnaW1hZ2VtaW4td2VicCdcclxuaW1wb3J0IGltYWdlbWluUG5ncXVhbnQgZnJvbSAnaW1hZ2VtaW4tcG5ncXVhbnQnXHJcbmltcG9ydCB2aXRlSHRtbEFsaWFzUGx1Z2luIGZyb20gJy4vcGx1Z2lucy9odG1sQWxpYXNQbHVnaW4uanMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgIHZpdHV1bSxcclxuICAgc2Fzc0dsb2JJbXBvcnRzLFxyXG4gICBwb3N0aHRtbCxcclxuICAgdGFpbHdpbmRjc3MsXHJcbiAgIHBvc3RodG1sRmV0Y2gsXHJcbiAgIGV4cHJlc3Npb25zLFxyXG4gICBiZWF1dGlmeSxcclxuICAgaW1nQXV0b3NpemUsXHJcbiAgIHBvc3RodG1sV2VicCxcclxuICAgcG9zdGh0bWxSZXBsYWNlLFxyXG4gICBQdXJnZUNTUyxcclxuICAgdml0ZUltYWdlbWluLFxyXG4gICBpbWFnZW1pbk1vempwZWcsXHJcbiAgIGltYWdlbWluV2VicCxcclxuICAgaW1hZ2VtaW5QbmdxdWFudCxcclxuICAgdml0ZUh0bWxBbGlhc1BsdWdpbixcclxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3JhZnZcXFxcRG9jdW1lbnRzXFxcXFdFQlxcXFx2aXRlLWh0bWwtdGVtcGxhdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3JhZnZcXFxcRG9jdW1lbnRzXFxcXFdFQlxcXFx2aXRlLWh0bWwtdGVtcGxhdGVcXFxccGx1Z2luc1xcXFxodG1sQWxpYXNQbHVnaW4uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2dyYWZ2L0RvY3VtZW50cy9XRUIvdml0ZS1odG1sLXRlbXBsYXRlL3BsdWdpbnMvaHRtbEFsaWFzUGx1Z2luLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICdub2RlLWh0bWwtcGFyc2VyJ1xyXG5cclxuY29uc3QgZGVmYXVsdFRhZ3MgPSB7XHJcbiAgdmlkZW86IFsnc3JjJywgJ3Bvc3RlciddLFxyXG4gIHNvdXJjZTogWydzcmMnXSxcclxuICBpbWc6IFsnc3JjJ10sXHJcbiAgaW1hZ2U6IFsneGxpbms6aHJlZicsICdocmVmJ10sXHJcbiAgdXNlOiBbJ3hsaW5rOmhyZWYnLCAnaHJlZiddLFxyXG4gIGxpbms6IFsnaHJlZiddLFxyXG4gIHNjcmlwdDogWydzcmMnXSxcclxufVxyXG5cclxuZnVuY3Rpb24gdml0ZUh0bWxBbGlhc1BsdWdpbihhbGlhc2VzLCB0YWdzID0gZGVmYXVsdFRhZ3MpIHtcclxuICBjb25zdCBhbGlhc01hcCA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoYWxpYXNlcykpXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAndml0ZS1odG1sLWFsaWFzLXBsdWdpbicsXHJcbiAgICBvcmRlcjogJ3ByZScsXHJcblxyXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sOiB7XHJcbiAgICAgIG9yZGVyOiAncHJlJyxcclxuICAgICAgaGFuZGxlcihodG1sKSB7XHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IHBhcnNlKGh0bWwpXHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgW3RhZywgYXR0cmlidXRlc10gb2YgT2JqZWN0LmVudHJpZXModGFncykpIHtcclxuICAgICAgICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbCh0YWcpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKVxyXG4gICAgICAgICAgICAgIGlmICghYXR0clZhbHVlKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgICAgYWxpYXNNYXAuZm9yRWFjaCgoYWxpYXNQYXRoLCBhbGlhcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZS5zdGFydHNXaXRoKGFsaWFzKSkge1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuY3dkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlLnJlcGxhY2UoYWxpYXMsIGFsaWFzUGF0aClcclxuICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ciwgYC8ke3JlbGF0aXZlUGF0aH1gKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJvb3QudG9TdHJpbmcoKVxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHZpdGVIdG1sQWxpYXNQbHVnaW5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyVSxTQUFTLG9CQUFvQjtBQUN4VyxP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
