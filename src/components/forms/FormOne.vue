<template>
  <v-container>
    <v-card class="pa-4 form-one">
      <v-card-title class="text-center pb-0">{{ title }}</v-card-title>
      <v-card-subtitle class="text-center pb-4">配膳線上督餐作業查檢表</v-card-subtitle>
      <v-container>
        <div>
          <div>日期：2025/6/8 上午11:58:03</div>
          <div>時段：<span class="fillTime">{{ time === 'morning' ? '早餐' :
            time === 'noon' ? '午餐' : '晚餐' }}</span></div>
        </div>
      </v-container>
      <v-row class="my-2 font-weight-bold text-center">
        <v-col cols="5" class="d-flex align-center justify-center">檢核項目</v-col>
        <!-- <v-col cols="2" v-if="showBreakfast" class="d-flex align-center justify-center">早餐</v-col>
        <v-col cols="2" v-if="showLunch" class="d-flex align-center justify-center">午餐</v-col>
        <v-col cols="2" v-if="showDinner" class="d-flex align-center justify-center">晚餐</v-col> -->
        <v-col class="3"></v-col>
        <v-col :cols="getRemarksColSize()" class="d-flex align-center justify-center">備註</v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row v-for="item in formItems" :key="item.id" class="my-3 formItemsVrow">
        <v-col cols="5" class="d-flex align-center">{{ item.title }}</v-col>

        <v-col cols="3" v-if="showBreakfast" class="d-flex flex-column align-center">
          <v-radio-group inline v-model="item.breakfast" class="dflex flex-column align-center" row hide-details
            @update:modelValue="checkAllSelcted()">
            <v-radio :value="true" color="success" true-icon="mdi-check-circle" false-icon="mdi-check-circle"
              density="compact"></v-radio>
            <v-radio :value="false" color="error" true-icon="mdi-close-circle" false-icon="mdi-close-circle"
              density="compact"></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="3" v-if="showLunch" class="d-flex flex-column align-center">
          <v-radio-group inline v-model="item.lunch" class="dflex flex-column align-center" row hide-details
            @update="checkAllSelcted()">
            <v-radio :value="true" color="success" true-icon="mdi-check-circle" false-icon="mdi-check-circle"
              density="compact"></v-radio>
            <v-radio :value="false" color="error" true-icon="mdi-close-circle" false-icon="mdi-close-circle"
              density="compact"></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="3" v-if="showDinner" class="d-flex flex-column align-center">
          <v-radio-group inline v-model="item.dinner" class="dflex flex-column align-center" row hide-details
            @update="checkAllSelcted()">
            <v-radio :value="true" color="success" true-icon="mdi-check-circle" false-icon="mdi-check-circle"
              density="compact"></v-radio>
            <v-radio :value="false" color="error" true-icon="mdi-close-circle" false-icon="mdi-close-circle"
              density="compact"></v-radio>
          </v-radio-group>
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
  </v-container>
</template>

<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue';

import RemarksDialog from '../TCHG/RemarksDialog.vue';

const props = defineProps({
  title: {
    type: String,
    default: '配膳線上督餐作業查檢表'
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

const formDone = ref(false);

const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');

const showBreakfast = computed(() => props.time.includes('morning') || !props.time);
const showLunch = computed(() => props.time.includes('noon') || !props.time);
const showDinner = computed(() => props.time.includes('evening') || !props.time);

// Local form data
const formItems = ref([]);

// Determine the size of the remarks column based on visible meal columns
const getRemarksColSize = () => {
  const visibleColumns = [showBreakfast.value, showLunch.value, showDinner.value].filter(Boolean).length;
  // 12 - 5 (title column) - (2 * number of visible meal columns)
  return 12 - 5 - (3 * visibleColumns);
};

const itemRemarks = ref(null);
const showRemarksDialog = ref(false);

function openRemarkDialog(item) {
  itemRemarks.value = item || '';
  showRemarksDialog.value = true;
}

// Load form data
onMounted(() => {
  loadFormData();
});

// Watch for form config changes
watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

function loadFormData() {
  const formData = getAddiForm('formOne');

  if (formData && formData.length > 0) {
    const firstForm = formData[0];

    if (firstForm.form && Array.isArray(firstForm.form)) {
      // Create a deep copy to avoid reference issues
      formItems.value = JSON.parse(JSON.stringify(firstForm.form));
    }
  } else {
    alert('異常：無法取得表單資料');
  }
  formDone.value = formItems.value.every(item => {
    if (showBreakfast.value && item.breakfast == null) return false;
    if (showLunch.value && item.lunch == null) return false;
    if (showDinner.value && item.dinner === null) return false;
    return true;
  });
}

function tempSave() {
  let formNoProblem = formItems.value.every(item => {
    if (showBreakfast.value && item.breakfast !== true) return false;
    if (showLunch.value && item.lunch !== true) return false;
    if (showDinner.value && item.dinner !== true) return false;
    return true;
  });
  let state = formNoProblem ? 'success' : 'error'; 

  const newFormData = [{
    title: '配膳線上督餐作業查檢表',
    form: JSON.parse(JSON.stringify(formItems.value))
  }];

  // Update form data
  updateAddiForm('formOne', newFormData);
  emit('formDoneEvent', {formName:'formOne', state: state});
}

function save() {
  let formNoProblem = formItems.value.every(item => {
    if (showBreakfast.value && item.breakfast !== true) return false;
    if (showLunch.value && item.lunch !== true) return false;
    if (showDinner.value && item.dinner !== true) return false;
    return true;
  });
  let state = formNoProblem ? 'success' : 'error'; 

  const newFormData = [{
    title: '配膳線上督餐作業查檢表',
    form: JSON.parse(JSON.stringify(formItems.value))
  }];

  // Update form data
  updateAddiForm('formOne', newFormData);
  emit('formDoneEvent', {formName:'formOne', state: state});
  cancel();
}

function checkAllSelcted() {
  formDone.value = formItems.value.every(item => {
    if (showBreakfast.value && item.breakfast == null) return false;
    if (showLunch.value && item.lunch == null) return false;
    if (showDinner.value && item.dinner === null) return false;
    return true;
  });
};

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.form-one {
  max-width: 100%;
  height: 70vh;
  overflow-y: auto;
  margin: 0 auto;
}

.form-one::-webkit-scrollbar {
  display: none;
}

.fillTime {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  background-color: #ff859d;
}
</style>