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
          <v-list-item v-for="item in job.items" :key="`${index}-${item.id}`" :value="`${index}-${item.id}-val`"
            lines="one" class="task-item">
            <template v-slot:prepend>
              <div class="timeline-indicator"></div>
            </template>
            <v-list-item-title :style="{'background-color':(item.id % 2 ? '#fff' : '#e0f7fa'),'height': '48px'}" class="pl-3 d-flex align-center">{{ item.title }}</v-list-item-title>

            <template v-slot:append>
              <div class="d-flex align-center" :style="{'background-color':(item.id % 2 ? '#fff' : '#e0f7fa')}">
                <v-btn :key="`button-${index}-${item.id}`" hide-details variant="text" icon class="ma-0 pa-0"
                  @click="handleButtonClick(item, job.section)">
                  <v-icon
                    :color="state[`button-${job.section}-${item.id}`] && item.checked ? state[`button-${job.section}-${item.id}`] : 'grey'">
                    mdi-check-circle</v-icon>
                </v-btn>
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
  <v-card class="mt-4">
    <div class="d-flex justify-space-between align-center pa-2">
      <div>關聯表單</div>
    </div>

    <v-list>
      <v-list-group v-for="(form, index) in forms" :key="index">
        
      </v-list-group>
    </v-list>
  </v-card>
  <DialogComponent v-model:show="dialogState.show" :title="dialogState.title" :check-object="dialogState.checkObject"
    :check-boxs="dialogState.checkBoxs" :form-buttons="dialogState.formButtons"
    :additional-form="dialogState.additionalForm" :form-name="dialogState.formName"
    :form-required="dialogState.formRequired" :time="dialogState.time" :reminder="dialogState.reminder"
    @addtionalFormSubmit="saveDialogAndAdditionalForm" />
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
import DialogComponent from '../../components/TCHG/DialogComponent.vue';
import { fa } from 'vuetify/locale';

onMounted(() => {
  jobs.value.forEach((job, jobIndex) => {
    job.items.forEach(item => {
      state.value[`button-${job.section}-${item.id}`] = "success";
    });
  });
  updateCompletedCount();
});

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
  formButtons: [],
  formName: [],
  formRequired: false,
  time: '',
  additionalForm: null,
  reminder: ''
});

const jobsRemarks = ref(null);
const showRemarksDialog = ref(false);
const state = ref({});

