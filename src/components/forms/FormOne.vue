<template>
  <div class="form-one">
    <v-card class="pa-4">
      <v-card-title class="text-center pb-0">{{ title }}</v-card-title>
      <v-card-subtitle class="text-center pb-4">配膳線上督餐作業查檢表</v-card-subtitle>

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
        
        <v-col cols="2" v-if="showBreakfast" class="d-flex justify-center">
          <v-checkbox-btn
            v-model="item.breakfast"
            color="success"
            true-icon="mdi-check-circle"
            false-icon="mdi-close-circle-outline"
          ></v-checkbox-btn>
        </v-col>
        
        <v-col cols="2" v-if="showLunch" class="d-flex justify-center">
          <v-checkbox-btn
            v-model="item.lunch"
            color="success"
            true-icon="mdi-check-circle"
            false-icon="mdi-close-circle-outline"
          ></v-checkbox-btn>
        </v-col>
        
        <v-col cols="2" v-if="showDinner" class="d-flex justify-center">
          <v-checkbox-btn
            v-model="item.dinner"
            color="success"
            true-icon="mdi-check-circle"
            false-icon="mdi-close-circle-outline"
          ></v-checkbox-btn>
        </v-col>
        
        <v-col :cols="getRemarksColSize()">
          <v-text-field
            v-model="item.remarks"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

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
    default: '配膳線上督餐作業查檢表'
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

// Local form data
const formItems = ref([]);
const formPassed = ref(false);

// Determine the size of the remarks column based on visible meal columns
const getRemarksColSize = () => {
  const visibleColumns = [showBreakfast.value, showLunch.value, showDinner.value].filter(Boolean).length;
  // 12 - 5 (title column) - (2 * number of visible meal columns)
  return 12 - 5 - (2 * visibleColumns);
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
  const formData = getAddiForm('formOne');
  console.log('Loaded form data:', formData);
  
  if (formData && formData.length > 0) {
    const firstForm = formData[0];
    formPassed.value = firstForm.passed ?? false;
    
    if (firstForm.form && Array.isArray(firstForm.form)) {
      // Create a deep copy to avoid reference issues
      formItems.value = JSON.parse(JSON.stringify(firstForm.form));
    } else {
      // Initialize with default items if no form data
      initializeDefaultItems();
    }
  } else {
    // Initialize with default items if no form data
    initializeDefaultItems();
  }
}

function initializeDefaultItems() {
  formItems.value = [
    { id: 1, title: '1.保溫配膳車依菜色需求加熱(或擺放熱水)，水位須到達指定位置、熱度到達指定溫度(設定溫度≧80℃)。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 2, title: '2.確認病患用餐車已洗淨並預熱(加熱型，設定≧70℃)。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 3, title: '3.配膳前環境的清潔符合作業規範（以 75%酒精消毒輸送帶、配膳區域地面乾燥、無積水等）', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 4, title: '4.病患餐具或免洗餐具，配膳前置放於正確位置。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 5, title: '5.配膳器具，例如：勺子、夾子、煎鏟等，配膳前依菜色正確選用。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 6, title: '6. 配膳前熱食溫度需達≧60℃；冷食(分切水果)需維持設定0℃~7℃(依內控不定期抽測)。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 7, title: '7.配膳前正確洗淨雙手、佩戴外科口罩、乾淨手套、髮帽完全包覆頭髮、耳朵等。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 8, title: '8.雙手如有傷口(無則免填)應適當包紮並穿戴乳膠手套。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 9, title: '9.配膳人員就定位並避免危害食品衛生及交互污染之行為，例如：聊天、唱歌、嚼口香糖等。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 10, title: '10.依照餐卡所標示飲食種類及份量正確配膳。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 11, title: '11.留存備檢餐，各種菜餚皆須留存。', breakfast: null, lunch: null, dinner: null, remarks: '' },
    { id: 12, title: '12.配膳線上作業結束後，剩餘主食及菜餚處理。', breakfast: null, lunch: null, dinner: null, remarks: '' }
  ];
  formPassed.value = false;
}

function save() {
  // Determine if all visible checkboxes are checked
  const allChecked = formItems.value.every(item => {
    if (showBreakfast.value && item.breakfast !== true) return false;
    if (showLunch.value && item.lunch !== true) return false;
    if (showDinner.value && item.dinner !== true) return false;
    return true;
  });

  // Create new form data
  const newFormData = [{
    title: '配膳線上督餐作業查檢表',
    passed: allChecked,
    form: JSON.parse(JSON.stringify(formItems.value))
  }];

  // Update form data
  updateAddiForm('formOne', newFormData);
  emit('save', newFormData);
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.form-one {
  max-width: 800px;
  margin: 0 auto;
}
</style>