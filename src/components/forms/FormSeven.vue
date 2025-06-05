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
              <!-- <v-select v-model="record.company" :items="companyOptions" label="選擇廠商" variant="outlined"
                density="compact" hide-details></v-select> -->
              <v-text-field v-model="record.comapany" type="text" label="廠商" variant="outlined" density="compact"
                hide-details></v-text-field>
            </td>
            <td>
              <div class="flex-column">
                <!-- <v-text-field v-model="record.time" type="time" label="時間" variant="outlined" density="compact"
                  hide-details class="mr-1"></v-text-field> -->
                <v-text-field
                  v-model="record.time"
                  :active="timeDialog[`record-${index}`]"
                  :focused="timeDialog[`record-${index}`]"
                  label="時間"
                  readonly
                >
                  <v-dialog
                    v-model="timeDialog[`record-${index}`]"
                    activator="parent"
                    width="auto"
                  >
                    <v-time-picker
                      v-if="timeDialog[`record-${index}`]"
                      v-model="record.time"
                    ></v-time-picker>
                  </v-dialog>
                </v-text-field>
                <v-text-field v-model="record.name" label="姓名" variant="outlined" density="compact"
                  hide-details></v-text-field>
              </div>
            </td>
            <td>
              <v-textarea v-model="record.issues" label="所見缺失" variant="outlined" density="compact" hide-details
                rows="2" no-resize></v-textarea>
            </td>
            <td class="text-center">
              <v-btn icon="mdi-delete" color="error" size="small" variant="text"
                @click="removeRecord(index)"
                :disabled="localRecords.length <= 1"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div class="d-flex justify-center my-4">
        <v-btn prepend-icon="mdi-plus" color="primary" variant="outlined" @click="addNewRecord">
          新增廠商紀錄
        </v-btn>
      </div>

      <v-divider class="my-4"></v-divider>

      <div>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn color="error" variant="text" class="mr-2" @click="cancel">取消</v-btn>
          <v-btn color="primary" @click="save">儲存</v-btn>
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
  formConfig: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['save', 'cancel']);

// Inject methods from parent component
const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');

// Local copy of records for editing
const localRecords = ref([]);
const timeDialog = ref({});

// Initialize data
onMounted(() => {
  loadFormData();
});

watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

function loadFormData() {
  const additionalForm = getAddiForm('formSeven');

  if (additionalForm && additionalForm.length > 0 && additionalForm[0].records) {

    if (additionalForm[0].records.length > 0) {
      localRecords.value = JSON.parse(JSON.stringify(additionalForm[0].records));
    } else {
      localRecords.value = [{ company: null, name: '', time: null, issues: '' }];
    }
  } else {
    alert('異常：無法取得表單資料');
  }
}

function addNewRecord() {
  localRecords.value.push({ company: null, name: '', time: null, issues: '' });
}

function removeRecord(index) {
  // if (index > 0) { // Don't remove the first record
  //   localRecords.value.splice(index, 1);
  // }
  if( localRecords.value.length > 1) {
    localRecords.value.splice(index, 1);
  }
}

function isRecordEmpty(record) {
  return !record.company && !record.name && !record.time && !record.issues;
}

function save() {
  let filteredRecords = localRecords.value.filter(record => !isRecordEmpty(record));

  if (filteredRecords.length === 0) {
    filteredRecords = [{ company: null, name: '', time: null, issues: '' }];
  }

  const hasIssues = filteredRecords.some(record =>
    record.company && record.issues && record.issues.trim() !== ''
  );

  const newFormData = [{
    records: filteredRecords
  }];

  updateAddiForm('formSeven', newFormData);
  emit('save', newFormData);
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