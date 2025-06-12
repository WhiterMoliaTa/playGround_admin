<template>
  <v-card class="form-g4-02 pa-4">
    <v-card-title class="d-flex justify-center text-h5 font-weight-bold">
      每日衛生檢查表
    </v-card-title>

    <v-table>
      <thead>
        <tr>
          <th class="text-center" width="10%">項目</th>
          <th class="text-center" width="30%">檢查內容</th>
          <th v-if="showBreakfast" class="text-center" width="10%">上午</th>
          <th v-if="showDinner" class="text-center" width="10%">下午</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through sections -->
        <template v-for="(section, sectionIndex) in formConfig.sections" :key="`section-${sectionIndex}`">
          <!-- Loop through items in each section -->
          <tr v-for="(item, itemIndex) in section.items" :key="`item-${sectionIndex}-${itemIndex}`">
            <!-- Section title - only show on first row of each section -->
            <td v-if="itemIndex === 0" :rowspan="section.items.length" class="text-center align-middle">
              {{ section.title }}
            </td>

            <!-- Item content -->
            <td class="pa-2">{{ item.content }}</td>

            <!-- Morning checkbox -->
            <td v-if="showBreakfast" class="text-center">
              <v-btn :disabled="item.disable?.morning" icon density="compact" variant="text"
                @click="switchState(section.title, itemIndex, 'breakfast')" class="mx-2">
                <v-icon v-if="item.breakfast !== null" :color="getStateColor(item.breakfast)"
                  :icon="getStateIcon(item.breakfast)" @update:modelValue="checkAllSelcted"></v-icon>
                <span v-else class="text-grey text-body-2">-</span>
              </v-btn>
            </td>

            <!-- Noon checkbox -->
            <td v-if="showLunch" class="text-center">
              <v-btn :disabled="item.disable?.noon" icon density="compact" variant="text"
                @click="switchState(section.title, itemIndex, 'lunch')" class="mx-2">
                <v-icon v-if="item.lunch !== null" :color="getStateColor(item.lunch)" :icon="getStateIcon(item.lunch)"
                  @update:modelValue="checkAllSelcted"></v-icon>
                <span v-else class="text-grey text-body-2">-</span>
              </v-btn>
            </td>

            <!-- Evening checkbox -->
            <td v-if="showDinner" class="text-center">
              <v-btn :disabled="item.disable?.evening" icon density="compact" variant="text"
                @click="switchState(section.title, itemIndex, 'dinner')" class="mx-2">
                <v-icon v-if="item.dinner !== null" :color="getStateColor(item.dinner)"
                  :icon="getStateIcon(item.dinner)" @update:modelValue="checkAllSelcted"></v-icon>
                <span v-else class="text-grey text-body-2">-</span>
              </v-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </v-table>
    <v-row class="mt-4">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn variant="outlined" rounded @click="tempSave">暫存</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="deep-orange-lighten-4" class="text-white" :variant="!formDone ? 'outlined' : 'elevated'"
          :readonly="!formDone" rounded @click="save">儲存</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" rounded class="mr-2" @click="cancel">取消</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted, watch, computed } from 'vue';

const emit = defineEmits(['cancel', 'formDoneEvent']);

const getAddiForm = inject('getAddiForm');
const updateAddiForm = inject('updateAddiForm');

const props = defineProps({
  title: {
    type: String,
    default: '每日衛生檢查表'
  },
  formConfig: {
    type: Object,
    default: () => ({})
  },
  time: {
    type: String,
    default: ''
  }
});

const formItems = ref([]);

onMounted(() => {
  loadFormData();
});

watch(() => props.formConfig, () => {
  loadFormData();
}, { deep: true });

const showBreakfast = computed(() => props.time.includes('morning'));
const showLunch = computed(() => props.time.includes('noon'));
const showDinner = computed(() => props.time.includes('evening'));

