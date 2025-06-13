<template>
  <div class="form-seven">
    <v-card>
      <v-toolbar>
        <v-toolbar-title class="text-center pb-0">{{ title }}</v-toolbar-title>
        <v-btn icon="mdi-close" @click="cancel"></v-btn>
      </v-toolbar>
      <v-table class="form-seven-table">
        <thead>
          <tr>
            <th class="text-center">廠商</th>
            <th class="text-center">時間及姓名</th>
            <th class="text-center">所見缺失</th>
            <th class="text-center" width="80">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in localRecords" :key="index" class="text-center">
            <td>
              <v-text-field v-model="record.comapany" @update:focused="checkValidRecord()" type="text" label="廠商"
                variant="outlined" density="compact" hide-details></v-text-field>
            </td>
            <td>
              <div class="flex-column">
                <v-text-field v-model="record.time" :active="timeDialog[`record-${index}`]"
                  :focused="timeDialog[`record-${index}`]" label="時間" readonly>
                  <v-dialog v-model="timeDialog[`record-${index}`]" activator="parent" width="auto">
                    <v-time-picker v-if="timeDialog[`record-${index}`]" @update:focused="checkValidRecord()"
                      v-model="record.time"></v-time-picker>
                  </v-dialog>
                </v-text-field>
                <v-text-field v-model="record.name" label="姓名" @update:focused="checkValidRecord()" variant="outlined"
                  density="compact" hide-details></v-text-field>
              </div>
            </td>
            <td>
              <v-textarea v-model="record.issues" label="所見缺失" @update:focused="checkValidRecord()" variant="outlined"
                density="compact" hide-details rows="2" no-resize></v-textarea>
            </td>
            <td class="text-center">
              <v-btn icon="mdi-delete" color="error" size="small" variant="text" @click="removeRecord(index)"
                :disabled="localRecords.length <= 1"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div class="d-flex justify-center my-4">
        <v-btn prepend-icon="mdi-plus" color="primary" variant="outlined" @click="addNewRecord">
          新增廠商紀錄
        </v-btn>
      </div>

      <v-divider class="mt-4 mb-1"></v-divider>

      <div>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn variant="outlined" rounded @click="tempSave()">暫存</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="deep-orange-lighten-4" class="text-white" :variant="!formDone ? 'outlined' : 'elevated'"
            :readonly="!formDone" rounded @click="save()">儲存</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded class="mr-2" @click="cancel()">取消</v-btn>
        </v-col>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '進貨廠商管理紀錄'
  },
  time: {
    type: String,
    default: ''
  },
  formConfig: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['save', 'cancel', 'formDoneEvent']);

// Inject methods from parent component
const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');

// Local copy of records for editing
const localRecords = ref([]);
const timeDialog = ref({});

const formDone = ref(false);

function checkValidRecord() {
  formDone.value = localRecords.value.every(record => isRecordNotEmpty(record));
};

// Initialize data
onMounted(() => {
  loadFormData();
  checkValidRecord();
});

watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

function loadFormData() {
  //TODO 改成api取得
  const additionalForm = getAddiForm('formSeven');

  if (additionalForm && additionalForm.records) {

    if (additionalForm.records.length > 0) {
      localRecords.value = JSON.parse(JSON.stringify(additionalForm.records));
    } else {
      localRecords.value = [{ company: null, name: '', time: null, issues: '' }];
    }
  } else {
    localRecords.value = [{ company: null, name: '', time: null, issues: '' }];
  }
}

function addNewRecord() {
  localRecords.value.push({ company: null, name: '', time: null, issues: '' });
}

function removeRecord(index) {
  // Don't remove the first record
  if (localRecords.value.length > 1) {
    localRecords.value.splice(index, 1);
  }
}

function isRecordNotEmpty(record) {
  return record.company && record.name && record.time && record.issues;
}

function tempSave() {
  let filteredRecords = localRecords.value.filter(record => isRecordNotEmpty(record));
  let newFormData = [];
  if (filteredRecords.length === 0) {
    filteredRecords = [{ company: null, name: '', time: null, issues: '' }];
  } else {
    newFormData = {
      title: props.title,
      passed: {
        //有紀錄代表有問題所以直接!props.time
        morning: !props.time.includes('morning'),
        noon: !props.time.includes('noon'),
        evening: !props.time.includes('evening')
      },
      records: filteredRecords
    };
  }
  // 改成api呼叫
  updateAddiForm('formSeven', newFormData);
}

function save() {
  let filteredRecords = localRecords.value.filter(record => isRecordNotEmpty(record));
  let newFormData = [];
  if (filteredRecords.length === 0) {
    emit('formDoneEvent', { formName: 'formSeven', state: 'success' });
  } else {
    emit('formDoneEvent', { formName: 'formSeven', state: 'error' });
  }
  newFormData = [{
    records: filteredRecords
  }];
  // 改成api呼叫
  updateAddiForm('formSeven', newFormData);
  cancel();
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.form-seven {
  max-width: 100%;
}

.form-seven-table {
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
}
</style>