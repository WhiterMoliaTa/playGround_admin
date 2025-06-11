<template>
  <div class="tchg-meal-sys">
    <v-app-bar class="app-bar" v-resize="onResize">
      <v-app-bar-nav-icon color="white" variant="text"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-white app-bar-title">供膳管理系統</v-app-bar-title>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" color="white" class="text-caption">
            <v-avatar size="24" class="mr-2">
              <v-img src="https://images.icon-icons.com/2265/PNG/512/doctor_avatar_medical_icon_140443.png"
                alt="User avatar"></v-img>
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
    <div class="bg-grey-lighten-3 d-flex flex-column">
      <!-- Page Header -->
      <div class="d-flex align-center mt-2 mx-4 pa-1">
        <h1 class="text-h5 font-weight-bold">任務看板</h1>
        <v-spacer></v-spacer>
        <div class="text-caption text-grey">首頁 / 任務看板</div>
      </div>
      <v-divider color="warning" class="my-1"></v-divider>
      <v-row class="current-info-bar mb-4 mx-1 justify-space-around">
        <v-col class="pa-2" cols="7">
          <span> <v-icon class="mr-2">mdi-clock-outline</v-icon>{{ currentDateTime }}</span>
        </v-col>
        <v-col class="pa-2" cols="4">
          <v-select v-model="branch" class="branch-selection" :items="branches" dense variant="solo-filled"
            hide-details />
        </v-col>
      </v-row>
      <!-- <v-carousel-item
                v-for="(task, i) in tasks"
                :key="i"
              >
                <v-container class="d-flex justify-center align-center ">
                  <v-card width="400" outlined class="d-flex flex-column align-center">
                    <v-card-title class="font-weight-bold">{{ task.title }}</v-card-title>
                    <v-divider color="warning" :thickness="7"></v-divider>
                    <v-card-text class="py-2">
                      <div class="text-body-2">{{ task.description }}</div>
                    </v-card-text>
                    <v-divider color="warning" :thickness="7"></v-divider>
                      <v-btn
                        color="#6A36DE"
                        text
                        class="font-weight-bold"
                        @click="openTaskDetail(task.id)"
                      >
                        立即開始
                      </v-btn>
                  </v-card>
                </v-container>
              </v-carousel-item> -->
      <!-- </v-carousel> -->
      <Carousel v-bind="carouselConfig" :items-to-show="slidesToShow" :autoplay="2000">
        <Slide>
          <div class="d-flex justify-center align-center">
            <v-card outlined class="d-flex flex-column align-center carousel-card gradient-purple" rounded>
              <div class="icon-background mt-2">
                <v-icon size="30" class="text-white">
                  mdi-calendar-month-outline
                </v-icon>
              </div>
              <v-card-title class="task-name">供膳管理日誌</v-card-title>
              <v-card-text class="py-2">
                <ul class="task-list">
                  <li><v-icon class="yellow-dot">mdi-check-circle</v-icon>2/8 廚點作業</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/1 生鮮食材驗收及登錄</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/6 清潔衛具設備衛生</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/5 營日誌各事項作業</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/5 烹煮督導作業</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/4 午餐督導作業</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/5 補餐、午餐後清潔作業</li>
                </ul>
              </v-card-text>
              <v-btn variant="text" class="font-weight-bold mb-3 start-button" @click="openTaskDetail('meal-log')">
                立即開始
              </v-btn>
            </v-card>
          </div>
        </Slide>
        <Slide>
          <div class="d-flex justify-center align-center">
            <v-card outlined class="d-flex flex-column align-center carousel-card gradient-pink">
              <div class="icon-background mt-2">
                <v-icon size="30" class="text-white">
                  mdi-calendar-month-outline
                </v-icon>
              </div>
              <v-card-title class="task-name">每日衛生檢查紀錄</v-card-title>
              <v-divider :thickness="7"></v-divider>
              <v-card-text class="py-2">
                <ul class="task-list">
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/5 廚房衛生檢查</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/3 冰箱溫度確認</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/4 料理區域清潔檢查</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/2 食材保存區確認</li>
                </ul>
              </v-card-text>
              <v-divider :thickness="7"></v-divider>
              <v-btn variant="text" class="font-weight-bold mb-3 start-button" @click="openTaskDetail('meal-log')">
                立即開始
              </v-btn>
            </v-card>
          </div>
        </Slide>
        <Slide>
          <div class="d-flex justify-center align-center">
            <v-card outlined class="d-flex flex-column align-center carousel-card gradient-yellow">
              <div class="icon-background mt-2">
                <v-icon size="30" class="text-white">
                  mdi-calendar-month-outline
                </v-icon>
              </div>
              <v-card-title class="task-name">食材驗收查驗檢查紀錄</v-card-title>
              <v-divider :thickness="7"></v-divider>
              <v-card-text class="py-2">
                <ul class="task-list">
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/4 蔬果類驗收</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/5 肉品類驗收</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/3 乾貨類驗收</li>
                  <li><v-icon class="white-dot">mdi-check-circle</v-icon> 0/2 調味品類驗收</li>
                </ul>
              </v-card-text>
              <v-divider :thickness="7"></v-divider>
              <v-btn variant="text" class="font-weight-bold mb-3 start-button" @click="openTaskDetail('meal-log')">
                立即開始
              </v-btn>
            </v-card>
          </div>
        </Slide>
        <template #addons>
        </template>
      </Carousel>
      <v-card class="my-4 ml-4" variant="flat">
        <v-card-text height="100%">
          <div class="d-flex justify-space-between mb-1">
            <div class="text-subtitle-1 font-weight-bold">今日工作表</div>
          </div>
          <div class="text-h5 font-weight-bold d-flex flex-row align-end">
            {{ totalCompletion }}<span class="text-h6 text-grey-darken-1">%</span>
            <div class="text-caption text-grey-darken-1 mb-1">/ 任務完成度</div>
          </div>
          <!-- Timeline -->
          <v-sheet class="timeline-container mt-6">
            <!-- Time markers -->
            <div class="timeline-header" :style="{ width: `${timelineWidth}px` }">
              <span v-for="(time, index) in timeMarkers" :key="index" class="time-marker"
                :style="{ left: `${getTimePosition(time)}px` }">
                {{ time }}
              </span>
            </div>
            <!-- Timeline content with task blocks -->
            <div class="timeline-content">
              <!-- Task blocks -->
              <div v-for="(task, index) in taskBlocks" :key="`task-${index}`" class="task-block" :style="{
                width: `${task.width}px`,
                left: `${task.left}px`,
                top: `${task.top}px`
              }">
                <div class="task-completion-bar"
                  :style="{ 'background-color': `${taskColor[index]}`, width: `${getCompletionBarWidth(task)}%` }">
                </div>
                <div class="task-completion-task">{{ task.completion }}/{{ task.needToComplete }}</div>
              </div>
              <!-- Current time indicator -->
              <div class="current-time-indicator" :style="{ left: `${currentTimePosition}px` }">
                <div class="time-bubble">{{ formattedCurrentTime }}</div>
                <div class="time-line" :style="{ height: `${requreidHeight}px` }"></div>
              </div>
            </div>
            <v-divider class="total-timeline mb-3" :style="{
              '--timeline-total-width': `${timelineWidth}px`,
              '--requreid-height': `${requreidHeight / 2 - 26}px`,
            }"></v-divider>
            <div class="task-block"
              :style="{ width: `700px`, left: `30px`, transform: `translateY(${requreidHeight / 2 - 26}px)` }">
              <div class="task-completion-bar"></div>
              <div class="task-completion-task">0/15</div>
            </div>
            <div class="task-block"
              :style="{ width: `930px`, left: `500px`, transform: `translateY(${requreidHeight / 2}px)` }">
              <div class="task-completion-bar"></div>
              <div class="task-completion-task">0/21</div>
            </div>
          </v-sheet>
        </v-card-text>
      </v-card>
      <v-btn rounded-sm class="mb-2 mx-4 need-to-sign-btn" display="d-flex justify-space-around align-center">
        <template v-slot:prepend>
          <div>
            <v-icon size="30" style="transform: scaleX(-1);">mdi-gavel</v-icon>
            待簽核
          </div>
        </template>
        <template v-slot:append>
          <div class="sign-text-caption-background">
            <span>5</span>
          </div>
        </template>
      </v-btn>
      <v-btn rounded-sm class="mb-2 mx-4 signed-btn">
        <template v-slot:prepend>
          <div>
            <v-icon size="30" style="transform: scaleX(-1); rotate: -45deg;">mdi-gavel</v-icon>
            已簽核
          </div>
        </template>
        <template v-slot:append>
          <div class="sign-text-caption-background">
            <span>21</span>
          </div>
        </template>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'

