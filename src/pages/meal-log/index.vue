<template>
  <div class="meal-log-page">
    <div class="d-flex justify-space-between align-center pa-2 mx-2">
      <h2>供膳管理日誌</h2>
      <nav>
        <ul class="breadcrumb">
          <span v-for="(breadcrumb, index) in breadcrumbs" :key=index>
            <router-link :to="breadcrumb.path">{{ breadcrumb.label }}</router-link>
            <span v-if="index < breadcrumbs.length - 1"> / </span>
          </span>
        </ul>
      </nav>
    </div>
    <div class="d-flex justify-space-between align-center pa-2 mx-2">
      <div>
        <v-icon>mdi-clock-outline</v-icon>
        {{ currentTime }}
      </div>
      <div>
        <v-select v-model="branch" :items="branches" label="" class="ml-4" />
      </div>
    </div>
    <v-card>
      <div class="d-flex justify-space-between align-center pa-2">
        <div>日誌檢核表</div>
        <v-chip color="purple" text-color="white">{{ completedCount }}/{{ sectionsToDone }}</v-chip>
      </div>
      <v-list>
        <v-list-group v-for="(job, index) in jobs" :key="job.section" :value="job.section">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="job.time"
              :subtitle="`${job.title} (${job.items.filter(i => i.checked).length}/${job.items.length})`"
              class="font-weight-bold">
              <template v-slot:prepend>
                <v-icon color="amber">mdi-circle</v-icon>
              </template>
            </v-list-item>
          </template>
          <div class="task-timeline">
            <v-list-item v-for="item in job.items" :key="`${index}-${item.id}`" :value="`${index}-${item.id}-val`"
              lines="one" class="task-item">
              <template v-slot:prepend>
                <div class="timeline-indicator"></div>
              </template>
              <v-list-item-title :style="{ 'background-color': (item.id % 2 ? '#fff' : '#e0f7fa') }"
                class="pl-3 d-flex align-center meal-list-item-title">{{ item.title }}</v-list-item-title>
              <template v-slot:append>
                <div class="d-flex align-center" :style="{ 'background-color': (item.id % 2 ? '#fff' : '#e0f7fa') }">
                  <v-btn :key="`button-${index}-${item.id}`" hide-details variant="text" icon class="ma-0 pa-0"
                    @click="handleButtonClick(item, job.section)">
                    <v-icon
                      :color="state[`button-${job.section}-${item.id}`] && item.checked ? state[`button-${job.section}-${item.id}`] : 'grey'">
                      mdi-check-circle</v-icon>
                  </v-btn>
                  <v-btn variant="text" icon @click="openRemarkDialog(item)">
                    <v-icon>mdi-dots-horizontal-circle</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </div>
        </v-list-group>
      </v-list>
    </v-card>
    <v-card class="associated-forms mt-5">
      <div class="d-flex justify-space-between align-center pa-2">
        <div>關聯表單</div>
      </div>
      <div class="pa-4">
        <v-row>
          <!-- Iterate through forms dynamically -->
          <v-col v-for="(form, formName) in forms" :key="formName">
            <div class="associate-from">{{ form.additionalForm[0]?.title || formName }}</div>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <div class="d-flex justify-space-around align-center draft-func-footer">
      <v-btn variant="flat" class="border-md" color="white" @click="tempSaveDraft" rounded>暫存草稿</v-btn>
      <v-btn variant="flat" disabled @click="signDraft" rounded>簽章送出</v-btn>
    </div>
    <DialogComponent v-model:show="dialogState.show" :title="dialogState.title" :check-object="dialogState.checkObject"
      :check-boxs="dialogState.checkBoxs" :form-buttons="dialogState.formButtons"
      :additional-form="dialogState.additionalForm" :form-name="dialogState.formName"
      :form-required="dialogState.formRequired" :time="dialogState.time" :reminder="dialogState.reminder"
      @addtionalFormSubmit="saveDialogAndAdditionalForm" />
    <remarks-dialog v-model:showRemarks="showRemarksDialog" :item="jobRemarks" />
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted, provide } from 'vue';
import DialogComponent from '../../components/TCHG/DialogComponent.vue';
import RemarksDialog from '../../components/TCHG/RemarksDialog.vue';
import { testTCHGJobs } from "../../data/testTCHGJobs";
import { testTCHGForms } from '../../data/testTCHGForms';

