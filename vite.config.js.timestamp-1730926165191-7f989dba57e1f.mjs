// vite.config.js
import { defineConfig } from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/vite/dist/node/index.js";
import path3 from "path";
import vituum from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/vituum/src/index.js";
import sassGlobImports from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/vite-plugin-sass-glob-import/dist/index.mjs";
import posthtml from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/@vituum/vite-plugin-posthtml/index.js";
import posthtmlFetch from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/posthtml-fetch/lib/index.js";
import expressions from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/posthtml-expressions/lib/index.js";
import beautify from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/posthtml-beautify/lib/index.js";
import postcss from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/@vituum/vite-plugin-postcss/index.js";
import PurgeCSS from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/vite-plugin-purgecss/dist/index.mjs";
import viteImagemin from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/@vheemstra/vite-plugin-imagemin/dist/index.js";
import imageminMozjpeg from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/imagemin-mozjpeg/index.js";
import imageminWebp from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/imagemin-webp/index.js";
import imageminPngquant from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/imagemin-pngquant/index.js";

// plugins/htmlAliasPlugin.js
import path from "path";
import { parse } from "file:///C:/Users/grafv/Documents/WEB/Test_Projects/test_vite_template/node_modules/node-html-parser/dist/index.js";
var defaultTags = {
  video: ["src", "poster"],
  source: ["src"],
  img: ["src"],
  image: ["xlink:href", "href"],
  use: ["xlink:href", "href"],
  link: ["href"],
  script: ["src"],
  include: ["src", "locals"],
  fetch: ["url"]
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

// plugins/vite-plugin-post-process.js
import fs from "fs";
import path2 from "path";
function jsonPlugin(options) {
  return function(tree) {
    tree.walk((node) => {
      if (node.tag === "json" && node.attrs && node.attrs.url) {
        const jsonPath = path2.resolve(options.rootDir, node.attrs.url);
        try {
          const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
          console.log(data);
          node.content = node.content.map((contentNode) => {
            if (contentNode.content) {
              contentNode.content = contentNode.content.replace("{{response}}", JSON.stringify(data, null, 2));
            }
            return contentNode;
          });
        } catch (err) {
          console.error(`\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0437\u0447\u0438\u0442\u0443\u0432\u0430\u043D\u043D\u0456 JSON \u0437 \u0444\u0430\u0439\u043B\u0443 ${jsonPath}:`, err);
        }
      }
      return node;
    });
    return tree;
  };
}

// vite.config.js
var rootPath = "./src";
var aliases = {
  "@": path3.resolve(process.cwd(), "./src/"),
  "@cmp": path3.resolve(process.cwd(), "./src/html/components/"),
  "@scss": path3.resolve(process.cwd(), "./src/scss"),
  "@img": path3.resolve(process.cwd(), "./src/assets/img/"),
  "@vid": path3.resolve(process.cwd(), "./src/assets/video/"),
  "@files": path3.resolve(process.cwd(), "./src/assets/files"),
  "@js": path3.resolve(process.cwd(), "./src/js")
};
var isProduction = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig({
  plugins: [
    postcss(),
    htmlAliasPlugin_default(aliases),
    sassGlobImports(),
    vituum(),
    posthtml({
      encoding: "utf-8",
      root: process.cwd(),
      plugins: [
        posthtmlFetch(),
        expressions()
      ]
    }),
    ...isProduction ? [
      PurgeCSS({
        content: ["./src/**/*.html", "./src/**/*.js"],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
      }),
      jsonPlugin({
        indent: 2,
        blanks: ["head", "body"]
      })
    ] : [],
    {
      name: "custom-hmr",
      enforce: "post",
      handleHotUpdate({ file, server }) {
        if (file.endsWith(".html")) {
          server.ws.send({ type: "full-reload", path: "*" });
        }
      }
    },
    viteImagemin({
      plugins: {
        jpg: imageminMozjpeg({ quality: 80 }),
        png: imageminPngquant({ quality: [0.6, 0.8] })
      },
      makeWebp: {
        plugins: {
          jpg: imageminWebp({ quality: 80 }),
          png: imageminWebp({ quality: 80 })
        }
      }
    })
  ],
  resolve: {
    alias: { ...aliases }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
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
  build: {
    target: "esnext",
    root: rootPath,
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
          const folders = {
            css: "css",
            png: "img",
            jpg: "img",
            jpeg: "img",
            webp: "img",
            svg: "img",
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
  aliases,
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicGx1Z2lucy9odG1sQWxpYXNQbHVnaW4uanMiLCAicGx1Z2lucy92aXRlLXBsdWdpbi1wb3N0LXByb2Nlc3MuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncmFmdlxcXFxEb2N1bWVudHNcXFxcV0VCXFxcXFRlc3RfUHJvamVjdHNcXFxcdGVzdF92aXRlX3RlbXBsYXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncmFmdlxcXFxEb2N1bWVudHNcXFxcV0VCXFxcXFRlc3RfUHJvamVjdHNcXFxcdGVzdF92aXRlX3RlbXBsYXRlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ncmFmdi9Eb2N1bWVudHMvV0VCL1Rlc3RfUHJvamVjdHMvdGVzdF92aXRlX3RlbXBsYXRlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgdml0dXVtIGZyb20gJ3ZpdHV1bSdcbmltcG9ydCBzYXNzR2xvYkltcG9ydHMgZnJvbSAndml0ZS1wbHVnaW4tc2Fzcy1nbG9iLWltcG9ydCdcblxuaW1wb3J0IHBvc3RodG1sIGZyb20gJ0B2aXR1dW0vdml0ZS1wbHVnaW4tcG9zdGh0bWwnXG5pbXBvcnQgcG9zdGh0bWxGZXRjaCBmcm9tICdwb3N0aHRtbC1mZXRjaCdcbmltcG9ydCBleHByZXNzaW9ucyBmcm9tICdwb3N0aHRtbC1leHByZXNzaW9ucydcbmltcG9ydCBiZWF1dGlmeSBmcm9tICdwb3N0aHRtbC1iZWF1dGlmeSdcblxuaW1wb3J0IHBvc3Rjc3MgZnJvbSAnQHZpdHV1bS92aXRlLXBsdWdpbi1wb3N0Y3NzJ1xuaW1wb3J0IFB1cmdlQ1NTIGZyb20gJ3ZpdGUtcGx1Z2luLXB1cmdlY3NzJ1xuaW1wb3J0IHZpdGVJbWFnZW1pbiBmcm9tICdAdmhlZW1zdHJhL3ZpdGUtcGx1Z2luLWltYWdlbWluJ1xuXG5pbXBvcnQgaW1hZ2VtaW5Nb3pqcGVnIGZyb20gJ2ltYWdlbWluLW1vempwZWcnXG5pbXBvcnQgaW1hZ2VtaW5XZWJwIGZyb20gJ2ltYWdlbWluLXdlYnAnXG5pbXBvcnQgaW1hZ2VtaW5QbmdxdWFudCBmcm9tICdpbWFnZW1pbi1wbmdxdWFudCdcblxuaW1wb3J0IHZpdGVIdG1sQWxpYXNQbHVnaW4gZnJvbSAnLi9wbHVnaW5zL2h0bWxBbGlhc1BsdWdpbi5qcydcbmltcG9ydCBodG1sRm9ybWF0dGVyUGx1Z2luIGZyb20gJy4vcGx1Z2lucy92aXRlLXBsdWdpbi1wb3N0LXByb2Nlc3MuanMnXG5cblxuY29uc3Qgcm9vdFBhdGggPSAnLi9zcmMnXG5cbmV4cG9ydCBjb25zdCBhbGlhc2VzID0ge1xuICAnQCc6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLi9zcmMvJyksXG4gICdAY21wJzogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICcuL3NyYy9odG1sL2NvbXBvbmVudHMvJyksXG4gICdAc2Nzcyc6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLi9zcmMvc2NzcycpLFxuICAnQGltZyc6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLi9zcmMvYXNzZXRzL2ltZy8nKSxcbiAgJ0B2aWQnOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy4vc3JjL2Fzc2V0cy92aWRlby8nKSxcbiAgJ0BmaWxlcyc6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLi9zcmMvYXNzZXRzL2ZpbGVzJyksXG4gICdAanMnOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy4vc3JjL2pzJyksXG59XG5cbmNvbnN0IGlzUHJvZHVjdGlvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHBvc3Rjc3MoKSxcbiAgICB2aXRlSHRtbEFsaWFzUGx1Z2luKGFsaWFzZXMpLFxuICAgIHNhc3NHbG9iSW1wb3J0cygpLFxuICAgIHZpdHV1bSgpLFxuICAgIHBvc3RodG1sKHtcbiAgICAgIGVuY29kaW5nOiAndXRmLTgnLFxuICAgICAgcm9vdDogcHJvY2Vzcy5jd2QoKSxcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcG9zdGh0bWxGZXRjaCgpLFxuICAgICAgICBleHByZXNzaW9ucygpLFxuICAgICAgXSxcbiAgICB9KSxcbiAgICAuLi4oaXNQcm9kdWN0aW9uXG4gICAgICA/IFtcbiAgICAgICAgUHVyZ2VDU1Moe1xuICAgICAgICAgIGNvbnRlbnQ6IFsnLi9zcmMvKiovKi5odG1sJywgJy4vc3JjLyoqLyouanMnXSxcbiAgICAgICAgICBkZWZhdWx0RXh0cmFjdG9yOiAoY29udGVudCkgPT5cbiAgICAgICAgICAgIGNvbnRlbnQubWF0Y2goL1tcXHctLzpdKyg/PCE6KS9nKSB8fCBbXSxcbiAgICAgICAgfSksXG4gICAgICAgIGh0bWxGb3JtYXR0ZXJQbHVnaW4oe1xuICAgICAgICAgIGluZGVudDogMixcbiAgICAgICAgICBibGFua3M6IFsnaGVhZCcsICdib2R5J10sXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgOiBbXSksXG4gICAge1xuICAgICAgbmFtZTogJ2N1c3RvbS1obXInLFxuICAgICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgICAgaGFuZGxlSG90VXBkYXRlKHsgZmlsZSwgc2VydmVyIH0pIHtcbiAgICAgICAgaWYgKGZpbGUuZW5kc1dpdGgoJy5odG1sJykpIHtcbiAgICAgICAgICBzZXJ2ZXIud3Muc2VuZCh7IHR5cGU6ICdmdWxsLXJlbG9hZCcsIHBhdGg6ICcqJyB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICAgdml0ZUltYWdlbWluKHtcbiAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAganBnOiBpbWFnZW1pbk1vempwZWcoeyBxdWFsaXR5OiA4MCB9KSxcbiAgICAgICAgcG5nOiBpbWFnZW1pblBuZ3F1YW50KHsgcXVhbGl0eTogWzAuNiwgMC44XSB9KSxcbiAgICAgIH0sXG4gICAgICBtYWtlV2VicDoge1xuICAgICAgICBwbHVnaW5zOiB7XG4gICAgICAgICAganBnOiBpbWFnZW1pbldlYnAoeyBxdWFsaXR5OiA4MCB9KSxcbiAgICAgICAgICBwbmc6IGltYWdlbWluV2VicCh7IHF1YWxpdHk6IDgwIH0pLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcblxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHsgLi4uYWxpYXNlcyB9LFxuICB9LFxuXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBzZXJ2ZXI6IHtcbiAgICB3YXRjaDoge1xuICAgICAgaWdub3JlZDogW1xuICAgICAgICAnKiovdmVuZG9yLyoqJyxcbiAgICAgICAgJyoqL3N0b3JhZ2UvKionLFxuICAgICAgICAnKiovbm9kZV9tb2R1bGVzLyoqJyxcbiAgICAgICAgJyoqL2lmb250LWdlbi8qKicsXG4gICAgICAgICcqKi9wbHVnaW5zLyoqJyxcbiAgICAgICAgJyoqL2Rpc3QvKionLFxuICAgICAgICAnKiovLmdpdC8qKicsXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG5cbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIHJvb3Q6IHJvb3RQYXRoLFxuICAgIG1vZHVsZVByZWxvYWQ6IHtcbiAgICAgIHBvbHlmaWxsOiBmYWxzZSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBmb3JtYXQ6ICdlcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXQpID0+IHtcbiAgICAgICAgICBjb25zdCBleHQgPSBhc3NldC5uYW1lLnNwbGl0KCcuJykucG9wKClcbiAgICAgICAgICBjb25zdCBmb2xkZXJzID0ge1xuICAgICAgICAgICAgY3NzOiAnY3NzJyxcbiAgICAgICAgICAgIHBuZzogJ2ltZycsXG4gICAgICAgICAgICBqcGc6ICdpbWcnLFxuICAgICAgICAgICAganBlZzogJ2ltZycsXG4gICAgICAgICAgICB3ZWJwOiAnaW1nJyxcbiAgICAgICAgICAgIHN2ZzogJ2ltZycsXG4gICAgICAgICAgICBhdmk6ICdmaWxlcy92aWRlbycsXG4gICAgICAgICAgICBtcDQ6ICdmaWxlcy92aWRlbycsXG4gICAgICAgICAgICBtZWJtOiAnZmlsZXMvdmlkZW8nLFxuICAgICAgICAgICAgd29mZjI6ICdmb250cycsXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGAke2ZvbGRlcnNbZXh0XSB8fCAnZmlsZXMnfS9bbmFtZV1bZXh0bmFtZV1gXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncmFmdlxcXFxEb2N1bWVudHNcXFxcV0VCXFxcXFRlc3RfUHJvamVjdHNcXFxcdGVzdF92aXRlX3RlbXBsYXRlXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdyYWZ2XFxcXERvY3VtZW50c1xcXFxXRUJcXFxcVGVzdF9Qcm9qZWN0c1xcXFx0ZXN0X3ZpdGVfdGVtcGxhdGVcXFxccGx1Z2luc1xcXFxodG1sQWxpYXNQbHVnaW4uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2dyYWZ2L0RvY3VtZW50cy9XRUIvVGVzdF9Qcm9qZWN0cy90ZXN0X3ZpdGVfdGVtcGxhdGUvcGx1Z2lucy9odG1sQWxpYXNQbHVnaW4uanNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICdub2RlLWh0bWwtcGFyc2VyJ1xuXG5jb25zdCBkZWZhdWx0VGFncyA9IHtcbiAgdmlkZW86IFsnc3JjJywgJ3Bvc3RlciddLFxuICBzb3VyY2U6IFsnc3JjJ10sXG4gIGltZzogWydzcmMnXSxcbiAgaW1hZ2U6IFsneGxpbms6aHJlZicsICdocmVmJ10sXG4gIHVzZTogWyd4bGluazpocmVmJywgJ2hyZWYnXSxcbiAgbGluazogWydocmVmJ10sXG4gIHNjcmlwdDogWydzcmMnXSxcbiAgaW5jbHVkZTogWydzcmMnLCAnbG9jYWxzJ10sXG4gIGZldGNoOiBbJ3VybCddLFxufVxuXG5mdW5jdGlvbiB2aXRlSHRtbEFsaWFzUGx1Z2luKGFsaWFzZXMsIHRhZ3MgPSBkZWZhdWx0VGFncykge1xuICBjb25zdCBhbGlhc01hcCA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoYWxpYXNlcykpXG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZS1odG1sLWFsaWFzLXBsdWdpbicsXG4gICAgb3JkZXI6ICdwcmUnLFxuXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sOiB7XG4gICAgICBvcmRlcjogJ3ByZScsXG4gICAgICBoYW5kbGVyKGh0bWwpIHtcbiAgICAgICAgY29uc3Qgcm9vdCA9IHBhcnNlKGh0bWwpXG5cbiAgICAgICAgZm9yIChjb25zdCBbdGFnLCBhdHRyaWJ1dGVzXSBvZiBPYmplY3QuZW50cmllcyh0YWdzKSkge1xuICAgICAgICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbCh0YWcpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgYXR0clZhbHVlID0gZWwuZ2V0QXR0cmlidXRlKGF0dHIpXG4gICAgICAgICAgICAgIGlmICghYXR0clZhbHVlKSByZXR1cm5cblxuICAgICAgICAgICAgICBhbGlhc01hcC5mb3JFYWNoKChhbGlhc1BhdGgsIGFsaWFzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZS5zdGFydHNXaXRoKGFsaWFzKSkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZShcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5jd2QoKSxcbiAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlLnJlcGxhY2UoYWxpYXMsIGFsaWFzUGF0aClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyLCBgLyR7cmVsYXRpdmVQYXRofWApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvb3QudG9TdHJpbmcoKVxuICAgICAgfSxcbiAgICB9LFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZpdGVIdG1sQWxpYXNQbHVnaW5cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3JhZnZcXFxcRG9jdW1lbnRzXFxcXFdFQlxcXFxUZXN0X1Byb2plY3RzXFxcXHRlc3Rfdml0ZV90ZW1wbGF0ZVxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncmFmdlxcXFxEb2N1bWVudHNcXFxcV0VCXFxcXFRlc3RfUHJvamVjdHNcXFxcdGVzdF92aXRlX3RlbXBsYXRlXFxcXHBsdWdpbnNcXFxcdml0ZS1wbHVnaW4tcG9zdC1wcm9jZXNzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ncmFmdi9Eb2N1bWVudHMvV0VCL1Rlc3RfUHJvamVjdHMvdGVzdF92aXRlX3RlbXBsYXRlL3BsdWdpbnMvdml0ZS1wbHVnaW4tcG9zdC1wcm9jZXNzLmpzXCI7aW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ganNvblBsdWdpbihvcHRpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodHJlZSkge1xuICAgIHRyZWUud2Fsaygobm9kZSkgPT4ge1xuICAgICAgLy8gXHUwNDFGXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDMyXHUwNDU2XHUwNDQwXHUwNDRGXHUwNDU0XHUwNDNDXHUwNDNFLCBcdTA0NDdcdTA0MzggXHUwNDU0IFx1MDQ0Mlx1MDQzNVx1MDQzMyA8anNvbj4gXHUwNDM3IFx1MDQzMFx1MDQ0Mlx1MDQ0MFx1MDQzOFx1MDQzMVx1MDQ0M1x1MDQ0Mlx1MDQzRVx1MDQzQyB1cmxcbiAgICAgIGlmIChub2RlLnRhZyA9PT0gJ2pzb24nICYmIG5vZGUuYXR0cnMgJiYgbm9kZS5hdHRycy51cmwpIHtcbiAgICAgICAgY29uc3QganNvblBhdGggPSBwYXRoLnJlc29sdmUob3B0aW9ucy5yb290RGlyLCBub2RlLmF0dHJzLnVybClcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFx1MDQyMVx1MDQzOFx1MDQzRFx1MDQ0NVx1MDQ0MFx1MDQzRVx1MDQzRFx1MDQzRFx1MDQzNSBcdTA0NDdcdTA0MzhcdTA0NDJcdTA0MzBcdTA0M0RcdTA0M0RcdTA0NEYgSlNPTiBcdTA0NDRcdTA0MzBcdTA0MzlcdTA0M0JcdTA0NDNcbiAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoanNvblBhdGgsICd1dGY4JykpXG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgIC8vIFx1MDQxN1x1MDQzMFx1MDQzQ1x1MDQ1Nlx1MDQ0OVx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSB7e3Jlc3BvbnNlfX0gXHUwNDNEXHUwNDMwIFx1MDQzNFx1MDQzMFx1MDQzRFx1MDQ1NiBcdTA0MzcgSlNPTlxuICAgICAgICAgIG5vZGUuY29udGVudCA9IG5vZGUuY29udGVudC5tYXAoY29udGVudE5vZGUgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbnRlbnROb2RlLmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgY29udGVudE5vZGUuY29udGVudCA9IGNvbnRlbnROb2RlLmNvbnRlbnQucmVwbGFjZSgne3tyZXNwb25zZX19JywgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMikpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29udGVudE5vZGVcbiAgICAgICAgICB9KVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBcdTA0MUZcdTA0M0VcdTA0M0NcdTA0MzhcdTA0M0JcdTA0M0FcdTA0MzAgXHUwNDNGXHUwNDQwXHUwNDM4IFx1MDQzN1x1MDQ0N1x1MDQzOFx1MDQ0Mlx1MDQ0M1x1MDQzMlx1MDQzMFx1MDQzRFx1MDQzRFx1MDQ1NiBKU09OIFx1MDQzNyBcdTA0NDRcdTA0MzBcdTA0MzlcdTA0M0JcdTA0NDMgJHtqc29uUGF0aH06YCwgZXJyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9kZVxuICAgIH0pXG5cbiAgICByZXR1cm4gdHJlZVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVYLFNBQVMsb0JBQW9CO0FBQ3BaLE9BQU9BLFdBQVU7QUFDakIsT0FBTyxZQUFZO0FBQ25CLE9BQU8scUJB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QixFQUFFLE1BQU0sT0FBTyxHQUFHO0FBQ2hDLFlBQUksS0FBSyxTQUFTLE9BQU8sR0FBRztBQUMxQixpQkFBTyxHQUFHLEtBQUssRUFBRSxNQUFNLGVBQWUsTUFBTSxJQUFJLENBQUM7QUFBQSxRQUNuRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxhQUFhO0FBQUEsTUFDWCxTQUFTO0FBQUEsUUFDUCxLQUFLLGdCQUFnQixFQUFFLFNBQVMsR0FBRyxDQUFDO0FBQUEsUUFDcEMsS0FBSyxpQkFBaUIsRUFBRSxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUFBLE1BQy9DO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUixTQUFTO0FBQUEsVUFDUCxLQUFLLGFBQWEsRUFBRSxTQUFTLEdBQUcsQ0FBQztBQUFBLFVBQ2pDLEtBQUssYUFBYSxFQUFFLFNBQVMsR0FBRyxDQUFDO0FBQUEsUUFDbkM7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsT0FBTyxFQUFFLEdBQUcsUUFBUTtBQUFBLEVBQ3RCO0FBQUEsRUFFQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsTUFBTTtBQUFBLElBQ04sZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLElBQ1o7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQixDQUFDLFVBQVU7QUFDekIsZ0JBQU0sTUFBTSxNQUFNLEtBQUssTUFBTSxHQUFHLEVBQUUsSUFBSTtBQUN0QyxnQkFBTSxVQUFVO0FBQUEsWUFDZCxLQUFLO0FBQUEsWUFDTCxLQUFLO0FBQUEsWUFDTCxLQUFLO0FBQUEsWUFDTCxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixLQUFLO0FBQUEsWUFDTCxLQUFLO0FBQUEsWUFDTCxLQUFLO0FBQUEsWUFDTCxNQUFNO0FBQUEsWUFDTixPQUFPO0FBQUEsVUFDVDtBQUVBLGlCQUFPLEdBQUcsUUFBUSxHQUFHLEtBQUssT0FBTztBQUFBLFFBQ25DO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCIsICJhbGlhc2VzIiwgInBhdGgiLCAicGF0aCIsICJwYXRoIl0KfQo=
