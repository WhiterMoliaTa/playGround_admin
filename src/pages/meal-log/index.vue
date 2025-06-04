<template>
  <div class="d-flex justify-space-between align-center pa-2">
    <h1>供膳管理日誌</h1>
    <nav>
      <ul class="breadcrumb">
        <span v-for="(breadcrumb, index) in breadcrumbs" :key=index>
          <router-link :to="breadcrumb.path">{{ breadcrumb.label }}</router-link>
          <span v-if="index < breadcrumbs.length - 1"> / </span>
        </span>
      </ul>
    </nav>
  </div>
  <div class="d-flex justify-space-between align-center pa-2">
    <div>
      <v-icon>mdi-clock-outline</v-icon>
      {{ currentTime }}
    </div>
    <div>
      <v-select v-model="branch" :items="branches" label="" class="ml-4" />
    </div>
  </div>
  <v-card>
    <div class="d-flex justify-space-between align-center pa-2">
      <div>日誌檢核表</div>
      <v-chip color="purple" text-color="white">{{ completedCount }}/{{ sectionsToDone }}</v-chip>
    </div>

    <v-list>
      <v-list-group v-for="(job, index) in jobs" :key="job.section" :value="job.section">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="job.time"
            :subtitle="`${job.title} (${job.items.filter(i => i.checked).length}/${job.items.length})`"
            class="font-weight-bold">
            <template v-slot:prepend>
              <v-icon color="amber">mdi-circle</v-icon>
            </template>
          </v-list-item>
        </template>

        <div class="task-timeline">
          <v-list-item v-for="item in job.items" :key="`${index}-${item.id}`" :value="`${index}-${item.id}-val`" lines="one" class="task-item">
            <template v-slot:prepend>
              <div class="timeline-indicator"></div>
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>

            <template v-slot:append>
              <div class="d-flex align-center">
                <v-checkbox :key="`checkbox-${item.id}-${item.forms?.passed}`" true-icon="mdi-check-circle"
                  false-icon="mdi-check-circle" v-model="item.checked"
                  :color="('forms' in item) ? (item.forms.passed ? 'success' : 'error') : 'success'" hide-details
                  class="ma-0 pa-0" @change="(value) => handleCheckboxChange(item.forms, item.checked)" />
                <v-btn variant="text" icon @click="openRemarkDialog(item)">
                  <v-icon>mdi-dots-horizontal-circle</v-icon>
                </v-btn>
              </div>
            </template>
          </v-list-item>
        </div>
      </v-list-group>
    </v-list>
  </v-card>
  <DialogComponent 
    v-model:show="dialogState.show" 
    :title="dialogState.title" 
    :checkObject="dialogState.checkObject"
    :checkBoxs="dialogState.checkBoxs" 
    :additional-form="dialogState.additionalForm" 
    :form-name="dialogState.formName"
    :time="dialogState.time" 
    :reminder="dialogState.reminder" 
    @addtionalFormSubmit="saveDialogAndAdditionalForm" 
  />
  <v-dialog v-model="showRemarksDialog">
    <v-card>
      <v-card-title class="text-center">備註</v-card-title>
      <v-card-text>
        <v-textarea v-model="jobsRemarks.remarks" label="特殊狀況" rows="3" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="updateJobRemark">確認</v-btn>
        <v-btn color="secondary" @click="closeRemarksDialog">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted, provide } from 'vue';
import DialogComponent from '../../components/DialogComponent.vue';

const breadcrumbs = [
  { label: '首頁', path: '/' },
  { label: '供膳管理日誌', path: '/meal-log' }
]
const branch = ref('院本部');
const branches = ['院本部', '中興', '仁愛', '其他分院'];
const currentTime = ref(new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }));

const dialogState = reactive({
  show: false,
  title: '',
  checkObject: '',
  checkBoxs: [],
  formName: '',
  time: '',
  additionalForm: null,
  reminder: ''
});

const jobsRemarks = ref(null);
const showRemarksDialog = ref(false);

