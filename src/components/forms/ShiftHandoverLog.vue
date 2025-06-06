<template>
    <div class="shift-handover-log">
        <v-card>
            <v-card-title class="text-center">交班事項</v-card-title>
            <v-card-text>
                <v-table fixed-header>
                    <thead>
                        <tr>
                            <th>內容</th>
                            <th>簽名</th>
                            <th>處理說明</th>
                            <th>處理者簽名</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(entry, index) in logEntry" :key="index">
                            <td>{{ entry.content }}</td>
                            <td>{{ entry.signature }}</td>
                            <td>{{ entry.processHandleDesc }}</td>
                            <td>{{ entry.handlerSignature }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
            <v-card-actions>
                <v-btn color="secondary" @click="haveReadAll()">閱覽完畢</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';

const $emit = defineEmits(['formDone', 'cancel']);

const props = defineProps({
    time: {
        type: String,
        default: ''
    },
    formConfig: {
        type: Object,
        default: () => ({})
    }
});

const logEntry = ref({});

watch(() => props.formConfig, (newVal) => {
    if (newVal) {
        logEntry.value = newVal;
    }
}, { immediate: true });

function haveReadAll(){
    $emit('formDone', 'shiftHandoverLog');
    $emit('cancel');
}

</script>

<style scoped>
.shift-handover-log {
    width: 100%;
    max-height: 70vh;
}
</style>