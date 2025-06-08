<template>
    <v-card class="pa-2">
        <v-card-title class="text-h5">
            <v-col class="d-flex align-center">
                <span>{{ editCase?.caseName }} 細項</span>
                <v-spacer />
                <v-icon icon="mdi-close" @click="$router.back()" style="cursor: pointer;" color="error" />
            </v-col>
        </v-card-title>
        <v-card-text>
            <v-tabs v-model="tab" bg-color="primary">
                <v-tab value="1">詳細資訊</v-tab>
                <v-tab value="2">節點事件</v-tab>
                <v-tab value="3">搜尋節點文件</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="1">
                    <v-card class="position-relative">
                        <v-btn class="position-absolute" style="top: 10px; right: 10px;z-index: 10;" color="primary"
                            variant="text" @click="editCaseDialog = true">
                            <v-icon>mdi-pencil</v-icon>
                            Edit
                        </v-btn>
                        <caseDialogView v-if="editCase" :caseData="editCase" :default-expanded="['1']" />
                        <caseDialogEdit v-if="editCase" :model-value="editCaseDialog"
                            @update:model-value="editCaseDialog = $event" :model="editCase" @save="saveCase"
                            :new-case="false" />
                    </v-card>
                </v-tabs-window-item>

                <v-tabs-window-item value="2">
                    <v-timeline side="end" direction="horizontal" truncate-line="both"
                        :style="{ width: '95%', margin: '0 auto' }">
                        <v-timeline-item v-for="(item, index) in caseItem" :key="item.id" :dot-color="item.color"
                            size="small" class="position-relative" style="min-width: 100px;">
                            <template #icon>
                                <v-btn icon type="button" @click.stop="onDotClick(item)" class="EventCount" tabindex="0"
                                    aria-label="點擊事件">
                                    {{ item.count > 0 ? item.count : '' }}
                                </v-btn>

                                <div class="position-absolute" :style="{
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    whiteSpace: 'nowrap',
                                    color: 'black',
                                    top: index % 2 === 0 ? '-20px' : '30px',
                                    margin: '0'
                                }">
                                    <h4 style="margin: 0; padding: 0;">{{ item.title }}</h4>
                                </div>
                            </template>
                        </v-timeline-item>
                    </v-timeline>

                    <div v-if="selectedNode" class="d-flex justify-end mt-2 me-4">
                        <v-btn :color="selectedNodeCaseAddition ? 'green' : 'blue'"
                            :variant="selectedNodeCaseAddition ? 'elevated' : 'outlined'" @click="toggleAddition"
                            class="text-white" style="min-width: 150px;"
                            :disabled="necessaryNodes.includes(selectedNode.eventType)">
                            <v-icon left>
                                {{ selectedNodeCaseAddition ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off' }}
                            </v-icon>
                            {{ selectedNodeCaseAddition ? '計入時間軸' : '不計入時間軸' }}
                        </v-btn>

                    </div>
                    <v-expansion-panels multiple class="mt-4" variant="popout" v-model="expandedEvents">
                        <v-expansion-panel v-for="(event, index) in nodeEvents" :key="event.uuid">
                            <v-expansion-panel-title hide-actions>
                                <div class="d-flex align-center w-100">
                                    <v-icon class="mr-2" :class="{ 'rotate-180': expandedEvents.includes(index) }"
                                        style="transition: transform 0.2s;">
                                        mdi-chevron-down
                                    </v-icon>

                                    <span class="mr-2 font-weight-medium">{{ event.eventTitle }}</span>

                                    <v-icon class="ml-2" color="primary">mdi-calendar</v-icon>
                                    <span class="ml-1">{{ event.eventDate }}</span>

                                    <v-badge v-if="event.files && event.files.length > 0" :content="event.files.length"
                                        color="green" class="ml-3" overlap bordered>
                                        <v-icon small color="green" style="vertical-align: middle;">mdi-file</v-icon>
                                    </v-badge>

                                    <v-spacer />

                                    <v-btn icon small @click.stop="startEdit(index)" variant="text">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon small variant="text" color="error" @click.stop="">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </div>
                            </v-expansion-panel-title>


                            <v-expansion-panel-text>
                                <div v-if="editIndex === index">
                                    <nodeEventEditor :model="editEventData" @open-file="openFile" @remove-file="removeFile"
                                        @update:new-files="updateNewFiles" />
                                    <v-divider class="my-3" />

                                    <v-btn color="primary" @click="saveEdit(index)">儲存</v-btn>
                                    <v-btn text @click="cancelEdit">取消</v-btn>
                                </div>

                                <div v-else>
                                    <p>{{ event.eventDescription }}</p>

                                    <!-- Files -->
                                    <div v-if="event.files && event.files.length > 0" class="mt-2">
                                        <div v-for="file in event.files" :key="file.uuid" class="mb-2">
                                            <v-btn variant="text" color="primary" @click="openFile(file.fileUrl)">
                                                <v-icon left>mdi-file-download</v-icon>
                                                {{ file.fileName }}
                                            </v-btn>
                                        </div>
                                    </div>
                                    <p v-else class="text--disabled">無相關檔案 📂</p>
                                </div>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <!-- New Event Dialog -->
                    <v-card v-if="newEventDialog && selectedNode" class="elevation-4 pa-4 mt-4" outlined>
                        <v-card-title>新增事件 - {{ selectedNode.title }}</v-card-title>
                        <v-card-text>
                            <v-form ref="eventForm" v-model="formValid">
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="newEvent.eventTitle" label="事件標題"
                                            :rules="[v => !!v || '必填']" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-menu v-model="dateMenu" :close-on-content-click="false" close-on-back>
                                            <template #activator="{ props }">
                                                <v-text-field v-model="newEvent.eventDate" label="事件日期" readonly
                                                    v-bind="props" :rules="[v => !!v || '必填']"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="newEvent.eventDate"
                                                @update:model-value="dateMenu = false"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea v-model="newEvent.eventDescription" label="事件描述"
                                            :rules="[v => !!v || '必填']" required></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <!-- Enhanced File Input -->
                                        <v-file-input v-model="newEvent.files" label="上傳相關檔案" multiple
                                            accept=".pdf,.doc,.docx,.txt,.jpg,.png" show-size prepend-icon=""
                                            color="deep-purple-accent-4" variant="outlined" counter>
                                            <template v-slot:selection="{ fileNames }">
                                                <template v-for="(fileName, index) in fileNames" :key="fileName">
                                                    <v-chip v-if="index < 2" class="me-2" color="deep-purple-accent-4"
                                                        size="small" label>
                                                        {{ fileName }}
                                                    </v-chip>

                                                    <span v-else-if="index === 2"
                                                        class="text-overline text-grey-darken-3 mx-2">
                                                        +{{ newEvent.files.length - 2 }} File(s)
                                                    </span>
                                                </template>
                                            </template>
                                        </v-file-input>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-btn color="primary" @click="saveNewEvent">儲存</v-btn>
                            <v-btn @click="newEventDialog = false">取消</v-btn>
                        </v-card-actions>
                    </v-card>


                    <!-- Add New Event Button -->
                    <v-card class="elevation-4 pa-4 mt-4"
                        v-if="(!newEventDialog && selectedNode) && !(oneDateNodes.includes(selectedNode?.eventType) && selectedNode?.count === 1)"
                        outlined>
                        <v-btn color="primary" variant="outlined" style="width: 99%; margin: 0 auto; display: block;"
                            @click="newEventDialog = true">
                            <v-icon left>mdi-plus</v-icon>
                            新增事件
                        </v-btn>
                    </v-card>
                </v-tabs-window-item>

                <v-tabs-window-item value="3">
                    <v-card class="elevation-4 pa-4" style="border-radius: 12px;">
                        <v-text-field label="搜尋節點文件" v-model="searchQuery" clearable outlined dense hide-details
                            style="background: #f9f9f9; border-radius: 8px;">

                        </v-text-field>

                        <v-list two-line>
                            <v-list-item v-for="file in filteredFiles" :key="file.uuid" class="file-list-item"
                                style="border-radius: 8px;" @mouseenter="hover = file.uuid" @mouseleave="hover = null"
                                :style="{ backgroundColor: hover === file.uuid ? '#e3f2fd' : 'transparent' }"
                                :title="file.fileName">
                                <template v-slot:append>
                                    <v-btn color="blue-lighten-1" icon="mdi-download" variant="text"></v-btn>
                                </template>
                            </v-list-item>

                            <v-list-item v-if="filteredFiles.length === 0" class="text-center text--disabled">
                                沒有符合搜尋條件的文件
                            </v-list-item>
                        </v-list>
                    </v-card>

                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>
<script setup>
import { onMounted, reactive, ref, toRaw, computed } from 'vue';
import { testCases } from '../../data/testCase';
import { testCaseEvents, EventFiles } from '../../data/testCaseEvent';
import caseDialogView from '../../components/caseDialogView.vue';
import caseDialogEdit from '../../components/caseDialogEdit.vue';
import { cloneDeep } from 'lodash';
import { useRoute } from 'vue-router';
import { useToast } from "vue-toastification";
import { random } from 'lodash';
const route = useRoute();
const editCase = ref(null);
const editCaseDialog = ref(false);
const getEditCase = () => {
    const caseId = route.params.id;
    // console.log('Fetching case with ID:', caseId);
    editCase.value = testCases.find(c => c.uuid === caseId) || null;
    // console.log('Edit case data:', toRaw(editCase.value));
};

onMounted(() => {
    getEditCase();
});

const saveCase = (caseData) => {
    // Logic to save the edited case
    // console.log('Saving case:', caseData);
    const index = testCases.findIndex(c => c.uuid === caseData.uuid);
    if (index !== -1) {
        testCases[index] = cloneDeep(caseData);
    } else {
        console.error('Case not found for update:', caseData.uuid);
    }
    getEditCase(); // Refresh the case data after saving
}

const tab = ref("1");

const necessaryNodes = [
    'docReceived',
    'dispatchEvaluation',
    'siteVisit',
    'replyToOsha'
];
const oneDateNodes = [
    'docReceived',
    'replyToOsha',
]

// Colors, define these somewhere globally or in data()
const necessaryCompletedColor = 'green-darken-1';
const necessaryDefaultColor = 'yellow-lighten-1';
const additionCompletedColor = 'green-lighten-2';
const completedColor = 'blue-lighten-2';
const defaultNodeColor = 'grey-lighten-2';

// `testCaseEvents` is the list of events that have been completed
// `testCases` is the list of all test cases (assuming route.params.id for context)

const getDotColor = (eventType) => {
    var isCompleted = testCaseEvents.some(event => event.eventType === eventType);
    // var isCompleted = false
    if (necessaryNodes.includes(eventType)) {
        return isCompleted ? necessaryCompletedColor : necessaryDefaultColor;
    } else {
        var addition = eventType + 'Addition';

        if (editCase.value[addition]) {
            return isCompleted ? additionCompletedColor : defaultNodeColor;
        } else {
            return isCompleted ? completedColor : defaultNodeColor;
        }

    }
};

const defaultCaseItem = [
    {
        id: 1,
        title: '來文收案',
        eventType: 'docReceived',
    },
    {
        id: 2,
        title: '派案評估',
        eventType: 'dispatchEvaluation',
    },
    {
        id: 3,
        title: '執行方向討論',
        eventType: 'executionDiscussion',
    },
    {
        id: 4,
        title: '專家諮詢/環測',
        eventType: 'expertReviewPreVisit',
    },
    {
        id: 5,
        title: '現場訪視',
        eventType: 'siteVisit',
    },
    {
        id: 6,
        title: '專家諮詢/環測',
        eventType: 'expertReviewPostVisit',
    },
    {
        id: 7,
        title: '報告初稿',
        eventType: 'reportDraft',
    },
    {
        id: 8,
        title: '報告檢視/修改',
        eventType: 'reportReview',
    },
    {
        id: 9,
        title: '函覆職安署',
        eventType: 'replyToOsha',
    },
    {
        id: 10,
        title: '書審補提',
        eventType: 'docSupplement',
    },
    {
        id: 11,
        title: '職業病鑑定會',
        eventType: 'diseaseReviewMeeting',
    },
];

const caseItem = reactive({});

const SetCaseItem = () => {
    Object.keys(caseItem).forEach(key => delete caseItem[key]);

    defaultCaseItem.forEach(item => {
        caseItem[item.eventType] = cloneDeep(item);
        caseItem[item.eventType].count = 0;
        caseItem[item.eventType].color = getDotColor(item.eventType);
    });

    testCaseEvents.forEach(event => {
        if (caseItem[event.eventType]) {
            caseItem[event.eventType].count += 1;
        }
    });
};
onMounted(() => {
    SetCaseItem();
});
const nodeEvents = reactive([]);  // 改成陣列

const setNodeCaseItem = (node) => {
    nodeEvents.splice(0);

    testCaseEvents.forEach(event => {
        if (event.eventType === node.eventType) {
            nodeEvents.push({
                ...event,
                files: []
            });
        }
    });
    EventFiles.forEach(file => {
        nodeEvents.some(event => {
            if (event.uuid === file.eventId) {
                event.files.push(file);
            }
        });
    });
    // console.log('Node Event Items:', toRaw(nodeEvents));
};
const selectedNode = ref(null);
const expandedEvents = ref([]); // 用於控制展開的事件
function onDotClick(item) {
    // console.log('點擊節點:', item);
    selectedNode.value = item;
    newEventDialog.value = false;
    expandedEvents.value = [];
    setNodeCaseItem(item);
}

const eventForm = ref(null)
const formValid = ref(false)

const dateMenu = ref(false)
const newEventDialog = ref(false);
const newEvent = reactive({})

const toast = useToast();
const saveNewEvent = () => {
    if (!formValid.value) {
        eventForm.value.validate();
        toast.error("請填寫所有必填欄位", {
            position: "bottom-center",
            timeout: 2074,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
            draggable: true,
            draggablePercent: 0.3,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: false,
            icon: true,
            rtl: false
        });
        return;
    }
    const newEventData = {
        uuid: crypto.randomUUID(),
        caseUuid: route.params.id,
        eventTitle: newEvent.eventTitle,
        eventDescription: newEvent.eventDescription,
        eventDate: newEvent.eventDate,
        eventType: selectedNode.value.eventType,
    }
    testCaseEvents.push(newEventData);
    newEvent.files?.forEach(file => {
        EventFiles.push({
            uuid: crypto.randomUUID(),
            eventId: newEventData.uuid,
            fileName: file.name,
        });
    });
    // console.log('儲存新事件:', toRaw(newEventData));
    newEventDialog.value = false; // 關閉對話框
    newEvent.eventTitle = '';
    newEvent.eventDescription = '';
    newEvent.eventDate = '';
    newEvent.files = [];
    selectedNode.value.count += 1; // 更新選定節點的事件計數
    SetCaseItem(); // 更新節點事件計數
    setNodeCaseItem(selectedNode.value); // 更新選定節點的事件列表
};
const hover = ref(null);
const searchQuery = ref('');
const filteredFiles = computed(() => {
    if (!searchQuery.value) return EventFiles;
    return EventFiles.filter(file => file.fileName.includes(searchQuery.value));
});

const selectedNodeCaseAddition = computed(() => {
    if (!selectedNode.value) return false;
    const additionKey = selectedNode.value.eventType + 'Addition';
    // console.log('Checking addition for node:', selectedNode.value.eventType, 'Key:', additionKey);
    // console.log(editCase.value[additionKey]);
    // console.log('Edit case data:', toRaw(editCase.value));
    return editCase.value[additionKey] ?? true;
});

const toggleAddition = () => {
    if (!selectedNode.value) return;
    const additionKey = selectedNode.value.eventType + 'Addition';
    editCase.value[additionKey] = !editCase.value[additionKey];
    caseItem[selectedNode.value.eventType].color = getDotColor(selectedNode.value.eventType);
};

import nodeEventEditor from '../../components/caseNodeEventEditor.vue';

const editIndex = ref(null);
const editEventData = ref(null);
const newFiles = ref([]);
function startEdit(index) {
    editIndex.value = index;
    expandedEvents.value = [index]; // 展開當前編輯的事件
    editEventData.value = JSON.parse(JSON.stringify(nodeEvents[index]));
    newFiles.value = [];
}

function cancelEdit() {
    editIndex.value = null;
    editEventData.value = null;
    newFiles.value = [];
}

function saveEdit(index) {
    if (newFiles.value.length > 0) {
        newFiles.value.forEach((file, i) => {
            editEventData.value.files.push({
                uuid: `newfile-${Date.now()}-${i}`,
                fileName: file.name,
                fileUrl: URL.createObjectURL(file),
            });
        });
        EventFiles.push(...newFiles.value.map(file => ({
            uuid: `newfile-${Date.now()}-${Math.random()}`,
            eventId: editEventData.value.uuid,
            fileName: file.name,
        })));
    }
    nodeEvents[index] = JSON.parse(JSON.stringify(editEventData.value));
    cancelEdit();
}

function openFile(url) {
    window.open(url, "_blank");
}

function removeFile(uuid) {
    editEventData.value.files = editEventData.value.files.filter((f) => f.uuid !== uuid);
}

function updateNewFiles(files) {
    newFiles.value = files;
}
</script>

<style scoped>
.EventCount {
    background-color: transparent;
    box-shadow: none;
    width: 24px;
    height: 24px;
    min-width: 24px;
    font-weight: bold;
    font-size: 14px;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
}

.file-list-item {
    transition: background-color 0.3s ease;
    cursor: pointer;
}

.rotate-180 {
    transform: rotate(180deg);
}
</style>