<template>
    <div>
        <v-text-field label="事件標題" v-model="model.eventTitle" dense />
        <v-text-field label="事件日期" v-model="model.eventDate" type="date" dense />
        <v-textarea label="事件描述" v-model="model.eventDescription" rows="3" dense />

        <!-- 檔案列表 -->
        <div class="my-3">
            <h4>現有檔案</h4>
            <div v-if="model.files && model.files.length > 0">
                <div v-for="file in model.files" :key="file.uuid" class="mb-2 d-flex align-center">
                    <v-btn variant="text" color="primary" @click="$emit('open-file', file.fileUrl)" class="mr-3" small>
                        <v-icon left>mdi-file-download</v-icon>
                        {{ file.fileName }}
                    </v-btn>
                    <v-btn icon small color="red" @click="$emit('remove-file', file.uuid)" variant="text">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
            </div>
            <p v-else class="text--disabled">無相關檔案 📂</p>
        </div>

        <!-- 檔案上傳 -->
        <div>
            <h4>新增檔案</h4>
            <input type="file" multiple @change="onFileSelected" />
            <div v-if="newFiles.length > 0" class="mt-2">
                <div v-for="(file, idx) in newFiles" :key="idx" class="mb-1">
                    {{ file.name }}
                    <v-btn icon small color="red" @click="removeNewFile(idx)" variant="text">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, toRefs, reactive } from 'vue';

const props = defineProps({
    model: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['open-file', 'remove-file', 'update:new-files']);

const { model } = toRefs(props);

const newFiles = reactive([])  // reactive 就是直接操作陣列
// 監聽 model.files，如果你想根據 model.files 做些事情可以在這裡寫
watch(
    () => model.files,
    (newVal) => {
        // 例如：console.log('files changed:', newVal);
    }
);

function onFileSelected(event) {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
        newFiles.push(files[i]);
    }

    event.target.value = ""; // ✅ 正確清空 input 的方式
    emit('update:new-files', newFiles);
}


function removeNewFile(index) {
    newFiles.splice(index, 1);
    emit('update:new-files', newFiles);
}
</script>