import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

const windowSize = ref({ x: 0, y: 0, });

onMounted(() => {
  onResize();
})

const currentTime = ref(new Date("2025-06-09T08:30:00"));
const formattedCurrentTime = computed(() => {
  const hours = currentTime.value.getHours().toString().padStart(2, '0');
  const minutes = currentTime.value.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
});

// Position of the current time indicator
const currentTimePosition = computed(() => {
  const hours = currentTime.value.getHours();
  const minutes = currentTime.value.getMinutes();
  const hoursDecimal = hours + minutes / 60;
  return (hoursDecimal - START_HOUR) * PIXELS_PER_HOUR;
});

const slidesToShow = ref(1.3);
const carouselConfig = {
  height: 400,
  wrapAround: true,
}

const branch = ref('院本部');
const branches = ref(['院本部', '中興', '仁愛', '其他分院']);
const timeMarkers = ref([
  '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'
]);
const taskColor = ['#f5945c', '#fec76f', '#465952', '#75ba75', '#71a3c1', '#FFBE0B', '#725E54'];
// Total completion percentage
const totalCompletion = ref(2);
// Calculate time to pixels
const PIXELS_PER_HOUR = 200; // How many pixels per hour
const START_HOUR = 7; // Our timeline starts at 7:00
// Current time 
const currentDateTime = ref(new Date().toLocaleString());

