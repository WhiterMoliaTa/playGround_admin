<template>
    <v-dialog persistent :model-value="modelValue" max-width="auto"
        @update:model-value="$emit('update:modelValue', $event)">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="auto">
                        <h3>{{ newCase ? '新增案件' : '編輯案件' }}</h3>
                    </v-col>
                    <v-spacer />
                    <v-col cols="auto">
                        <v-icon color="error" @click="$emit('update:modelValue', false)">mdi-close</v-icon>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" @submit.prevent="emitSave">
                    <v-stepper v-model="step">
                        <!-- Step Headers -->

                        <v-stepper-header style="display: flex;">
                            <v-stepper-item v-for="(item, index) in stepItems" :key="item.title" :title="item.title"
                                :value="index" :icon="item.icon" editable class="custom-step-item" />
                        </v-stepper-header>


                        <!-- Step Contents -->
                        <v-stepper-window>
                            <!-- Step 0: 基本資料 -->
                            <v-stepper-window-item :value="0">
                                <v-row dense>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="來文號" v-model="caseData.docId" density="compact" />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-menu v-model="docDateMenu" :close-on-content-click="false">
                                            <template #activator="{ props }">
                                                <v-text-field v-bind="props" v-model="formattedDocDate" label="來文日期"
                                                    readonly density="compact" />
                                            </template>
                                            <v-date-picker v-model="docDateRaw"
                                                @update:model-value="onDocDateSelected" />
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-menu v-model="receivedDateMenu" :close-on-content-click="false">
                                            <template #activator="{ props }">
                                                <v-text-field v-bind="props" v-model="formattedReceivedDate"
                                                    label="收文日期" readonly density="compact" />
                                            </template>
                                            <v-date-picker v-model="receivedDateRaw"
                                                @update:model-value="onReceivedDateSelected" />
                                        </v-menu>
                                    </v-col>
                                </v-row>

                                <v-row dense>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="案件編號" v-model="caseData.caseNumber" density="compact" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field label="姓名" v-model="caseData.name" density="compact" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field label="年齡" v-model="caseData.age" type="number"
                                            density="compact" />
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <v-select label="性別" :items="['男性', '女性', '其他']" v-model="caseData.gender"
                                            density="compact" />
                                    </v-col>
                                </v-row>

                                <v-row dense>
                                    <v-col cols="12" md="6">
                                        <v-textarea label="案名" v-model="caseData.caseName" rows="3" density="compact" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-textarea label="備註" v-model="caseData.remarks" rows="3" density="compact" />
                                    </v-col>
                                </v-row>

                                <v-row dense>
                                    <v-col cols="12" md="12">
                                        <v-textarea label="診斷結果" v-model="caseData.diagnosis" rows="3"
                                            density="compact" />
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center">
                                    <v-col>
                                        <v-text-field variant="underlined" prepend-icon="mdi-account" label="中心承辦人"
                                            v-model="caseData.centerHandler" />
                                    </v-col>
                                    <v-col class="text-right">
                                        <v-btn @click="step++" color="primary">下一步</v-btn>
                                    </v-col>
                                </v-row>
                            </v-stepper-window-item>

                            
                            <!-- Step 1: 派案醫院 -->
                            <v-stepper-window-item :value="1">
                                <v-row dense>
                                    <v-col cols="12" md="3">
                                        <v-menu v-model="dispatchDateMenu" :close-on-content-click="false">
                                            <template #activator="{ props }">
                                                <v-text-field v-bind="props" v-model="formattedDispatchDate"
                                                    label="派案日期" readonly density="compact" />
                                            </template>
                                            <v-date-picker v-model="dispatchDateRaw"
                                                @update:model-value="onDispatchDateSelected" />
                                        </v-menu>
                                    </v-col>

                                    <v-col cols="12" md="5">
                                        <v-hover v-slot="{ isHovering, props }">
                                            <div v-bind="props" style="position: relative;">
                                                <v-select label="派案醫院" :items="hospitals" item-title="name"
                                                    item-value="uuid" v-model="caseData.dispatchHospital.uuid"
                                                    density="compact" hide-details clearable
                                                    @update:model-value="onHospitalChange" />
                                                <v-slide-y-transition>
                                                    <v-card v-if="caseData.dispatchHospital.uuid && isHovering"
                                                        class="pa-3"
                                                        style="position: absolute; top: 100%; left: 0; z-index: 10; background-color: #f9f9f9; min-width: 100%;"
                                                        elevation="2">
                                                        <div><strong>地址：</strong>{{ caseData.dispatchHospital.address }}
                                                        </div>
                                                        <div><strong>聯絡電話：</strong>{{ caseData.dispatchHospital.contact
                                                        }}
                                                        </div>
                                                    </v-card>
                                                </v-slide-y-transition>
                                            </div>
                                        </v-hover>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-hover v-slot="{ isHovering, props }">
                                            <div v-bind="props" style="position: relative;">
                                                <v-select label="派案醫生" :items="doctors" item-title="name"
                                                    item-value="uuid" v-model="caseData.dispatchDoctor.uuid"
                                                    density="compact" hide-details clearable
                                                    @update:model-value="onDoctorChange" />

                                                <v-slide-y-transition>
                                                    <v-card v-if="caseData.dispatchDoctor.uuid && isHovering"
                                                        class="pa-3"
                                                        style="position: absolute; top: 100%; left: 0; z-index: 10; background-color: #f9f9f9; min-width: 100%;"
                                                        elevation="2">
                                                        <div><strong>專科：</strong>{{ caseData.dispatchDoctor.specialty }}
                                                        </div>
                                                        <div><strong>聯絡電話：</strong>{{ caseData.dispatchDoctor.contact }}
                                                        </div>
                                                    </v-card>
                                                </v-slide-y-transition>
                                            </div>
                                        </v-hover>
                                    </v-col>


                                    <v-col cols="12" md="12">
                                        <!-- 工具列 -->
                                        <div class="editor-menu"
                                            style="margin-bottom: 8px; display: flex; align-items: center;">
                                            <div class="left-btn-group" style="display: flex;">
                                                <v-btn icon size="small" @click="toggleBold"
                                                    :color="editor.isActive('bold') ? 'primary' : ''">
                                                    <v-icon size="18">mdi-format-bold</v-icon>
                                                </v-btn>
                                                <v-btn icon size="small" @click="toggleHeading(1)"
                                                    :color="editor.isActive('heading', { level: 1 }) ? 'primary' : ''">
                                                    <v-icon size="18">mdi-format-header-1</v-icon>
                                                </v-btn>
                                                <v-btn icon size="small" @click="toggleHeading(2)"
                                                    :color="editor.isActive('heading', { level: 2 }) ? 'primary' : ''">
                                                    <v-icon size="18">mdi-format-header-2</v-icon>
                                                </v-btn>
                                                <v-btn icon size="small" @click="toggleHeading(3)"
                                                    :color="editor.isActive('heading', { level: 3 }) ? 'primary' : ''">
                                                    <v-icon size="18">mdi-format-header-3</v-icon>
                                                </v-btn>
                                                <v-btn icon size="small" @click="clearFormatting">
                                                    <v-icon size="18">mdi-format-clear</v-icon>
                                                </v-btn>
                                                <v-btn icon size="small" color="error" @click="clearAll">
                                                    <v-icon size="18">mdi-delete-outline</v-icon>
                                                </v-btn>
                                            </div>
                                            <v-spacer />
                                            <v-menu v-model="templateMenu" :close-on-content-click="false">
                                                <template #activator="{ props }">
                                                    <v-btn v-bind="props">
                                                        派信模板
                                                    </v-btn>
                                                </template>
                                                <v-list>
                                                    <v-list-item v-for="item in dispatchItem" :key="item.title"
                                                        @mouseenter="previewTemplate(item.value)"
                                                        @mouseleave="cancelPreview()"
                                                        @click="applyTemplate(item.value)">
                                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </div>

                                        <!-- tiptap 編輯器 -->
                                        <EditorContent :editor="editor" class="tiptap-editor" />
                                    </v-col>
                                </v-row>

                                <v-row class="mt-4" justify="space-between">
                                    <v-col cols="auto">
                                        <v-btn @click="step--" class="me-2">上一步</v-btn>
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-btn @click="step++" color="primary">下一步</v-btn>
                                    </v-col>
                                </v-row>
                            </v-stepper-window-item>

                            <!-- Step 2: 雇主 -->
                            <v-stepper-window-item :value="2">
                                <v-row dense>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="雇主名稱" v-model="caseData.employer.name" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="聯絡電話" v-model="caseData.employer.contact" />
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-text-field label="地址" v-model="caseData.employer.address" />
                                    </v-col>
                                </v-row>

                                <v-row class="mt-4" justify="space-between">
                                    <v-col cols="auto">
                                        <v-btn @click="step--" class="me-2">上一步</v-btn>
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-btn @click="step++" color="primary">下一步</v-btn>
                                    </v-col>
                                </v-row>
                            </v-stepper-window-item>

                            <!-- Step 3: 勞檢 -->
                            <v-stepper-window-item :value="3">

                                <v-row dense>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="職安署承辦人" v-model="caseData.oshaHandler" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select label="勞檢機關" :items="laborInspections" item-title="name"
                                            item-value="uuid" v-model="caseData.laborInspection.uuid" hide-details
                                            clearable />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="聯絡電話" v-model="caseData.laborInspection.contact"
                                            :disabled="true" density="compact" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="地址" v-model="caseData.laborInspection.address"
                                            :disabled="true" density="compact" />
                                    </v-col>
                                </v-row>



                                <v-row class="mt-4" justify="space-between">
                                    <v-col cols="auto">
                                        <v-btn @click="step--" class="me-2">上一步</v-btn>
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-btn @click="step++" color="primary">下一步</v-btn>
                                    </v-col>
                                </v-row>
                            </v-stepper-window-item>

                            <!-- Step 4: 案件確認 -->
                            <v-stepper-window-item :value="4">

                                <showCaseCard :caseData="caseData" />

                                <div class="text-right mt-4">
                                    <v-btn @click="step--" class="me-2">上一步</v-btn>
                                    <v-btn @click="emitSave" color="primary">儲存</v-btn>
                                    <v-btn @click="$emit('update:modelValue', false)">關閉</v-btn>
                                </div>
                            </v-stepper-window-item>
                        </v-stepper-window>
                    </v-stepper>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, computed, watch, toRaw, onBeforeMount, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import cloneDeep from 'lodash/cloneDeep'
