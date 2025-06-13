<template>
  <div class="form-three">
    <v-card class="pa-4">
      <v-card-title class="text-center pb-0">{{ title }}</v-card-title>
      <v-card-subtitle class="text-center pb-4">病人餐點回收及盤餘抽查記錄</v-card-subtitle>
      <v-container class="records-container">
        <div v-for="(record, recordIndex) in localRecords" :key="recordIndex" class="record-container mb-6">
          <v-card class="pa-3" variant="outlined">
            <!-- Meal Checkboxes -->
            <v-row class="my-2 font-weight-bold text-center">
              <v-col cols="4" v-if="showBreakfast" class="d-flex align-center justify-center">早餐</v-col>
              <v-col cols="4" v-if="showLunch" class="d-flex align-center justify-center">午餐</v-col>
            </v-row>
            <v-row>
              <v-col cols="4" v-if="showBreakfast" class="d-flex flex-column align-center">
                <v-checkbox-btn v-model="record.breakfast" color="success" true-icon="mdi-check-circle"
                  false-icon="mdi-close-circle-outline" @update:focused="checkValidRecord"></v-checkbox-btn>
              </v-col>

              <v-col cols="4" v-if="showLunch" class="d-flex flex-column align-center">
                <v-checkbox-btn v-model="record.lunch" color="success" true-icon="mdi-check-circle"
                  false-icon="mdi-close-circle-outline" @update:focused="checkValidRecord"></v-checkbox-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="record.recycleTime" :active="timeDialog[`recycle-${recordIndex}`]"
                  :focused="timeDialog[`recycle-${recordIndex}`]" label="回收時間" readonly>
                  <v-dialog v-model="timeDialog[`recycle-${recordIndex}`]" activator="parent" width="auto">
                    <v-time-picker v-if="timeDialog[`recycle-${recordIndex}`]" v-model="record.recycleTime" scrollable
                      format="24hr" @update:focused="checkValidRecord"></v-time-picker>
                  </v-dialog>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="record.ward" label="病房" variant="outlined" density="compact" hide-details
                  @update:focused="checkValidRecord"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="record.plate" label="盤數" type="number" variant="outlined" density="compact"
                  hide-details @update:focused="checkValidRecord"></v-text-field>
              </v-col>
            </v-row>
            <!-- Dish and Leftover Portions -->
            <v-card-subtitle class="px-0 pt-2">餐點剩餘份量</v-card-subtitle>

            <div v-for="(dish, dishIndex) in record.dishAndLeftoverPortion" :key="`dish-${recordIndex}-${dishIndex}`"
              class="mb-2">
              <v-row :class="dishIndex === 0 ? 'mt-2' : ''">
                <v-col cols="6">
                  <v-text-field v-model="dish.dishName" label="餐點名稱" variant="outlined" density="compact" hide-details
                    @update:focused="checkValidRecord"></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field v-model="dish.leftPortion" label="剩餘份量" variant="outlined" density="compact"
                    hide-details @update:focused="checkValidRecord"></v-text-field>
                </v-col>
                <v-col cols="1" class="d-flex align-center justify-center">
                  <v-btn variant="text" icon="mdi-delete" size="small" color="error"
                    @click="removeDish(record, dishIndex)"
                    :disabled="record.dishAndLeftoverPortion.length <= 1"></v-btn>
                </v-col>
              </v-row>
            </div>
            <v-row class="mt-2 mb-4">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn prepend-icon="mdi-plus" variant="outlined" size="small" @click="addDish(record)">
                  新增餐點
                </v-btn>
              </v-col>
            </v-row>
            <!-- Remarks -->
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="record.remarks" label="備註" variant="outlined" density="compact"
                  @update:focused="checkValidRecord"></v-textarea>
              </v-col>
            </v-row>
            <!-- Delete Record Button -->
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="error" variant="text" icon="mdi-delete" @click="removeRecord(recordIndex)"
                  :disabled="localRecords.length <= 1"></v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-container>

      <!-- Add New Record Button -->
      <v-row class="my-3">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn prepend-icon="mdi-plus" variant="outlined" @click="addNewRecord">
            新增記錄
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn variant="outlined" rounded @click="tempSave()">暫存</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="deep-orange-lighten-4" class="text-white" :variant="!formDone ? 'outlined' : 'elevated'"
            :readonly="!formDone" rounded @click="save()">儲存</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded class="mr-2" @click="cancel()">取消</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue';
import { isNotBlankUtil } from '../../utils/stringUtil';

