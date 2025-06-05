<template>
  <div class="form-three">
    <v-card class="pa-4">
      <v-card-title class="text-center pb-0">{{ title }}</v-card-title>
      <v-card-subtitle class="text-center pb-4">病人餐點回收及盤餘抽查記錄</v-card-subtitle>

      <!-- Main Records Loop -->
      <div v-for="(record, recordIndex) in localRecords" :key="recordIndex" class="record-container mb-6">
        <v-card class="pa-3" variant="outlined">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="record.recycleTime"
                label="回收時間"
                type="time"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="record.ward"
                label="病房"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="record.plate"
                label="盤數"
                type="number"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Dish and Leftover Portions -->
          <v-card-subtitle class="px-0 pt-2">餐點剩餘份量</v-card-subtitle>
          
          <div v-for="(dish, dishIndex) in record.dishAndLeftoverPortion" :key="`dish-${recordIndex}-${dishIndex}`" class="mb-2">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="dish.dishName"
                  label="餐點名稱"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="dish.leftPortion"
                  label="剩餘份量"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-center">
                <v-btn 
                  variant="text" 
                  icon="mdi-delete" 
                  size="small" 
                  color="error"
                  @click="removeDish(record, dishIndex)"
                  :disabled="record.dishAndLeftoverPortion.length <= 1"
                ></v-btn>
              </v-col>
            </v-row>
          </div>

          <v-row class="mt-2 mb-4">
            <v-col cols="12" class="d-flex justify-end">
              <v-btn 
                prepend-icon="mdi-plus" 
                variant="outlined" 
                size="small"
                @click="addDish(record)"
              >
                新增餐點
              </v-btn>
            </v-col>
          </v-row>

          <!-- Meal Checkboxes -->
          <v-row class="my-2 font-weight-bold text-center">
            <v-col cols="4" v-if="showBreakfast" class="d-flex align-center justify-center">早餐</v-col>
            <v-col cols="4" v-if="showLunch" class="d-flex align-center justify-center">午餐</v-col>
            <v-col cols="4" v-if="showDinner" class="d-flex align-center justify-center">晚餐</v-col>
          </v-row>

          <v-row>
            <v-col cols="4" v-if="showBreakfast" class="d-flex justify-center">
              <v-checkbox-btn
                v-model="record.breakfast"
                color="success"
                true-icon="mdi-check-circle"
                false-icon="mdi-close-circle-outline"
              ></v-checkbox-btn>
            </v-col>
            
            <v-col cols="4" v-if="showLunch" class="d-flex justify-center">
              <v-checkbox-btn
                v-model="record.lunch"
                color="success"
                true-icon="mdi-check-circle"
                false-icon="mdi-close-circle-outline"
              ></v-checkbox-btn>
            </v-col>
            
            <v-col cols="4" v-if="showDinner" class="d-flex justify-center">
              <v-checkbox-btn
                v-model="record.dinner"
                color="success"
                true-icon="mdi-check-circle"
                false-icon="mdi-close-circle-outline"
              ></v-checkbox-btn>
            </v-col>
          </v-row>

          <!-- Remarks -->
          <v-row class="mt-3">
            <v-col cols="12">
              <v-textarea
                v-model="record.remarks"
                label="備註"
                variant="outlined"
                rows="2"
              ></v-textarea>
            </v-col>
          </v-row>

          <!-- Delete Record Button -->
          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn 
                color="error" 
                variant="text" 
                icon="mdi-delete" 
                @click="removeRecord(recordIndex)"
                :disabled="localRecords.length <= 1"
              ></v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- Add New Record Button -->
      <v-row class="my-3">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn 
            prepend-icon="mdi-plus" 
            variant="outlined"
            @click="addNewRecord"
          >
            新增記錄
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn color="error" variant="text" class="mr-2" @click="cancel">取消</v-btn>
          <v-btn color="primary" @click="save">儲存</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '病人餐點回收及盤餘抽查記錄'
  },
  formConfig: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['save', 'cancel']);

// Get form data access from parent
const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');

// Time-based display
const showBreakfast = computed(() => props.formConfig.time === 'morning' || !props.formConfig.time);
const showLunch = computed(() => props.formConfig.time === 'afternoon' || !props.formConfig.time);
const showDinner = computed(() => props.formConfig.time === 'evening' || !props.formConfig.time);

// Local records
const localRecords = ref([]);

// Load form data
onMounted(() => {
  loadFormData();
});

// Watch for form config changes
watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

function loadFormData() {
  const formData = getAddiForm('formThree');
  console.log('Loaded form data:', formData);
  
  if (formData && formData.length > 0) {
    const firstForm = formData[0];
    
    if (firstForm.records && Array.isArray(firstForm.records)) {
      // Create a deep copy to avoid reference issues
      localRecords.value = JSON.parse(JSON.stringify(firstForm.records));
    } else {
      // Initialize with default items if no form data
      initializeDefaultRecords();
    }
  } else {
    // Initialize with default items if no form data
    initializeDefaultRecords();
  }
}

function initializeDefaultRecords() {
  localRecords.value = [
    { 
      recycleTime: '', 
      ward: '', 
      plate: 0,
      dishAndLeftoverPortion: [{ dishName: '', leftPortion: '' }],
      breakfast: null, 
      lunch: null, 
      dinner: null, 
      remarks: '' 
    }
  ];
}

function addDish(record) {
  record.dishAndLeftoverPortion.push({ dishName: '', leftPortion: '' });
}

function removeDish(record, dishIndex) {
  if (record.dishAndLeftoverPortion.length > 1) {
    record.dishAndLeftoverPortion.splice(dishIndex, 1);
  }
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

function save() {
  // Check if all records are valid
  const allValid = localRecords.value.every(isRecordValid);
  
  // Create new form data with the passed status
  const timePeriod = getTimePeriod(props.formConfig.time);
  
  // Create a passed object with the appropriate time period
  const passed = {
    morning: showBreakfast.value ? allValid : false,
    noon: showLunch.value ? allValid : false,
    evening: showDinner.value ? allValid : false
  };
  
  const newFormData = [{
    title: '病人餐點回收及盤餘抽查記錄',
    passed: passed,
    records: JSON.parse(JSON.stringify(localRecords.value))
  }];

  // Update form data
  updateAddiForm('formThree', newFormData);
  emit('save', newFormData);
}

function cancel() {
  emit('cancel');
}

function getTimePeriod(time) {
  if (time === 'morning') return 'morning';
  if (time === 'afternoon') return 'noon'; 
  if (time === 'evening') return 'evening';
  return 'morning'; // default
}
</script>

<style scoped>
.form-three {
  max-width: 800px;
  margin: 0 auto;
}

.record-container {
  border-left: 3px solid #1976d2;
  padding-left: 8px;
}
</style>