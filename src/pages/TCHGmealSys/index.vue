<template>
  <v-container class="pa-0 ma-0">
    <!-- App Header -->
    <v-app-bar color="#6A36DE" flat density="compact">
      <v-app-bar-nav-icon color="white" variant="text"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-white">供膳管理系統</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" color="white" class="text-caption">
            <v-avatar size="24" class="mr-2">
              <v-img src="/avatar-placeholder.png" alt="User avatar"></v-img>
            </v-avatar>
            午班營養師 <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item value="profile">個人資料</v-list-item>
          <v-list-item value="logout">登出</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-3">
      <v-container class="">
        <!-- Page Header -->
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h5 font-weight-bold">任務看板</h1>
          <div class="text-caption text-grey">首頁 / 任務看板</div>
        </div>

        <!-- Time and Location Bar -->
        <v-card class="mb-4" variant="flat">
          <v-card-text class="d-flex justify-space-between pa-2">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-clock-outline</v-icon>
              <span>{{ currentTime }}</span>
            </div>
            <v-select
              v-model="selectedLocation"
              :items="locations"
              density="compact"
              variant="outlined"
              hide-details
              class="max-width-150"
            ></v-select>
          </v-card-text>
        </v-card>

        <!-- Task Cards Carousel -->
        <v-carousel
          hide-delimiter-background
          :show-arrows="false"
          height="420"
          class="rounded-lg"
        >
          <v-carousel-item
            v-for="(task, index) in tasks"
            :key="task.id"
            class="d-flex align-center justify-center"
          >
            <v-card
              class="mx-auto"
              max-width="400"
              min-height="300"
              outlined
              elevation="2"
            >
              <v-card-title class="font-weight-bold">{{ task.title }}</v-card-title>
              <v-card-subtitle class="text-caption text-grey">
                {{ task.dueDate }}
              </v-card-subtitle>
              <v-card-text class="py-2">
                <div class="text-body-2">{{ task.description }}</div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="#6A36DE"
                  text
                  class="font-weight-bold"
                  @click="openTaskDetail(task.id)"
                >
                  查看詳情
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-carousel-item>
        </v-carousel>
      </v-container>
    </v-main>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const currentTime = ref(new Date().toLocaleString());
const selectedLocation = ref(null);
const locations = ref(['全部', '台北', '高雄', '台中']);
const tasks = ref([
  {
    id: 1,
    title: '任務一',
    dueDate: '2023-10-10',
    description: '這是一個測試任務',
  },
  {
    id: 2,
    title: '任務二',
    dueDate: '2023-10-12',
    description: '這是另一個測試任務',
  },
]);

function openTaskDetail(taskId) {
  // 實作打開任務詳情的邏輯
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>