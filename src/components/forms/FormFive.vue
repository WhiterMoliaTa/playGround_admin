<template>
  <v-container class="form-five">
    <v-card class="pa-1">
      <v-toolbar>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-btn icon="mdi-close" @click="cancel"></v-btn>
      </v-toolbar>
      <v-row>
        <v-col cols="12" md="6">
          日期: {{ new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) }}
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <!-- Records -->
      <v-list class="scroll-container" v-model:opened="open">
        <v-list-group v-for="(record, index) in localRecords" :key="index" :value="`record-${index}`" class="mb-4">
          <template v-slot:activator="{ props }">
            <v-list-item :title="`紀錄 #${index + 1}`" v-bind="props">
            </v-list-item>
          </template>
          <v-card class="pa-3">
            <v-row>
              <v-col class="d-flex">
                <v-select class="mr-3" v-model="record.personnel" :items="personnelOptions.map(option => option.name)"
                  label="請選擇人員" outlined></v-select>
                <v-select v-model="record.jobTitle" readonly :items="[getJobTitle(record.personnel)]" label="人員職稱"
                  outlined></v-select>
              </v-col>
            </v-row>

            <v-textarea v-model="record.notes" label="特殊狀況紀錄" outlined rows="4"></v-textarea>

            <v-row>
              <v-col cols="12">
                <v-file-input v-model="record.image" label="上傳圖片" accept="image/*" outlined></v-file-input>
                <v-img v-if="record.image" :src="url(record.image)"></v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-list-group>
        <v-divider class="my-1"></v-divider>
        <v-container class="d-flex align-center pa-1">
          <v-container class="pa-1">
            新增一組
          </v-container>
          <v-btn @click="newEmptyRecord" variant="plain" ref="autoScroll">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-container>
      </v-list>


      <!-- Action Buttons -->
      <div class="d-flex justify-end my-3">
        <v-btn color="grey" outlined @click="tempSave">暫存</v-btn>
        <v-btn color="pink" @click="save">儲存</v-btn>
        <v-btn color="grey" outlined @click="cancel">取消</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, inject, watch, onMounted, nextTick } from 'vue';
import { isNotBlankUtil } from '../../utils/stringUtil.js';

const updateAddiForm = inject('updateAddiForm');
const getAddiForm = inject('getAddiForm');

const props = defineProps({
  title: {
    type: String,
    default: '人事管理紀錄',
  },
  time: {
    type: String,
    default: '',
  },
  personalRecords: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['save', 'cancel']);

const personnelOptions = [
  { name: '林大明', jobTitle: '供膳人員' },
  { name: '林享張', jobTitle: '供膳人員' },
  { name: '郭小俠', jobTitle: '供膳人員' }
];

const formData = ref({
  records: []
})

const autoScroll = ref();

const localRecords = ref([]); //...props.personalRecords[0].records
const open = ref([]);

onMounted(() => {
  loadFormData();
  if(localRecords.value.length > 0) {
    open.value = ['record-0'];
  }
});

function loadFormData() {
  let additionalForm = getAddiForm('formFive');
  if (additionalForm && additionalForm.length > 0) {
    formData.value = additionalForm[0];
    const records = JSON.parse(JSON.stringify(formData.value.records));
    records.forEach(record => {
      if (record.image && typeof record.image === 'string' && 
          record.image.startsWith('data:')) {
        record.image = base64ToFile(record.image);
      }
    });
    localRecords.value = records;
  } else {
    alert('異常：無法取得表單資料');
  }
}

watch(() => props.personalRecords, () => {
  loadFormData();
}, { deep: true }
);

watch(
  () => localRecords.value,
  (newRecords) => {
    newRecords.forEach(record => {
      watch(
        () => record.personnel,
        (newPersonnel) => {
          record.jobTitle = getJobTitle(newPersonnel);
        },
        { immediate: true }
      )
    });
  },
  { deep: true, immediate: true }
);

function url(file) {
  if (!file) return null;

  if (file instanceof File) {
    return URL.createObjectURL(file);
  } else if (typeof file === 'string') {
    return file;
  }
};

function getJobTitle(personnelName) {
  const selectedPerson = personnelOptions.find(option => option.name === personnelName);
  return selectedPerson ? selectedPerson.jobTitle : '';
}

function newEmptyRecord() {
  const newRecord = {
    personnel: '',
    jobTitle: '',
    notes: '',
    image: null,
  }
  localRecords.value.push(newRecord);
  nextTick( async() => {
    autoScroll.value.$el.scrollIntoView({ behavior: 'smooth'});
  });
}

function isRecordEmpty(record) {
  return (
    !((isNotBlankUtil(record.personnel)) && (isNotBlankUtil(record.notes)))
  );
}

async function save() {
  let filteredRecords = localRecords.value.filter(record => !isRecordEmpty(record));
  if (filteredRecords.length > 0) {
    const processedRecords = await Promise.all(
      filteredRecords.map(async record => {
        const processedRecord = { ...record };
        if (record.image instanceof File) {
          processedRecord.image = await fileToBase64(record.image);
        }
        
        return processedRecord;
      })
    );
    const newFormData = [{
      records: processedRecords
    }];
    updateAddiForm('formFive', newFormData);
  } else {
    updateAddiForm('formFive', [{ records: [{ personnel: '', jobTitle: '', notes: '', image: null }] }]);
  }
  emit('cancel');
}

async function tempSave() {
  let filteredRecords = localRecords.value.filter(record => !isRecordEmpty(record));
  if (filteredRecords.length > 0) {
    const processedRecords = await Promise.all(
      filteredRecords.map(async record => {
        const processedRecord = { ...record };
        if (record.image instanceof File) {
          processedRecord.image = await fileToBase64(record.image);
        }
        
        return processedRecord;
      })
    );
    const newFormData = [{
      records: processedRecords
    }];
    updateAddiForm('formFive', newFormData);
  } else {
    updateAddiForm('formFive', [{ records: [{ personnel: '', jobTitle: '', notes: '', image: null }] }]);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    if (typeof file === 'string') {
      resolve(file);
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function base64ToFile(dataUrl, filename = 'image.jpg') {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return null;
  }
  
  // Extract the content type and base64 data
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  // Convert to binary data
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  // Create and return File object
  return new File([u8arr], filename, { type: mime });
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.form-five {
  max-width: 100%;
}

.scroll-container {
  max-height: 70vh;
  overflow-y: auto;
}
</style>