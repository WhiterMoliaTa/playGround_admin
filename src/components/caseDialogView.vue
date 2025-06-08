<template>
  <v-container fluid>
    <v-expansion-panels multiple v-model="expandedPanels" variant="accordion">

      <!-- 基本資料 -->
      <v-expansion-panel value="1">
        <v-expansion-panel-title class="section-title">
          <v-icon class="icon" color="primary" size="24">mdi-folder</v-icon>
          <div>
            <div class="title-text">基本資料</div>
            <div class="sub-info">
              {{ caseData.caseNumber }} - {{ caseData.name }}
            </div>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row dense>
            <v-col cols="12" md="4"><strong>來文號：</strong> {{ caseData.docId }}</v-col>
            <v-col cols="12" md="4"><strong>來文日期：</strong> {{ formatDate(caseData.docDate) }}</v-col>
            <v-col cols="12" md="4"><strong>收文日期：</strong> {{ formatDate(caseData.receivedDate) }}</v-col>
            <v-col cols="12" md="4"><strong>案件編號：</strong> {{ caseData.caseNumber }}</v-col>
            <v-col cols="12" md="8"><strong>案名：</strong> {{ caseData.caseName }}</v-col>
            <v-col cols="12" md="4"><strong>姓名：</strong> {{ caseData.name }}</v-col>
            <v-col cols="12" md="4"><strong>年齡：</strong> {{ caseData.age }}</v-col>
            <v-col cols="12" md="4"><strong>性別：</strong> {{ caseData.gender }}</v-col>
            <v-col cols="12"><strong>備註：</strong> {{ caseData.remarks }}</v-col>
            <v-col cols="12"><strong>診斷結果：</strong> {{ caseData.diagnosis }}</v-col>
            <v-col cols="12"><strong>中心承辦人：</strong> {{ caseData.centerHandler }}</v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>


      <!-- 派案資料 -->
      <v-expansion-panel value="2" >
        <v-expansion-panel-title class="section-title">
          <v-icon class="icon" color="primary" size="24">mdi-hospital-building</v-icon>
          <div>
            <div class="title-text">派案資料</div>
            <div class="sub-info" v-if="caseData.dispatchHospital && caseData.dispatchDoctor">
              {{ caseData.dispatchHospital.name }} / {{ caseData.dispatchDoctor.name }}
            </div>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row dense>
            <v-col cols="12" md="12"><strong>派案日期：</strong> {{ formatDate(caseData.dispatchDate) }}</v-col>
            <v-col cols="12" md="4"><strong>派案醫院：</strong> {{ caseData.dispatchHospital.name }}</v-col>
            <v-col cols="12" md="4"><strong>醫院電話：</strong> {{ caseData.dispatchHospital.contact }}</v-col>
            <v-col cols="12" md="4"><strong>醫院地址：</strong> {{ caseData.dispatchHospital.address }}</v-col>
            <v-col cols="12" md="4"><strong>派案醫生：</strong> {{ caseData.dispatchDoctor.name }}</v-col>
            <v-col cols="12" md="4"><strong>醫生電話：</strong> {{ caseData.dispatchDoctor.contact }}</v-col>
            <v-col cols="12" md="4"><strong>專科：</strong> {{ caseData.dispatchDoctor.specialty }}</v-col>
            <v-col cols="12" class="dispatch-letter" v-html="caseData.dispatchLetter"></v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>


      <!-- 雇主資料 -->
      <v-expansion-panel value="3">
        <v-expansion-panel-title class="section-title">
          <v-icon class="icon" color="primary" size="24">mdi-domain</v-icon>
          <div>
            <div class="title-text">雇主資料</div>
            <div class="sub-info" v-if="caseData.employer">
              {{ caseData.employer.name }}
            </div>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row dense>
            <v-col cols="12" md="12"><strong>雇主名稱：</strong> {{ caseData.employer.name }}</v-col>
            <v-col cols="12" md="6"><strong>聯絡電話：</strong> {{ caseData.employer.contact }}</v-col>
            <v-col cols="12" md="6"><strong>地址：</strong> {{ caseData.employer.address }}</v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>


      <!-- 勞檢資料 -->
      <v-expansion-panel value="4">
        <v-expansion-panel-title class="section-title">
          <v-icon class="icon" color="primary" size="24">mdi-briefcase-check</v-icon>
          <div>
            <div class="title-text">勞檢資料</div>
            <div class="sub-info" v-if="caseData.laborInspection">
              {{ caseData.laborInspection.name }}
            </div>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row dense>
            <v-col cols="12" md="12"><strong>職安署承辦人：</strong> {{ caseData.oshaHandler }}</v-col>
            <v-col cols="12" md="4"><strong>勞檢單位：</strong> {{ caseData.laborInspection.name }}</v-col>
            <v-col cols="12" md="4"><strong>聯絡電話：</strong> {{ caseData.laborInspection.contact }}</v-col>
            <v-col cols="12" md="4"><strong>單位地址：</strong> {{ caseData.laborInspection.address }}</v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

    </v-expansion-panels>
  </v-container>
</template>

<script setup>
import { cloneDeep } from 'lodash'
import { ref } from 'vue'

const props = defineProps({
  caseData: {
    type: Object,
    required: true,
  },
  defaultExpanded: {
    type: Array,
    default: () => ['1','2','3','4']
  }
})

// 預設「基本資料」展開
const expandedPanels = ref(props.defaultExpanded)
function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d)) return ''
  const year = d.getFullYear() - 1911
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}
</script>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: default;
  user-select: none;
  font-weight: 600;
  font-size: 1.3rem;
  color: #3f51b5;
  transition: color 0.3s ease;
}

.section-title:hover {
  color: #283593;
}

.section-title>div {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.title-text {
  font-weight: 700;
}

.sub-info {
  font-weight: 400;
  font-size: 0.85rem;
  color: #666;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.icon {
  transition: transform 0.3s ease;
}

.section-title:hover .icon {
  transform: translateX(5px);
}

.dispatch-letter {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  white-space: pre-wrap;
  font-family: 'Noto Sans TC', sans-serif;
  color: #555;
  box-shadow: inset 0 0 5px #ccc;
}
</style>
