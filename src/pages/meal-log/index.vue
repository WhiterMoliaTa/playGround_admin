<template>
  <div class="d-flex justify-space-between align-center pa-2">
    <h1>供膳管理日誌</h1>
    <nav>
      <ul class="breadcrumb">
        <span v-for="(breadcrumb, index) in breadcrumbs" :key=index>
          <router-link :to="breadcrumb.path">{{ breadcrumb.label }}</router-link>
          <span v-if="index < breadcrumbs.length - 1"> / </span>
        </span>
      </ul>
    </nav>
  </div>
  <div class="d-flex justify-space-between align-center pa-2">
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
            <v-list-item-title :style="{ 'background-color': (item.id % 2 ? '#fff' : '#e0f7fa'), 'height': '48px' }"
              class="pl-3 d-flex align-center">{{ item.title }}</v-list-item-title>

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
  <DialogComponent v-model:show="dialogState.show" :title="dialogState.title" :check-object="dialogState.checkObject"
    :check-boxs="dialogState.checkBoxs" :form-buttons="dialogState.formButtons"
    :additional-form="dialogState.additionalForm" :form-name="dialogState.formName"
    :form-required="dialogState.formRequired" :time="dialogState.time" :reminder="dialogState.reminder"
    @addtionalFormSubmit="saveDialogAndAdditionalForm" />
  <v-dialog v-model="showRemarksDialog">
    <v-card>
      <v-card-title class="text-center">備註</v-card-title>
      <v-card-text>
        <v-textarea v-model="jobsRemarks.remarks" label="特殊狀況" rows="3" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="updateJobRemark">確認</v-btn>
        <v-btn color="secondary" @click="closeRemarksDialog">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted, provide } from 'vue';
import DialogComponent from '../../components/TCHG/DialogComponent.vue';
import { jobs } from "../../data/testTCHGJobs";
import { forms } from '../../data/testTCHGForms';

onMounted(() => {
  jobs.forEach((job, jobIndex) => {
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

const jobsRemarks = ref(null);
const showRemarksDialog = ref(false);
const state = ref({});

provide('getAddiForm', (formName) => {
  return forms[formName]?.additionalForm || [];
});

provide('modifyJobPass', (formName, time, pass) => {

  const job = jobs.find(j =>
    j.items.some(item =>
      item.forms &&
      item.forms.formName.includes(formName) &&
      (!time || item.forms.time === time)
    )
  );
  console.log(`Job found: ${job ? job : 'none'}`);
  if (job) {
    const section = job.section;
    const item = job.items.find(item =>
      item.forms && item.forms.formName?.includes(formName) && (!time || item.forms.time === time)
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
  const form = forms[formName];

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
  return jobs.length;
});

function openRemarkDialog(item) {
  jobsRemarks.value = item || '';
  showRemarksDialog.value = true;
}

function updateJobRemark() {
  closeRemarksDialog();
}

function closeRemarksDialog() {
  showRemarksDialog.value = false;
}

function updateCompletedCount() {
  let completed = 0;
  jobs.forEach(job => {
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
          forms[form]?.additionalForm || [];
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

watch(() =>
  jobs
    .filter(job => Array.isArray(job.items))
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
</script>

<style scoped>
.v-list-group__items .v-list-item {
  padding-inline-start: 48px !important;
}

.task-timeline {
  position: relative;
  padding-left: 12px;
}

.timeline-indicator {
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  border-left: 4px dotted #ccc;
  height: 90%;
}

.associated-forms {
  height: 30%;
}
</style>