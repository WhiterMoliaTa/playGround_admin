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
          @update:modelValue="checkBoxCheck" :rules="baseCheckRules">
        </v-checkbox>
      </v-card-text>
      <v-card-text>
        <v-btn outlined v-for="formBtn in formButtons" :key="formBtn.id"
          @click="openFormDialog(formBtn.formName, formBtn.time)" width="100%" class="mt-1">
          {{ formBtn.label }}
          <template v-slot:append>
            <v-icon :color="buttonColor(formBtn.formName, formBtn.time)">mdi-check-circle</v-icon>
          </template>
        </v-btn>
      </v-card-text>
      <v-card-text>
        {{ reminder }}
      </v-card-text>


      <v-container class="d-flex justify-space-around">
        <v-btn rounded="xl" :color="allDone ? 'deep-orange-lighten-4' : 'grey'" class="text-white" :readonly="!allDone"
          @click="ableToCloseDialog">檢核確認</v-btn>
        <v-btn v-if="props.additionalForm && !formRequired" rounded="xl" outlined
          @click="openSingleAdditionalForm">填寫紀錄表</v-btn>
      </v-container>
    </v-card>
  </v-dialog>
  <form-dialog-manager v-model:showForm="showFormDialog" :form="form" :time="time" :form-config="formConfig"
    @currentformDone="updateFormDone($event, time)" />
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import FormDialogComponent from './FormDialogComponent.vue';
import FormDialogManager from './FormDialogManager.vue';

const modifyPass = inject('modifyJobPass');
const getAddiForm = inject('getAddiForm');

const showFormDialog = ref(false);
const formConfig = ref(null);
const allDone = ref(false);
const formDones = ref({});
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

function updateAllDone() {
  let checkFormAllDone = true;
  if (props.formRequired) {
    checkFormAllDone = props.formName.every(name => !!formDones.value[`${name}-${props.time}`]);
  }
  let checkBoxAllDone = props.checkBoxs.every(cb => cb.checked);
  allDone.value = checkFormAllDone && checkBoxAllDone;
}

function dbugs(place) {
  console.log(`----${place}-----\n%O\n-------------`,
    {
      formRequired: props.formRequired,
      formNames: props.formName,
      allCheckboxesChecked: props.checkBoxs.every(cb => cb.checked),
      formDones: { ...formDones.value },
      formDonesLength: Object.values(formDones.value).length,
      allDone: allDone.value
    }
  );
}

const emit = defineEmits(['update:show', 'addtionalFormSubmit']);

const baseCheckRules = [
  (value) => !!value || '請確認'
];

//Change meal-log button using this function
const buttonColor = computed(() => {
  return (formName, time) => {
    const key = `${formName}-${time}`;
    // Return the color from formDones if it exists, otherwise return "grey"
    return formDones.value[key] || "grey";
  };
});

const showDialog = computed({
  get: () => {
    updateAllDone();
    return props.show;
  },
  set: (value) => emit('update:show', value)
});

watch(() => props.checkBoxs, (newVal) => {
  updateAllDone();
}, { immediate: false });

function checkBoxCheck() {
  updateAllDone();
}

function ableToCloseDialog() {
  let allFormNoError = true;
  if (props.formRequired) {
    allFormNoError = props.formName.every(name => {
      const key = `${name}-${props.time}`;
      return formDones.value[key] !== undefined && formDones.value[key] === 'success';
    });
  }
  if(props.formName[0] === 'formFive'){
    // 改成api取得
    getAddiForm('formFive').records.length === 0 ? allFormNoError = true : allFormNoError = false;
  }
  if(props.formName[0] === 'formSeven'){
    // 改成api取得
    getAddiForm('formSeven').records.length === 0 ? allFormNoError = true : allFormNoError = false;
  }
  modifyPass(props.formName, props.time, allFormNoError);
  showDialog.value = false;
}

function closeDialog() {
  showDialog.value = false;
}

function saveAdditionalForm(submittedData) {
  emit('addtionalFormSubmit', submittedData);
}

function resetDialogDone() {
  allDone.value = false; // Reset completion state
}

watch(() => props.show, (newVal) => {
  if (newVal === true) {
    resetDialogDone();
  }
});

function updateFormDone(event, time) {
  formDones.value[`${event.formName}-${time}`] = event.state;
  updateAllDone();
}

function openSingleAdditionalForm() {
  formConfig.value = props.additionalForm;
  form.value = props.formName[0];
  showFormDialog.value = true;
}

function openFormDialog(formName, time) {
  formConfig.value = props.additionalForm[formName] || null;
  form.value = formName;
  showFormDialog.value = true;
}


</script>
<style scoped></style>