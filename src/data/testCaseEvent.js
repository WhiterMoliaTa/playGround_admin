export const testCaseEvents = [
  {
    uuid: 'event-001',
    caseUuid: 'case-001',
    eventType: 'docReceived',
    eventDate: '2025-05-01',
    eventTitle: '收到來文',
    eventDescription: '收到勞動部職安字第123456號來文，開始案件處理。'
  },
  {
    uuid: 'event-002',
    caseUuid: 'case-001',
    eventType: 'dispatchEvaluation',
    eventDate: '2025-05-03',
    eventTitle: '完成派案評估',
    eventDescription: '完成初步派案評估，確認案件指派方向。'
  },
  {
    uuid: 'event-003',
    caseUuid: 'case-001',
    eventType: 'executionDiscussion',
    eventDate: '2025-05-05',
    eventTitle: '執行方向討論開始',
    eventDescription: '開始針對案件執行方向進行內部討論。'
  },
  {
    uuid: 'event-004',
    caseUuid: 'case-001',
    eventType: 'executionDiscussion',
    eventDate: '2025-05-07',
    eventTitle: '執行方向討論結束',
    eventDescription: '結束執行方向討論，形成初步共識。'
  },
  {
    uuid: 'event-005',
    caseUuid: 'case-001',
    eventType: 'expertReviewPreVisit',
    eventDate: '2025-05-08',
    eventTitle: '專家諮詢與環境監測開始',
    eventDescription: '專家諮詢與前期環測啟動。'
  },
  {
    uuid: 'event-006',
    caseUuid: 'case-001',
    eventType: 'expertReviewPreVisit',
    eventDate: '2025-05-10',
    eventTitle: '專家諮詢與環境監測結束',
    eventDescription: '完成前期專家諮詢與環測。'
  },
  {
    uuid: 'event-007',
    caseUuid: 'case-001',
    eventType: 'siteVisit',
    eventDate: '2025-05-11',
    eventTitle: '實地訪查',
    eventDescription: '完成現場實地訪查與觀察。'
  },
  {
    uuid: 'event-008',
    caseUuid: 'case-001',
    eventType: 'expertReviewPostVisit',
    eventDate: '2025-05-12',
    eventTitle: '專家後續諮詢開始',
    eventDescription: '專家根據實地訪查結果進行分析與建議。'
  },
  {
    uuid: 'event-009',
    caseUuid: 'case-001',
    eventType: 'expertReviewPostVisit',
    eventDate: '2025-05-13',
    eventTitle: '專家後續諮詢結束',
    eventDescription: '完成後續專家諮詢與討論。'
  },
  {
    uuid: 'event-010',
    caseUuid: 'case-001',
    eventType: 'reportDraft',
    eventDate: '2025-05-14',
    eventTitle: '報告撰寫開始',
    eventDescription: '開始撰寫案件調查報告初稿。'
  },
  {
    uuid: 'event-011',
    caseUuid: 'case-001',
    eventType: 'reportDraft',
    eventDate: '2025-05-16',
    eventTitle: '報告撰寫完成',
    eventDescription: '完成初稿內容，準備後續審閱。'
  },
  // {
  //   uuid: 'event-012',
  //   caseUuid: 'case-001',
  //   eventType: 'replyToOsha',
  //   eventDate: '2025-06-14',
  //   eventTitle: '函覆勞動部職安署',
  //   eventDescription: '將處理結果與報告內容回覆勞動部職安署。'
  // }
];
export const EventFiles=[
    {
        uuid: 'file-001',
        eventId: 'event-001',
        fileName: 'docReceived.pdf',
        fileType: 'application/pdf',
        fileSize: 204800, // 200 KB
        uploadDate: '2025-05-01',
        uploader: 'user-001',
    },
       {
        uuid: 'file-0012',
        eventId: 'event-001',
        fileName: 'docReceivedv2.pdf',
        fileType: 'application/pdf',
        fileSize: 204800, // 200 KB
        uploadDate: '2025-05-01',
        uploader: 'user-001',
    },
    {
        uuid: 'file-002',
        eventId: 'event-002',
        fileName: 'dispatchEvaluation.docx',
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileSize: 102400, // 100 KB
        uploadDate: '2025-05-03',
        uploader: 'user-002',
    },
    {
        uuid: 'file-003',
        eventId: 'event-003',
        fileName: 'executionDiscussionNotes.txt',
        fileType: 'text/plain',
        fileSize: 51200, // 50 KB
        uploadDate: '2025-05-05',
        uploader: 'user-003',
    },
    {
        uuid: 'file-004',
        eventId: 'event-004',
        fileName: 'executionDiscussionSummary.pdf',
        fileType: 'application/pdf',
        fileSize: 256000, // 250 KB
        uploadDate: '2025-05-07',
        uploader: 'user-001',
    },
    {
        uuid: 'file-005',
        eventId: 'event-005',
        fileName: 'expertReviewPreVisitReport.pdf',
        fileType: 'application/pdf',
        fileSize: 307200, // 300 KB
        uploadDate: '2025-05-08',
        uploader: 'user-002',
    },
    {
        uuid: 'file-006',
        eventId: 'event-006',
        fileName: 'environmentalMonitoringResults.xlsx',
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileSize: 153600, // 150 KB
        uploadDate: '2025-05-10',
        uploader: 'user-003'
    }
]