const jobs = ref(testTCHGJobs);
const forms = ref(testTCHGForms);
onMounted(() => {
  jobs.value.forEach((job, jobIndex) => {
    job.items.forEach(item => {
      state.value[`button-${job.section}-${item.id}`] = "success";
    });
  });
  updateCompletedCount();
});

const breadcrumbs = [
  { label: '首頁', path: '/' },
  { label: '供膳管理日誌', path: '/meal-log' }
]
const branch = ref('院本部');
const branches = ['院本部', '中興', '仁愛', '其他分院'];
const currentTime = ref(new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }));

const dialogState = reactive({
  show: false,
  title: '',
  checkObject: '',
  checkBoxs: [],
  formButtons: [],
  formName: [],
  formRequired: false,
  time: '',
  additionalForm: null,
  reminder: ''
});

const showRemarksDialog = ref(false);
const state = ref({});

watch(() =>
  jobs.value.filter(job => Array.isArray(job.items))
    .map(job => job.items.map(item => item.checked))
  ,
  () => updateCompletedCount(),
  { deep: true }
);

onMounted(() => {
  updateCompletedCount();
  setInterval(() => {
    let localDateString = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    currentTime.value = localDateString;
  }, 1000);
});

provide('getAddiForm', (formName) => {
  return forms.value[formName]?.additionalForm || [];
});

provide('modifyJobPass', (formName, time, pass) => {
  const job = jobs.value.find(j =>
    j.items.some(item => {
      return (item.forms &&
        item.forms.formName === formName &&
        (!time || item.forms.time === time))
    }
    )
  );
  console.log(`Job found: ${job ? job : 'none'}`);
  if (job) {
    const section = job.section;
    const item = job.items.find(item =>
      item.forms && item.forms.formName === formName && (!time || item.forms.time === time)
    );
    if (item && item.forms) {
      item.forms.passed = pass;
      const key = `button-${section}-${item.id}`;
      state.value[key] = pass ? 'success ' : 'error';
      console.log(`Job ${formName} in section ${section} updated to ${state.value[key]}.`);
      item.checked = true;
      updateCompletedCount();
    }
  }
});

provide('updateAddiForm', (formName, newData) => {
  const form = forms.value[formName];

  if (form && form.additionalForm) {
    if (Array.isArray(newData)) {
      form.additionalForm = [...newData];
    } else {
      form.additionalForm.push(newData);
    }
  }

});

const completedCount = ref(0);
const sectionsToDone = computed(() => {
  return jobs.value.length;
});

const jobRemarks = ref(null);

function openRemarkDialog(item) {
  jobRemarks.value = item || '';
  showRemarksDialog.value = true;
}

function updateCompletedCount() {
  let completed = 0;
  jobs.value.forEach(job => {
    completed += (job.items.filter(item => item.checked).length / job.items.length) | 0;
  });
  completedCount.value = completed;
}

function handleButtonClick(item, jobSection) {
  let currentForms = item.forms;
  let itemId = item.id;

  // item.forms, job.section, item.id, item.checked
  if (currentForms && Object.keys(currentForms).length > 0 && !item.checked) {
    const formsCollection = {};
    if (currentForms.formName) {
      currentForms.formName.forEach(form => {
        formsCollection[form] =
          forms.value[form]?.additionalForm || [];
      });
    }
    Object.assign(dialogState, {
      show: true,
      title: currentForms.title || "檢核確認",
      checkObject: currentForms.checkObject || "",
      checkBoxs: currentForms.checkBoxs || [],
      formButtons: currentForms.formButtons || [],
      formName: currentForms.formName || [],
      formRequired: currentForms.formRequired || false,
      time: currentForms.time || "",
      additionalForm: formsCollection,
      reminder: currentForms.reminder || ""
    });
  }
  const key = `button-${jobSection}-${itemId}`;
  if (!currentForms) {
    item.checked = item.checked ? false : true;

  } else {
    item.checked = false;
  }
  updateCompletedCount();

}

function saveDialogAndAdditionalForm(allData) {

}

function tempSaveDraft(){
  console.log("暫存草稿功能尚未實作");
}

function signDraft() {
  console.log("簽章送出功能尚未實作");
}
</script>

<style scoped>
@import url('../../css/TCHG_mealLog.css');
@import url('../../css/TCHG_mealLog_MobileS.css') (max-width: 320px) and (orientation: portrait);
</style>