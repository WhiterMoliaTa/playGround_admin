<template>
    <v-dialog v-model="showRemarksDialog">
        <v-card>
          <v-card-title class="text-center">備註</v-card-title>
          <v-card-text>
            <v-textarea v-model="itemRemarks.remarks" label="特殊狀況" rows="3" />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="updateJobRemark">確認</v-btn>
            <v-btn color="secondary" @click="closeRemarksDialog">取消</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
});

watch( () => props.item, (newVal) => {
  if (newVal) {
    itemRemarks.value = newVal || '';
  }
}, { immediate: true });

const itemRemarks = ref(null);
const showRemarksDialog = defineModel('showRemarks');

function updateJobRemark() {
  closeRemarksDialog();
}

function closeRemarksDialog() {
  showRemarksDialog.value = false;
}
</script>