import showCaseCard from './caseDialogView.vue'

const step = ref(0)
const stepItems = [
    { title: '基本資料', icon: 'mdi-account' },
    { title: '派案醫院', icon: 'mdi-hospital-building' },
    { title: '雇主', icon: 'mdi-domain' },
    { title: '勞檢', icon: 'mdi-shield-check' },
    { title: '案件確認', icon: 'mdi-clipboard-check' }
]
const form = ref(null)


const props = defineProps({
    modelValue: Boolean,
    model: Object,
    newCase: Boolean,
})

const emit = defineEmits(['update:modelValue', 'save'])

const caseData = ref(cloneDeep(props.model))

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


// 當 dialog 開啟時根據傳入值重置資料與日期狀態
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            // console.log('Dialog 開啟，重置資料，props.model:', props.model)
            caseData.value = cloneDeep(props.model)
            docDateRaw.value = caseData.value.docDate || null
            receivedDateRaw.value = caseData.value.receivedDate || new Date()
            caseData.value.receivedDate = formatDateToDB(receivedDateRaw.value)
            dispatchDateRaw.value = caseData.value.dispatchDate || null
            caseData.value.caseNumber = caseData.value.caseNumber || formatToROC(formatDateToDB(new Date())).replace(/\//g, '') + '000'
            caseData.value.dispatchDoctor.uuid = null
            caseData.value.dispatchHospital.uuid = null
            step.value = 0
            caseData.value.centerHandler = caseData.value.centerHandler || '管理員帳戶'
        }
    }
)

