<template>
  <div class="form-two">
    <v-card class="pa-4">
      <v-card-title class="text-center pb-0">{{ title }}</v-card-title>
      <v-card-subtitle class="text-center pb-4">出餐作業查檢表</v-card-subtitle>

      <!-- Section 1: Checklist -->
      <v-card-subtitle class="pt-2 pb-0">檢查項目</v-card-subtitle>
      <v-row class="my-2 font-weight-bold text-center">
        <v-col cols="5" class="d-flex flex-column align-center">檢核項目</v-col>
        <!-- <v-col cols="3" v-if="showBreakfast" class="d-flex flex-column align-center">早餐</v-col>
        <v-col cols="3" v-if="showLunch" class="d-flex flex-column align-center">午餐</v-col>
        <v-col cols="3" v-if="showDinner" class="d-flex flex-column align-center">晚餐</v-col> -->
        <v-col cols="4"></v-col>
        <v-col :cols="getRemarksColSize()" class="d-flex flex-column align-center">備註</v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row v-for="item in section1Items" :key="item.id" class="my-3">
        <v-col cols="5" class="d-flex align-center">{{ item.title }}</v-col>

        <v-col cols="4" v-if="showBreakfast" class="d-flex flex-column align-center">
          <v-radio-group inline v-model="item.breakfast" class="dflex flex-column align-center" row hide-details
            @update:modelValue="checkAllSelcted()">
            <v-radio true-icon="mdi-check-circle" false-icon="mdi-check-circle" :value="true" color="success">
            </v-radio>
            <v-radio true-icon="mdi-close-circle" false-icon="mdi-close-circle" :value="false" color="error">
            </v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="4" v-if="showLunch" class="d-flex flex-column align-center">
          <v-checkbox-btn v-model="item.lunch" color="success" true-icon="mdi-check-circle"
            false-icon="mdi-close-circle-outline"></v-checkbox-btn>
        </v-col>

        <v-col cols="4" v-if="showDinner" class="d-flex flex-column align-center">
          <v-checkbox-btn v-model="item.dinner" color="success" true-icon="mdi-check-circle"
            false-icon="mdi-close-circle-outline"></v-checkbox-btn>
        </v-col>

        <v-col :cols="getRemarksColSize()" class="d-flex flex-column justify-center align-center">
          <!-- <v-text-field
            v-model="item.remarks"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field> -->
          <v-btn variant="text" icon @click="openRemarkDialog(item)">
            <v-icon>mdi-dots-horizontal-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Section 2: Time Inputs -->
      <v-card-subtitle class="pt-4 pb-0">送餐時間記錄</v-card-subtitle>
      <v-row class="my-2 font-weight-bold text-center">
        <v-col cols="5" class="d-flex flex-column align-cente">項目</v-col>
        <v-col cols="4" v-if="showBreakfast" class="d-flex flex-column align-center">早餐</v-col>
        <v-col cols="4" v-if="showLunch" class="d-flex flex-column align-center">午餐</v-col>
        <v-col cols="4" v-if="showDinner" class="d-flex flex-column align-center">晚餐</v-col>
        <v-col :cols="getRemarksColSize()" class="d-flex flex-column align-center">備註</v-col>
      </v-row>

      <v-divider></v-divider>


      //TODO 設定min max 可能要整個大改
      <v-row v-for="item in section2Items" :key="item.id" class="my-3">
        <v-col cols="5" class="d-flex align-center">{{ item.title }}</v-col>

        <v-col cols="4" v-if="showBreakfast" class="d-flex flex-column align-center">
          <v-text-field v-model="item.breakfast" :active="timeDialog[`breakfast-${item.id}`]"
            :focused="timeDialog[`breakfast-${item.id}`]" label="時間" readonly>
            <v-dialog v-model="timeDialog[`breakfast-${item.id}`]" activator="parent" width="auto">
              <v-time-picker v-if="timeDialog[`breakfast-${item.id}`]" v-model="item.breakfast" format="24hr"
                scrollable></v-time-picker>
            </v-dialog>
          </v-text-field>
        </v-col>

        <v-col cols="4" v-if="showLunch" class="d-flex flex-column align-center">
          <v-text-field v-model="item.lunch" :active="timeDialog[`lunch-${item.id}`]"
            :focused="timeDialog[`lunch-${item.id}`]" label="時間" readonly>
            <v-dialog v-model="timeDialog[`lunch-${item.id}`]" activator="parent" width="auto">
              <v-time-picker v-if="timeDialog[`lunch-${item.id}`]" v-model="item.lunch" format="24hr"
                scrollable></v-time-picker>
            </v-dialog>
          </v-text-field>
        </v-col>

        <v-col cols="4" v-if="showDinner" class="d-flex flex-column align-center">
          <v-text-field v-model="item.dinner" :active="timeDialog[`dinner-${item.id}`]"
            :focused="timeDialog[`dinner-${item.id}`]" label="時間" readonly>
            <v-dialog v-model="timeDialog[`dinner-${item.id}`]" activator="parent" width="auto">
              <v-time-picker v-if="timeDialog[`dinner-${item.id}`]" v-model="item.dinner" format="24hr"
                scrollable></v-time-picker>
            </v-dialog>
          </v-text-field>
        </v-col>

        <v-col :cols="getRemarksColSize()" class="d-flex flex-column justify-center align-center">
          <v-btn variant="text" icon @click="openRemarkDialog(item)">
            <v-icon>mdi-dots-horizontal-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn variant="outlined" rounded @click="tempSave">暫存</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="deep-orange-lighten-4" class="text-white" :variant="!formDone ? 'outlined' : 'elevated'"
            :readonly="!formDone" rounded @click="save">儲存</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded class="mr-2" @click="cancel">取消</v-btn>
        </v-col>
      </v-row>
      <remarks-dialog v-model:showRemarks="showRemarksDialog" :item="itemRemarks" />
    </v-card>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue';

