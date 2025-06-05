import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

import VueRouter from 'unplugin-vue-router/vite'
const isProd = process.env.NODE_ENV === 'production'
export default defineConfig({
  base: isProd ? '/playGround_admin/' : '/',
  plugins: [
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
      history: 'createWebHashHistory',
      historyOptions: {
        base: isProd ? '/playGround_admin/' : '/'
      },
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
        api: "modern-compiler"
      }
    }
  },
})
