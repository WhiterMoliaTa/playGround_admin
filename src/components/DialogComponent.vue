<template>
  <v-dialog v-model="showDialog" max-width="500" persistent>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
      </v-toolbar>
      <v-card-text>
        檢核項目{{ checkObject }}
      </v-card-text>

      <v-card-text>
        <v-checkbox v-for="checkBox in checkBoxs" :key="checkBox.id" v-model="checkBox.checked" :label="checkBox.label"
          :rules="baseCheckRules"></v-checkbox>
      </v-card-text>
      <v-card-text>
        <v-btn 
          outlined 
          v-for="formBtn in formButtons" 
          :key="formBtn.id" 
          @click="openFormDialog(formBtn.formName, formBtn.time)" 
          width="100%" 
          class="mt-1">
          {{ formBtn.label }}
            <template v-slot:append>
              <v-icon :color="isFormPassed(formBtn.formName, formBtn.time) ? 'success' : 'grey'">mdi-check-circle</v-icon>
            </template>
        </v-btn>
      </v-card-text>
      <v-card-text>
        {{ reminder }}
      </v-card-text>


      <v-container class="d-flex justify-space-around">
        <v-btn rounded="xl" color="deep-orange-lighten-4" class="text-grey" :readonly="formAllDone" @click="closeDialog" >檢核確認</v-btn>
        <v-btn v-if="props.additionalForm && !formRequired" rounded="xl" outlined @click="openSingleAdditionalForm">填寫紀錄表</v-btn>
      </v-container>
    </v-card>
  </v-dialog>
  <!-- <form-dialog-component
        v-model:showForm="showFormDialog"
        :form-config="formConfig"
        :fillFormTime="new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })"
        @submitForm="saveAdditionalForm"
    /> -->
  <form-dialog-manager 
    v-model:showForm="showFormDialog" 
    :form="form" :time="time"
    :form-config="formConfig"
  />
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import FormDialogComponent from './FormDialogComponent.vue';
import FormDialogManager from './FormDialogManager.vue';

const modifyPass = inject('modifyJobPass');

const showFormDialog = ref(false);
const formConfig = ref(null);
const formAllDone = ref(false);
const form = ref('')

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Dialog Title'
  },
  cardText: {
    type: String,
    default: 'placeholder text for card content'
  },
  subtitle: {
    type: String,
    default: ''
  },
  checkObject: {
    type: String,
    default: 'default check object'
  },
  checkBoxs: {
    type: Array,
    default: () => [{}]
  },
  formButtons: {
    type: Array,
    default: () => [{}]
  },
  formName: {
    type: Array,
    default: () => ['']
  },
  formRequired: {
    type: Boolean,
    default: false
  },
  time: {
    type: String,
    default: ''
  },
  additionalForm: {
    type: Object,
    default: null
  },
  reminder: {
    type: String,
    default: ''
  }
});

watch( () => props.formRequired, (newVal) => {
  formAllDone.value = newVal;
}, { immediate: true });

const emit = defineEmits(['update:show', 'addtionalFormSubmit']);

const baseCheckRules = [
  (value) => !!value || '請確認'
];

const showDialog = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
});

function closeDialog() {
  const unchecked = props.checkBoxs.some(cb => !cb.checked);
  modifyPass(props.formName, props.time, !unchecked);
  showDialog.value = false;
}

function saveAdditionalForm(submittedData) {
  emit('addtionalFormSubmit', submittedData);
}

function openSingleAdditionalForm() {
  console.log('DialogComponent/openSingleAdditionalForm props.additionalForm', props.additionalForm);
  formConfig.value = props.additionalForm;
  form.value = props.formName[0];
  showFormDialog.value = true;
}

function openFormDialog(formName, time) {
  formConfig.value = props.additionalForm[formName] || null;
  form.value = formName;
  showFormDialog.value = true;
}

function isFormPassed(formName, time) {
  const formData = props.additionalForm[formName]?.additionalForm;
  if (!formData || formData.length === 0) return false;
  
  // Check if this specific time period is passed
  return formData[0].passed?.[getTimePeriod(time)] === true;
}


</script>
<style scoped>
</style>