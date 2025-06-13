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
      <div class="d-flex align-center mt-2 mx-4 pa-1">
        <h1 class="text-h5 font-weight-bold">任務看板</h1>
        <v-spacer></v-spacer>
        <span v-for="(breadcrumb, index) in breadcrumbs" :key="index">
          <router-link :to="breadcrumb.path">{{ breadcrumb.label }}</router-link>
          <span v-if="index < breadcrumbs.length - 1"> / </span>
        </span>
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
      <Carousel v-bind="carouselConfig" :items-to-show="slidesToShow" :autoplay="2000">
        <Slide v-for="(slide, index) in slides" :key="index">
          <div class="d-flex justify-center align-center">
            <v-card outlined class="d-flex flex-column align-center carousel-card" :class="slide.gradient" rounded-10>
              <div class="icon-background mt-2">
                <v-icon size="30" class="text-white">
                  {{ slide.icon }}
                </v-icon>
              </div>
              <v-card-title class="task-name">{{ slide.title }}</v-card-title>
              <v-card-text class="py-2">
                <ul class="task-list">
                  <li v-for="(task, taskIndex) in slide.tasks" :key="taskIndex">
                    <v-icon :class="task.status">mdi-check-circle</v-icon>
                    {{ task.completed }}/{{ task.total }} {{ task.label }}
                  </li>
                </ul>
              </v-card-text>

              <v-btn variant="text" :color="slideDone[`${slide.id}`] ? 'yellow' : 'black'"
                class="font-weight-bold mb-3 start-button" @click="openTaskDetail(slide.id)">
                {{ slideDone[`${slide.id}`] ? '今日已完成' : '立即開始' }}
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
            {{ totalCompletionPercentage }}<span class="text-h6 text-grey-darken-1">%</span>
            <div class="text-caption text-grey-darken-1 mb-1">/ 任務完成度</div>
          </div>
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
              <!-- TODO currentTimePosition目前是寫死 -->
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
              <div class="task-completion-bar"
                :style="ifSet ? { 'background-color': `${taskColor[5]}`, width: `60%` } : ``"></div>
              <div class="task-completion-task">{{ ifSet ? '9/15' : '0/15' }}</div>
            </div>
            <div class="task-block"
              :style="{ width: `930px`, left: `500px`, transform: `translateY(${requreidHeight / 2}px)` }">
              <div class="task-completion-bar"
                :style="ifSet ? { 'background-color': `${taskColor[6]}`, width: `80%` } : ``"></div>
              <div class="task-completion-task">{{ ifSet ? '18/21' : '0/21' }}</div>
            </div>
          </v-sheet>
        </v-card-text>
      </v-card>
      <p class="ml-4 my-2">簽核表單</p>
      <v-btn rounded-sm variant="flat" class="mb-2 mx-4 need-to-sign-btn"
        display="d-flex justify-space-around align-center">
        <template v-slot:prepend>
          <div>
            <v-icon size="30" style="transform: scaleX(-1);">mdi-gavel</v-icon>
            待簽核
          </div>
        </template>
        <template v-slot:append>
          <div class="sign-text-caption-background">
            <span>{{ ifSet ? 0 : 5 }}</span>
          </div>
        </template>
      </v-btn>
      <v-btn rounded-sm variant="flat" class="mb-2 mx-4 signed-btn">
        <template v-slot:prepend>
          <div>
            <v-icon size="30" style="transform: scaleX(-1); rotate: -45deg;">mdi-gavel</v-icon>
            已簽核
          </div>
        </template>
        <template v-slot:append>
          <div class="sign-text-caption-background">
            <span>{{ ifSet ? 26 : 21 }}</span>
          </div>
        </template>
      </v-btn>
    </div>
    <div class="copyright">
      Copyright © 臺北市立聯合醫院所有
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { testSlides } from '../../data/testSlides';
import { useRouter } from 'vue-router'

import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

import { testMorningTCHGJobs } from '../../data/testTCHGMealJobs';

const windowSize = ref({ x: 0, y: 0, });
const slides = ref(testSlides);

const jobs = ref(testMorningTCHGJobs);

const pixel_per_hour = ref(200);
const START_HOUR = 7; // TODO 改成api呼叫去抓或是jobs抓第一筆時間

const currentDateTime = ref(new Date().toLocaleString());

//TODO 改成api呼叫
const branch = ref('院本部');
//TODO 改成api呼叫
const branches = ref(['院本部', '中興', '仁愛', '其他分院']);
//TODO 改成api呼叫
const timeMarkers = ref([
  '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'
]);
//TODO 改成api呼叫
const taskColor = ['#f5945c', '#fec76f', '#465952', '#75ba75', '#71a3c1', '#FFBE0B', '#725E54'];
//TODO 改成api呼叫
const totalCompletionPercentage = ref(0);
const breadcrumbs = ref([
  {label: '首頁', path: '/'},
  {label: '任務看板', path: '/TCHGmealSys'}
])

