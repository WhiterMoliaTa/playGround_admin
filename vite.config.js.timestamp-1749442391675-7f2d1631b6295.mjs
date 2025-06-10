// vite.config.js
import { defineConfig } from "file:///D:/Test/ocr-vue-demo/node_modules/.pnpm/vite@5.4.19_sass@1.89.1/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Test/ocr-vue-demo/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.19_sass@1.89.1__vue@3.5.16/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueDevTools from "file:///D:/Test/ocr-vue-demo/node_modules/.pnpm/vite-plugin-vue-devtools@7._bd8d6a0c13c0ed1a7d214f88ea101156/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import VueRouter from "file:///D:/Test/ocr-vue-demo/node_modules/.pnpm/unplugin-vue-router@0.12.0__0ed8830d57a9844a937584dcb1600ecc/node_modules/unplugin-vue-router/dist/vite.js";
var isProd = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig({
  plugins: [
    VueRouter({
      routesFolder: "src/pages",
      dts: "src/typed-router.d.ts",
      history: "createWebHashHistory",
      historyOptions: {}
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
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxUZXN0XFxcXG9jci12dWUtZGVtb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVGVzdFxcXFxvY3ItdnVlLWRlbW9cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Rlc3Qvb2NyLXZ1ZS1kZW1vL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXHJcblxyXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZSdcclxuY29uc3QgaXNQcm9kID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIFZ1ZVJvdXRlcih7XHJcbiAgICAgIHJvdXRlc0ZvbGRlcjogJ3NyYy9wYWdlcycsXHJcbiAgICAgIGR0czogJ3NyYy90eXBlZC1yb3V0ZXIuZC50cycsXHJcbiAgICAgIGhpc3Rvcnk6ICdjcmVhdGVXZWJIYXNoSGlzdG9yeScsXHJcbiAgICAgIGhpc3RvcnlPcHRpb25zOiB7XHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICAgIHZ1ZSgpLFxyXG4gICAgVnVlRGV2VG9vbHMoKVxyXG4gIF0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBleGNsdWRlOiBbJ3BkZmpzLWRpc3QvYnVpbGQvcGRmLndvcmtlci5tanMnXVxyXG4gIH0sXHJcbiAgY3NzOiB7XHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBhcGk6IFwibW9kZXJuLWNvbXBpbGVyXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1AsU0FBUyxvQkFBb0I7QUFDalIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8saUJBQWlCO0FBRXhCLE9BQU8sZUFBZTtBQUN0QixJQUFNLFNBQVMsUUFBUSxJQUFJLGFBQWE7QUFDeEMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsVUFBVTtBQUFBLE1BQ1IsY0FBYztBQUFBLE1BQ2QsS0FBSztBQUFBLE1BQ0wsU0FBUztBQUFBLE1BQ1QsZ0JBQWdCLENBQ2hCO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsSUFDSixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGlDQUFpQztBQUFBLEVBQzdDO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
