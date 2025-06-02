<template>
  <div class="step-progress-container">
    <div :style="{ position: 'absolute', left: '-90px', top: '18%', textAlign: 'center' }">
      起始日<br>
      {{ formatToROC(startDate) }}
    </div>
    <div :style="{ position: 'absolute', right: '-90px', top: '18%', textAlign: 'center' }">
      截止日<br>
      {{ formatToROC(deadLine) }}
    </div>
    <div :style="{
      position: 'absolute',
      color: getColorByDiff,
      top: '85%',
      left: '50%',
      transform: 'translateX(-50%)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }">
      {{ lastStatus }}
    </div>

    <!-- 共用的底線 -->
    <div class="progress-line"></div>

    <!-- 主進度條 -->
    <div class="main-step-progress-bar" :style="{ width: progressPercent + '%', backgroundColor: getColorByDiff }">
    </div>

    <!-- 主節點 -->
    <div v-for="(label, index) in mainFields" :key="'main-' + index">
      <div v-if="mainDates[index]" class="main-step-node-circle" :class="{ completed: !!mainDates[index] }" :style="{
        left: nodeLeftPercents[index] + '%',
        '--line-color': mainDates[index] ? getColorByDiff : '#bbb',
        borderColor: mainDates[index] ? getColorByDiff : '#bbb',
      }">
        <div class="main-step-node-label" :style="{ color: mainDates[index] ? getColorByDiff : 'black' }"
          :class="{ 'main-step-label-top': index % 2 === 0, 'main-step-label-bottom': index % 2 === 1 }">
          {{ mainLabels[index] }}
        </div>
        <span v-if="mainDates[index]" class="main-step-checkmark" :style="{ color: getColorByDiff }">✔</span>
      </div>
    </div>

    <!-- 次節點 -->
    <div v-for="(label, index) in secondaryLabels" :key="'secondary-group-' + index" style="position: relative;">
      <div class="secondary-step-progress-bar" :style="{
        left: `calc(${secondaryLeftPercents[index * 2]}% + 6px)`,
        width: (secondaryLeftPercents[index * 2 + 1] - secondaryLeftPercents[index * 2]) + '%',
        top: secondaryAddition[index] ? '50px' : index % 2 === 0 ? `calc(${secondaryTop} + 1.5px)` : `calc(${secondaryBottom} + 1.5px)`
      }" v-if="secondaryDates[index * 2] && secondaryDates[index * 2 + 1]"></div>

      <div v-if="secondaryDates[index * 2]"
        :class="{ addition: secondaryAddition[index], 'secondary-step-node-circle': true }"
        :style="{ left: secondaryLeftPercents[index * 2] + '%', top: secondaryAddition[index] ? '47px' : index % 2 === 0 ? secondaryTop : secondaryBottom }">
      </div>
      <div v-if="secondaryDates[index * 2 + 1]"
        :class="{ addition: secondaryAddition[index], 'secondary-step-node-circle': true }"
        :style="{ left: secondaryLeftPercents[index * 2 + 1] + '%', top: secondaryAddition[index] ? '47px' : index % 2 === 0 ? secondaryTop : secondaryBottom }">
      </div>
      <div class="secondary-step-node-label" v-if="secondaryDates[index * 2] && secondaryDates[index * 2 + 1]"
        :class="{ addition: secondaryAddition[index], 'secondary-step-label-top': index % 2 === 0, 'secondary-step-label-bottom': index % 2 === 1 }"
        :style="{
          left: `calc(${(secondaryLeftPercents[index * 2] + secondaryLeftPercents[index * 2 + 1]) / 2}% + 6px)`,
          top: index % 2 === 0 ? `calc(${secondaryTop} - 20px)` : `calc(${secondaryBottom} + 12px)`
        }">
        {{ label }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  caseItem: Object,
  mainLabels: {
    type: Array,
    default: () => ['來文收案', '派案評估', '現場訪視', '函覆職安署']
  },
  secondaryLabels: {
    type: Array,
    default: () => ['執行方向討論', '專家諮詢/環測', '專家諮詢/環測', '報告初稿', '報告檢視/修改', '書審補提', '職業病鑑定會']
  },
  mainFields: {
    type: Array,
    default: () => ['docReceivedDate', 'dispatchEvaluationDate', 'siteVisitDate', 'oshaResponseDate']
  },
  secondaryFields: {
    type: Array,
    default: () => [
      'executionDiscussionStartDate', 'executionDiscussionEndDate',
      'expertReviewPreVisitStartDate', 'expertReviewPreVisitEndDate',
      'expertReviewPostVisitStartDate', 'expertReviewPostVisitEndDate',
      'reportDraftStartDate', 'reportDraftEndDate',
      'reportReviewStartDate', 'reportReviewEndDate',
      'docSupplementStartDate', 'docSupplementEndDate',
      'diseaseReviewMeetingStartDate', 'diseaseReviewMeetingEndDate'
    ]
  },
  additionArray: {
    type: Array,
    default: () => [
      'executionDiscussionAddition',
      'expertReviewPreVisitAddition',
      'expertReviewPostVisitAddition',
      'reportDraftAddition',
      'reportReviewAddition',
      'docSupplementAddition',
      'diseaseReviewMeetingAddition'
    ]
  }
});