const jobs = ref([
  {
    section: "first-section",
    title: "晨點作業",
    time: "07:00-07:40",
    items: [
      { id: 1, title: '閱讀前日工作日誌及交班事項，並請相關人員簽核。', checked: false, remarks: '' },
      { id: 2, title: '檢查瓦斯漏氣受信總機指示燈號正常。', checked: false, remarks: '' },
      {
        id: 3, title: '確認員工到班及服裝儀容【人事管理記錄(表五)】。', checked: false,
        forms: {
          title: "檢核確認",
          checkObject: "確認員工到班及服裝儀容",
          checkBoxs: [
            { id: 1, label: '員工到班', checked: false },
            { id: 2, label: '服裝儀容符合規定', checked: false },
            { id: 3, label: '個人儀容符合規定', checked: false }
          ],
          reminder: "檢核項目符合規範請點選「確認」\n若有不符合規範項目,請填寫「人事管理紀錄表」",
          formName: 'formFive',
          time: 'morning',
          passed: true,
        },
        remarks: ''
      },
      {
        id: 4, title: '督導病患早餐等配膳作業(表一及表二）。', checked: false,
        forms: {
          title: "檢核確認",
          checkObject: "督導病患早餐等配膳作業",
          checkBoxs: [
            { id: 1, label: '配膳線上督餐作業查檢表', checked: false },
            { id: 2, label: '出餐作業查檢表', checked: false }
          ],
          formButtons:[
            { id: 1, label: '配膳線上督餐作業查檢表', formName: 'formOne', time: 'morning' },
            { id: 2, label: '出餐作業查檢表', formName: 'formTwo', time: 'morning' }
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「病患配膳紀錄表」",
          formName: 'formOneAndTwo',
          time: 'morning',
          passed: false,
        },
        remarks: ''
      },
      { id: 5, title: '確認早餐粥品烹煮時間符合，試吃早餐菜色。', checked: false, remarks: '' },
      { id: 6, title: '督導確認病患早餐、補餐送出(填寫漏補餐原因紀錄表)。', checked: false, remarks: '' },
      { id: 7, title: '確認冰箱溫度，冷藏庫 0℃~7℃；冷凍庫≦ -18℃。', checked: false, remarks: '' },
      { id: 8, title: '填寫菜餚品質與數量檢討記錄（表四）。', checked: false,
        forms: {
          title: "菜餚品質與數量檢討紀錄",
          checkObject: "菜餚品質與數量檢討",
          checkBoxs: [
            { id: 1, label: '菜量設計', checked: false },
            { id: 2, label: '菜餚品質(賣像)', checked: false }
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「菜餚品質與數量檢討紀錄」",
          formName: 'formFour',
          time: 'morning',
          passed: false,
        },
        remarks: ''
      },
    ],
  },
  {
    section: "second-section",
    title: "生鮮食材驗收及登錄",
    time: "07:30-08:00",
    items: [
      { id: 1, title: '生鮮食材驗收及登錄/進貨異常記錄(表七)。', checked: false, 
        forms: {
          title: "進貨廠商管理紀錄",
          checkObject: "進貨廠商管理",
          checkBoxs: [
            { id: 1, label: '無異常', checked: false },
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「進貨廠商管理紀錄」",
          formName: 'formSeven',
          time: 'morning',
          passed: true,
        },
        remarks: '' }
    ]
  },
  {
    section: "third-section",
    title: "人數及食材確認",
    time: "08:40-09:30",
    items: [
      { id: 1, title: '10.依清潔檢查表，稽核廚區早餐配膳後清潔作業。', checked: false, remarks: '' },
      { id: 2, title: '11.督導早餐餐車回收並填寫菜餚剩餘量紀錄(表三)。', checked: false, 
        forms: {

        },
        remarks: '' 
      },
      { id: 3, title: '12.督導餐具清洗作業，填寫洗碗機每週基本操作檢查表。', checked: false, remarks: '' },
      { id: 4, title: '13.檢查早餐餐車排列及清潔，確認無餐盤留於餐車內。', checked: false, remarks: '' },
      { id: 5, title: '14.填寫每日衛生檢查表(TCHG-G4-02)。', checked: false, 
        forms: {
        },
        remarks: '' 
      },
      { id: 6, title: '15.追蹤設備請修及處理情形登錄（另行登錄）。', checked: false, remarks: '' }
    ]
  }
]);

const forms = ref(
  {
    formFive: {
      additionalForm: [
        {
          passed: {
            morning: true,
            noon: true,
            evening: true
          },
          records: [{ personnel: '', jobTitle: '', notes: '', image: null }],
        }
      ],
    },
    formOneAndTwo:{
      additionalForm: [
        {
          title: '配膳線上督餐作業查檢表',
          passed: {
            morning: false,
            noon: false,
            evening: false
          },
          form: [
            { id: 1, title: '1.保溫配膳車依菜色需求加熱(或擺放熱水)，水位須到達指定位置、熱度到達指定溫度(設定溫度≧80℃)。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 2, title: '2.確認病患用餐車已洗淨並預熱(加熱型，設定≧70℃)。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 3, title: '3.配膳前環境的清潔符合作業規範（以 75%酒精消毒輸送帶、配膳區域地面乾燥、無積水等）', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 4, title: '4.病患餐具或免洗餐具，配膳前置放於正確位置。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 5, title: '5.配膳器具，例如：勺子、夾子、煎鏟等，配膳前依菜色正確選用。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 6, title: '6. 配膳前熱食溫度需達≧60℃；冷食(分切水果)需維持設定0℃~7℃(依內控不定期抽測)。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 7, title: '7.配膳前正確洗淨雙手、佩戴外科口罩、乾淨手套、髮帽完全包覆頭髮、耳朵等。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 8, title: '8.雙手如有傷口(無則免填)應適當包紮並穿戴乳膠手套。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 9, title: '9.配膳人員就定位並避免危害食品衛生及交互污染之行為，例如：聊天、唱歌、嚼口香糖等。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 10, title: '10.依照餐卡所標示飲食種類及份量正確配膳。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 11, title: '11.留存備檢餐，各種菜餚皆須留存。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 12, title: '12.配膳線上作業結束後，剩餘主食及菜餚處理。', breakfast: null, lunch: null, dinner: null, remarks: '' }
          ]
        },
        {
          title: '出餐作業查檢表',
          passed: {
            morning: false,
            noon: false,
            evening: false
          },
          section1: [
            { id: 1, title: '1.依送餐簡表檢查所有餐車飲食類類別及數量是否正確。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 2, title: '2.餐車實際送出及結束時間是否正常。', breakfast: null, lunch: null, dinner: null, remarks: '' },
          ],
          section2: [
            { id: 1, title: '第一部餐車送出時間', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 2, title: '最後一部餐車送出時間', breakfast: null, lunch: null, dinner: null, remarks: '' },
          ]
        }
      ]
    },
    formOne:{
      additionalForm: [
        {
          title: '配膳線上督餐作業查檢表',
          passed: {
            morning: false,
            noon: false,
            evening: false
          },
          form: [
            { id: 1, title: '1.保溫配膳車依菜色需求加熱(或擺放熱水)，水位須到達指定位置、熱度到達指定溫度(設定溫度≧80℃)。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 2, title: '2.確認病患用餐車已洗淨並預熱(加熱型，設定≧70℃)。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 3, title: '3.配膳前環境的清潔符合作業規範（以 75%酒精消毒輸送帶、配膳區域地面乾燥、無積水等）', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 4, title: '4.病患餐具或免洗餐具，配膳前置放於正確位置。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 5, title: '5.配膳器具，例如：勺子、夾子、煎鏟等，配膳前依菜色正確選用。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 6, title: '6. 配膳前熱食溫度需達≧60℃；冷食(分切水果)需維持設定0℃~7℃(依內控不定期抽測)。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 7, title: '7.配膳前正確洗淨雙手、佩戴外科口罩、乾淨手套、髮帽完全包覆頭髮、耳朵等。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 8, title: '8.雙手如有傷口(無則免填)應適當包紮並穿戴乳膠手套。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 9, title: '9.配膳人員就定位並避免危害食品衛生及交互污染之行為，例如：聊天、唱歌、嚼口香糖等。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 10, title: '10.依照餐卡所標示飲食種類及份量正確配膳。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 11, title: '11.留存備檢餐，各種菜餚皆須留存。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 12, title: '12.配膳線上作業結束後，剩餘主食及菜餚處理。', breakfast: null, lunch: null, dinner: null, remarks: '' }
          ]
        },
      ]
    },
    formTwo: {
      additionalForm: [
        {
          title: '出餐作業查檢表',
          passed: {
            morning: false,
            noon: false,
            evening: false
          },
          section1: [
            { id: 1, title: '1.依送餐簡表檢查所有餐車飲食類類別及數量是否正確。', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 2, title: '2.餐車實際送出及結束時間是否正常。', breakfast: null, lunch: null, dinner: null, remarks: '' },
          ],
          section2: [
            { id: 1, title: '第一部餐車送出時間', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 2, title: '最後一部餐車送出時間', breakfast: null, lunch: null, dinner: null, remarks: '' },
          ]
        }
      ],
    },
    formFour: {
      additionalForm: [
        {
          title: '菜餚品質與數量檢討紀錄',
          passed: {
            morning: false,
            noon: false,
            evening: false
          },
          form: [
            { id: 1, title: '1.菜量設計是否合理', breakfast: null, lunch: null, dinner: null, remarks: '' },
            { id: 2, title: '2.菜餚品質(賣像)是否優質', breakfast: null, lunch: null, dinner: null, remarks: '' }
          ]
        }
      ],
    },
    formSeven: {
      additionalForm: [
        {
          passed: {
            morning: true,
            noon: true,
            evening: true
          },
          records: [
            { company: null, name: '', time: null, issues: '' }
          ]
        }
      ],
    },
  }
);

provide('getAddiForm', (formName) => {
  return forms.value[formName]?.additionalForm || [];
});

provide('modifyJobPass', (formName, time, pass) => {

  const job = jobs.value.find(j =>
    j.items.some(item =>
      item.forms &&
      item.forms.formName === formName &&
      (!time || item.forms.time === time)
    )
  );
  if (job) {
    const item = job.items.find(item =>
      item.forms && item.forms.formName === formName && (!time || item.forms.time === time)
    );
    if (item && item.forms ) {
      item.forms.passed = pass;
    }
  }
});

provide('updateAddiForm', (formName, newData) => {
  const form = forms.value[formName];

  if (form && form.additionalForm) {
    if (Array.isArray(newData)) {
      form.additionalForm = [...newData];
    } else {
      form.additionalForm.push(newData);
    }
  }
});

const completedCount = ref(0);
const sectionsToDone = computed(() => {
  return jobs.value.length;
});

function openRemarkDialog(item){
  jobsRemarks.value = item || '';
  showRemarksDialog.value = true;
}

function updateJobRemark(){
  closeRemarksDialog();
}

function closeRemarksDialog() {
  showRemarksDialog.value = false;
}

function updateCompletedCount() {
  let completed = 0;
  jobs.value.forEach(job => {
    completed += (job.items.filter(item => item.checked).length / job.items.length) | 0;
  });
  completedCount.value = completed;
}

function handleCheckboxChange(currentForms, isChecked) {
  // Update the overall completion count
  updateCompletedCount();

  if (isChecked && currentForms && Object.keys(currentForms).length > 0) {
    Object.assign(dialogState, {
      show: true,
      title: currentForms.title || "檢核確認",
      checkObject: currentForms.checkObject || "",
      checkBoxs: currentForms.checkBoxs || [],
      formName: currentForms.formName || "",
      time: currentForms.time || "",
      additionalForm: forms.value[currentForms.formName]?.additionalForm || null,
      reminder: currentForms.reminder || ""
    });
  }
}

function saveDialogAndAdditionalForm(allData) {

}


watch(() =>
  jobs.value
    .filter(job => Array.isArray(job.items))
    .map(job => job.items.map(item => item.checked))
  ,
  () => updateCompletedCount(),
  { deep: true }
);

onMounted(() => {
  updateCompletedCount();
  setInterval(() => {
    let localDateString = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    currentTime.value = localDateString;
  }, 1000);
});
</script>

<style scoped>
.task-timeline {
  position: relative;
  padding-left: 12px;
}

.timeline-indicator {
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  border-left: 4px dotted #ccc;
  height: 90%;
}
</style>