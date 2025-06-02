<template>
  <v-container fluid>
    <!-- 基本資料 -->
    <section class="section-block">
      <h3 class="section-title">基本資料</h3>
      <v-row dense>
        <v-col cols="12" md="4"><strong>來文號：</strong> {{ caseData.docId }}</v-col>
        <v-col cols="12" md="4"><strong>來文日期：</strong> {{ formatDate(caseData.docDate) }}</v-col>
        <v-col cols="12" md="4"><strong>收文日期：</strong> {{ formatDate(caseData.receivedDate) }}</v-col>
        <v-col cols="12" md="4"><strong>案件編號：</strong> {{ caseData.caseNumber }}</v-col>
        <v-col cols="12" md="4"><strong>姓名：</strong> {{ caseData.name }}</v-col>
        <v-col cols="12" md="4"><strong>年齡：</strong> {{ caseData.age }}</v-col>
        <v-col cols="12" md="4"><strong>性別：</strong> {{ caseData.gender }}</v-col>
        <v-col cols="12" md="8"><strong>案名：</strong> {{ caseData.caseName }}</v-col>
        <v-col cols="12"><strong>備註：</strong> {{ caseData.remarks }}</v-col>
        <v-col cols="12"><strong>診斷結果：</strong> {{ caseData.diagnosis }}</v-col>
        <v-col cols="12"><strong>中心承辦人：</strong> {{ caseData.centerHandler }}</v-col>
      </v-row>
    </section>

    <v-divider class="my-6"></v-divider>

    <!-- 派案資料 -->
    <section class="section-block">
      <h3 class="section-title">派案資料</h3>
      <v-row dense>
        <v-col cols="12" md="4"><strong>派案日期：</strong> {{ formatDate(caseData.dispatchDate) }}</v-col>
        <v-col cols="12" md="8"><strong>派案醫院：</strong> {{ caseData.dispatchHospital.name }}</v-col>
        <v-col cols="12" md="6"><strong>醫院電話：</strong> {{ caseData.dispatchHospital.contact }}</v-col>
        <v-col cols="12" md="6"><strong>醫院地址：</strong> {{ caseData.dispatchHospital.address }}</v-col>
        <v-col cols="12" md="6"><strong>派案醫生：</strong> {{ caseData.dispatchDoctor.name }}</v-col>
        <v-col cols="12" md="6"><strong>醫生電話：</strong> {{ caseData.dispatchDoctor.contact }}</v-col>
        <v-col cols="12" md="4"><strong>專科：</strong> {{ caseData.dispatchDoctor.specialty }}</v-col>
        <v-col cols="12" class="dispatch-letter" v-html="caseData.dispatchLetter"></v-col>
      </v-row>
    </section>

    <v-divider class="my-6"></v-divider>

    <!-- 雇主資料 -->
    <section class="section-block">
      <h3 class="section-title">雇主資料</h3>
      <v-row dense>
        <v-col cols="12" md="6"><strong>雇主名稱：</strong> {{ caseData.employer.name }}</v-col>
        <v-col cols="12" md="6"><strong>聯絡電話：</strong> {{ caseData.employer.contact }}</v-col>
        <v-col cols="12"><strong>地址：</strong> {{ caseData.employer.address }}</v-col>
      </v-row>
    </section>

    <v-divider class="my-6"></v-divider>

    <!-- 勞檢資料 -->
    <section class="section-block">
      <h3 class="section-title">勞檢資料</h3>
      <v-row dense>
        <v-col cols="12" md="4"><strong>職安署承辦人：</strong> {{ caseData.oshaHandler }}</v-col>
        <v-col cols="12" md="4"><strong>勞檢機關：</strong> {{ caseData.laborInspection.name }}</v-col>
        <v-col cols="12" md="4"><strong>聯絡電話：</strong> {{ caseData.laborInspection.contact }}</v-col>
        <v-col cols="12"><strong>機關地址：</strong> {{ caseData.laborInspection.address }}</v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script setup>
defineProps({
  caseData: {
    type: Object,
    required: true,
  },
})

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
.section-block {
  margin-bottom: 1.5rem;
}

.section-title {
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #3f51b5;
  /* Vuetify primary color */
}

strong {
  color: #333;
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