function emitSave() {
    if(!caseData.value.uuid) {
        caseData.value.uuid = crypto.randomUUID()
    }
    emit('save', caseData.value)
    emit('update:modelValue', false)
}

const templateMenu = ref(false)
const dispatchItem = [
    {
        title: '歡迎信模板',
        value: `
      <h1>歡迎加入！</h1>
      <p>感謝您使用我們的服務，請注意以下事項：</p>
      <p><strong>帳號啟用：</strong>請於三天內完成啟用。</p>
      <p><strong>客服電話：</strong>0800-123-456</p>
      <p>期待與您的合作！</p>
    `
    },
    {
        title: '活動通知模板',
        value: `
      <h2>活動通知</h2>
      <p>親愛的會員：</p>
      <p>時間：6月15日下午2點</p>
      <p>地點：台北國際會議中心</p>
      <p>報名請回覆此信</p>
      <p>名額有限，請儘速報名！</p>
    `
    },
    {
        title: '系統維護通知',
        value: `
      <h3>系統維護公告</h3>
      <p>系統將於下列時間暫停服務：</p>
      <p>6月1日 00:00 - 06:00</p>
      <p>造成不便，敬請見諒。</p>
    `
    }
];



const previewValue = ref('')

const editor = new Editor({
    content: caseData.value.dispatchLetter,
    extensions: [
        StarterKit,
        Link.configure({
            openOnClick: true,
        }),

    ],
})

