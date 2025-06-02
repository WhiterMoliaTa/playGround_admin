import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

import VueRouter from 'unplugin-vue-router/vite'
export default defineConfig({
  plugins: [
   VueRouter({
      routesFolder: 'src/pages', // 預設是 src/pages，也可以自訂
      dts: 'src/typed-router.d.ts' // 自動產生型別
    }),
    vue(),
    VueDevTools()
  ],
  optimizeDeps: {
    exclude: ['pdfjs-dist/build/pdf.worker.mjs']
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler" // or 'modern'
      }
    }
  },
})