const deadLine = computed(() => {
  const start = startDate.value
  const dead = deadLineDays.value
  return start.add(dead, 'day')
})

const mainDates = computed(() => props.mainFields.map(f => props.caseItem[f] ? dayjs(props.caseItem[f]) : null))
const secondaryDates = computed(() => props.secondaryFields.map(f => props.caseItem[f] ? dayjs(props.caseItem[f]) : null))
const secondaryAddition = computed(() => props.additionArray.map(f => props.caseItem[f] ? props.caseItem[f] : false))
const startDate = computed(() => {
  for (const d of mainDates.value) {
    if (d) return d
  }
  return dayjs()
})

const maxCompleteDate = computed(() => {
  let max = null
  const allDates = [...mainDates.value, ...secondaryDates.value]
  for (const d of allDates) {
    if (d && (!max || d.isAfter(max))) max = d
  }
  return max || startDate.value
})

const maxDays = computed(() => {
  const diff = maxCompleteDate.value.diff(startDate.value, 'day')
  console.log(`目前進程天數: ${diff} 天`)
  return Math.max(diff, 60)
})

const progressPercent = computed(() => {
  const diff = maxCompleteDate.value.diff(startDate.value, 'day')
  return Math.min(100, (diff / maxDays.value) * 100)
})
const nodeLeftPercents = computed(() => {
  const completed = []
  const pending = []
  mainDates.value.forEach((d, i) => {
    if (d) completed.push(i)
    else pending.push(i)
  })
  const result = new Array(mainDates.value.length).fill(0)
  const completedPercs = completed.map(i => {
    const d = mainDates.value[i]
    const diff = d.diff(startDate.value, 'day')
    return Math.min(100, Math.max(0, (diff / maxDays.value) * 100))
  })
  completed.forEach((idx, i) => {
    result[idx] = completedPercs[i]
  })
  const fixedPercents = [74, 79, 84, 89, 94, 99]
  pending.forEach((idx, i) => {
    const len = pending.length
    const valuesToUse = fixedPercents.slice(-len)
    result[idx] = valuesToUse[i]
  })
  return result
})

const secondaryTop = "4.5px"
const secondaryBottom = "88.5px"
const secondaryLeftPercents = computed(() => {
  const completed = []
  const pending = []
  secondaryDates.value.forEach((d, i) => {
    if (d) completed.push(i)
    else pending.push(i)
  })

  const result = new Array(secondaryDates.value.length).fill(0)
  const completedPercs = completed.map(i => {
    const d = secondaryDates.value[i]
    const diff = d.diff(startDate.value, 'day')
    return Math.min(100, Math.max(0, (diff / maxDays.value) * 100))
  })
  completed.forEach((idx, i) => {
    result[idx] = completedPercs[i]
  })
  const pendingGap = (100 - progressPercent.value) / (pending.length + 1)
  pending.forEach((idx, i) => {
    result[idx] = progressPercent.value + pendingGap * (i + 1)
  })
  return result
})
const deadLineDays = ref(60)
const scanAddition = () => {
  for (let i = 0; i < secondaryAddition.value.length; i++) {
    if (secondaryAddition.value[i]) {
      const start = secondaryDates.value[i * 2]
      const end = secondaryDates.value[i * 2 + 1]
      if (start && end) {
        const diff = end.diff(start, 'day')
        // console.log(`次節點 ${i + 1} 的時間差: ${diff} 天`)
        deadLineDays.value += diff
      }
    }
  }
  console.log(`死線: ${deadLineDays.value} 天`)
}
watch(() => secondaryAddition, (val) => {
  scanAddition()
}, { immediate: true })
const lastStatus = computed(() => {
  var diff = deadLine.value.diff(dayjs(), 'day')
  var over = deadLine.value.isBefore(dayjs())
  if (mainDates.value[mainDates.value.length - 1]) {
    var lastDate = mainDates.value[mainDates.value.length - 1]
    if (lastDate) {
      diff = lastDate.diff(startDate.value, 'day')
    }
    if (diff > deadLineDays.value) {
      return '已完成，逾期 ' + (diff - deadLineDays.value) + ' 天'
    }
    return '已完成'
  }
  if (diff === 0) {
    return '今天截止'
  }
  if (over) {
    diff = Math.abs(diff)
    return `已逾期 ${diff} 天`
  }
  return `剩餘:  ${diff} 天`
})

