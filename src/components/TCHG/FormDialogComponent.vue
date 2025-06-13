<template>
  <div>
    <v-dialog
      v-model="showFormDialog"
      max-width="500px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
        </v-toolbar>
    
        <v-card-text> 
          <div class="mb-4 text-sm">
            日期: {{ fillFormTime }}
          </div>
          <form @submit.prevent="handleFormSubmit">
            <div v-for="(field, index) in formConfig.fields" :key="index" class="mb-4">
              <div v-if="field.type === 'radio'">
                <label class="block mb-1">{{ field.label }}</label>
                <div v-for="option in field.options" :key="option.value">
                  <label>
                    <input type="radio" :name="field.name" :value="option.value" v-model="field.value" />
                    {{ option.label }}
                  </label>
                </div>
              </div>
    
              <div v-else-if="field.type === 'text'">
                <label class="block mb-1">{{ field.label }}</label>
                <input type="text" v-model="field.value" class="border p-1 w-full" />
              </div>
    
              <div v-else-if="field.type === 'checkbox'">
                <label class="block mb-1">{{ field.label }}</label>
                <div v-for="option in field.options" :key="option.value">
                  <label>
                    <input type="checkbox" :value="option.value" v-model="option.value" />
                    {{ option.label }}
                  </label>
                </div>
              </div>
    
              <div v-else-if="field.type === 'datatable'">
                <label class="block mb-1">{{ field.label }}</label>
                <select v-model="formData[field.name]" class="border p-1 w-full">
                  <option v-for="option in field.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
    
            <div class="flex justify-end mt-6">
              <button type="button" @click="closeDialog" class="mr-2 px-4 py-2 bg-grey rounded">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-amber-darken-4 text-white rounded">Submit</button>
            </div>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const title = ref('');

/**
* @typedef {Object} FormConfig
* @property {string} title - Title of the form dialog
* @property {FormField[]} fields - Array of form fields
*/
/**
 * @typedef {Object} FormField
 * @property {string} type - 'radio' | 'text' | 'checkbox' | 'datatable'
 * @property {string} name
 * @property {string} label
 * @property {{ label: string, value: string }[]} [options]
 */

const props = defineProps({
  showForm: Boolean,
  fillFormTime: {
    type: String,
    default: ''
  },
  /** @type {FormConfig} */
  formConfig: null
});

const showFormDialog = computed({
    get: () => props.showForm,
    set: (value) => emit('update:showForm', value)
});

function closeDialog() {
  showFormDialog.value = false;
}

const emit = defineEmits(['update:showForm', 'update:showFormDialog', 'submitForm']);

const formData = ref({});

// Initialize form data when config changes
watch(
  () => props.formConfig,
  (newConfig) => {
    if (!newConfig) return;
    title.value = newConfig.title || '';
    formData.value = {};
  },
  { immediate: true }
);

function handleFormSubmit() {
  emit('submitForm', {...formData.value});
  closeDialog();
}

</script>

<style scoped>
input[type="radio"],
input[type="checkbox"] {
  margin-right: 0.5rem;
}
</style>