const slideDone = ref({});

const tasks = ref([]);

const slidesToShow = ref(1.3);
const carouselConfig = {
  height: 400,
  wrapAround: true,
}

const router = useRouter();

const ifSet = ref(false);

onMounted(() => {
  onResize();
  fetchJobsAndUpdateTasks();
  updateTotalCompletion();
  //TODO 讓currentTime每分鐘更新一次


  //   timeInterval = setInterval(() => {
  //     currentTime.value = new Date();
  //   }, 60000);
})

// onUnmounted(() => {
//   clearInterval(timeInterval);
// });

const currentTimePosition = computed(() => {
  const hours = currentTime.value.getHours();
  const minutes = currentTime.value.getMinutes();
  const hoursDecimal = hours + minutes / 60;
  return (hoursDecimal - START_HOUR) * pixel_per_hour.value;
});

const currentTime = ref(new Date("2025-06-11T08:30:00"));
const formattedCurrentTime = computed(() => {
  const hours = currentTime.value.getHours().toString().padStart(2, '0');
  const minutes = currentTime.value.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
});

const requreidHeight = ref(0);
const taskBlocks = computed(() => {
  return tasks.value.map(task => {
    const [startHour, startMin] = task.startTime.split(':').map(Number);
    const [endHour, endMin] = task.endTime.split(':').map(Number);

    const startDecimal = startHour + startMin / 60;
    const endDecimal = endHour + endMin / 60;

    const left = (startDecimal - START_HOUR) * pixel_per_hour.value;
    const width = (endDecimal - startDecimal) * pixel_per_hour.value;

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

  return (lastTimeDecimal - START_HOUR) * pixel_per_hour.value;
});

function getTimePosition(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const timeDecimal = hours + minutes / 60;
  return (timeDecimal - START_HOUR) * pixel_per_hour.value;
}

function getCompletionBarWidth(task) {
  const [startHour, startMin] = task.startTime.split(':').map(Number);
  const startTimeDecimal = startHour + startMin / 60;

  const currentHour = currentTime.value.getHours();
  const currentMinute = currentTime.value.getMinutes();
  const currentTimeDecimal = currentHour + currentMinute / 60;

  const normalWidth = (task.completion / task.needToComplete) * 100;

  if (currentTimeDecimal >= startTimeDecimal && normalWidth === 0) {
    return 5; // 如果當前時間在任務開始時間之後且任務尚未完成，則返回5%
  }
  
  return normalWidth;
}

function jobsToTask(jobsData) {
  let updatedTask = [];
  let idAndRow = 1;

  jobsData.forEach(job => {
    let checkedCount = job.items.filter(item => item.checked).length;
    let totalCount = job.items.length;
    let startTime = job.time.split('-')[0];
    let endTime = job.time.split('-')[1];

    updatedTask.push({
      id: idAndRow,
      title: job.title,
      startTime: startTime,
      endTime: endTime,
      completion: checkedCount,
      needToComplete: totalCount,
      row: idAndRow,
    });
    idAndRow++;
  });

  return updatedTask;
}

function fetchJobsAndUpdateTasks() {
  const jobsData = sessionStorage.getItem("mealJobs");

  if (jobsData) {
    const parsedJobs = JSON.parse(jobsData);
    tasks.value = jobsToTask(parsedJobs);

    //TODO 移除掉 這個是demo用而已所以寫死的currentTime
    currentTime.value = new Date("2025-06-09T13:30:00");
  } else {
    tasks.value = jobsToTask(jobs.value);
  }
}

function updateTotalCompletion() {
  const totalTasks = tasks.value.reduce((sum, task) => sum + task.needToComplete, 0);
  const completedTasks = tasks.value.reduce((sum, task) => sum + task.completion, 0);

  if (totalTasks > 0) {
    totalCompletionPercentage.value = Math.round((completedTasks / totalTasks) * 100);
  } else {
    totalCompletionPercentage.value = 0;
  }
}

function openTaskDetail(taskName) {
  router.push(`/${taskName}`)
}

function onResize() {
  windowSize.value = { x: window.innerWidth, y: window.innerHeight };
  pixel_per_hour.value = 200 + windowSize.value.x / 18; // TODO 改掉毫無邏輯的18
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

</script>

<style scoped>
@import url("../../css/TCHG_mealSys.css");
@import url("../../css/TCHG_mealSys_MobileS.css") (max-width: 320px) and (orientation: portrait);
@import url("../../css/TCHG_mealSys_16_9ratio.css") (min-aspect-ratio: 16/9) and (orientation: landscape);
</style>