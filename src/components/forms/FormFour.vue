<template>
  <div class="form-four">
    <v-card class="pa-4">
      <v-card-title class="text-center pb-0">{{ title }}</v-card-title>
      <v-card-subtitle class="text-center pb-4">菜餚品質與數量檢討紀錄</v-card-subtitle>

      <v-row class="my-2 font-weight-bold text-center">
        <v-col cols="5" class="d-flex align-center">檢核項目</v-col>
        <v-col :cols="adjustMealColSize" v-if="showBreakfast" class="d-flex align-center justify-center">早餐</v-col>
        <v-col :cols="adjustMealColSize" v-if="showLunch" class="d-flex align-center justify-center">午餐</v-col>
        <v-col :cols="adjustMealColSize" v-if="showDinner" class="d-flex align-center justify-center">晚餐</v-col>
        <v-col :cols="getRemarksColSize" class="d-flex align-center">備註</v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row v-for="item in formItems" :key="item.id" class="my-3">
        <v-col cols="5" class="d-flex align-center">{{ item.title }}</v-col>

        <v-col :cols="adjustMealColSize" v-if="showBreakfast" class="d-flex flex-column align-center">
          <v-radio-group inline v-model="item.breakfast" class="dflex flex-column align-center" row hide-details
            @update:modelValue="checkAllSelcted">
            <v-radio :value="true" color="success" true-icon="mdi-check-circle" false-icon="mdi-check-circle"
              density="compact"></v-radio>
            <v-radio :value="false" color="error" true-icon="mdi-close-circle" false-icon="mdi-close-circle"
              density="compact"></v-radio>
          </v-radio-group>
        </v-col>

        <v-col :cols="adjustMealColSize" v-if="showLunch" class="d-flex flex-column align-center">
          <v-radio-group inline v-model="item.lunch" class="dflex flex-column align-center" row hide-details
            @update:modelValue="checkAllSelcted">
            <v-radio :value="true" color="success" true-icon="mdi-check-circle" false-icon="mdi-check-circle"
              density="compact"></v-radio>
            <v-radio :value="false" color="error" true-icon="mdi-close-circle" false-icon="mdi-close-circle"
              density="compact"></v-radio>
          </v-radio-group>
        </v-col>

        <v-col :cols="adjustMealColSize" v-if="showDinner" class="d-flex flex-column align-center">
          <v-radio-group inline v-model="item.dinner" class="dflex flex-column align-center" row hide-details
            @update:modelValue="checkAllSelcted">
            <v-radio :value="true" color="success" true-icon="mdi-check-circle" false-icon="mdi-check-circle"
              density="compact"></v-radio>
            <v-radio :value="false" color="error" true-icon="mdi-close-circle" false-icon="mdi-close-circle"
              density="compact"></v-radio>
          </v-radio-group>
        </v-col>

        <v-col :cols="getRemarksColSize">
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

const emit = defineEmits(['save', 'cancel', 'formDoneEvent']);

const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');

const showBreakfast = computed(() => props.time.includes('morning'));
const showLunch = computed(() => props.time.includes('noon'));
const showDinner = computed(() => props.time.includes('evening'));

const formDone = ref(false);

const formItems = ref([]);

const adjustMealColSize = computed(() => {
  return 5 - [showBreakfast.value, showLunch.value, showDinner.value].filter(Boolean).length;
});

//可寫死
const getRemarksColSize = computed(() => {
  const visibleColumns = [showBreakfast.value, showLunch.value, showDinner.value].filter(Boolean).length;
  return 12 - 5 - (adjustMealColSize * visibleColumns);
});

const itemRemarks = ref(null);
const showRemarksDialog = ref(false);

function openRemarkDialog(item) {
  itemRemarks.value = item || '';
  showRemarksDialog.value = true;
}

onMounted(() => {
  loadFormData();
});

watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

function checkAllSelcted() {
  formDone.value = formItems.value.every(item => {
    if (showBreakfast.value && item.breakfast == null) return false;
    if (showLunch.value && item.lunch == null) return false;
    if (showDinner.value && item.dinner === null) return false;
    return true;
  });
};

function loadFormData() {
  // 改成api取得
  let additionalForm = getAddiForm('formFour');

  if (additionalForm) {
    let firstForm = additionalForm;

    if (firstForm.form && Array.isArray(firstForm.form)) {
      formItems.value = JSON.parse(JSON.stringify(firstForm.form));
    } else {
      alert('異常：無法取得表單資料');
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

  const newFormData = {
    title: '菜餚品質與數量檢討記錄',
    passed: {
      morning: showBreakfast.value && formItems.value.every(item => item.breakfast !== null),
      noon: showLunch.value && formItems.value.every(item => item.lunch !== null),
      evening: showDinner.value && formItems.value.every(item => item.dinner !== null)
    },
    form: JSON.parse(JSON.stringify(formItems.value))
  };
  // 改成api呼叫
  updateAddiForm('formFour', newFormData);
}

function save() {
  let formNoProblem = formItems.value.every(item => {
    if (showBreakfast.value && item.breakfast !== true) return false;
    if (showLunch.value && item.lunch !== true) return false;
    if (showDinner.value && item.dinner !== true) return false;
    return true;
  });
  let state = formNoProblem ? 'success' : 'error';

  let newFormData = {
    title: '菜餚品質與數量檢討紀錄',
    passed: {
      morning: showBreakfast.value && formNoProblem,
      noon: showLunch.value && formNoProblem,
      evening: showDinner.value && formNoProblem
    },
    form: JSON.parse(JSON.stringify(formItems.value))
  };
// 改成api呼叫
  updateAddiForm('formFour', newFormData);
  emit('formDoneEvent', { formName: 'formFour', state: state });
  cancel();
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