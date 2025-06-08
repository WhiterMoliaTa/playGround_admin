<template>
  <v-card class="pa-2">
    <v-card-title class="text-h5">
      <v-col class="d-flex align-center">
        <span>案件管理系統</span>
        <v-spacer />
        <v-btn color="primary" @click="newCaseDialog = true">新增案件</v-btn>
        <v-menu v-model="menu" :close-on-content-click="false" location="bottom" offset="4">
          <template #activator="{ props }">
            <div v-bind="props">
              <v-btn class="ms-2" icon variant="text">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item link style="cursor: pointer;" @click="exportCSV">
              <div style="display: flex; align-items: center;">
                <v-icon class="mr-2" style="line-height: 1;"> mdi-file-delimited</v-icon>
                <span>匯出統計CSV</span>
              </div>
            </v-list-item>

            <v-list-item link style="cursor: pointer;" @click="showCaseView">
              <div style="display: flex; align-items: center;">
                <v-icon class="mr-2" style="line-height: 1;">mdi-chart-bar</v-icon>
                <span>顯示統計視圖</span>
              </div>
            </v-list-item>
          </v-list>

        </v-menu>
      </v-col>
    </v-card-title>

    <v-card-text>
      <!-- <div class="d-flex justify-end mt-4">
        <v-btn color="info" @click="expandAll" class="me-2">展開所有案件</v-btn>
        <v-btn color="info" @click="collapseAll" class="me-4">收起所有案件</v-btn>
      </div> -->
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
                    <!-- <template v-else-if="column.key === 'status'">
                      <v-chip :color="itemStatusColors(item)" small>
                        {{ itemStatusText(item) }}
                      </v-chip>
                    </template> -->
                    <!-- <template v-else-if="column.key === 'dispatchDate'">
                      {{ formatToROC(item.dispatchDate) }}
                    </template> -->
                    <template v-else-if="column.key === 'totalDays'">
                      {{ totalDays(item) }}
                    </template>
                    <template v-else-if="column.key === 'approvedDays'">
                      {{ additionDays(item) }}
                    </template>
                    <template v-else-if="column.key === 'actions'">
                      <v-btn variant="text" size="small" icon @click="viewItem(item)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                      <v-btn variant="text" size="small" icon @click="editItem(item)">
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
                  <v-icon v-if="idx === columns.length - 1" @click.stop="toggleExpand(item)" style="cursor: pointer;">
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
    @save="saveCase" :new-case="true" />
  <v-dialog v-model="viewCaseModel">
    <v-card>
      <v-card-title class="text-h5">
        <v-col class="d-flex align-center">
          <span>案件詳情</span>
          <v-spacer />
          <v-icon icon="mdi-close" @click="viewCaseModel = false" style="cursor: pointer;" color="error" />
        </v-col>
      </v-card-title>
      <showCaseCard :caseData="viewCaseData" />
    </v-card>
  </v-dialog>
  <v-dialog v-model="viewCaseView">
    <v-card style="position: relative;">
      <v-btn icon="mdi-close" @click="viewCaseView = false"
        style="position: absolute; top: 8px; right: 8px; z-index: 9999; cursor: pointer;" color="error"
        variant="text" />
      <highcharts :options="chartOptions" />
    </v-card>
  </v-dialog>



</template>

<script setup>
defineOptions({ name: 'IndexPage' }) // 👈 讓 Devtools 能看到

import { onMounted, ref, toRaw, watch } from 'vue'
import StepProgress from '../components/caseStepPrograss.vue'
import TruncateText from '../components/truncateText.vue'
import NewCaseDialog from '../components/caseDialogEdit.vue'
import showCaseCard from '../components/caseDialogView.vue'

