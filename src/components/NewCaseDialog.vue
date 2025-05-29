<template>
    <v-dialog persistent :model-value="modelValue" max-width="auto"
        @update:model-value="$emit('update:modelValue', $event)">
        <v-card>
            <v-card-title>新增案件</v-card-title>
            <v-card-text>
                <div class="ocr-section mb-4">
                    <v-btn color="secondary">新增OCR掃描檔案</v-btn>
                </div>
                <v-form @submit.prevent="emitSave" class="d-flex flex-column gap-3">

                    <v-row dense>
                        <v-col cols="12" md="4">
                            <v-text-field label="來文號" v-model="caseData.docId" density="compact" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-menu v-model="docDateMenu" hide-overlay offset-y :close-on-content-click="false">
                                <template #activator="{ props }">
                                    <v-text-field v-model="formattedDocDate" label="來文日期" readonly v-bind="props"
                                        density="compact" />
                                </template>
                                <v-date-picker v-model="docDateRaw" @update:model-value="onDocDateSelected"
                                    show-adjacent-months color="primary" hide-header />
                            </v-menu>
                        </v-col>

                        <!-- 收文日期 -->
                        <v-col cols="12" md="4">
                            <v-menu v-model="receivedDateMenu" hide-overlay offset-y :close-on-content-click="false">
                                <template #activator="{ props }">
                                    <v-text-field v-model="formattedReceivedDate" label="收文日期" readonly v-bind="props"
                                        density="compact" />
                                </template>
                                <v-date-picker v-model="receivedDateRaw" @update:model-value="onReceivedDateSelected"
                                    show-adjacent-months color="primary" hide-header />
                            </v-menu>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-textarea label="案名" v-model="caseData.caseName" density="compact" rows="3" counter
                                maxlength="100" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-textarea label="診斷結果" v-model="caseData.diagnosis" density="compact" rows="3" counter
                                maxlength="500" />
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="12" md="2">
                            <v-text-field label="案件編號" v-model="caseData.caseNumber" density="compact" />
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field label="姓名" v-model="caseData.name" density="compact" />
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field label="年齡" v-model="caseData.age" type="number" density="compact" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select label="性別" :items="['男性', '女性', '其他']" v-model="caseData.gender"
                                density="compact" />
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <!-- 送醫日期 -->
                        <v-col cols="12" md="4">
                            <v-menu v-model="dispatchDateMenu" hide-overlay offset-y :close-on-content-click="false">
                                <template #activator="{ props }">
                                    <v-text-field v-model="formattedDispatchDate" label="派案日期" readonly v-bind="props"
                                        density="compact" />
                                </template>
                                <v-date-picker v-model="dispatchDateRaw" @update:model-value="onDispatchDateSelected"
                                    show-adjacent-months color="primary" hide-header />
                            </v-menu>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field label="派案醫院" v-model="caseData.dispatchHospital" density="compact" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select label="是否勞檢" :items="['是', '否']" v-model="caseData.laborInspection"
                                density="compact" />
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="12" md="4">
                            <v-text-field label="職安署承辦人" v-model="caseData.oshaHandler" density="compact" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="中心承辦人" v-model="caseData.centerHandler" density="compact" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="雇主名稱" v-model="caseData.employer" density="compact" />
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="12" md="12">
                            <v-textarea label="備註" v-model="caseData.remarks" density="compact" rows="3" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="emitSave">儲存</v-btn>
                <v-btn @click="$emit('update:modelValue', false)">取消</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, computed, watch, toRaw } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    model: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

const caseData = ref({ ...props.model })

const docDateMenu = ref(false)
const docDateRaw = ref(caseData.value.docDate || null)

const receivedDateMenu = ref(false)
const receivedDateRaw = ref(caseData.value.receivedDate || null)

const dispatchDateMenu = ref(false)
const dispatchDateRaw = ref(caseData.value.dispatchDate || null)

function formatToROC(date) {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d)) return ''
    const year = d.getFullYear() - 1911
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
}

const formattedDocDate = computed({
    get() {
        return formatToROC(docDateRaw.value)
    },
    set(_) { },
})
function onDocDateSelected(val) {
    docDateRaw.value = val
    caseData.value.docDate = formatDateToDB(val)
    docDateMenu.value = false
}

const formattedReceivedDate = computed({
    get() {
        return formatToROC(receivedDateRaw.value)
    },
    set(_) { },
})
function onReceivedDateSelected(val) {
    receivedDateRaw.value = val
    caseData.value.receivedDate = formatDateToDB(val)
    receivedDateMenu.value = false
}

// 送醫日期格式化
const formattedDispatchDate = computed({
    get() {
        return formatToROC(dispatchDateRaw.value)
    },
    set(_) { },
})
function onDispatchDateSelected(val) {
    dispatchDateRaw.value = val
    caseData.value.dispatchDate = formatDateToDB(val)
    dispatchDateMenu.value = false
}

function formatDateToDB(date) {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}


// 當 dialog 開啟時重置資料與日期狀態
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            caseData.value = { ...props.model }
            docDateRaw.value = caseData.value.docDate || null
            receivedDateRaw.value = caseData.value.receivedDate || null
            dispatchDateRaw.value = caseData.value.dispatchDate || null
        }
    }
)

function emitSave() {
    emit('save', caseData.value)
    emit('update:modelValue', false)
}
</script>