function getTimePosition(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const timeDecimal = hours + minutes / 60;
  return (timeDecimal - START_HOUR) * PIXELS_PER_HOUR;
}

const tasks = ref([
  {
    id: 1,
    title: '晨點作業',
    startTime: '07:00',
    endTime: '07:40',
    completion: 2,
    needToComplete: 8,
    status: 'active',
    row: 1
  },
  {
    id: 2,
    title: '生鮮食材驗收及登錄',
    startTime: '07:30',
    endTime: '08:00',
    completion: 0,
    needToComplete: 1,
    status: 'pending',
    row: 2
  },
  {
    id: 3,
    title: '早餐配膳及回收作業',
    startTime: '08:40',
    endTime: '09:30',
    completion: 0,
    needToComplete: 6,
    status: 'pending',
    row: 3
  },
  {
    id: 4,
    title: '人數食材確認',
    startTime: '08:00',
    endTime: '10:00',
    completion: 0,
    needToComplete: 5,
    status: 'pending',
    row: 4
  },
  {
    id: 5,
    title: '午餐製作作業',
    startTime: '10:00',
    endTime: '10:50',
    completion: 0,
    needToComplete: 5,
    status: 'pending',
    row: 5
  },
  {
    id: 6,
    title: '午餐配膳作業',
    startTime: '10:50',
    endTime: '12:00',
    completion: 0,
    needToComplete: 4,
    status: 'pending',
    row: 6
  },
  {
    id: 7,
    title: '午餐回收清潔作業',
    startTime: '12:00',
    endTime: '14:00',
    completion: 0,
    needToComplete: 5,
    status: 'pending',
    row: 7
  }
]);

const router = useRouter();

function openTaskDetail(taskName) {
  router.push(`/${taskName}`)
}

function onResize() {
  windowSize.value = { x: window.innerWidth, y: window.innerHeight };
  itemsToShowByWindowSize()
}

function itemsToShowByWindowSize() {
  if (windowSize.value.x <= 320) {
    slidesToShow.value = 1.4;
  } else if (windowSize.value.x <= 800) {
    slidesToShow.value = 1.7;
  } else if (windowSize.value.x <= 1000) {
    slidesToShow.value = 2.0;
  } else {
    slidesToShow.value = 2.5;
  }
}

const requreidHeight = ref(0);
// Calculate task block positions and dimensions
const taskBlocks = computed(() => {
  return tasks.value.map(task => {
    // Parse times and calculate positions
    const [startHour, startMin] = task.startTime.split(':').map(Number);
    const [endHour, endMin] = task.endTime.split(':').map(Number);

    const startDecimal = startHour + startMin / 60;
    const endDecimal = endHour + endMin / 60;

    // Calculate left position and width in pixels
    const left = (startDecimal - START_HOUR) * PIXELS_PER_HOUR;
    const width = (endDecimal - startDecimal) * PIXELS_PER_HOUR;

    // Vertical positioning - 29px per row, with some margin
    const top = (task.row - 1) * 29;

    requreidHeight.value = top;

    return {
      ...task,
      left,
      width,
      top,
    };
  });
});

const timelineWidth = computed(() => {
  const lastTime = timeMarkers.value[timeMarkers.value.length - 1];
  const [lastHour, lastMin] = lastTime.split(':').map(Number);
  const lastTimeDecimal = lastHour + lastMin / 60;
  return (lastTimeDecimal - START_HOUR) * PIXELS_PER_HOUR;
});

function getCompletionBarWidth(task) {
  // Parse the task start time
  const [startHour, startMin] = task.startTime.split(':').map(Number);
  const startTimeDecimal = startHour + startMin / 60;

  // Get current time as decimal
  const currentHour = currentTime.value.getHours();
  const currentMinute = currentTime.value.getMinutes();
  const currentTimeDecimal = currentHour + currentMinute / 60;

  // Calculate normal completion percentage
  const normalWidth = (task.completion / task.needToComplete) * 100;

  // If current time is past start time and completion is 0%, return at least 5%
  if (currentTimeDecimal >= startTimeDecimal && normalWidth === 0) {
    return 5; // Minimum 5% width
  }

  // Otherwise return the normal calculation
  return normalWidth;
}

// // Update current time every minute
// let timeInterval;
// onMounted(() => {
//   timeInterval = setInterval(() => {
//     currentTime.value = new Date();
//   }, 60000);
// });

// onUnmounted(() => {
//   clearInterval(timeInterval);
// });
</script>

<style scoped>
@import url("../../css/TCHG_mealSys.css");
@import url("../../css/TCHG_mealSys_MobileS.css") (max-width: 320px) and (orientation: portrait);
@import url("../../css/TCHG_mealSys_16_9ratio.css") (min-aspect-ratio: 16/9) and (orientation: landscape);
</style>