const props = defineProps({
  title: {
    type: String,
    default: '病人餐點回收及盤餘抽查記錄'
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

// Get form data access from parent
const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');

// Time-based display
const showBreakfast = computed(() => props.time.includes('morning'));
const showLunch = computed(() => props.time.includes('noon'));
const showDinner = computed(() => props.time.includes('evening'));

// Local records
const localRecords = ref([]);
const timeDialog = ref({});

const formDone = ref(false);

// Load form data
onMounted(() => {
  loadFormData();
});

// Watch for form config changes
watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

function loadFormData() {
  //TODO 改成api取得
  let formData = getAddiForm('formThree');

  if (formData) {
    let firstForm = formData;
    if (firstForm.records && Array.isArray(firstForm.records)) {
      let allRecords = JSON.parse(JSON.stringify(firstForm.records));

      let filteredRecords = allRecords.filter(record => {
        if (props.time.includes('morning') && record.breakfast !== null) return true;
        if (props.time.includes('noon') && record.lunch !== null) return true;
        if (props.time.includes('evening') && record.dinner !== null) return true;

        // If no meal time check has been set yet, include this record for the current meal time
        return record.breakfast === null && record.lunch === null && record.dinner === null;
      });
      localRecords.value = filteredRecords.length > 0 ? filteredRecords : [createEmptyRecord()];
    } else {
      alert('異常：無法取得表單資料');
    }
  } else {
    alert('異常：無法取得表單資料');
  }
  checkValidRecord();
}

function createEmptyRecord() {
  return {
    recycleTime: '',
    ward: '',
    plate: 0,
    dishAndLeftoverPortion: [{ dishName: '', leftPortion: '' }],
    breakfast: props.time.includes('morning') ? false : null,
    lunch: props.time.includes('noon') ? false : null,
    dinner: props.time.includes('evening') ? false : null,
    remarks: ''
  };
}

function checkValidRecord() {
  formDone.value = localRecords.value.every(record => isRecordNotEmpty(record));
};

function isRecordNotEmpty(record) {
  console.log(isNotBlankUtil(record.recycleTime) && isNotBlankUtil(record.ward) && record.plate > 0 &&
    record.dishAndLeftoverPortion.every(dish => isNotBlankUtil(dish.dishName)));
  return isNotBlankUtil(record.recycleTime) && isNotBlankUtil(record.ward) && record.plate > 0 &&
    record.dishAndLeftoverPortion.every(dish => isNotBlankUtil(dish.dishName));
}

function addDish(record) {
  record.dishAndLeftoverPortion.push({ dishName: '', leftPortion: '' });
  checkValidRecord();
}

function removeDish(record, dishIndex) {
  if (record.dishAndLeftoverPortion.length > 1) {
    record.dishAndLeftoverPortion.splice(dishIndex, 1);
  }
  checkValidRecord();
}

function addNewRecord() {
  localRecords.value.push({
    recycleTime: '',
    ward: '',
    plate: 0,
    dishAndLeftoverPortion: [{ dishName: '', leftPortion: '' }],
    breakfast: null,
    lunch: null,
    dinner: null,
    remarks: ''
  });
}

function removeRecord(index) {
  if (localRecords.value.length > 1) {
    localRecords.value.splice(index, 1);
  }
  checkValidRecord();
}

function isRecordValid(record) {
  // Check required fields
  if (!record.recycleTime || !record.ward) return false;

  // Check that all dishes have both name and portion
  for (const dish of record.dishAndLeftoverPortion) {
    if (!dish.dishName || !dish.leftPortion) return false;
  }

  // Check meal checkboxes based on visible columns
  if (showBreakfast.value && record.breakfast !== true) return false;
  if (showLunch.value && record.lunch !== true) return false;
  if (showDinner.value && record.dinner !== true) return false;

  return true;
}

function tempSave() {
  // Check if all records are valid
  const allValid = localRecords.value.every(record => isRecordValid(record));

  const newFormData = {
    title: '病人餐點回收及盤餘抽查記錄',
    passed: {
      morning: showBreakfast.value && allValid,
      noon: showLunch.value && allValid,
      evening: showDinner.value && allValid
    },
    records: JSON.parse(JSON.stringify(localRecords.value))
  };

  // 改成api呼叫
  updateAddiForm('formThree', newFormData);
}

function save() {
  // Check if all records are valid
  const allValid = localRecords.value.every(record => isRecordValid(record));

  const newFormData = {
    title: '病人餐點回收及盤餘抽查記錄',
    passed: {
      morning: showBreakfast.value && allValid,
      noon: showLunch.value && allValid,
      evening: showDinner.value && allValid
    },
    records: JSON.parse(JSON.stringify(localRecords.value))
  };

  // 改成api呼叫
  emit('formDoneEvent', { formName: 'formThree', state: allValid ? 'success' : 'error' });
  updateAddiForm('formThree', newFormData);
  cancel();
}

function cancel() {
  emit('cancel');
}

</script>

<style scoped>
.form-three {
  max-width: 100%;
  margin: 0 auto;
}

.record-container {
  border-left: 3px solid #1976d2;
  padding-left: 8px;
}

.records-container {
  max-height: 60vh;
  overflow-y: auto;
}
</style>