const jobs = ref([
  {
    section: "first-section",
    title: "晨點作業",
    time: "07:00-07:40",
    items: [
      {
        id: 1, title: '閱讀前日工作日誌及交班事項，並請相關人員簽核。', checked: false,
        forms: {
          title: "前日工作日誌",
          checkObject: "閱讀前日工作日誌及交班事項",
          formButtons: [
            { id: 1, label: '交班事項', formName: 'shiftHandoverLog', time: 'morning' }
          ],
          reminder: "請閱讀「交班事項」「前日工作日誌」",
          formName: ['shiftHandoverLog'],
          formRequired: true,
          time: 'morning',
          passed: false,
        }
        , remarks: ''
      },
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
          formName: ['formFive'],
          formRequired: false,
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
          // checkBoxs: [
          //   { id: 1, label: '配膳線上督餐作業查檢表', checked: false },
          //   { id: 2, label: '出餐作業查檢表', checked: false }
          // ],
          formButtons: [
            { id: 1, label: '配膳線上督餐作業查檢表', formName: 'formOne', time: 'morning' },
            { id: 2, label: '出餐作業查檢表', formName: 'formTwo', time: 'morning' }
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「病患配膳紀錄表」",
          formName: ['formOne', 'formTwo'],
          formRequired: true,
          time: 'morning',
          passed: false,
        },
        remarks: ''
      },
      { id: 5, title: '確認早餐粥品烹煮時間符合，試吃早餐菜色。', checked: false, remarks: '' },
      { id: 6, title: '督導確認病患早餐、補餐送出(填寫漏補餐原因紀錄表)。', checked: false, remarks: '' },
      { id: 7, title: '確認冰箱溫度，冷藏庫 0℃~7℃；冷凍庫≦ -18℃。', checked: false, remarks: '' },
      {
        id: 8, title: '填寫菜餚品質與數量檢討記錄（表四）。', checked: false,
        forms: {
          title: "菜餚品質與數量檢討紀錄",
          checkObject: "菜餚品質與數量檢討",
          // checkBoxs: [
          //   { id: 1, label: '菜量設計', checked: false },
          //   { id: 2, label: '菜餚品質(賣像)', checked: false }
          // ],
          formButtons: [
            { id: 1, label: '菜餚品質與數量檢討紀錄', formName: 'formFour', time: 'morning' }
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「菜餚品質與數量檢討紀錄」",
          formName: ['formFour'],
          formRequired: true,
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
      {
        id: 1, title: '生鮮食材驗收及登錄/進貨異常記錄(表七)。', checked: false,
        forms: {
          title: "進貨廠商管理紀錄",
          checkObject: "進貨廠商管理",
          checkBoxs: [
            { id: 1, label: '無異常', checked: false },
          ],
          // formButtons: [
          //   { id: 1, label: '進貨廠商管理紀錄', formName: 'formSeven', time: 'morning' },
          // ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「進貨廠商管理紀錄」",
          formName: ['formSeven'],
          formRequired: false,
          time: 'morning',
          passed: true,
        },
        remarks: ''
      }
    ]
  },
  {
    section: "third-section",
    title: "早餐配膳及回收作業",
    time: "08:40-09:30",
    items: [
      { id: 1, title: '10.依清潔檢查表，稽核廚區早餐配膳後清潔作業。', checked: false, remarks: '' },
      {
        id: 2, title: '11.督導早餐餐車回收並填寫菜餚剩餘量紀錄(表三)。', checked: false,
        forms: {
          title: "病人餐點回收及盤餘抽查記錄",
          checkObject: "病人餐點回收及盤餘抽查",
          formButtons: [
            { id: 1, label: '全數病人餐點回收完畢', formName: 'formThree', time: 'morning' },
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「病人餐點回收及盤餘抽查記錄」",
          formName: ['formThree'],
          formRequired: true,
          time: 'morning',
          passed: false,
        },
        remarks: ''
      },
      { id: 3, title: '12.督導餐具清洗作業，填寫洗碗機每週基本操作檢查表。', checked: false, remarks: '' },
      { id: 4, title: '13.檢查早餐餐車排列及清潔，確認無餐盤留於餐車內。', checked: false, remarks: '' },
      {
        id: 5, title: '14.填寫每日衛生檢查表(TCHG-G4-02)。', checked: false,
        forms: {
        },
        remarks: ''
      },
      { id: 6, title: '15.追蹤設備請修及處理情形登錄（另行登錄）。', checked: false, remarks: '' }
    ]
  },
  {
    section: 'fourth-section',
    title: '人數食材確認',
    time: '08:00-10:00',
    items: [
      { id: 1, title: '16.查詢當日膳食人數。', checked: false, remarks: '' },
      { id: 2, title: '17.確認當日食材撥發作業。', checked: false, remarks: '' },
      { id: 3, title: '18.檢視可利用熟食。', checked: false, remarks: '' },
      { id: 4, title: '19.確認一般食、治療食等食材前處理作業，如：配菜、大菜切洗及水果清洗切盒。及備餐冰箱0℃~7℃。', checked: false, remarks: '' },
      {
        id: 5, title: '20.若午、晚餐訂購食材不足或過量，預作調配安排及紀錄清點剩餘食材、修改食材採購量(表四)。', checked: false,
        forms: {
          title: "菜餚品質與數量檢討紀錄",
          checkObject: "菜餚品質與數量檢討",
          formButtons: [
            { id: 1, label: '菜餚品質與數量檢討紀錄', formName: 'formFour', time: 'afternoon' }
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「菜餚品質與數量檢討紀錄」",
          formName: ['formFour'],
          formRequired: true,
          time: 'afternoon',
          passed: false,
        },
      }
    ]
  },
  {
    section: 'fifth-section',
    title: '午餐製作作業',
    time: '10:00-10:50',
    items: [
      { id: 6, title: '6.確認爐灶火源安全使用。', checked: false, remarks: '' },
      { id: 7, title: '7.督導一般食、治療食、剁碎等烹調作業(烹煮設備時間溫度設定)。', checked: false, remarks: '' },
      { id: 8, title: '8.督導素食、軟食、半流等烹調作業(烹煮設備及烹煮時間溫度)。', checked: false, remarks: '' },
      { id: 9, title: '9.督導飯、稀飯、麵、湯等烹調作業(烹煮設備正常及烹煮時間)。', checked: false, remarks: '' },
      { id: 10, title: '10.試吃午餐', checked: false, remarks: '' },
    ]
  },
  {
    section: 'sixth-section',
    title: '午餐配膳作業',
    time: '10:50-12:00',
    items: [
      {
        id: 11, title: '11.督導病患及員工午餐等配膳作業(表一及表二）。', checked: false,
        forms: {
          title: "檢核確認",
          checkObject: "督導病患早餐等配膳作業",
          formButtons: [
            { id: 1, label: '配膳線上督餐作業查檢表', formName: 'formOne', time: 'noon' },
            { id: 2, label: '出餐作業查檢表', formName: 'formTwo', time: 'noon' }
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「病患配膳紀錄表」",
          formName: ['formOne', 'formTwo'],
          formRequired: true,
          time: 'noon',
          passed: false,
        },
        remarks: ''
      },
      { id: 12, title: '12.督導病患午餐剩菜處理及器具用具清潔作業。', checked: false, remarks: '' },
      { id: 13, title: '13.依清潔檢查表稽核病患飲食配膳區午餐膳後清潔作業。', checked: false, remarks: '' },
      {
        id: 14, title: '14.填寫菜餚品質與數量檢討記錄（表四）。', checked: false,
        forms: {
          title: "菜餚品質與數量檢討紀錄",
          checkObject: "菜餚品質與數量檢討",
          formButtons: [
            { id: 1, label: '菜餚品質與數量檢討紀錄', formName: 'formFour', time: 'noon' }
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「菜餚品質與數量檢討紀錄」",
          formName: ['formFour'],
          formRequired: true,
          time: 'noon',
          passed: false,
        },
        remarks: ''
      }
    ]
  },
  {
    section: 'seventh-section',
    title: '午餐回收清潔作業',
    time: '12:00-14:00',
    items: [
      { id: 15, title: '15.督導確認病患午餐、補餐送出(填寫漏補餐原因紀錄表)。', checked: false, remarks: '' },
      {
        id: 16, title: '16.確認午餐餐車回收並填寫菜餚剩餘量紀錄 (表三)。', checked: false,
        forms: {
          title: "病人餐點回收及盤餘抽查記錄",
          checkObject: "病人餐點回收及盤餘抽查",
          formButtons: [
            { id: 1, label: '全數病人餐點回收完畢', formName: 'formThree', time: 'noon' },
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「病人餐點回收及盤餘抽查記錄」",
          formName: ['formThree'],
          formRequired: true,
          time: 'noon',
          passed: false,
        },
        remarks: ''
      },
      { id: 17, title: '17.督導餐具清洗作業，填寫洗碗機每週基本操作檢查表。', checked: false, remarks: '' },
      { id: 18, title: '18.檢查餐車排列及清潔，確認無餐盤留於餐車內。', checked: false, remarks: '' },
      { id: 19, title: '19.檢查廚區清潔作業。', checked: false, remarks: '' }
    ]
  }
]);

const forms = ref(
  {
    formOne: {
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
            { id: 2, title: '2.確認病患用餐車已洗淨並預熱(加熱型，設定≧70℃)。', breakfast: true, lunch: null, dinner: null, remarks: '' },
            { id: 3, title: '3.配膳前環境的清潔符合作業規範（以 75%酒精消毒輸送帶、配膳區域地面乾燥、無積水等）', breakfast: true, lunch: null, dinner: null, remarks: '' },
            { id: 4, title: '4.病患餐具或免洗餐具，配膳前置放於正確位置。', breakfast: false, lunch: null, dinner: null, remarks: '' },
            { id: 5, title: '5.配膳器具，例如：勺子、夾子、煎鏟等，配膳前依菜色正確選用。', breakfast: true, lunch: null, dinner: null, remarks: '' },
            { id: 6, title: '6. 配膳前熱食溫度需達≧60℃；冷食(分切水果)需維持設定0℃~7℃(依內控不定期抽測)。', breakfast: true, lunch: null, dinner: null, remarks: '' },
            { id: 7, title: '7.配膳前正確洗淨雙手、佩戴外科口罩、乾淨手套、髮帽完全包覆頭髮、耳朵等。', breakfast: false, lunch: null, dinner: null, remarks: '' },
            { id: 8, title: '8.雙手如有傷口(無則免填)應適當包紮並穿戴乳膠手套。', breakfast: false, lunch: null, dinner: null, remarks: '' },
            { id: 9, title: '9.配膳人員就定位並避免危害食品衛生及交互污染之行為，例如：聊天、唱歌、嚼口香糖等。', breakfast: false, lunch: null, dinner: null, remarks: '' },
            { id: 10, title: '10.依照餐卡所標示飲食種類及份量正確配膳。', breakfast: true, lunch: null, dinner: null, remarks: '' },
            { id: 11, title: '11.留存備檢餐，各種菜餚皆須留存。', breakfast: true, lunch: null, dinner: null, remarks: '' },
            { id: 12, title: '12.配膳線上作業結束後，剩餘主食及菜餚處理。', breakfast: true, lunch: null, dinner: null, remarks: '' }
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
            { id: 1, title: '1.依送餐簡表檢查所有餐車飲食類類別及數量是否正確。', breakfast: true, lunch: null, dinner: null, remarks: '' },
            { id: 2, title: '2.餐車實際送出及結束時間是否正常。', breakfast: true, lunch: null, dinner: null, remarks: '' },
          ],
          section2: [
            { id: 1, title: '第一部餐車送出時間', breakfast: '07:20', lunch: null, dinner: null, remarks: '' },
            { id: 2, title: '最後一部餐車送出時間', breakfast: '07:30', lunch: null, dinner: null, remarks: '' },
          ]
        }
      ],
    },
    formOneAndTwo: {
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
    formThree: {
      additionalForm: [
        {
          title: '病人餐點回收及盤餘抽查記錄',
          passed: {
            morning: false,
            noon: false,
            evening: false
          },
          records: [
            {
              recycleTime: '', ward: '', plate: 0,
              dishAndLeftoverPortion: [{ dishName: '', leftPortion: '' }],
              breakfast: null, lunch: null, dinner: null, remarks: ''
            },
          ]
        }
      ]
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
    formFive: {
      additionalForm: [
        {
          passed: {
            morning: true,
            noon: true,
            evening: true
          },
          records: [{ personnel: '林大明', jobTitle: '供膳人員', notes: '車禍', image: 'data:image/jpeg;base64,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' }],
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
          ]
        }
      ],
    },
    shiftHandoverLog: {
      additionalForm: [
        {
          title: '前日工作日誌',
          passed: {
            morning: false,
            noon: true,
            evening: true
          },
          records: [
            { content: '99病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '100病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '101病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '102病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '101病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '102病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '103病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '104病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '105病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '106病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '107病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
            { content: '108病房燈壞掉', signature: '還沒做', processHandleDesc: '已經請人替換', handlerSignature: '還沒做' },
          ]
        }
      ],
    }
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
    const section = job.section;
    const item = job.items.find(item =>
      item.forms && item.forms.formName === formName && (!time || item.forms.time === time)
    );
    if (item && item.forms) {
      item.forms.passed = pass;
      const key = `button-${section}-${item.id}`;
      state.value[key] = pass ? 'success ' : 'error';
      console.log(`Job ${formName} in section ${section} updated to ${state.value[key]}.`);
      item.checked = true;
      updateCompletedCount();
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

function openRemarkDialog(item) {
  jobsRemarks.value = item || '';
  showRemarksDialog.value = true;
}

function updateJobRemark() {
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

function handleButtonClick(item, jobSection) {
  let currentForms = item.forms;
  let itemId = item.id;

  // item.forms, job.section, item.id, item.checked
  if (currentForms && Object.keys(currentForms).length > 0 && !item.checked) {
    const formsCollection = {};
    if (currentForms.formName) {
      currentForms.formName.forEach(form => {
        formsCollection[form] =
          forms.value[form]?.additionalForm || [];
      });
    }
    Object.assign(dialogState, {
      show: true,
      title: currentForms.title || "檢核確認",
      checkObject: currentForms.checkObject || "",
      checkBoxs: currentForms.checkBoxs || [],
      formButtons: currentForms.formButtons || [],
      formName: currentForms.formName || [],
      formRequired: currentForms.formRequired || false,
      time: currentForms.time || "",
      additionalForm: formsCollection,
      reminder: currentForms.reminder || ""
    });
  }
  const key = `button-${jobSection}-${itemId}`;
  if (!currentForms) {
    item.checked = item.checked ? false : true;

  } else {
    item.checked = false;
  }
  updateCompletedCount();

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
.v-list-group__items .v-list-item{
  padding-inline-start: 48px !important;
}

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