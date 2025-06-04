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
        {{ reminder }}
      </v-card-text>


      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">檢核確認</v-btn>
        <v-btn color="error" @click="openAdditionalForm">填寫紀錄表</v-btn>
      </v-card-actions>
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
    :form="formName" :time="time"
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
    default: () => []
  },
  formName: {
    type: String,
    default: ''
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

function openAdditionalForm() {
  formConfig.value = props.additionalForm;
  console.log('DialogComponent/openAdditionalForm formConfig.value', formConfig.value);
  showFormDialog.value = true;
}

</script>