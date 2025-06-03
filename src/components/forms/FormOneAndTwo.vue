<template>
  <div>

    <v-card class="form-one-and-two">
      <v-toolbar>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-btn icon="mdi-close" @click="cancel"></v-btn>
      </v-toolbar>
      <v-tabs v-model="activeTab" color="primary" grow>
        <v-tab v-for="(formSection, index) in formData" :key="index" :value="index">
          {{ formSection.title }}
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="activeTab">
          <!-- First Form: 配膳線上督餐作業查檢表 -->
          <v-window-item :value="0">
            <v-card flat>
              <v-row class="mb-2">
                <v-col :cols="timeBasedCols.title" class="text-center font-weight-bold">檢核項目</v-col>

                <!-- Only show breakfast column for morning -->
                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal" class="text-center font-weight-bold">早餐</v-col>

                <!-- Only show lunch column for afternoon -->
                <v-col v-if="showLunch" :cols="timeBasedCols.meal" class="text-center font-weight-bold">午餐</v-col>

                <!-- Only show dinner column for evening -->
                <v-col v-if="showDinner" :cols="timeBasedCols.meal" class="text-center font-weight-bold">晚餐</v-col>

                <v-col :cols="timeBasedCols.remarks" class="text-center font-weight-bold">備註</v-col>
              </v-row>

              <!-- Use form array in first form section -->
              <v-row v-for="item in formData[0]?.form || []" :key="item.id" class="my-2" align="center">
                <v-col :cols="timeBasedCols.title">{{ item.title }}</v-col>

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal" class="text-center">
                  <v-checkbox-btn v-model="item.breakfast" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col v-if="showLunch" :cols="timeBasedCols.meal" class="text-center">
                  <v-checkbox-btn v-model="item.lunch" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col v-if="showDinner" :cols="timeBasedCols.meal" class="text-center">
                  <v-checkbox-btn v-model="item.dinner" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col :cols="timeBasedCols.remarks">
                  <v-text-field v-model="item.remarks" variant="outlined" density="compact" hide-details></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </v-window-item>

          <!-- Second Form: 出餐作業查檢表 -->
          <v-window-item :value="1">
            <v-card flat>
              <v-card-subtitle class="font-weight-bold px-0">檢核項目</v-card-subtitle>
              <v-row class="mb-2">
                <v-col :cols="timeBasedCols.title" class="text-center font-weight-bold">檢核項目</v-col>

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal" class="text-center font-weight-bold">早餐</v-col>
                <v-col v-if="showLunch" :cols="timeBasedCols.meal" class="text-center font-weight-bold">午餐</v-col>
                <v-col v-if="showDinner" :cols="timeBasedCols.meal" class="text-center font-weight-bold">晚餐</v-col>

                <v-col :cols="timeBasedCols.remarks" class="text-center font-weight-bold">備註</v-col>
              </v-row>

              <!-- Use form1 array in second form section -->
              <v-row v-for="item in formData[1]?.form1 || []" :key="item.id" class="my-2" align="center">
                <v-col :cols="timeBasedCols.title">{{ item.title }}</v-col>

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal" class="text-center">
                  <v-checkbox-btn v-model="item.breakfast" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col v-if="showLunch" :cols="timeBasedCols.meal" class="text-center">
                  <v-checkbox-btn v-model="item.lunch" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col v-if="showDinner" :cols="timeBasedCols.meal" class="text-center">
                  <v-checkbox-btn v-model="item.dinner" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col :cols="timeBasedCols.remarks">
                  <v-text-field v-model="item.remarks" variant="outlined" density="compact" hide-details></v-text-field>
                </v-col>
              </v-row>

              <v-card-subtitle class="font-weight-bold px-0 mt-6">送餐時間紀錄</v-card-subtitle>
              <v-row class="mb-2">
                <v-col :cols="timeBasedCols.title" class="text-center font-weight-bold">時間項目</v-col>

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal" class="text-center font-weight-bold">早餐</v-col>
                <v-col v-if="showLunch" :cols="timeBasedCols.meal" class="text-center font-weight-bold">午餐</v-col>
                <v-col v-if="showDinner" :cols="timeBasedCols.meal" class="text-center font-weight-bold">晚餐</v-col>

                <v-col :cols="timeBasedCols.remarks" class="text-center font-weight-bold">備註</v-col>
              </v-row>

              <!-- Use form2 array in second form section -->
              <v-row v-for="item in formData[1]?.form2 || []" :key="item.id" class="my-2" align="center">
                <v-col :cols="timeBasedCols.title">{{ item.title }}</v-col>

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal">
                  <v-text-field v-model="item.breakfast" type="time" variant="outlined" density="compact"
                    hide-details></v-text-field>
                </v-col>

                <v-col v-if="showLunch" :cols="timeBasedCols.meal">
                  <v-text-field v-model="item.lunch" type="time" variant="outlined" density="compact"
                    hide-details></v-text-field>
                </v-col>

                <v-col v-if="showDinner" :cols="timeBasedCols.meal">
                  <v-text-field v-model="item.dinner" type="time" variant="outlined" density="compact"
                    hide-details></v-text-field>
                </v-col>

                <v-col :cols="timeBasedCols.remarks">
                  <v-text-field v-model="item.remarks" variant="outlined" density="compact" hide-details></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="cancel">取消</v-btn>
        <v-btn color="primary" @click="save">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '病患配膳紀錄表'
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

const emit = defineEmits(['save', 'cancel']);

console.log(props.title, props.time, props.formConfig);
// Tab control
const activeTab = ref(0);

// Get form data from parent using inject
const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');

// Initialize local form data
const formData = ref([]);

// Determine which meal columns to show based on time
const showBreakfast = computed(() => props.time === 'morning');
const showLunch = computed(() => props.time === 'afternoon');
const showDinner = computed(() => props.time === 'evening');

// Calculate column widths based on visible columns
const timeBasedCols = computed(() => {
  // Count how many meal columns are visible
  const visibleMealColumns = [showBreakfast.value, showLunch.value, showDinner.value]
    .filter(Boolean).length;

  // If only one meal column is visible, make the title column wider
  if (visibleMealColumns === 1) {
    return {
      title: 5,
      meal: 4,
      remarks: 3
    };
  } else if (visibleMealColumns === 2) {
    return {
      title: 4,
      meal: 3,
      remarks: 2
    };
  } else {
    // Default for all three columns visible
    return {
      title: 4,
      meal: 2,
      remarks: 2
    };
  }
});

// Initialize form data when component is mounted
onMounted(() => {
  loadFormData();
});

// Watch for changes in formConfig
watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

// Load form data from parent
function loadFormData() {
  const additionalForm = getAddiForm('formOneAndTwo');
  console.log('Loading form data:', additionalForm);

  if (additionalForm && additionalForm.length > 0) {
    // Create a deep copy to prevent reference issues
    formData.value = JSON.parse(JSON.stringify(additionalForm));
  } else {
    // Initialize with empty structure if no data
    formData.value = [
      {
        title: '配膳線上督餐作業查檢表',
        form: []
      },
      {
        title: '出餐作業查檢表',
        form1: [],
        form2: []
      }
    ];
  }
}

// Save the form data
function save() {
  // Make sure we're saving a clean copy
  const dataToSave = JSON.parse(JSON.stringify(formData.value));

  // Update the form data in the parent component
  updateAddiForm('formOneAndTwo', dataToSave);
  emit('save', dataToSave);
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.form-one-and-two {
  max-height: 80vh;
  overflow-y: auto;
}
</style>