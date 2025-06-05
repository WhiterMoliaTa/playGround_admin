// vite.config.js
import { defineConfig } from "file:///D:/Test/ocr-vue-demo/node_modules/.pnpm/vite@5.4.19_sass@1.89.1/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Test/ocr-vue-demo/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.19_sass@1.89.1__vue@3.5.16/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueDevTools from "file:///D:/Test/ocr-vue-demo/node_modules/.pnpm/vite-plugin-vue-devtools@7._bd8d6a0c13c0ed1a7d214f88ea101156/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import VueRouter from "file:///D:/Test/ocr-vue-demo/node_modules/.pnpm/unplugin-vue-router@0.12.0__0ed8830d57a9844a937584dcb1600ecc/node_modules/unplugin-vue-router/dist/vite.js";
var vite_config_default = defineConfig({
  plugins: [
    VueRouter({
      routesFolder: "src/pages",
      // 預設是 src/pages，也可以自訂
      dts: "src/typed-router.d.ts"
      // 自動產生型別
    }),
    vue(),
    VueDevTools()
  ],
  optimizeDeps: {
    exclude: ["pdfjs-dist/build/pdf.worker.mjs"]
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
        // or 'modern'
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxUZXN0XFxcXG9jci12dWUtZGVtb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVGVzdFxcXFxvY3ItdnVlLWRlbW9cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Rlc3Qvb2NyLXZ1ZS1kZW1vL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcblxuaW1wb3J0IFZ1ZVJvdXRlciBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGUnXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICBWdWVSb3V0ZXIoe1xuICAgICAgcm91dGVzRm9sZGVyOiAnc3JjL3BhZ2VzJywgLy8gXHU5ODEwXHU4QTJEXHU2NjJGIHNyYy9wYWdlc1x1RkYwQ1x1NEU1Rlx1NTNFRlx1NEVFNVx1ODFFQVx1OEEwMlxuICAgICAgZHRzOiAnc3JjL3R5cGVkLXJvdXRlci5kLnRzJyAvLyBcdTgxRUFcdTUyRDVcdTc1MjJcdTc1MUZcdTU3OEJcdTUyMjVcbiAgICB9KSxcbiAgICB2dWUoKSxcbiAgICBWdWVEZXZUb29scygpXG4gIF0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsncGRmanMtZGlzdC9idWlsZC9wZGYud29ya2VyLm1qcyddXG4gIH0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYXBpOiBcIm1vZGVybi1jb21waWxlclwiIC8vIG9yICdtb2Rlcm4nXG4gICAgICB9XG4gICAgfVxuICB9LFxufSlcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUCxTQUFTLG9CQUFvQjtBQUNqUixPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7QUFFeEIsT0FBTyxlQUFlO0FBQ3RCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNSLFVBQVU7QUFBQSxNQUNQLGNBQWM7QUFBQTtBQUFBLE1BQ2QsS0FBSztBQUFBO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsSUFDSixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGlDQUFpQztBQUFBLEVBQzdDO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixLQUFLO0FBQUE7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
