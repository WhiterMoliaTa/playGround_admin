<template>
  <v-dialog v-model="showManger" max-width="90vw">
    <div v-if="props.form === 'formOne'">
      <FormOne :formConfig="formConfig" 
        :time="props.time"
        @formDoneEvent="handleFormDone($event)"
        @save="handleSave"
        @cancel="handleCancel" 
      />
    </div>
    <div v-else-if="props.form === 'formTwo'">
      <FormTwo :formConfig="formConfig" 
        :time="props.time"
        @formDoneEvent="handleFormDone($event)"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div>
    <div v-else-if="props.form === 'formThree'">
      <FormThree :formConfig="formConfig" 
        :time="props.time"
        @formDoneEvent="handleFormDone($event)"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div>
    <div v-else-if="props.form === 'formFour'">
      <FormFour :formConfig="formConfig" 
        :time="props.time"
        @formDoneEvent="handleFormDone($event)"
        @save="handleSave"
        @cancel="handleCancel" 
      />
    </div>
    <div v-if="props.form === 'formFive'">
      <FormFive :personalRecords="formConfig" 
        :time="props.time" 
        @formDoneEvent="handleFormDone($event)"
        @save="handleSave" 
        @cancel="handleCancel"
      />
    </div>
    <div v-else-if="props.form === 'formSeven'">
      <FormSeven :formConfig="formConfig" 
        :time="props.time"
        @formDoneEvent="handleFormDone($event)"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div>
    <div v-else-if="props.form === 'shiftHandoverLog'">
      <ShiftHandoverLog :formConfig="formConfig" 
        :time="props.time"
        @cancel="handleCancel"
        @formDoneEvent="handleFormDone($event)"
      />
    </div>
    <div v-else-if="props.form === 'formG402'">
      <FormG402 :formConfig="formConfig" 
        :time="props.time"
        @formDoneEvent="handleFormDone($event)"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div>
  </v-dialog>
</template>
<script setup>
import { computed } from 'vue';
import FormOne from '../forms/formOne.vue';
import FormTwo from '../forms/formTwo.vue';
import FormThree from '../forms/FormThree.vue';
import FormFour from '../forms/FormFour.vue';
import FormFive from '../forms/FormFive.vue';
import FormSeven from '../forms/FormSeven.vue';
import ShiftHandoverLog from '../forms/ShiftHandoverLog.vue';
import FormG402 from '../forms/FormG402.vue';

const emit = defineEmits(['update:showForm', 'submitForm', 'currentformDone']);

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

function handleFormDone(event) {
  console.log(`FormDialogManager: Forwarding currentformDone event from ${event.formName}`);
  emit('currentformDone', {formName: event.formName, state: event.state});
}

</script>