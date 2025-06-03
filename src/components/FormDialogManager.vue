<template>
  <v-dialog v-model="showManger" max-width="500">
    <div v-if="props.form === 'formFive'">
      <FormFive :personalRecords="formConfig" :time="props.time" @save="handleSave" @cancel="handleCancel" />
    </div>
    <div v-else-if="props.form === 'formOneAndTwo'">
      <FormOneAndTwo :formConfig="formConfig" @save="handleSave" @cancel="handleCancel" />
    </div>
  </v-dialog>
</template>
<script setup>
import { computed } from 'vue';
import FormFive from './forms/FormFive.vue';
import FormOneAndTwo from './forms/FormOneAndTwo.vue';


const emit = defineEmits(['update:showForm', 'submitForm']);

const props = defineProps({
  showForm: Boolean,
  form: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: ''
  },
  formConfig: {
    type: Object,
    default: () => ({})
  },
});

const showManger = computed({
  get: () => props.showForm,
  set: (value) => emit('update:showForm', value)
});

function closeManger() {
  emit('update:showForm', false);
}

function handleSave(data) {
  emit('submitForm', data);
  emit('update:showForm', false);
}

function handleCancel() {
  emit('update:showForm', false);
}


</script>