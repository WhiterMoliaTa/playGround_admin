import { createApp } from 'vue'
import App from './App.vue'

// Vuetify 3
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VTimePicker } from 'vuetify/labs/VTimePicker'

// 引入 icon
import '@mdi/font/css/materialdesignicons.css'

// unplugin-vue-router 的虛擬模組
// import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { createRouter, createWebHashHistory } from 'vue-router/auto'

import HighchartsVue from 'highcharts-vue'
// ↓ 修改為 hash history
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const isProd = import.meta.env.PROD
const options = {
  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: false
};
// const router = createRouter({
//     history: createWebHistory(isProd ? '/playGround_admin/' : '/'),
//   routes,
// })


const vuetify = createVuetify({
  components: {
    VTimePicker,
    ...components
  },
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'medicalTheme',
    themes: {
      medicalTheme: {
        dark: false,
        colors: {
          primary: '#0D47A1',
          secondary: '#00796B',
          info: '#0288D1',
          success: '#2E7D32',
          warning: '#FBC02D',
          error: '#D32F2F',
          background: '#FAFAFA',
          surface: '#FFFFFF',
          onPrimary: '#FFFFFF',
          onSecondary: '#FFFFFF'
        }
      }
    }
  }
})

createApp(App)
  .use(router)    // ✅ 加上這行
  .use(vuetify)
  .use(Toast, options)
  .use(HighchartsVue)
  .mount('#app')