function previewTemplate(html) {
    previewValue.value = html
    editor.commands.setContent(html)
}

function cancelPreview() {
    previewValue.value = ''
    editor.commands.setContent(caseData.value.dispatchLetter)
}

function applyTemplate(html) {
    caseData.value.dispatchLetter = html
    editor.commands.setContent(html)
    templateMenu.value = false
}

editor.on('update', () => {
    caseData.value.dispatchLetter = editor.getHTML()
})

// 編輯器功能按鈕函式
function toggleBold() {
    editor.chain().focus().toggleBold().run()
}
function toggleHeading(level) {
    editor.chain().focus().toggleHeading({ level }).run()
}
function clearFormatting() {
    editor.chain().focus().clearNodes().unsetAllMarks().run()
}

onBeforeUnmount(() => {
    editor.destroy()
})

function clearAll() {
    editor.commands.clearContent()
    caseData.value.dispatchLetter = ''
}

const hospitals = ref([
    {
        uuid: 'hospital-001',
        name: '台北榮總醫院',
        address: '台北市中山區民權東路二段123號',
        contact: '02-1234-5678'
    },
])

const doctors = ref([
    {
        uuid: 'doctor-001',
        name: '陳醫生',
        specialty: '神經外科',
        contact: '02-1234-5678'
    },
])

const onHospitalChange = (selectedUuid) => {
    const selected = hospitals.value.find(h => h.uuid === selectedUuid)
    if (selected) {
        caseData.value.dispatchHospital = { ...selected }
    } else {
        caseData.value.dispatchHospital = { uuid: null, name: '', address: '', contact: '' }
    }
}

const onDoctorChange = (selectedUuid) => {
    const selected = doctors.value.find(d => d.uuid === selectedUuid)
    if (selected) {
        caseData.value.dispatchDoctor = { ...selected }
    } else {
        caseData.value.dispatchDoctor = { uuid: '', name: '', phone: '' }
    }
}

const laborInspections = ref([
    {
        uuid: 'inspection-001',
        name: '勞動檢查局',
        address: '台北市信義區松山路456號',
        contact: '02-8765-4321'
    },
    {
        uuid: 'inspection-002',
        name: '職業安全衛生署',
        address: '台北市大同區重慶北路三段789號',
        contact: '02-2345-6789'
    },
    {
        uuid: 'inspection-003',
        name: '勞工保險局',
        address: '台北市中正區仁愛路一段101號',
        contact: '02-3456-7890'
    }
])
watch(
    () => caseData.value.laborInspection.uuid,
    (newUuid) => {
        const selected = laborInspections.value.find((item) => item.uuid === newUuid);
        if (selected) {
            caseData.value.laborInspection.name = selected.name;
            caseData.value.laborInspection.contact = selected.contact;
            caseData.value.laborInspection.address = selected.address;
        } else {
            caseData.value.laborInspection.name = '';
            caseData.value.laborInspection.contact = '';
            caseData.value.laborInspection.address = '';
        }
    }
);
</script>
<style scoped>
.custom-step-item {
    flex: 1 1 20%;
    /* 平均五等分 */
    text-align: center;
    /* 標題置中 */
    justify-content: center;
    /* 圖示置中 */
    transition: background-color 0.3s;
}

.custom-step-item:hover {
    background-color: #f0f0f0;
    /* hover 高亮 */
    cursor: pointer;
}

.v-stepper-item--selected {
    background-color: #1976d2 !important;
    /* 選中步驟高亮 */
    color: white !important;
}

.tiptap-editor {
    border: 1px solid #ddd;
    border-radius: 4px;

    padding: 8px;
    font-size: 14px;
    background-color: white;
    overflow-y: auto;
}

.editor-menu>* {
    margin-right: 6px;
}

.left-btn-group>.v-btn {
    border-radius: 0 !important;
    /* 取消圓角 */
    width: 32px;
    /* 固定寬度 */
    height: 32px;
    /* 固定高度 */
    min-width: 32px !important;
    /* 防止v-btn自帶寬度撐開 */
    padding: 0 !important;
    /* 取消內距 */
    margin-right: 4px;
    /* 按鈕間距 */
    box-sizing: border-box;
}
</style>
