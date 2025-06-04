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

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal" class="text-center font-weight-bold">早餐</v-col>

                <v-col v-if="showLunch" :cols="timeBasedCols.meal" class="text-center font-weight-bold">午餐</v-col>

                <v-col v-if="showDinner" :cols="timeBasedCols.meal" class="text-center font-weight-bold">晚餐</v-col>

                <v-col :cols="timeBasedCols.remarks" class="text-center font-weight-bold">特殊狀況</v-col>
              </v-row>

              <v-row v-for="item in formData[0]?.form || []" :key="item.id" class="my-2 text-center" align="center">
                <v-col :cols="timeBasedCols.title">{{ item.title }}</v-col>

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal" class="d-flex flex-column align-center">
                  <v-checkbox-btn v-model="item.breakfast" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col v-if="showLunch" :cols="timeBasedCols.meal" class="d-flex flex-column align-center">
                  <v-checkbox-btn v-model="item.lunch" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col v-if="showDinner" :cols="timeBasedCols.meal" class="d-flex flex-column align-center">
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

                <v-col :cols="timeBasedCols.remarks" class="text-center font-weight-bold">特殊狀況</v-col>
              </v-row>

              <v-row v-for="item in formData[1]?.form1 || []" :key="item.id" class="my-2" align="center">
                <v-col :cols="timeBasedCols.title">{{ item.title }}</v-col>

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal" class="d-flex flex-column align-center">
                  <v-checkbox-btn v-model="item.breakfast" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col v-if="showLunch" :cols="timeBasedCols.meal" class="d-flex flex-column align-center">
                  <v-checkbox-btn v-model="item.lunch" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col v-if="showDinner" :cols="timeBasedCols.meal" class="d-flex flex-column align-center">
                  <v-checkbox-btn v-model="item.dinner" color="success" true-icon="mdi-check-circle"
                    false-icon="mdi-close-circle-outline"></v-checkbox-btn>
                </v-col>

                <v-col :cols="timeBasedCols.remarks">
                  <v-text-field v-model="item.remarks" variant="outlined" density="compact" hide-details></v-text-field>
                </v-col>
              </v-row>

              <v-card-subtitle class="font-weight-bold px-0 mt-6">送餐時間紀錄</v-card-subtitle>
              <v-row class="mb-2">
                <v-col :cols="timeBasedCols.title" class="text-center font-weight-bold">項目</v-col>

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal" class="text-center font-weight-bold">早餐</v-col>
                <v-col v-if="showLunch" :cols="timeBasedCols.meal" class="text-center font-weight-bold">午餐</v-col>
                <v-col v-if="showDinner" :cols="timeBasedCols.meal" class="text-center font-weight-bold">晚餐</v-col>

                <v-col :cols="timeBasedCols.remarks" class="text-center font-weight-bold">特殊狀況</v-col>
              </v-row>

              <!-- Use form2 array in second form section -->
              <v-row v-for="item in formData[1]?.form2 || []" :key="item.id" class="my-2" align="center">
                <v-col :cols="timeBasedCols.title">{{ item.title }}</v-col>

                <v-col v-if="showBreakfast" :cols="timeBasedCols.meal">
                    <v-text-field
                        v-model="item.breakfast"
                        :active="timeModals[`breakfast-${item.id}`]"
                        :focused="timeModals[`breakfast-${item.id}`]"
                        label="時間"
                        readonly
                      >
                        <v-dialog
                          v-model="timeModals[`breakfast-${item.id}`]"
                          activator="parent"
                          width="auto"
                        >
                          <v-time-picker
                            v-if="timeModals[`breakfast-${item.id}`]"
                            v-model="item.breakfast"
                          ></v-time-picker>
                        </v-dialog>
                      </v-text-field>
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

const emit = defineEmits(['save', 'cancel', 'update:passed']);

const activeTab = ref(0);

const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');

const formData = ref([]);

const showBreakfast = computed(() => props.time.includes('morning'));
const showLunch = computed(() => props.time.includes('noon'));
const showDinner = computed(() => props.time.includes('evening'));

const timeModals = ref({});

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

onMounted(() => {
  loadFormData();
});

watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

function loadFormData() {
  const additionalForm = getAddiForm('formOneAndTwo');

  if (additionalForm && additionalForm.length > 0) {
    formData.value = JSON.parse(JSON.stringify(additionalForm));
  } else {
    alert('異常：無法取得表單資料');
  }
}

function save() {
  const dataToSave = JSON.parse(JSON.stringify(formData.value));

  const isComplete = formData.value.every(section => {
    if (section.form2) {
      const form2Complete = section.form2.every(item =>
        (!showBreakfast.value || item.breakfast) &&
        (!showLunch.value || item.lunch) &&
        (!showDinner.value || item.dinner)
      );
      return form2Complete;
    }
    return true;
  });
  if (!isComplete) {
    props.formConfig.passed = false;
    emit('update:passed', false);
  }
  props.formConfig.passed = true;
  updateAddiForm('formOneAndTwo', dataToSave);
  emit('update:passed', true);
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
* {
  touch-action: none;
}
</style>