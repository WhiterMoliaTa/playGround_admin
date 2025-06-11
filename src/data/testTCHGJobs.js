export const testTCHGJobs = [
  {
    section: "first-section",
    title: "晨點作業",
    time: "07:00-07:40",
    items: [
      {
        id: 1, title: '閱讀前日工作日誌及交班事項，並請相關人員簽核。', checked: false,
        // forms: {
        //   title: "前日工作日誌",
        //   checkObject: "閱讀前日工作日誌及交班事項",
        //   formButtons: [
        //     { id: 1, label: '交班事項', formName: 'shiftHandoverLog', time: 'morning' }
        //   ],
        //   reminder: "請閱讀「交班事項」「前日工作日誌」",
        //   formName: ['shiftHandoverLog'],
        //   formRequired: true,
        //   time: 'morning',
        //   passed: false,
        // },
        remarks: ''
      },
      { id: 2, title: '檢查瓦斯漏氣受信總機指示燈號正常。', checked: false, remarks: '' },
      {
        id: 3, title: '確認員工到班及服裝儀容【人事管理記錄(表五)】。', checked: false,
        forms: {
          title: "檢核確認",
          checkObject: "確認員工到班及服裝儀容",
          checkBoxs: [
            { id: 1, label: '員工到班', checked: true },
            { id: 2, label: '服裝儀容符合規定', checked: true },
            { id: 3, label: '個人儀容符合規定', checked: true }
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
            { id: 1, label: '無異常', checked: true },
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
            { id: 1, label: '菜餚品質與數量檢討紀錄', formName: 'formFour', time: 'noon' }
          ],
          reminder: "檢核項目填寫完畢請點選「確認」\n若無請填寫「菜餚品質與數量檢討紀錄」",
          formName: ['formFour'],
          formRequired: true,
          time: 'morning',
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
];