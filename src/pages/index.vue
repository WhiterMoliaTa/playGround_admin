<template>
  <v-card class="pa-2">
    <v-card-title class="d-flex align-center">
      <span class="text-h5">案件管理系統</span>
      <v-spacer />
      <v-btn color="primary" @click="newCaseDialog = true">新增案件</v-btn>
    </v-card-title>

    <v-card-text>
      <div class="d-flex justify-end mt-4">
        <v-btn color="info" @click="expandAll" class="me-2">展開所有案件</v-btn>
        <v-btn color="info" @click="collapseAll" class="me-4">收起所有案件</v-btn>
      </div>
      <div style="overflow-x: auto;">
        <v-data-table :headers="headers" :items="cases" item-value="docId" v-model:expanded="expanded"
          class="elevation-1 pa-4">
          <template #headers="{ columns }">
            <tr>
              <th v-for="column in columns" :key="column.key" class="zebra-header"
                :style="column.key === 'actions' || column.key === 'status' ? 'text-align: center;' : ''">
                {{ column.title }}
              </th>
            </tr>
          </template>


          <template #item="{ item, index, columns }">
            <tr :class="getRowClass(index)">
              <td v-for="(column, idx) in columns" :key="column.key" style="position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>
                    <template v-if="column.key === 'caseName'">
                      <TruncateText :text="item.caseName" :maxLength="10" />
                    </template>
                    <template v-else-if="column.key === 'diagnosis'">
                      <TruncateText :text="item.diagnosis" :maxLength="10" />
                    </template>
                    <template v-else-if="column.key === 'dispatchHospitalName'">
                      {{ item.dispatchHospital.name }}
                    </template>
                    <template v-else-if="column.key === 'status'">
                      <v-chip :color="itemStatusColors(item)" small>
                        {{ itemStatusText(item) }}
                      </v-chip>
                    </template>
                    <template v-else-if="column.key === 'dispatchDate'">
                      {{ formatToROC(item.dispatchDate) }}
                    </template>
                    <template v-else-if="column.key === 'actions'">
                      <v-btn variant="text" size="small" icon @click="viewItem(item)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                      <v-btn variant="text" size="small" icon>
                        <v-icon color="warning">mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn variant="text" size="small" icon>
                        <v-icon color="error">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <template v-else>
                      {{ item[column.key] }}
                    </template>
                  </span>
                  <v-icon v-if="idx === columns.length - 1" @click.stop="toggleExpand(item)"
                    style="cursor: pointer; margin-left: 8px;">
                    {{ expanded.includes(item.docId) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </div>
              </td>
            </tr>
          </template>

          <template #expanded-row="{ item, index, columns }">
            <tr :class="getExpandedRowClass(index)">
              <td :colspan="columns.length">
                <div style="width: 85%;" class="justify-center mx-auto">
                  <StepProgress :caseItem="item" />
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>

      </div>
    </v-card-text>
  </v-card>
  <NewCaseDialog :model-value="newCaseDialog" @update:model-value="newCaseDialog = $event" :model="newCase"
    @save="saveCase" />
  <v-dialog v-model="viewCaseModel">
    <v-card>
      <v-card-title class="text-h5">
        <v-col class="d-flex align-center">
          <span>案件詳情</span>
          <v-spacer />
          <v-icon icon="mdi-close" @click="viewCaseModel = false" style="cursor: pointer;" color="error"/>
        </v-col>
      </v-card-title>

      <showCaseCard :caseData="viewCaseData" />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import StepProgress from '../components/StepProgress.vue'
import TruncateText from '../components/TruncateText.vue'
import NewCaseDialog from '../components/NewCaseDialog.vue'
import showCaseCard from '../components/showCaseCard.vue'

const headers = [
  { title: '案件編號', key: 'caseNumber' },
  { title: '案名', key: 'caseName' },
  { title: '姓名', key: 'name' },
  { title: '診斷', key: 'diagnosis' },
  { title: '派案醫院', key: 'dispatchHospitalName' },
  { title: '職安署承辦', key: 'oshaHandler' },
  { title: '中心承辦', key: 'centerHandler' },
  // { title: '派案日期', key: 'dispatchDate' },
  { title: '目前狀態', key: 'status' },
  { title: '操作', key: 'actions' },
]

import { testCases } from '../data/testCase'
const cases = ref(structuredClone(testCases))
const expanded = ref([])

const toggleExpand = (item) => {
  const index = expanded.value.findIndex(i => i === item.docId)
  if (index > -1) {
    expanded.value.splice(index, 1)
  } else {
    expanded.value.push(item.docId)
  }
}

const expandAll = () => {
  expanded.value = cases.value.map(item => item.docId)
}

const collapseAll = () => {
  expanded.value = []
}

const getRowClass = (index) => {
  return index % 2 === 0 ? 'zebra-even' : 'zebra-odd'
}

const getExpandedRowClass = (index) => {
  return index % 2 === 0 ? 'zebra-exEven' : 'zebra-exOdd'
}


const newCaseDialog = ref(false)
const newCase = ref({
  docId: '',
  docDate: '',
  oshaHandler: '',
  receivedDate: '',
  centerHandler: '',
  caseNumber: '',
  caseName: '',
  name: '',
  gender: '',
  age: null,
  diagnosis: '',
  dispatchDate: '',
  dispatchHospital: {
    uuid: null,
    name: '',
    address: '',
    contact: ''
  },
  dispatchDoctor: {
    uuid: null,
    name: '',
    address: '',
    contact: ''
  },
  dispatchLetter: '',
  employer: {
    name: '',
    address: '',
    contact: ''
  },
  laborInspection: {
    uuid: null,
    name: '',
    address: '',
    contact: ''
  },
  remarks: '',
})
function formatToROC(date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d)) return ''
  const year = d.getFullYear() - 1911
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

function saveCase(caseData) {
  console.log('儲存案件', toRaw(caseData))
  // newCase.value = { ...caseData }
  cases.value.push({
    ...caseData,
  })
  newCaseDialog.value = false
}

const itemStatusColors = (item) => {
  if (item.oshaResponseDate) {
    return 'success'
  } else {
    return 'warning'
  }
}
const itemStatusText = (item) => {
  if (item.oshaResponseDate) {
    return '已函覆'
  } else {
    return '處理中'
  }
}
const viewCaseModel = ref(false)
const viewCaseData = ref(null)
const viewItem = (item) => {
  // console.log('查看案件', item)
  viewCaseData.value = item
  viewCaseModel.value = true
}
</script>

<style scoped>
.zebra-header {
  background-color: #aecbeb;
  font-weight: bold;
}

.zebra-even {
  background-color: #e1ecf7;
}

.zebra-odd {
  background-color: #f8f9fb;
}

.zebra-exEven {
  background-color: #e1ecf780;
}

.zebra-exOdd {
  background-color: #f8f9fb80;
}
</style>