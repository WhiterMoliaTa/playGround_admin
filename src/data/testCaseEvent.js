export const testCaseEvents = [
  {
    eventId: 'event-001',
    caseId: 'case-001',
    eventType: 'docReceived',
    eventTitle: '收到來文',
    eventDate: '2025-05-01',
    description: '收到勞動部職安字第123456號來文，開始案件處理。',
    createdBy: 'user-001',
    createdTime: '2025-05-01T10:00:00Z',
    updatedBy: 'user-001',
    updatedTime: '2025-05-01T10:00:00Z',
    status: 'A',
  },
];
export const EventFiles = [
  {
    fileId: 'file-001',
    eventId: 'event-001',
    originalName: 'docReceived.pdf',
    storedName: 'docReceived-20250501.pdf',
    filePath: '/files/docReceived-20250501.pdf',
    fileType: 'application/pdf',
    fileSize: 204800, // 200 KB
    createdBy: 'user-001',
    createdTime: '2025-05-01T10:00:00Z',
    updatedBy: 'user-001',
    updatedTime: '2025-05-01T10:00:00Z',
    status: 'A',
  },
]