const getColorByDiff = computed(() => {
  var diff = deadLine.value.diff(dayjs(), 'day')
  if (mainDates.value[mainDates.value.length - 1]) {
    var lastDate = mainDates.value[mainDates.value.length - 1]
    if (lastDate) {
      diff = lastDate.diff(startDate.value, 'day')
    }
    if (diff > deadLineDays.value) {
      return '#588157'
    }
    return '#4caf50'
  }
  if (diff < 0) return '#f44336'
  if (diff === 0) return '#f19143'
  if (diff <= 3) return '#fabc3c'
  return '#4caf50'
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


</script>

<style lang="scss" scoped>
$color-border-default: #bbb;
$color-primary: #2196f3;
$color-primary-light: #6cbdff;
$color-bg: white;
$color-progress-bg: #ddd;
$font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;

$size-main-node: 14px;
$size-secondary-node: 10px;
$size-secondary-node-addition: 12px;
$progress-height: 6px;

.step-progress-container {
  position: relative;
  height: 150px;
  margin-top: 20px;

  .progress-line {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: $progress-height;
    background-color: $color-progress-bg;
    z-index: 1;
    border-radius: 3px;
  }

  /* 主進度條 */
  .main-step-progress-bar {
    position: absolute;
    top: 50px;
    left: 8px;
    height: $progress-height;
    border-radius: 3px;
    z-index: 2;
    transition: width 0.3s ease;
  }

  /* 次進度條（每兩個節點一段） */
  .secondary-step-progress-bar {
    position: absolute;
    height: $progress-height;
    background-color: $color-primary;
    border-radius: 3px;
    z-index: 2;
  }

  /* 主節點 */
  .main-step-node-circle {
    position: absolute;
    top: 46px;
    width: $size-main-node;
    height: $size-main-node;
    border-radius: 50%;
    background-color: $color-bg;
    border: 3px solid $color-border-default;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &.completed {
      font-size: 10px;
      font-weight: bold;
    }

    .main-step-checkmark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 8px;
      pointer-events: none;
    }
  }

  .main-step-node-label {
    font-family: $font-family;
    position: absolute;
    white-space: nowrap;
    font-size: 12px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }

  /* 次節點 */
  .secondary-step-node-circle {
    position: absolute;
    width: $size-secondary-node;
    height: $size-secondary-node;
    border-radius: 50%;
    background-color: $color-bg;
    border: 2px solid $color-primary;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &.addition {
      width: $size-secondary-node-addition;
      height: $size-secondary-node-addition;
      background-color: $color-primary-light;
      border: 2px solid $color-primary;
    }
  }

  .secondary-step-node-label {
    font-family: $font-family;
    color: $color-primary;
    position: absolute;
    white-space: nowrap;
    font-size: 12px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }

  /* 共用 label 樣式 */
  .main-step-label-top,
  .main-step-label-bottom {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-family: $font-family;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
  }

  .main-step-label-top {
    bottom: 100%;
    margin-bottom: 8px;
    border-bottom: 2px solid var(--line-color, $color-border-default);

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -8px;
      width: 2px;
      height: 8px;
      background-color: var(--line-color, $color-border-default);
      transform: translateX(-50%);
    }
  }

  .main-step-label-bottom {
    top: 100%;
    margin-top: 8px;
    border-top: 2px solid var(--line-color, $color-border-default);

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: -8px;
      width: 2px;
      height: 8px;
      background-color: var(--line-color, $color-border-default);
      transform: translateX(-50%);
    }
  }

  .secondary-step-label-top,
  .secondary-step-label-bottom {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .secondary-step-label-top {
    bottom: auto;

    &.addition {
      border-bottom: 2px solid $color-primary;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -48px;
        width: 2px;
        height: 48px;
        background: repeating-linear-gradient(to bottom,
            $color-primary,
            $color-primary 4px,
            transparent 4px,
            transparent 8px);
        transform: translateX(-50%);
      }
    }
  }

  .secondary-step-label-bottom {
    top: auto;

    &.addition {
      border-top: 2px solid $color-primary;

      &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: -48px;
        width: 2px;
        height: 48px;
        background: repeating-linear-gradient(to bottom,
            $color-primary,
            $color-primary 4px,
            transparent 4px,
            transparent 8px);
        transform: translateX(-50%);
      }
    }
  }
}
</style>
