<template>
    <div class="form-five">
        <v-card class="pa-1">
            <v-toolbar>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-btn icon="mdi-close" @click="cancel"></v-btn>
            </v-toolbar>
            <v-row>
                <v-col cols="12" md="6">
                    日期: {{ new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) }}
                </v-col>
            </v-row>
            <v-divider></v-divider>

            <!-- Records -->
            <v-list class="scroll-container">
                <v-list-item v-for="(record, index) in localRecords" :key="index" class="mb-4">
                    <v-card class="pa-3">
                        <v-card-title class="text-subtitle-1">紀錄 #{{ index + 1 }}</v-card-title>

                        <v-row>
                            <v-col class="d-flex">
                                <v-select class="mr-3" v-model="record.personnel" :items="personnelOptions.map(option => option.name)" label="請選擇人員"
                                    outlined></v-select>
                                <v-select v-model="record.jobTitle" readonly :items="[getJobTitle(record.personnel)]" label="人員職稱"
                                    outlined></v-select>
                            </v-col>
                        </v-row>

                        <v-textarea v-model="record.notes" label="特殊狀況紀錄" outlined rows="4"></v-textarea>

                        <v-row>
                            <v-col cols="12">
                                <v-file-input v-model="record.image" label="上傳圖片" accept="image/*"
                                    outlined></v-file-input>
                                <v-img v-if="record.image" :src="url(record.image)"></v-img>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-list-item>
                <v-divider></v-divider>
                <v-btn type="button" @click="newEmptyRecord" class="mt-3 px-2 py-1 bg-blue text-white rounded">
                    新增一組 +
                </v-btn>
            </v-list>


            <!-- Action Buttons -->
            <div class="d-flex justify-end my-3">
                <v-btn color="grey" outlined @click="tempSave">暫存</v-btn>
                <v-btn color="pink" @click="save">儲存</v-btn>
                <v-btn color="grey" outlined @click="cancel">取消</v-btn>
            </div>
        </v-card>
    </div>
</template>

<script setup>
import { ref, inject, watch} from 'vue';

const updateAddiForm = inject('updateAddiForm');
const getAddiForm = inject('getAddiForm');

const props = defineProps({
    title: {
        type: String,
        default: '人事管理紀錄',
    },
    time: {
        type: String,
        default: '',
    },
    personalRecords: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['save', 'cancel', 'update:passed']);

const personnelOptions = [
    { name: '林大明', jobTitle: '供膳人員' },
    { name: '林享張', jobTitle: '供膳人員' },
    { name: '郭小俠', jobTitle: '供膳人員' }
];

function url(file) {
    if(!file) return null;

    if(file instanceof File) {
        return URL.createObjectURL(file);
    } else if (typeof file === 'string') {
        return file;
    }
};

function getJobTitle(personnelName) {
    const selectedPerson = personnelOptions.find(option => option.name === personnelName);
    return selectedPerson ? selectedPerson.jobTitle : '';
}
const formData = ref({
    passed: false,
    records: []
})
const localRecords = ref([...props.personalRecords[0].records]);

watch(
    () => props.personalRecords,
    () => {
        localRecords.value = getAddiForm('formFive')[0].records;
    },
    { immediate: true }
);

watch(
    () => localRecords.value,
    (newRecords) => {
        newRecords.forEach(record => {
            watch(
                () => record.personnel,
                (newPersonnel) => {
                    record.jobTitle = getJobTitle(newPersonnel);
                },
                { immediate: true }
            );
        });
    },
    { deep: true, immediate: true }
);

function newEmptyRecord() {
    const newRecord = {
        personnel: '',
        jobTitle: '',
        notes: '',
        image: null,
    }
    localRecords.value.push(newRecord);
}

function isRecordEmpty(record) {
    return (
        (!record.personnel || record.personnel === '') &&
        (!record.notes || record.notes === '') &&
        (!record.image)
    );
}

function save() {
    let filteredRecords = localRecords.value.filter(record => !isRecordEmpty(record));
    if (filteredRecords.length > 0) {
        const newFormData = [{
            passed: false,
            records: filteredRecords
        }];
        updateAddiForm('formFive',newFormData);
    } else {
        updateAddiForm('formFive', [{ passed:true, records: [{personnel: '', jobTitle: '', notes: '', image: null }]}]);
    }
    emit('cancel');
}

function tempSave() {
    let filteredRecords = localRecords.value.filter(record => !isRecordEmpty(record));
    if (filteredRecords.length > 0) {
        const newFormData = [{
            passed: false,
            records: filteredRecords
        }];
        updateAddiForm('formFive',newFormData);
    } else {
        updateAddiForm('formFive', [{ passed:true, records: [{personnel: '', jobTitle: '', notes: '', image: null }]}]);
    }
}

function cancel() {
    emit('cancel');
}
</script>

<style scoped>
.form-five {
    max-width: 600px;
}

.scroll-container {
    max-height: 70vh; /* Set the maximum height of the scrollable area */
    overflow-y: auto; /* Enable vertical scrolling */
}
</style>