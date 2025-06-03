<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>PlayGround</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer">
      <v-list>
        <v-list-item v-for="item in menuItems" :key="item.to" :to="item.to" router>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
const menuItems = [
  { text: '首頁', to: '/' },
  { text: '照片OCR', to: '/photo-ocr' },
  { text: '照片PDF-OCR', to: '/photo-pdf-ocr' },
  { text: '文字PDF-Reader', to: '/text-pdf-reader' },
  { text: '供膳管理日誌', to: '/meal-log' }
]
</script>