function loadFormData() {
  // 改成api取得
  let additionalForm = getAddiForm('formG402');
  if (additionalForm) {
    let firstForm = additionalForm;
    if (firstForm.sections && Array.isArray(firstForm.sections)) {
      formItems.value = JSON.parse(JSON.stringify(firstForm.sections));
    } else {
      alert('異常：無法取得表單資料');
    }
  } else {
    alert('異常：無法取得表單資料');
  }
  checkAllSelcted();
}

const formDone = ref(false);

function getStateColor(state) {
  if (state === 'good') return 'success';
  if (state === 'ok') return 'warning';
  if (state === 'bad') return 'error';
  return '';
}

function getStateIcon(state) {
  if (state === 'good') return 'mdi-check-circle';
  if (state === 'ok') return 'mdi-alert-circle-outline';
  if (state === 'bad') return 'mdi-close-circle';
  return '';
}

function switchState(sectionKey, itemIndex, mealTime) {

  // Get the current item
  const item = props.formConfig.sections
    .find(s => s.title === sectionKey).items[itemIndex];

  // Cycle through states: null -> 'good' -> 'ok' -> bad -> loop back to 'good'
  switch (item[mealTime]) {
    case null:
      item[mealTime] = 'good';
      break;
    case 'good':
      item[mealTime] = 'ok';
      break;
    case 'ok':
      item[mealTime] = 'bad';
      break;
    case 'bad':
      item[mealTime] = 'good';
      break;
    default:
      item[mealTime] = 'good';
  }
}

function checkAllSelcted() {
  formDone.value = formItems.value.every(section => {
    return section.items.every(item => {
      if (showBreakfast.value && item.breakfast == null && !item.disable.morning) return false;
      if (showLunch.value && item.lunch == null) return false;
      if (showDinner.value && item.dinner === null && !item.disable.evening) return false;
      return true;
    });
  });
};

function tempSave() {
  let formNoProblem = formItems.value.every(section => {
    section.items.every(item => {
      if (showBreakfast.value && item.breakfast == null && !item.disable.morning) return false;
      if (showLunch.value && item.lunch == null) return false;
      if (showDinner.value && item.dinner === null && !item.disable.evening) return false;
      if (item.breakfast !== 'good' || item.lunch !== 'good' || item.dinner !== 'good') return false;
      return true;
    });
  });
  const newFormData = {
    title: '每日衛生檢查表',
    passed: {
      morning: showBreakfast.value && formNoProblem,
      noon: showLunch.value && formNoProblem,
      evening: showDinner.value && formNoProblem
    },
    sections: JSON.parse(JSON.stringify(formItems.value))
  };
  //改成api呼叫
  updateAddiForm('formG402', newFormData);
}

function save() {
  let formNoProblem = formItems.value.every(section => {
    section.items.every(item => {
      if (showBreakfast.value && item.breakfast == null && !item.disable.morning) return false;
      if (showLunch.value && item.lunch == null) return false;
      if (showDinner.value && item.dinner === null && !item.disable.evening) return false;
      if (item.breakfast !== 'good' || item.lunch !== 'good' || item.dinner !== 'good') return false;
      return true;
    });
  });
  let state = formNoProblem ? 'success' : 'error';

  let newFormData = {
    title: '每日衛生檢查表',
    passed: {
      morning: showBreakfast && formNoProblem,
      noon: showLunch.value && formNoProblem,
      evening: showDinner.value && formNoProblem
    },
    sections: JSON.parse(JSON.stringify(formItems.value))
  };
  //改成api呼叫
  updateAddiForm('formG402', newFormData);
  emit('formDoneEvent', { formName: 'formG402', state: state });
  cancel();
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.form-g4-02 {
  max-height: 80vh;
  margin: 0 auto;
  overflow-y: auto;
}

th,
td {
  padding: 8px;
  text-align: left;
  vertical-align: middle;
}

.v-table {
  font-size: 1rem;
  border-collapse: collapse;
}

.v-table td {
  vertical-align: middle;
}

.v-table tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.v-icon.small {
  font-size: 18px;
}
</style>