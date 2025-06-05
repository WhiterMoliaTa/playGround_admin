<template>
  <v-dialog v-model="showManger" max-width="90vw">
    <div v-if="props.form === 'formOne'">
      <FormOne :formConfig="formConfig" 
        :time="props.time"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div>
    <div v-else-if="props.form === 'formTwo'">
      <FormTwo :formConfig="formConfig" 
        :time="props.time"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div>
    <!-- <div v-else-if="props.form === 'formOneAndTwo'">
      <FormOneAndTwo :formConfig="formConfig" 
        :time="props.time"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div> -->
    <div v-else-if="props.form === 'formThree'">
      <FormThree :formConfig="formConfig" 
        :time="props.time"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div>
    <div v-else-if="props.form === 'formFour'">
      <FormFour :formConfig="formConfig" 
        :time="props.time"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div>
    <div v-if="props.form === 'formFive'">
      <FormFive :personalRecords="formConfig" 
        :time="props.time" 
        @save="handleSave" 
        @cancel="handleCancel"
      />
    </div>
    <div v-else-if="props.form === 'formSeven'">
      <FormSeven :formConfig="formConfig" 
        :time="props.time"
        @save="handleSave" 
        @cancel="handleCancel" 
      />
    </div>
    <div v-else-if="props.form === 'shiftHandoverLog'">
      <ShiftHandoverLog :formConfig="formConfig" 
        :time="props.time"
        @cancel="handleCancel"
      /> <!--TODO 要確認下到底要不要做Save -->
    </div>
  </v-dialog>
</template>
<script setup>
import { computed } from 'vue';
import FormOneAndTwo from './forms/FormOneAndTwo.vue';
import FormOne from './forms/formOne.vue';
import FormTwo from './forms/formTwo.vue';
import FormThree from './forms/FormThree.vue';
import FormFour from './forms/FormFour.vue';
import FormFive from './forms/FormFive.vue';
import FormSeven from './forms/FormSeven.vue';
import ShiftHandoverLog from './forms/ShiftHandoverLog.vue';

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