const headers = [
  { title: '案件編號', key: 'caseNumber' },
  { title: '案名', key: 'caseName' },
  { title: '派案醫院', key: 'dispatchHospitalName' },
  // { title: '姓名', key: 'name' },
  { title: '認可天數', key: 'approvedDays' },
  { title: '總天數', key: 'totalDays' },
  { title: '診斷', key: 'diagnosis' },
  // { title: '職安署承辦', key: 'oshaHandler' },
  // { title: '中心承辦', key: 'centerHandler' },
  // { title: '派案日期', key: 'dispatchDate' },
  // { title: '目前狀態', key: 'status' },
  { title: '備註', key: 'type' },
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

const toast = useToast()
function saveCase(caseData) {
  console.log('儲存案件', toRaw(caseData))
  toast.success('案件已儲存，跳轉至新增事件！', {
    position: 'top-right',
    timeout: 2000,
    closeOnClick: true,
    pauseOnHover: true,
  })
  newCaseDialog.value = false

  const rawCase = toRaw(caseData)
  testCases.push({
    ...rawCase,
    uuid: rawCase.uuid || crypto.randomUUID(), // 補上 UUID（僅作單次使用）
  })
  cases.value = structuredClone(testCases)

  router.push(`/edit/${rawCase.uuid}`)

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
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'
import { max } from 'lodash'
const router = useRouter()
const editItem = (item) => {
  router.push(`/edit/${item.uuid}`)

}

// onMounted(() => {
//   // 初始化時可以做一些額外的設定
//   console.log(router.getRoutes().map(r => r.name))
// })
const mainField = [
  'docReceivedDate', 'dispatchEvaluationDate', 'siteVisitDate', 'oshaResponseDate',
]
const secondaryField = [
  'executionDiscussionStartDate', 'executionDiscussionEndDate',
  'expertReviewPreVisitStartDate', 'expertReviewPreVisitEndDate',
  'expertReviewPostVisitStartDate', 'expertReviewPostVisitEndDate',
  'reportDraftStartDate', 'reportDraftEndDate',
  'reportReviewStartDate', 'reportReviewEndDate',
  'docSupplementStartDate', 'docSupplementEndDate',
  'diseaseReviewMeetingStartDate', 'diseaseReviewMeetingEndDate'
]
const additionArray = [
  'executionDiscussionAddition',
  'expertReviewPreVisitAddition',
  'expertReviewPostVisitAddition',
  'reportDraftAddition',
  'reportReviewAddition',
  'docSupplementAddition',
  'diseaseReviewMeetingAddition'
]

const totalDays = (item) => {
  const startDate = dayjs(item.receivedDate)
  if (!startDate.isValid()) return 0

  let maxDate = null
  const secondaryDates = []
  const additions = []

  for (const field of mainField) {
    const date = item[field] ? dayjs(item[field]) : null
    if (date && (!maxDate || date.isAfter(maxDate))) {
      maxDate = date
    }
  }

  for (let i = 0; i < additionArray.length; i++) {
    const startField = secondaryField[i * 2]
    const endField = secondaryField[i * 2 + 1]
    const start = item[startField] ? dayjs(item[startField]) : null
    const end = item[endField] ? dayjs(item[endField]) : null
    secondaryDates.push({ start, end })
    additions.push(item[additionArray[i]] ?? false)
    if (end && (!maxDate || end.isAfter(maxDate))) {
      maxDate = end
    }
  }
  if (!maxDate) return 0
  const duration = maxDate.diff(startDate, 'day') + 1
  item = Object.assign(item, {
    totalDays: duration,
  })
  return duration > 0 ? duration : 0
}

const additionDays = (item) => {
  let total = 0
  for (let i = 0; i < additionArray.length; i++) {
    const start = item[secondaryField[i * 2]] ? dayjs(item[secondaryField[i * 2]]) : null
    const end = item[secondaryField[i * 2 + 1]] ? dayjs(item[secondaryField[i * 2 + 1]]) : null
    const addition = item[additionArray[i]] ?? false
    if (start && end && end.diff(start, 'day') > 0 && addition) {
      total += end.diff(start, 'day')
    }
  }

  return total
}

const menu = ref(false)
const exportCSV = () => {
  const group = {}

  for (const item of cases.value) {
    const mainType = item.type ?? '無'
    const diagnosis = item.diagnosis ?? '其他'
    const days = item.totalDays ?? 0
    if (!group[mainType]) group[mainType] = {}
    if (!group[mainType][diagnosis]) group[mainType][diagnosis] = { total: 0, count: 0 }

    group[mainType][diagnosis].total += days
    group[mainType][diagnosis].count += 1
  }

  const avgDays = {}
  for (const mainType in group) {
    avgDays[mainType] = {}
    for (const diagnosis in group[mainType]) {
      const { total, count } = group[mainType][diagnosis]
      avgDays[mainType][diagnosis] = count ? Math.round(total / count) : 0
    }
  }

  // 這邊算兩類型的案件總數
  const afterCount = Object.values(group["管服"] ?? {}).reduce((acc, cur) => acc + cur.count, 0)
  const beforeCount = Object.values(group["法人"] ?? {}).reduce((acc, cur) => acc + cur.count, 0)

  const diagnosisSet = new Set()
  Object.values(avgDays).forEach(typeGroup => {
    Object.keys(typeGroup).forEach(d => diagnosisSet.add(d))
  })

  const rows = []
  diagnosisSet.forEach(diagnosis => {
    const afterData = group["管服"]?.[diagnosis] ?? { total: 0, count: 0 }
    const beforeData = group["法人"]?.[diagnosis] ?? { total: 0, count: 0 }

    const afterAvg = avgDays["管服"]?.[diagnosis] ?? 0
    const beforeAvg = avgDays["法人"]?.[diagnosis] ?? 0

    const afterAvgText = afterData.count > 0 ? (afterAvg > 0 ? afterAvg : '-') : '-'
    const beforeAvgText = beforeData.count > 0 ? (beforeAvg > 0 ? beforeAvg : '-') : '-'

    const totalCount = afterData.count + beforeData.count
    rows.push(`${diagnosis}(${totalCount}案),${afterAvgText},${beforeAvgText}`)
  })

  rows.push(`總計(${afterCount + beforeCount}案),-,-`)

  const header = `案件類型,法人成立後(${afterCount}案),法人成立前(${beforeCount}案)`

  const csvContent = [header, ...rows].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'cases.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
const viewCaseView = ref(false)
const chartOptions = ref({})
const showCaseView = () => {
  const group = {}

  for (const item of cases.value) {
    const mainType = item.type ?? '無'
    const diagnosis = item.diagnosis ?? '其他'
    const days = item.totalDays ?? 0

    if (!group[mainType]) group[mainType] = {}
    if (!group[mainType][diagnosis]) group[mainType][diagnosis] = { total: 0, count: 0 }

    group[mainType][diagnosis].total += days
    group[mainType][diagnosis].count += 1
  }

  const avgDays = {}
  const totalStats = { '法人': { total: 0, count: 0 }, '管服': { total: 0, count: 0 } }

  for (const mainType in group) {
    avgDays[mainType] = {}
    for (const diagnosis in group[mainType]) {
      const { total, count } = group[mainType][diagnosis]
      avgDays[mainType][diagnosis] = count ? Math.round(total / count) : 0

      // 計算總計用
      if (mainType === '法人' || mainType === '管服') {
        totalStats[mainType].total += total
        totalStats[mainType].count += count
      }
    }
  }

  const totalAvg = {
    '法人': totalStats['法人'].count > 0
      ? Math.round(totalStats['法人'].total / totalStats['法人'].count)
      : 0,
    '管服': totalStats['管服'].count > 0
      ? Math.round(totalStats['管服'].total / totalStats['管服'].count)
      : 0
  }

  const diagnosisSet = new Set()
  Object.values(avgDays).forEach(typeGroup => {
    Object.keys(typeGroup).forEach(d => diagnosisSet.add(d))
  })

  const diagnoses = Array.from(diagnosisSet)
  diagnoses.push('總計')

  const series = [
    {
      name: '法人成立前',
      data: diagnoses.map(d =>
        d === '總計' ? totalAvg['法人'] : avgDays['法人']?.[d] ?? 0
      )
    },
    {
      name: '法人成立後',
      data: diagnoses.map(d =>
        d === '總計' ? totalAvg['管服'] : avgDays['管服']?.[d] ?? 0
      )
    }
  ]

  chartOptions.value = {
    chart: {
      type: 'bar'
    },
    title: {
      text: '診斷類別平均總天數比較（含總計）'
    },
    xAxis: {
      categories: diagnoses,
      title: { text: '診斷類別' },
      labels: {
        rotation: 0,
        style: { fontSize: '12px' }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '平均總天數 (天)',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    tooltip: {
      shared: true,
      valueSuffix: ' 天'
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    series
  }
  viewCaseView.value = true
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