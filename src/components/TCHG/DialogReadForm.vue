<template>
  <v-dialog v-model="showDialog">
    <div class="dialog-read-form">
      <div v-if="props.form === 'formOne'">
        <FormOne :formConfig="formConfig" :time="props.time" @formDoneEvent="handleFormDone($event)" @save="handleSave"
          @cancel="handleCancel" />
      </div>
      <div v-else-if="props.form === 'formTwo'">
        <FormTwo :formConfig="formConfig" :time="props.time" @formDoneEvent="handleFormDone($event)" @save="handleSave"
          @cancel="handleCancel" />
      </div>
      <div v-else-if="props.form === 'formThree'">
        <FormThree :formConfig="formConfig" :time="props.time" @formDoneEvent="handleFormDone($event)"
          @save="handleSave" @cancel="handleCancel" />
      </div>
      <div v-else-if="props.form === 'formFour'">
        <FormFour :formConfig="formConfig" :time="props.time" @formDoneEvent="handleFormDone($event)" @save="handleSave"
          @cancel="handleCancel" />
      </div>
      <div v-if="props.form === 'formFive'">
        <FormFive :personalRecords="formConfig" :time="props.time" @formDoneEvent="handleFormDone($event)"
          @save="handleSave" @cancel="handleCancel" />
      </div>
      <div v-else-if="props.form === 'formSeven'">
        <FormSeven :formConfig="formConfig" :time="props.time" @formDoneEvent="handleFormDone($event)"
          @save="handleSave" @cancel="handleCancel" />
      </div>
      <div v-else-if="props.form === 'shiftHandoverLog'">
        <ShiftHandoverLog :formConfig="formConfig" :time="props.time" @cancel="handleCancel"
          @formDoneEvent="handleFormDone($event)" />
      </div>
      <div v-else-if="props.form === 'formG402'">
        <FormG402 :formConfig="formConfig" :time="props.time" @formDoneEvent="handleFormDone($event)" @save="handleSave"
          @cancel="handleCancel" />
      </div>
    </div>
  </v-dialog>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import FormOne from '../forms/formOne.vue';
import FormTwo from '../forms/formTwo.vue';
import FormThree from '../forms/FormThree.vue';
import FormFour from '../forms/FormFour.vue';
import FormFive from '../forms/FormFive.vue';
import FormSeven from '../forms/FormSeven.vue';
import ShiftHandoverLog from '../forms/ShiftHandoverLog.vue';
import FormG402 from '../forms/FormG402.vue';

const emit = defineEmits(['update:showReadOnly']);

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({}),
    required: true
  }
});

const showDialog = computed({
  get: () => props.show,
  set: (value) => {
    // Emit an event to parent component to update the show state
    emit('update:showReadOnly', value);
  }
});

onMounted(() => {
  // Perform any setup needed when the component is mounted
  console.log('DialogReadForm mounted with data:', props.formData);
});
</script>