import RemarksDialog from '../TCHG/RemarksDialog.vue';

const props = defineProps({
  title: {
    type: String,
    default: '出餐作業查檢表'
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

// Get form data access from parent
const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');
const formDone = ref(false);

const timeDialog = ref({});

// Time-based display
const showBreakfast = computed(() => props.time.includes('morning') || !props.time);
const showLunch = computed(() => props.time.includes('noon') || !props.time);
const showDinner = computed(() => props.time.includes('evening') || !props.time);

// Local form data
const section1Items = ref([]);
const section2Items = ref([]);

const itemRemarks = ref(null);
const showRemarksDialog = ref(false);

function openRemarkDialog(item) {
  itemRemarks.value = item || '';
  showRemarksDialog.value = true;
}

function checkAllSelcted() {
  formDone.value = section1Items.value.every(item => {
    if (showBreakfast.value && item.breakfast == null) return false;
    if (showLunch.value && item.lunch == null) return false;
    if (showDinner.value && item.dinner === null) return false;
    return true;
  });
};

// Determine the size of the remarks column based on visible meal columns
const getRemarksColSize = () => {
  const visibleColumns = [showBreakfast.value, showLunch.value, showDinner.value].filter(Boolean).length;
  // 12 - 5 (title column) - (2 * number of visible meal columns)
  return 12 - 5 - (4 * visibleColumns);
};

// Load form data
onMounted(() => {
  loadFormData();
});

// Watch for form config changes
watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

function loadFormData() {
  const formData = getAddiForm('formTwo');
  console.log('Loaded form data:', formData);

  if (formData && formData.length > 0) {
    const firstForm = formData[0];
    console.log('First form data:', firstForm);

    if (firstForm.section1 && Array.isArray(firstForm.section1)) {
      // Create a deep copy to avoid reference issues
      section1Items.value = JSON.parse(JSON.stringify(firstForm.section1));
    } else {
      alert('異常：無法取得表單資料');
    }

    if (firstForm.section2 && Array.isArray(firstForm.section2)) {
      section2Items.value = JSON.parse(JSON.stringify(firstForm.section2));
    } else {
      alert('異常：無法取得表單資料');
    }
  } else {
    alert('異常：無法取得表單資料');
  }
}

function tempSave() {
  // Determine if all visible checkboxes are checked
  const section1FormDone = section1Items.value.every(item => {
    if (showBreakfast.value && item.breakfast !== true) return false;
    if (showLunch.value && item.lunch !== true) return false;
    if (showDinner.value && item.dinner !== true) return false;
    return true;
  });
  const section2FormDone = section2Items.value.every(item => {
    if (showBreakfast.value && !item.breakfast) return false;
    if (showLunch.value && !item.lunch) return false;
    if (showDinner.value && !item.dinner) return false;
    return true;
  });

  // Create new form data
  const newFormData = [{
    title: '出餐作業查檢表',
    section1: JSON.parse(JSON.stringify(section1Items.value)),
    section2: JSON.parse(JSON.stringify(section2Items.value))
  }];

  // Update form data
  updateAddiForm('formTwo', newFormData);
}

function save() {
  // Determine if all visible checkboxes are checked
  const allChecked = section1Items.value.every(item => {
    if (showBreakfast.value && item.breakfast !== true) return false;
    if (showLunch.value && item.lunch !== true) return false;
    if (showDinner.value && item.dinner !== true) return false;
    return true;
  });

  // Check if all time fields are filled
  const allTimesFilled = section2Items.value.every(item => {
    if (showBreakfast.value && !item.breakfast) return false;
    if (showLunch.value && !item.lunch) return false;
    if (showDinner.value && !item.dinner) return false;
    return true;
  });

  // Create new form data
  const newFormData = [{
    title: '出餐作業查檢表',
    section1: JSON.parse(JSON.stringify(section1Items.value)),
    section2: JSON.parse(JSON.stringify(section2Items.value))
  }];

  // Update form data
  updateAddiForm('formTwo', newFormData);
  cancel();
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.form-two {
  max-width: 100%;
  height: 70vh;
  overflow-y: auto;
}
</style>