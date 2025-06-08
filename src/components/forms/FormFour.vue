<template>
  <div class="form-four">
    <v-card class="pa-4">
      <v-card-title class="text-center pb-0">{{ title }}</v-card-title>
      <v-card-subtitle class="text-center pb-4">菜餚品質與數量檢討紀錄</v-card-subtitle>

      <v-row class="my-2 font-weight-bold text-center">
        <v-col cols="5" class="d-flex align-center">檢核項目</v-col>
        <v-col cols="2" v-if="showBreakfast" class="d-flex align-center justify-center">早餐</v-col>
        <v-col cols="2" v-if="showLunch" class="d-flex align-center justify-center">午餐</v-col>
        <v-col cols="2" v-if="showDinner" class="d-flex align-center justify-center">晚餐</v-col>
        <v-col :cols="getRemarksColSize()" class="d-flex align-center">備註</v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row v-for="item in formItems" :key="item.id" class="my-3">
        <v-col cols="5" class="d-flex align-center">{{ item.title }}</v-col>
        
        <v-col cols="2" v-if="showBreakfast" class="d-flex flex-column align-center">
          <v-checkbox-btn
            v-model="item.breakfast"
            color="success"
            true-icon="mdi-check-circle"
            false-icon="mdi-close-circle-outline"
          ></v-checkbox-btn>
        </v-col>
        
        <v-col cols="2" v-if="showLunch" class="d-flex flex-column align-center">
          <v-checkbox-btn
            v-model="item.lunch"
            color="success"
            true-icon="mdi-check-circle"
            false-icon="mdi-close-circle-outline"
          ></v-checkbox-btn>
        </v-col>
        
        <v-col cols="2" v-if="showDinner" class="d-flex flex-column align-center">
          <v-checkbox-btn
            v-model="item.dinner"
            color="success"
            true-icon="mdi-check-circle"
            false-icon="mdi-close-circle-outline"
          ></v-checkbox-btn>
        </v-col>
        
        <v-col :cols="getRemarksColSize()">
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
          <v-btn color="error" variant="text" class="mr-2" @click="cancel">取消</v-btn>
          <v-btn color="primary" @click="save">儲存</v-btn>
        </v-col>
      </v-row>
      <!-- <v-dialog v-model="showRemarksDialog">
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
      </v-dialog> -->
      <remarks-dialog
        v-model:showRemarks="showRemarksDialog"
        :item="itemRemarks"
      />
    </v-card>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue';

import RemarksDialog from '../TCHG/RemarksDialog.vue';

const props = defineProps({
  title: {
    type: String,
    default: '菜餚品質與數量檢討記錄'
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

// Time-based display
const showBreakfast = computed(() => props.time.includes('morning'));
const showLunch = computed(() => props.time.includes('noon'));
const showDinner = computed(() => props.time.includes('evening'));

// Local form data
const formItems = ref([]);

// Determine the size of the remarks column based on visible meal columns
const getRemarksColSize = () => {
  const visibleColumns = [showBreakfast.value, showLunch.value, showDinner.value].filter(Boolean).length;
  // 12 - 5 (title column) - (2 * number of visible meal columns)
  return 12 - 5 - (2 * visibleColumns);
};

const itemRemarks = ref(null);
const showRemarksDialog = ref(false);

function openRemarkDialog(item) {
  itemRemarks.value = item || '';
  showRemarksDialog.value = true;
}

// function updateJobRemark() {
//   closeRemarksDialog();
// }

// function closeRemarksDialog() {
//   showRemarksDialog.value = false;
// }

// Load form data
onMounted(() => {
  loadFormData();
});

// Watch for form config changes
watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

function loadFormData() {
  let additionalForm = getAddiForm('formFour');
  
  if (additionalForm && additionalForm.length > 0) {
    let firstForm = additionalForm[0];
    
    if (firstForm.form && Array.isArray(firstForm.form)) {
      formItems.value = JSON.parse(JSON.stringify(firstForm.form));
    } else {
      alert('異常：無法取得表單資料');
    }
  } else {
    alert('異常：無法取得表單資料');
  }
}

function save() {
  let allChecked = formItems.value.every(item => {
    if (showBreakfast.value && item.breakfast !== true) return false;
    if (showLunch.value && item.lunch !== true) return false;
    if (showDinner.value && item.dinner !== true) return false;
    return true;
  });

  let newFormData = [{
    title: '菜餚品質與數量檢討紀錄',
    form: JSON.parse(JSON.stringify(formItems.value))
  }];

  updateAddiForm('formFour', newFormData);
  emit('save', newFormData);
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.form-four {
  max-width: 800px;
  margin: 0 auto;
}
</style>